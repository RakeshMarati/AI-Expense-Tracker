import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const getUserInitials = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return "U";
  const { firstName, lastName } = user;
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const NavBar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on navigation (for mobile)
  const handleNavClick = () => setMenuOpen(false);

  return (
  <nav className="navbar">
      {/* Overlay for mobile menu */}
      <div
        className={`navbar-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
    <div className="navbar-container">
      <Link to="/dashboard" className="navbar-logo" onClick={handleNavClick}>
        AI Expense Tracker
      </Link>
      <div className="navbar-actions">
        <div className="navbar-avatar">{getUserInitials()}</div>
        <button
          className="navbar-hamburger"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>
      <div className={`navbar-links${menuOpen ? " open" : ""}`}>
        <Link to="/dashboard" className="navbar-link" onClick={handleNavClick}>Dashboard</Link>
        <Link to="/expenses" className="navbar-link" onClick={handleNavClick}>Expenses</Link>
        <Link to="/goals" className="navbar-link" onClick={handleNavClick}>Goals</Link>
        <Link to="/upload" className="navbar-link" onClick={handleNavClick}>Upload Receipt</Link>
        <button className="navbar-link logout-btn" onClick={() => { handleNavClick(); onLogout(); }}>Logout</button>
      </div>
    </div>
  </nav>
);
};

export default NavBar;