import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ isAuthenticated, onLogout }) => (
  <nav className="navbar">
    <div className="navbar-container">
      <span className="navbar-logo">AI Expense Tracker</span>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Dashboard</Link>
        <Link to="/expenses" className="navbar-link">Expenses</Link>
        <Link to="/goals" className="navbar-link">Goals</Link>
        <Link to="/upload" className="navbar-link">Upload Receipt</Link>
        {isAuthenticated ? (
          <button className="navbar-link logout-btn" onClick={onLogout}>Logout</button>
        ) : (
          <Link to="/login" className="navbar-link">Login</Link>
        )}
      </div>
      <div className="navbar-avatar">U</div>
    </div>
  </nav>
);

export default NavBar;