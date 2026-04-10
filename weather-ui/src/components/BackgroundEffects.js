import { useEffect } from "react";

function BackgroundEffects({ type }) {
  useEffect(() => {
    const bg = document.getElementById("weather-bg");
    if (!bg) return;

    bg.innerHTML = "";

    // 🌧️ RAIN
    if (type === "rain") {
      for (let i = 0; i < 120; i++) {
        const drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = 0.5 + Math.random() + "s";
        bg.appendChild(drop);
      }
    }

    // ☀️ SUN
    if (type === "sunny") {
      const sun = document.createElement("div");
      sun.className = "sun";
      bg.appendChild(sun);
    }

    // ☁️ CLOUDS
    if (type === "cloudy" || type === "sunny") {
      for (let i = 0; i < 5; i++) {
        const cloud = document.createElement("div");
        cloud.className = "cloud";
        cloud.style.top = Math.random() * 200 + "px";
        cloud.style.animationDuration = 20 + Math.random() * 10 + "s";
        bg.appendChild(cloud);
      }
    }

    // 🌫️ FOG
    if (type === "fog") {
      for (let i = 0; i < 8; i++) {
        const fog = document.createElement("div");
        fog.className = "fog";
        fog.style.top = Math.random() * 100 + "%";
        bg.appendChild(fog);
      }
    }

  }, [type]);

 return (
  <div id="weather-bg">

    {/* 🌤 Top */}
    <div className="cloud small slow" style={{ top: "5%", animationDelay: "0s" }}></div>
    <div className="cloud medium slow" style={{ top: "12%", animationDelay: "8s" }}></div>
    <div className="cloud small slow" style={{ top: "18%", animationDelay: "16s" }}></div>

    {/* 🌤 Upper mid */}
    <div className="cloud medium medium-speed" style={{ top: "25%", animationDelay: "4s" }}></div>
    <div className="cloud large medium-speed" style={{ top: "32%", animationDelay: "12s" }}></div>

    {/* 🌤 Center */}
    <div className="cloud large slow" style={{ top: "45%", animationDelay: "6s" }}></div>
    <div className="cloud medium fast" style={{ top: "55%", animationDelay: "14s" }}></div>
    <div className="cloud small fast" style={{ top: "60%", animationDelay: "22s" }}></div>

    {/* 🌤 Lower */}
    <div className="cloud large slow" style={{ top: "70%", animationDelay: "10s" }}></div>
    <div className="cloud medium medium-speed" style={{ top: "78%", animationDelay: "18s" }}></div>
    <div className="cloud small fast" style={{ top: "85%", animationDelay: "26s" }}></div>

  </div>
);
}

export default BackgroundEffects;