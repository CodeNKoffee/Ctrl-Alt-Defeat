import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklyActivityLineChart = ({ data, cycles }) => {
  const chartData = {
    labels: cycles,
    datasets: [
      {
        label: 'Accepted',
        data: cycles.map(cycle => data[cycle].accepted),
        borderColor: '#8B5CF6', // Purple
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 4,
        pointBorderColor: '#8B5CF6',
        pointBackgroundColor: '#ffffff', // Hollow points
        pointBorderWidth: 2,
      },
      {
        label: 'Flagged',
        data: cycles.map(cycle => data[cycle].flagged),
        borderColor: '#374151', // Black
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 4,
        pointBorderColor: '#374151',
        pointBackgroundColor: '#ffffff', // Hollow points
        pointBorderWidth: 2,
      },
      {
        label: 'Rejected',
        data: cycles.map(cycle => data[cycle].rejected),
        borderColor: '#3B82F6', // Light Blue
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 4,
        pointBorderColor: '#3B82F6',
        pointBackgroundColor: '#ffffff', // Hollow points
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        align: 'end', // Align legend to the right
        labels: {
          font: {
            size: 10,
          },
          color: '#6B7280', // Neutral gray
          usePointStyle: true, // Use point style for legend
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        titleColor: '#374151',
        bodyColor: '#374151',
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB', // Subtle grid lines
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
        title: {
          display: true,
          text: 'Number of Reports',
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          display: false, // Remove vertical grid lines
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
        title: {
          display: true,
          text: 'Cycles',
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-gray-700">Weekly Activity</h2>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeeklyActivityLineChart;