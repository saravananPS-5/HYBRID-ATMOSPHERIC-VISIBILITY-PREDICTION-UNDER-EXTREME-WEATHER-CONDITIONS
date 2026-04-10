import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackgroundEffects from "../components/BackgroundEffects";

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login = () => {
    const stored = localStorage.getItem(user);
    if (!stored) return alert("User not found");
    if (stored !== pass) return alert("Wrong password");

    localStorage.setItem("loggedUser", user);
    navigate("/home");
  };

  return (
    <div>
      <BackgroundEffects type="rain" />

      <div className="main-container">
        <div className="card">
          <h1>Hybrid Atmospheric Visibility Prediction Under Extreme Weather Conditions</h1>

          <input
            placeholder="Username"
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
          />

          <button onClick={login}>Login</button>

          <p>
            Not registered? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;