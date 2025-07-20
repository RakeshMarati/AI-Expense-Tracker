import React, { useState, useEffect } from "react";
import { addGoal, updateGoal, deleteGoal, fetchGoals } from "../../api/api";
import "./Goals.css";

const currencyOptions = ["USD", "INR", "EUR"];
const statusOptions = ["In Progress", "Completed", "Achieved", "Failed"];

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
    console.log('Editing goal:', goal); // Debugging
    setEditingId(goal._id || goal.id);
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
            <li key={goal._id || goal.id}>
              {editingId === (goal._id || goal.id) ? (
                <form onSubmit={handleEditGoal} className="goal-edit-form">
                  <input
                    type="text"
                    name="description"
                    value={editGoal.description || ''}
                    onChange={e => setEditGoal({ ...editGoal, description: e.target.value })}
                    placeholder="Description"
                    required
                  />
                  <input
                    type="number"
                    name="targetAmount"
                    value={editGoal.targetAmount || ''}
                    onChange={e => setEditGoal({ ...editGoal, targetAmount: e.target.value })}
                    placeholder="Target Amount"
                    required
                  />
                  <select
                    name="currency"
                    value={editGoal.currency || 'USD'}
                    onChange={e => setEditGoal({ ...editGoal, currency: e.target.value })}
                  >
                    {currencyOptions.map(cur => (
                      <option key={cur} value={cur}>{cur}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    name="deadline"
                    value={editGoal.deadline || ''}
                    onChange={e => setEditGoal({ ...editGoal, deadline: e.target.value })}
                  />
                  <select
                    name="status"
                    value={editGoal.status || 'In Progress'}
                    onChange={e => setEditGoal({ ...editGoal, status: e.target.value })}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button className="goal-btn save-btn" type="submit">Save</button>
                  <button className="goal-btn cancel-btn" type="button" onClick={() => { setEditingId(null); setEditGoal({}); }}>Cancel</button>
                </form>
              ) : (
                <>
                  <span className="goal-desc">{goal.description}</span>
                  <span className="goals-status">
                    <span className={`goal-status-badge ${goal.status?.toLowerCase().replace(' ', '-')}`}>{goal.status}</span>
                  </span>
                  <button className="goal-btn edit-btn" onClick={() => startEdit(goal)}>Edit</button>
                  <button className="goal-btn delete-btn" onClick={() => handleDelete(goal._id || goal.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* Add Goal Form */}
      {adding && (
        <form onSubmit={handleAddGoal} className="goal-add-form">
          <input
            type="text"
            name="description"
            value={newGoal.description}
            onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="targetAmount"
            value={newGoal.targetAmount}
            onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
            placeholder="Target Amount"
            required
          />
          <select
            name="currency"
            value={newGoal.currency}
            onChange={e => setNewGoal({ ...newGoal, currency: e.target.value })}
          >
            {currencyOptions.map(cur => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
          <input
            type="date"
            name="deadline"
            value={newGoal.deadline}
            onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
          />
          <select
            name="status"
            value={newGoal.status || 'In Progress'}
            onChange={e => setNewGoal({ ...newGoal, status: e.target.value })}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button className="goal-btn save-btn" type="submit">Add Goal</button>
          <button className="goal-btn cancel-btn" type="button" onClick={() => setAdding(false)}>Cancel</button>
        </form>
      )}
      {adding ? (
        <button className="goal-btn add-btn" style={{ marginTop: "1.5rem" }} onClick={() => setAdding(true)}>Add New Goal</button>
      ) : (
        <button className="goal-btn add-btn" style={{ marginTop: "1.5rem" }} onClick={() => setAdding(true)}>Add New Goal</button>
      )}
    </div>
  );
};

export default Goals;