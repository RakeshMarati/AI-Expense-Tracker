import React from "react";
import SpendingChart from "./SpendingChart";
import "./DashBoard.css";

const Dashboard = () => (
  <div className="dashboard-container">
    <h2 className="dashboard-title">Dashboard</h2>
    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3>Spending Overview</h3>
        <SpendingChart />
      </div>
      <div className="dashboard-card">
        <h3>Budget & Goals</h3>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          Set and track your financial goals here.
        </p>
      </div>
    </div>
  </div>
);

export default Dashboard;