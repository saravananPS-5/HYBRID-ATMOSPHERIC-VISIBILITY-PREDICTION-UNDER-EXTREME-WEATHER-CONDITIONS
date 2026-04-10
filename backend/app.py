from flask import Flask, request, jsonify
from flask_cors import CORS
from model import get_prediction, get_model_results

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Weather API Running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    return jsonify(get_prediction(data["date"]))

@app.route("/results", methods=["GET"])
def results():
    return jsonify(get_model_results())

if __name__ == "__main__":
    app.run(debug=True)