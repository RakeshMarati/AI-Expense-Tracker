import React from "react";
import SpendingChart from "./SpendingChart";
import "./Dashboard.css";

const Dashboard = ({ expenses, goals = [] }) => (
  <div className="dashboard-container">
    <h2 className="dashboard-title">Welcome to Your Dashboard</h2>
    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3>Spending Overview</h3>
        <SpendingChart expenses={expenses} />
      </div>
      <div className="dashboard-card">
        <h3>Budget & Goals</h3>
        {goals.length === 0 ? (
          <p className="dashboard-subtext">No goals set yet.</p>
        ) : (
          <ul>
            {goals.map(goal => (
              <li key={goal._id || goal.id}>
                {goal.description} <span className="goals-status">{goal.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;