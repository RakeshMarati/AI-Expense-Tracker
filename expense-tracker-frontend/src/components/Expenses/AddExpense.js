import React, { useState } from "react";
import "./AddExpense.css";

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

const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" }
  // Add more if needed
];

const AddExpense = ({ onAddExpense }) => {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: categories[0],
    date: "",
    currency: currencies[0].code
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (form.name && form.amount && form.category && form.date) {
      onAddExpense({ ...form });
      setForm({
        name: "",
        amount: "",
        category: categories[0],
        date: "",
        currency: currencies[0].code
      });
    }
  };

  return (
    <div className="add-expense-container">
      <h3 className="font-semibold mb-4 text-lg text-blue-600">Add Expense</h3>
      <form className="add-expense-form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Name"
        />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          type="number"
          placeholder="Amount"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          placeholder="Date"
          style={{ minWidth: '0', width: '100%' }}
        />
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
        >
          {currencies.map(cur => (
            <option key={cur.code} value={cur.code}>
              {cur.symbol} {cur.name}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddExpense;