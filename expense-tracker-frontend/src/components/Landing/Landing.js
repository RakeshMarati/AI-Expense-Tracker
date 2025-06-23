import React from "react";
import "./Landing.css";

const Landing = () => (
  <div className="landing-bg">
    <div className="landing-content">
      <h1 className="landing-title">AI-Powered Expense Tracker</h1>
      <p className="landing-subtitle">
        Take control of your finances with smart AI categorization, receipt scanning, and beautiful insights.
      </p>
      <a href="/login" className="landing-btn">Get Started</a>
    </div>
  </div>
);

export default Landing;