import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import json
import os
import joblib

from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.svm import SVR

import lightgbm as lgb
import xgboost as xgb

from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, GRU, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping


WINDOW = 7

# =======================
# LOAD DATA
# =======================
df = pd.read_csv("E:/WeatherApp/backend/Project 1 - Weather Dataset.csv")
df['Date/Time'] = pd.to_datetime(df['Date/Time'])
df = df.sort_values('Date/Time')
df = df.dropna()

features = [
    'Temp_C',
    'Dew Point Temp_C',
    'Rel Hum_%',
    'Wind Speed_km/h',
    'Press_kPa'
]

target = 'Visibility_km'

X = df[features].values
y = df[target].values.reshape(-1, 1)

# =======================
# AUTO TRAIN OR LOAD
# =======================
if not os.path.exists("model.keras"):

    print("🚀 Training model...")

    # Scaling
    x_scaler = MinMaxScaler()
    y_scaler = MinMaxScaler()

    X_scaled = x_scaler.fit_transform(X)
    y_scaled = y_scaler.fit_transform(y)

    # Save scalers
    joblib.dump(x_scaler, "x_scaler.pkl")
    joblib.dump(y_scaler, "y_scaler.pkl")

    # Sequence creation
    def create_sequences(X, y, window):
        Xs, ys = [], []
        for i in range(len(X) - window):
            Xs.append(X[i:i+window])
            ys.append(y[i+window])
        return np.array(Xs), np.array(ys)

    X_seq, y_seq = create_sequences(X_scaled, y_scaled, WINDOW)

    X_train, X_test, y_train, y_test = train_test_split(
        X_seq, y_seq, test_size=0.2, shuffle=False
    )

    # =======================
    # BUILD MODEL
    # =======================
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(WINDOW, X.shape[1])),
        GRU(32),
        Dropout(0.2),
        Dense(1)
    ])

    model.compile(optimizer='adam', loss='mse')

    model.fit(
        X_train,
        y_train,
        epochs=50,
        batch_size=32,
        validation_split=0.1,
        callbacks=[EarlyStopping(patience=5)],
        verbose=1
    )

    # Save model
    model.save("model.keras")

    # Predictions
    y_pred_dl = y_scaler.inverse_transform(model.predict(X_test))
    y_true = y_scaler.inverse_transform(y_test)

    # =======================
    # TRADITIONAL MODELS
    # =======================
    X_ml = X_scaled[WINDOW:]
    y_ml = y_scaled[WINDOW:].ravel()

    X_train_ml, X_test_ml, y_train_ml, y_test_ml = train_test_split(
        X_ml, y_ml, test_size=0.2, shuffle=False
    )

    svr = SVR(kernel='rbf')
    svr.fit(X_train_ml, y_train_ml)
    y_pred_svr = y_scaler.inverse_transform(svr.predict(X_test_ml).reshape(-1,1))

    lgbm = lgb.LGBMRegressor()
    lgbm.fit(X_train_ml, y_train_ml)
    y_pred_lgbm = y_scaler.inverse_transform(lgbm.predict(X_test_ml).reshape(-1,1))

    xgbr = xgb.XGBRegressor(objective='reg:squarederror')
    xgbr.fit(X_train_ml, y_train_ml)
    y_pred_xgb = y_scaler.inverse_transform(xgbr.predict(X_test_ml).reshape(-1,1))

    y_pred_ensemble = (y_pred_lgbm + y_pred_xgb) / 2
    y_test_inv = y_scaler.inverse_transform(y_test_ml.reshape(-1,1))

    # =======================
    # EVALUATION
    # =======================
    results = {}

    def evaluate(name, y_true, y_pred):
        results[name] = {
            "RMSE": float(np.sqrt(mean_squared_error(y_true, y_pred))),
            "MAE": float(mean_absolute_error(y_true, y_pred)),
            "R2": float(r2_score(y_true, y_pred))
        }

    evaluate("LSTM+GRU", y_true, y_pred_dl)
    evaluate("SVR", y_test_inv, y_pred_svr)
    evaluate("LightGBM", y_test_inv, y_pred_lgbm)
    evaluate("XGBoost", y_test_inv, y_pred_xgb)
    evaluate("LightGBM+XGBoost", y_test_inv, y_pred_ensemble)

    # Save results
    with open("results.json", "w") as f:
        json.dump(results, f, indent=4)

    print("✅ Training completed & saved")

# =======================
# LOAD FOR FLASK
# =======================
model = load_model("model.keras")
x_scaler = joblib.load("x_scaler.pkl")
y_scaler = joblib.load("y_scaler.pkl")

X_scaled = x_scaler.transform(X)

# =======================
# PREDICTION FUNCTION
# =======================
def get_prediction(date):

    date = pd.to_datetime(date)

    idx = df[df['Date/Time'] <= date].index

    if len(idx) < WINDOW:
        return {
            "date": str(date.date()),
            "visibility": "N/A",
            "result": "Not enough past data"
        }

    last_idx = idx[-1]

    data = X_scaled[last_idx - WINDOW + 1 : last_idx + 1]
    data = data.reshape(1, WINDOW, data.shape[1])

    visibility = y_scaler.inverse_transform(
        model.predict(data, verbose=0)
    )[0][0]

    return {
        "date": str(date.date()),
        "visibility": round(float(visibility), 2),
        "result": "Weather is Good ✅" if visibility >= 10 else "Visibility is Poor ❌"
    }

# =======================
# RESULTS FOR UI
# =======================
def get_model_results():
    with open("results.json", "r") as f:
        return json.load(f)