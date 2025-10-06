import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../store/slices/authSlice";
import "./Login.css";
import Spinner from "../Loader/Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      window.dispatchEvent(new Event("auth"));
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {loading ? (
        <Spinner />
      ) : (
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
      )}
      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?
        <a href="/register" className="login-link">Register</a>
      </p>
    </div>
  );
};

export default Login;