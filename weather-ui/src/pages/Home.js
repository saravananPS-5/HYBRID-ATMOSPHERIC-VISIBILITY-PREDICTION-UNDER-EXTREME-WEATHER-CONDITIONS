import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundEffects from "../components/BackgroundEffects";

function Home() {
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const user = localStorage.getItem("loggedUser");

  return (
    <div>
      {/* ☁️ Calm clouds background */}
      <BackgroundEffects type="cloudy" />

      <div className="main-container">
        <div className="card">
          <h1>Welcome, {user} 👋</h1>

          <p>Select a date to predict weather visibility</p>

          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
          />

          {/* 🔥 BUTTON GROUP (FIXED SPACING) */}
          <div className="button-group">
            <button onClick={() => navigate("/prediction", { state: { date } })}>
              🔮 Predict Visibility
            </button>

            <button onClick={() => navigate("/comparison")}>
              📊 Compare Models
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("loggedUser");
                navigate("/");
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;