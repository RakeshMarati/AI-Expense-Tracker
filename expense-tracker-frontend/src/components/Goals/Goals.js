import React, { useState, useEffect } from "react";
import { addGoal, updateGoal, deleteGoal, fetchGoals } from "../../api/api";
import "./Goals.css";

const currencyOptions = ["USD", "INR", "EUR"];
const statusOptions = ["In Progress", "Completed", "Failed"];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    description: "",
    targetAmount: "",
    currency: "USD",
    deadline: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editGoal, setEditGoal] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch goals from backend
  const refreshGoals = () => {
    setLoading(true);
    fetchGoals()
      .then(res => setGoals(res.data))
      .catch(() => setError("Failed to fetch goals"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshGoals();
  }, []);

  // Add goal handler
  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await addGoal(newGoal);
      setNewGoal({ description: "", targetAmount: "", currency: "USD", deadline: "" });
      setAdding(false);
      refreshGoals(); // Refetch after add
    } catch {
      setError("Failed to add goal");
    }
  };

  // Delete goal handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoal(id);
      refreshGoals(); // Refetch after delete
    } catch {
      setError("Failed to delete goal");
    }
  };

  // Start editing
  const startEdit = (goal) => {
    setEditingId(goal._id);
    setEditGoal({ ...goal, deadline: goal.deadline ? goal.deadline.slice(0, 10) : "" });
  };

  // Edit goal handler
  const handleEditGoal = async (e) => {
    e.preventDefault();
    try {
      await updateGoal(editingId, editGoal);
      setEditingId(null);
      setEditGoal({});
      refreshGoals(); // Refetch after edit
    } catch {
      setError("Failed to update goal");
    }
  };

  return (
    <div className="goals-container">
      <h3 className="goals-title">Financial Goals</h3>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="goals-list">
          {goals.map(goal => (
            <li key={goal._id}>
              {editingId === goal._id ? (
                <form onSubmit={handleEditGoal} className="goal-edit-form">
                  {/* ...edit form fields... */}
                </form>
              ) : (
                <>
                  <span>{goal.description}</span>
                  <span className="goals-status">
                    Target: {goal.currency} {goal.targetAmount}{" "}
                    {goal.deadline && (
                      <span style={{ color: "#64748b", fontSize: "0.95em" }}>
                        | Deadline: {goal.deadline.slice(0, 10)}
                      </span>
                    )}
                    <span className={`goal-status-badge ${goal.status?.toLowerCase().replace(' ', '-')}`}>
                      {goal.status}
                    </span>
                  </span>
                  <button className="goal-btn edit-btn" onClick={() => startEdit(goal)}>Edit</button>
                  <button className="goal-btn delete-btn" onClick={() => handleDelete(goal._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* Add Goal Form */}
      {adding ? (
        <form onSubmit={handleAddGoal} className="goal-add-form">
          {/* ...add form fields... */}
        </form>
      ) : (
        <button className="goal-btn add-btn" style={{ marginTop: "1.5rem" }} onClick={() => setAdding(true)}>Add New Goal</button>
      )}
    </div>
  );
};

export default Goals;