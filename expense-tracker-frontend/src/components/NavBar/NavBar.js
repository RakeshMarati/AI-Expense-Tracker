import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const getUserInitials = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return "U";
  const { firstName, lastName } = user;
  return `${firstName?.[0] || ""}${lastName?.slice(-1) || ""}`.toUpperCase();
};

const NavBar = ({ onLogout }) => (
  <nav className="navbar">
    <div className="navbar-container">
      <span className="navbar-logo">AI Expense Tracker</span>
      <div className="navbar-links">
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/expenses" className="navbar-link">Expenses</Link>
        <Link to="/goals" className="navbar-link">Goals</Link>
        <Link to="/upload" className="navbar-link">Upload Receipt</Link>
        <button className="navbar-link logout-btn" onClick={onLogout}>Logout</button>
      </div>
      <div className="navbar-avatar">{getUserInitials()}</div>
    </div>
  </nav>
);

export default NavBar;