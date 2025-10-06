import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateExpense, deleteExpense } from "../../store/slices/expensesSlice";
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

// Group expenses by year → month → day
const groupExpenses = (expenses) => {
  const grouped = {};
  expenses.forEach(exp => {
    if (!exp.date) return;
    const [year, month, day] = exp.date.slice(0, 10).split("-");
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = {};
    if (!grouped[year][month][day]) grouped[year][month][day] = [];
    grouped[year][month][day].push(exp);
  });
  return grouped;
};

const getTotal = (expenses) =>
  expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, updateLoading, deleteLoading, error } = useSelector((state) => state.expenses);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", amount: "", category: "", date: "", currency: "INR" });

  // Collapsible state
  const [openYear, setOpenYear] = useState(null);
  const [openMonth, setOpenMonth] = useState({});

  const grouped = groupExpenses(expenses);

  // Find the most recent year and month if none are selected
  const years = Object.keys(grouped).sort((a, b) => b - a);
  const mostRecentYear = years[0];

  // Sort expenses by date descending and take the latest 10
  const latestExpenses = [...expenses]
    .filter(exp => exp.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

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

  const handleEditSave = async (id) => {
    const result = await dispatch(updateExpense({ id, expenseData: editForm }));
    if (updateExpense.fulfilled.match(result)) {
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(id));
    }
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
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <h4 className="font-semibold mb-2 text-base text-indigo-700">
        Yearly Expenses
      </h4>

      {/* Collapsible Grouped View */}
      <div className="expense-list-grouped mb-8">
        {Object.keys(grouped).sort((a, b) => b - a).map(year => (
          <div key={year} style={{ marginBottom: "0.5rem" }}>
            <button
              className="accordion-btn"
              onClick={() => setOpenYear(openYear === year ? null : year)}
            >
              <span>{year}</span>
              <span>
                Total: {
                  Object.values(grouped[year])
                    .flatMap(monthObj => Object.values(monthObj).flat())
                    .reduce((sum, exp) => sum + Number(exp.amount), 0)
                }
              </span>
              <svg className={openYear === year ? "rotate" : ""} width="24" height="24" viewBox="0 0 24 24">
                <polyline points="9 5 16 12 9 19" fill="none" stroke="#22223b" strokeWidth="2" />
              </svg>
            </button>
            {openYear === year && (
              <div className="accordion-content">
                {Object.keys(grouped[year]).sort((a, b) => b - a).map(month => (
                  <div key={month} style={{ marginBottom: "0.25rem" }}>
                    <button
                      className="accordion-btn month"
                      onClick={() => setOpenMonth(prev => ({ ...prev, [year+month]: prev[year+month] === month ? null : month }))}
                    >
                      <span>{new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' })}</span>
                      <span>
                        Total: {
                          Object.values(grouped[year][month])
                            .flat()
                            .reduce((sum, exp) => sum + Number(exp.amount), 0)
                        }
                      </span>
                      <svg className={openMonth[year+month] === month ? "rotate" : ""} width="24" height="24" viewBox="0 0 24 24">
                        <polyline points="9 5 16 12 9 19" fill="none" stroke="#22223b" strokeWidth="2" />
                      </svg>
                    </button>
                    {openMonth[year+month] === month && (
                      <div className="accordion-content">
                        {Object.keys(grouped[year][month]).sort((a, b) => b - a).map(day => (
                          <div key={day} className="day-summary">
                            <span className="date">{`${year}-${month}-${day}`}</span>
                            <span className="amount">
                              {getCurrencySymbol("INR")}
                              {getTotal(grouped[year][month][day])}
                            </span>
                            <ul>
                              {grouped[year][month][day].map(exp => (
                                <li key={exp._id || exp.id} className="grouped-expense-item">
                                  <span>
                                    {editingId === (exp._id || exp.id) ? (
                                      <>
                                        <input
                                          name="name"
                                          value={editForm.name}
                                          onChange={handleEditChange}
                                          className="expense-edit-input"
                                        />
                                        <input
                                          name="amount"
                                          type="number"
                                          value={editForm.amount}
                                          onChange={handleEditChange}
                                          className="expense-edit-input"
                                        />
                                        <select
                                          name="category"
                                          value={editForm.category}
                                          onChange={handleEditChange}
                                          className="expense-edit-input"
                                        >
                                          <option value="">Select</option>
                                          {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                          ))}
                                        </select>
                                        <input
                                          name="date"
                                          type="date"
                                          value={editForm.date}
                                          onChange={handleEditChange}
                                          className="expense-edit-input"
                                        />
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
                                        <button className="expense-btn save-btn" onClick={() => handleEditSave(exp._id || exp.id)} disabled={updateLoading}>
                                          {updateLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button className="expense-btn cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                      </>
                                    ) : (
                                      <>
                                        {exp.name}
                                        <span className="category">({exp.category})</span>
                                        <span className="currency-amount">{getCurrencySymbol(exp.currency || "INR")}{exp.amount}</span>
                                        <button className="expense-btn modify-btn" onClick={() => startEdit(exp)}>Modify</button>
                                        <button className="expense-btn delete-btn" onClick={() => handleDelete(exp._id || exp.id)} disabled={deleteLoading}>
                                          {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                      </>
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Expenses Section */}
      <h4 className="font-semibold mb-2 text-base text-indigo-700 recent-expenses-heading">Recent Expenses</h4>
      <table className="expense-table recent-expenses-table">
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
          {latestExpenses.slice(0, 5).map(exp => (
            <tr key={exp._id || exp.id}>
              {editingId === (exp._id || exp.id) ? (
                <>
                  <td data-label="Name">
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    />
                  </td>
                  <td data-label="Amount">
                    <input
                      name="amount"
                      type="number"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    />
                  </td>
                  <td data-label="Category">
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    >
                      <option value="">Select</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Date">
                    <input
                      name="date"
                      type="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      className="expense-edit-input"
                    />
                  </td>
                  <td data-label="Currency">
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
                  <td data-label="Actions">
                    <button className="expense-btn save-btn" onClick={() => handleEditSave(exp._id || exp.id)} disabled={updateLoading}>
                      {updateLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button className="expense-btn cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td data-label="Name">{exp.name}</td>
                  <td data-label="Amount" className="font-semibold text-indigo-700">
                    {getCurrencySymbol(exp.currency || "INR")}
                    {exp.amount}
                  </td>
                  <td data-label="Category">{exp.category}</td>
                  <td data-label="Date">{exp.date ? exp.date.slice(0, 10) : ""}</td>
                  <td data-label="Currency">{exp.currency || "INR"}</td>
                  <td data-label="Actions">
                    <button className="expense-btn modify-btn" onClick={() => startEdit(exp)}>Modify</button>
                    <button className="expense-btn delete-btn" onClick={() => handleDelete(exp._id || exp.id)} disabled={deleteLoading}>
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
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