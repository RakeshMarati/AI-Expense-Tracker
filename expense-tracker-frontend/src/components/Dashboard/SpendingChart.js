import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];
const colors = [
  "#3b82f6", // Food
  "#f59e42", // Transport
  "#10b981", // Shopping
  "#f43f5e", // Bills
  "#6366f1"  // Other
];

function getCategoryTotals(expenses) {
  const totals = categories.map(
    cat => expenses.filter(e => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0)
  );
  return totals;
}

const SpendingChart = ({ expenses }) => {
  const data = {
    labels: categories,
    datasets: [
      {
        data: getCategoryTotals(expenses),
        backgroundColor: colors,
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