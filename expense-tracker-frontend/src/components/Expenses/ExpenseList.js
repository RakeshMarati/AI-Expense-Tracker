import React from "react";
import "./ExpenseList.css";

const ExpenseList = ({ expenses }) => (
  <div className="expense-list-container">
    <h3 className="font-semibold mb-4 text-lg text-blue-600">Expenses</h3>
    <table className="expense-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id}>
            <td>{exp.name}</td>
            <td className="font-semibold text-indigo-700">${exp.amount}</td>
            <td>{exp.category}</td>
            <td>{exp.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ExpenseList;