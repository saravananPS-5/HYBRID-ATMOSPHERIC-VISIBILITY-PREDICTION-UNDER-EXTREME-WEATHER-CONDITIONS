import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

function Comparison() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/results")
      .then(res => {
        const formatted = Object.keys(res.data).map(key => ({
          name: key,
          RMSE: res.data[key].RMSE,
          MAE: res.data[key].MAE,
          R2: res.data[key].R2
        }));
        setData(formatted);
      });
  }, []);

  const bestModel = data.length
    ? data.reduce((prev, curr) => (prev.R2 > curr.R2 ? prev : curr))
    : null;

  return (
    <div className="comparison-page">

      <div className="header">
        <h1>Model Performance Dashboard</h1>
        <p>Advanced Comparative Analysis</p>
      </div>

      {/* 📊 Chart */}
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="RMSE" fill="#ff6b6b" />
            <Bar dataKey="MAE" fill="#feca57" />
            <Bar dataKey="R2" fill="#1dd1a1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📦 Cards */}
      <div className="cards-wrapper">
        {data.map((model, index) => (
          <div
            key={index}
            className={`model-card ${model.name === bestModel?.name ? "best" : ""}`}
          >
            <div className="model-title">{model.name}</div>

            <div className="metrics">
              <p className="rmse">RMSE: {model.RMSE.toFixed(2)}</p>
              <p className="mae">MAE: {model.MAE.toFixed(2)}</p>
              <p className="r2">R²: {model.R2.toFixed(2)}</p>
            </div>

            {model.name === bestModel?.name && (
              <div className="best-badge">BEST</div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default Comparison;