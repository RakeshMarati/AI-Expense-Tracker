import React, { useState } from "react";
import "./AddExpense.css";

const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];

const AddExpense = ({ onAddExpense }) => {
  const [form, setForm] = useState({ name: "", amount: "", category: categories[0], date: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (form.name && form.amount && form.category && form.date) {
      onAddExpense({ ...form });
      setForm({ name: "", amount: "", category: categories[0], date: "" });
    }
  };

  return (
    <div className="add-expense-container">
      <h3 className="font-semibold mb-4 text-lg text-blue-600">Add Expense</h3>
      <form className="add-expense-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Name" />
        <input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Amount" />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input name="date" value={form.date} onChange={handleChange} type="date" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddExpense;