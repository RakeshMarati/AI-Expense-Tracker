import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Food", "Transport", "Shopping", "Bills", "Other"],
  datasets: [
    {
      data: [300, 50, 100, 80, 40],
      backgroundColor: [
        "#3b82f6",
        "#f59e42",
        "#10b981",
        "#f43f5e",
        "#6366f1"
      ],
      borderWidth: 1,
    },
  ],
};

const SpendingChart = () => (
  <div className="w-full max-w-xs mx-auto">
    <Doughnut data={data} />
  </div>
);

export default SpendingChart;