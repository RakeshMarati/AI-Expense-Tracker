import React, { useEffect, useState } from "react";
import API from "../../api/api";
import SpendingChart from "./SpendingChart";
import "./Dashboard.css";

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      API.get("/goals"),
      API.get("/expenses")
    ])
      .then(([goalsRes, expensesRes]) => {
        setGoals(goalsRes.data);
        setExpenses(expensesRes.data);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
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
};

export default Dashboard;