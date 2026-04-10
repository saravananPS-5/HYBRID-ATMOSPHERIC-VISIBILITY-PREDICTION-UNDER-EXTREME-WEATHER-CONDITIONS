import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BackgroundEffects from "../components/BackgroundEffects";

function Prediction() {
  const { state } = useLocation();
  const [data, setData] = useState(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
  if (!state?.date) return;

  axios.post("http://127.0.0.1:5000/predict", { date: state.date })
    .then(res => setData(res.data));

}, [state?.date]);

  // 🔢 Animated counter
  useEffect(() => {
    if (!data) return;

    let start = 0;
    let end = data.visibility;
    let duration = 1000;
    let stepTime = 20;

    let increment = end / (duration / stepTime);

    let counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplayValue(start.toFixed(1));
    }, stepTime);

  }, [data]);

  if (!data) return <h2>Loading...</h2>;

  let weatherType = "cloudy";

  if (data.visibility >= 10) weatherType = "sunny";
  else if (data.visibility >= 5) weatherType = "cloudy";
  else weatherType = "fog";

  let phrase = "";

if (weatherType === "sunny") {
  phrase = "Clear skies with excellent visibility";
} else if (weatherType === "cloudy") {
  phrase = "Moderate visibility with cloud cover";
} else {
  phrase = "Low visibility due to fog conditions";
}

  return (
  <div className={`weather-page ${weatherType}`}>
    <BackgroundEffects type={weatherType === "sunny" ? "cloudy" : weatherType} />

    <div className="main-container">
      <div className="weather-card">

        {/* 🌞 REAL SHAPE ICON */}
        <div className={`weather-icon ${weatherType}`}></div>

        {/* 🏷️ Label FIRST */}
        <p className="label-top">Visibility</p>

        {/* 🔢 Animated Value */}
        <h1 className="visibility">{displayValue} km</h1>

        {/* 📊 Status */}
        <h3 className="status">{phrase}</h3>

        {/* 📅 Date */}
        <p className="date">{data.date}</p>

      </div>
    </div>
  </div>
);
}

export default Prediction;