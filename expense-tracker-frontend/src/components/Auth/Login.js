import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      // Store user info if returned by backend
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      window.dispatchEvent(new Event("auth"));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="login-btn" type="submit">Login</button>
        {error && <div className="login-error">{error}</div>}
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?
        <a href="/register" className="login-link">Register</a>
      </p>
    </div>
  );
};

export default Login;