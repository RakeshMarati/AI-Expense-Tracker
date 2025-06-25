import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    category: "",
    date: "",
    currency: currencies[0].code
  });

  // For react-datepicker, keep a Date object in state
  const [dateObj, setDateObj] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDateChange = date => {
    setDateObj(date);
    // Format as yyyy-mm-dd for backend compatibility
    const formatted = date ? date.toISOString().slice(0, 10) : "";
    setForm(f => ({ ...f, date: formatted }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.name && form.amount && form.category && form.date && form.category !== "") {
      onAddExpense({ ...form });
      setForm({
        name: "",
        amount: "",
        category: "",
        date: "",
        currency: currencies[0].code
      });
      setDateObj(null);
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
        <DatePicker
          selected={dateObj}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          className="add-expense-datepicker"
          maxDate={new Date()}
          isClearable
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
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