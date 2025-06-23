import React from "react";
import SpendingChart from "./SpendingChart";
import "./Dashboard.css";

const Dashboard = ({ expenses }) => (
  <div className="dashboard-container">
    <h2 className="dashboard-title">Welcome to Your Dashboard</h2>
    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3>Spending Overview</h3>
        <SpendingChart expenses={expenses} />
      </div>
      <div className="dashboard-card">
        <h3>Budget & Goals</h3>
        <p className="dashboard-subtext">
          Set and track your financial goals here.
        </p>
      </div>
    </div>
  </div>
);

export default Dashboard;