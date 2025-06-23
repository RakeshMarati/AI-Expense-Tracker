import React, { useState } from "react";
import "./Goals.css";

const statusOptions = ["In Progress", "Completed", "Not Started"];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState(statusOptions[0]);

  // Add new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newDesc.trim()) {
      setGoals([
        ...goals,
        { id: Date.now(), description: newDesc, status: newStatus }
      ]);
      setNewDesc("");
      setNewStatus(statusOptions[0]);
    }
  };

  // Edit status only
  const handleEdit = (goal) => {
    setEditingId(goal.id);
    setEditStatus(goal.status);
  };

  // Save edited status
  const handleSave = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, status: editStatus } : goal
    ));
    setEditingId(null);
    setEditStatus("");
  };

  return (
    <div className="goals-container">
      <h3 className="goals-title">Financial Goals</h3>
      <form className="goal-add-form" onSubmit={handleAddGoal}>
        <input
          className="goal-edit-input"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="New goal description"
          required
        />
        <select
          className="goal-edit-select"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button className="goal-btn add-btn" type="submit">Add Goal</button>
      </form>
      <ul className="goals-list">
        {goals.map(goal => (
          <li key={goal.id}>
            <span>{goal.description}</span>
            {editingId === goal.id ? (
              <>
                <select
                  className="goal-edit-select"
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button className="goal-btn save-btn" onClick={() => handleSave(goal.id)}>Save</button>
              </>
            ) : (
              <>
                <span className="goals-status">{goal.status}</span>
                <button className="goal-btn modify-btn" onClick={() => handleEdit(goal)}>Modify Status</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Goals;