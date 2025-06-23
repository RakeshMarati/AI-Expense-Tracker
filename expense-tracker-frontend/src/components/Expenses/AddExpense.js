import React, { useState } from "react";

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
    <div className="bg-white/90 p-8 rounded-2xl shadow-lg mt-8">
      <h3 className="font-semibold mb-4 text-lg text-blue-600">Add Expense</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} className="border border-gray-200 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition" type="text" placeholder="Name" />
        <input name="amount" value={form.amount} onChange={handleChange} className="border border-gray-200 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition" type="number" placeholder="Amount" />
        <select name="category" value={form.category} onChange={handleChange} className="border border-gray-200 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input name="date" value={form.date} onChange={handleChange} className="border border-gray-200 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition" type="date" />
        <button className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold" type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddExpense; 