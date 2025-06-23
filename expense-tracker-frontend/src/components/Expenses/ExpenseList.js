import React from "react";

const ExpenseList = ({ expenses }) => (
  <div className="bg-white/90 p-8 rounded-2xl shadow-lg mt-8">
    <h3 className="font-semibold mb-4 text-lg text-blue-600">Expenses</h3>
    <table className="w-full text-left divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Category</th>
          <th className="py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id} className="hover:bg-indigo-50 transition">
            <td className="py-2">{exp.name}</td>
            <td className="py-2 font-semibold text-indigo-700">${exp.amount}</td>
            <td className="py-2">{exp.category}</td>
            <td className="py-2">{exp.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ExpenseList;