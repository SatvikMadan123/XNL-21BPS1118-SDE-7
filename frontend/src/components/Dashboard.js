import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ latency: [], successRate: [], errorRate: [] });

  useEffect(() => {
    // Fetch real-time data from the backend
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Chart.js Data for latency, success rate, and error rate
  const data = {
    labels: metrics.latency.map((_, index) => `Metric ${index + 1}`),
    datasets: [
      {
        label: 'Latency (ms)',
        data: metrics.latency,
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
      {
        label: 'Success Rate (%)',
        data: metrics.successRate,
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
      },
      {
        label: 'Error Rate (%)',
        data: metrics.errorRate,
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1>Performance Monitoring Dashboard</h1>
      <Line data={data} options={{ responsive: true, plugins: { title: { display: true, text: 'RPC Performance Metrics' } } }} />
    </div>
  );
};

export default Dashboard;
