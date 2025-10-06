import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/slices/expensesSlice";
import { fetchGoalsAsync } from "../../store/slices/goalsSlice";
import SpendingChart from "./SpendingChart";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { expenses, loading: expensesLoading } = useSelector((state) => state.expenses);
  const { goals, loading: goalsLoading } = useSelector((state) => state.goals);

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchGoalsAsync());
  }, [dispatch]);

  const loading = expensesLoading || goalsLoading;

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
            <ul className="dashboard-goals-list">
              {goals.map(goal => {
                // Calculate progress if possible
                let progress = 0;
                if (goal.targetAmount && goal.currentAmount) {
                  progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                }
                return (
                  <li key={goal._id || goal.id} className="dashboard-goal-item">
                    <div className="dashboard-goal-header">
                      <span className="dashboard-goal-desc">{goal.description}</span>
                      <span className={`dashboard-goal-status goal-status-badge ${goal.status?.toLowerCase().replace(' ', '-')}`}>{goal.status}</span>
                    </div>
                    <div className="dashboard-goal-details">
                      <span>Target: <b>{goal.targetAmount} {goal.currency}</b></span>
                      {goal.deadline && <span>Deadline: <b>{goal.deadline.slice(0,10)}</b></span>}
                    </div>
                    {goal.currentAmount !== undefined && goal.targetAmount ? (
                      <div className="dashboard-goal-progress">
                        <div className="dashboard-goal-progress-bar" style={{ width: progress + '%'}}></div>
                        <span className="dashboard-goal-progress-label">{progress}%</span>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;