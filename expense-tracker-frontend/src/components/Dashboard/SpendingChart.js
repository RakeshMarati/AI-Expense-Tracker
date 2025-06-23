import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const getCategoryTotals = (expenses) => {
  const totals = {};
  expenses.forEach(exp => {
    const cat = exp.category || "Other";
    totals[cat] = (totals[cat] || 0) + Number(exp.amount || exp.targetAmount || 0);
  });
  return totals;
};

const getColors = (n) => {
  const palette = [
    "#3b82f6", "#f59e42", "#10b981", "#f43f5e", "#6366f1", "#a21caf", "#fbbf24", "#14b8a6", "#eab308"
  ];
  return Array.from({ length: n }, (_, i) => palette[i % palette.length]);
};

const SpendingChart = ({ expenses }) => {
  // Show message if no expenses
  if (!expenses || expenses.length === 0) {
    return (
      <div className="spending-chart-empty" style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
        No expenses added.
      </div>
    );
  }

  const categoryTotals = getCategoryTotals(expenses);
  const categories = Object.keys(categoryTotals);
  const data = {
    labels: categories,
    datasets: [
      {
        data: categories.map(cat => categoryTotals[cat]),
        backgroundColor: getColors(categories.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <Doughnut data={data} />
    </div>
  );
};

export default SpendingChart;