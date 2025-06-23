import React, { useState } from "react";
import "./ExpenseList.css";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Gifts",
  "Medical Fees",
  "Other"
];

const getCurrencySymbol = (code) => {
  switch (code) {
    case "INR": return "₹";
    case "USD": return "$";
    case "EUR": return "€";
    default: return "";
  }
};

const ExpenseList = ({ expenses, onDeleteExpense, onModifyExpense }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", amount: "", category: "", date: "", currency: "INR" });

  const startEdit = (expense) => {
    setEditingId(expense._id || expense.id);
    setEditForm({
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? expense.date.slice(0, 10) : "",
      currency: expense.currency || "INR"
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = (id) => {
    onModifyExpense(id, editForm);
    setEditingId(null);
  };

  // Calculate totals by currency
  const totalsByCurrency = expenses.reduce((acc, exp) => {
    const cur = exp.currency || "INR";
    acc[cur] = (acc[cur] || 0) + Number(exp.amount);
    return acc;
  }, {});

  return (
    <div className="expense-list-container">
      <h3 className="font-semibold mb-4 text-lg text-blue-600">Expenses</h3>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Currency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp._id || exp.id}>
              {editingId === (exp._id || exp.id) ? (
                <>
                  <td>
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    />
                  </td>
                  <td>
                    <input
                      name="amount"
                      type="number"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    />
                  </td>
                  <td>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      name="date"
                      type="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    />
                  </td>
                  <td>
                    <select
                      name="currency"
                      value={editForm.currency}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    >
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                    </select>
                  </td>
                  <td>
                    <button className="expense-btn save-btn" onClick={() => handleEditSave(exp._id || exp.id)}>Save</button>
                    <button className="expense-btn cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{exp.name}</td>
                  <td className="font-semibold text-indigo-700">
                    {getCurrencySymbol(exp.currency || "INR")}
                    {exp.amount}
                  </td>
                  <td>{exp.category}</td>
                  <td>{exp.date ? exp.date.slice(0, 10) : ""}</td>
                  <td>{exp.currency || "INR"}</td>
                  <td>
                    <button className="expense-btn modify-btn" onClick={() => startEdit(exp)}>Modify</button>
                    <button className="expense-btn delete-btn" onClick={() => onDeleteExpense(exp._id || exp.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Total Expenses Card */}
      <div className="total-expense-card">
        <span className="total-expense-label">Total Expenses:</span>
        {Object.entries(totalsByCurrency).map(([cur, amt]) => (
          <span key={cur} className="total-expense-value">
            {getCurrencySymbol(cur)}{amt.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;