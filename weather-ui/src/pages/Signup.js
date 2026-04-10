import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackgroundEffects from "../components/BackgroundEffects";

function Signup() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasSymbol;
  };

  const handleSignup = () => {
    // ❌ Empty fields
    if (!user || !pass || !confirm) {
      return alert("All fields are required");
    }

    // ❌ Password validation
    if (!validatePassword(pass)) {
      return alert(
        "Password must be at least 8 characters and include a symbol"
      );
    }

    // ❌ Confirm password
    if (pass !== confirm) {
      return alert("Passwords do not match");
    }

    // ❌ Check if user exists
    if (localStorage.getItem(user)) {
      return alert("User already exists");
    }

    // ✅ Save user
    localStorage.setItem(user, pass);

    alert("Signup successful! Please login.");
    navigate("/");
  };

  return (
    <div>
      {/* 🌧️ Rain background */}
      <BackgroundEffects type="rain" />

      <div className="main-container">
        <div className="card">
          <h2>Create Account</h2>

          <input
            placeholder="Username"
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirm(e.target.value)}
          />

          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            Password must be at least 8 characters & include a symbol
          </p>

          <button onClick={handleSignup}>Sign Up</button>

          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;