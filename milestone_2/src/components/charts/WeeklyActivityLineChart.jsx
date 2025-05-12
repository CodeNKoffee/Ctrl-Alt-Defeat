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
        borderColor: '#34D399', // Green
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 4,
        pointBorderColor: '#34D399',
        pointBackgroundColor: '#ffffff',
        pointBorderWidth: 2,
      },
      {
        label: 'Flagged',
        data: cycles.map(cycle => data[cycle].flagged),
        borderColor: '#FBBF24', // Orange
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 4,
        pointBorderColor: '#FBBF24',
        pointBackgroundColor: '#ffffff',
        pointBorderWidth: 2,
      },
      {
        label: 'Rejected',
        data: cycles.map(cycle => data[cycle].rejected),
        borderColor: '#F87171', // Red
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 4,
        pointBorderColor: '#F87171',
        pointBackgroundColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide Chart.js legend, we'll render it manually
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
        <h2 className="text-sm font-medium text-gray-700">Cycle Activity</h2>
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <span className="w-3 h-3 rounded-full bg-[#34D399] inline-block mr-1"></span>
            <span className="text-xs text-gray-700">Accepted</span>
          </div>
          <div className="flex items-center mr-2">
            <span className="w-3 h-3 rounded-full bg-[#FBBF24] inline-block mr-1"></span>
            <span className="text-xs text-gray-700">Flagged</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#F87171] inline-block mr-1"></span>
            <span className="text-xs text-gray-700">Rejected</span>
          </div>
        </div>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeeklyActivityLineChart;