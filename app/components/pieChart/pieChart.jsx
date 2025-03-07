// components/FundingPieChart.js
"use client"
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // Register the plugin

const FundingPieChart = ({ totalAmount, disbursedAmount }) => {
  // Calculate the remaining amount
  const remainingAmount = totalAmount - disbursedAmount;

  const data = {
    labels: ['Disbursed', 'Remaining'],
    datasets: [
      {
        data: [disbursedAmount, remainingAmount],
        backgroundColor: ['#36A2EB', '#FF6384'], // Customize as needed
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
      },
      datalabels: {
        color: '#000', // Label text color
        font: {
          size: 14,
          weight: 'bold',
        },
        formatter: (value, context) => {
          return `${value.toLocaleString()} USD`; // Format the label to show the amount
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <h3>Funding Status</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default FundingPieChart;



