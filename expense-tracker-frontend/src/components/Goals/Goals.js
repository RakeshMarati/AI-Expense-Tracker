import React, { useState } from "react";
import { addGoal, updateGoal, deleteGoal } from "../../api/api";
import "./Goals.css";

const currencyOptions = ["USD", "INR", "EUR"];
const statusOptions = ["In Progress", "Completed", "Failed"];

const Goals = ({ goals, setGoals, refreshGoals }) => {
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
      {!goals ? (
        <div>Loading...</div>
      ) : (
        <ul className="goals-list">
          {goals.map(goal => (
            <li key={goal._id}>
              {editingId === goal._id ? (
                <form onSubmit={handleEditGoal} className="goal-edit-form">
                  <input
                    className="goal-edit-input"
                    value={editGoal.description}
                    onChange={e => setEditGoal({ ...editGoal, description: e.target.value })}
                    required
                  />
                  <input
                    className="goal-edit-input"
                    type="number"
                    value={editGoal.targetAmount}
                    onChange={e => setEditGoal({ ...editGoal, targetAmount: e.target.value })}
                    required
                  />
                  <select
                    className="goal-edit-input"
                    value={editGoal.currency}
                    onChange={e => setEditGoal({ ...editGoal, currency: e.target.value })}
                  >
                    {currencyOptions.map(cur => <option key={cur} value={cur}>{cur}</option>)}
                  </select>
                  <input
                    className="goal-edit-input"
                    type="date"
                    value={editGoal.deadline || ""}
                    onChange={e => setEditGoal({ ...editGoal, deadline: e.target.value })}
                  />
                  <select
                    className="goal-edit-input"
                    value={editGoal.status}
                    onChange={e => setEditGoal({ ...editGoal, status: e.target.value })}
                  >
                    {statusOptions.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <button type="submit" className="goal-btn save-btn">Save</button>
                  <button type="button" className="goal-btn cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
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
          <input
            className="goal-edit-input"
            placeholder="Description"
            value={newGoal.description}
            onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
            required
          />
          <input
            className="goal-edit-input"
            type="number"
            placeholder="Target Amount"
            value={newGoal.targetAmount}
            onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
            required
          />
          <select
            className="goal-edit-input"
            value={newGoal.currency}
            onChange={e => setNewGoal({ ...newGoal, currency: e.target.value })}
          >
            {currencyOptions.map(cur => <option key={cur} value={cur}>{cur}</option>)}
          </select>
          <input
            className="goal-edit-input"
            type="date"
            value={newGoal.deadline}
            onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
          />
          <button type="submit" className="goal-btn add-btn">Add</button>
          <button type="button" className="goal-btn cancel-btn" onClick={() => setAdding(false)}>Cancel</button>
        </form>
      ) : (
        <button className="goal-btn add-btn" style={{ marginTop: "1.5rem" }} onClick={() => setAdding(true)}>Add New Goal</button>
      )}
    </div>
  );
};

export default Goals;