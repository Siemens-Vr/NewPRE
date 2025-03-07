"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BudgetSpentChart = () => {
  // The full month names to be used in tooltips
  const fullMonthNames = ['January', 'February', 'June', 'March', 'April', 'May', 'June'];

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'],
    datasets: [
      {
        label: 'Amount',
        data: [400, 500, 450, 350, 600, 480, 560],
        backgroundColor: 'green',
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          // Custom tooltip callback to show full month names
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const monthName = fullMonthNames[index];
            const amount = tooltipItem.raw;
            return `${monthName}: $${amount}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2 className='text-xl text-white-400'>Budget Spent</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BudgetSpentChart;
