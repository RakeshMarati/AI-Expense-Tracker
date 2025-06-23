import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

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
      window.dispatchEvent(new Event("auth"));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/90 p-10 rounded-2xl shadow-lg mt-16">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">Login</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition"
          type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition"
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold">Login</button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">Don't have an account? <a href="/register" className="text-indigo-600 font-semibold">Register</a></p>
    </div>
  );
};

export default Login;