import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportsPieChart = ({ data, selectedCycle, setSelectedCycle, cycles }) => {
  const cycleIndex = cycles.indexOf(selectedCycle);

  const chartData = {
    labels: ['Accepted', 'Flagged', 'Rejected'],
    datasets: [
      {
        data: [
          data[selectedCycle].accepted,
          data[selectedCycle].flagged,
          data[selectedCycle].rejected,
        ],
        backgroundColor: ['#34D399', '#F87171', '#60A5FA'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => {
            if (cycleIndex > 0) setSelectedCycle(cycles[cycleIndex - 1]);
          }}
          disabled={cycleIndex === 0}
          className="text-gray-500 disabled:opacity-50"
        >
          <FiChevronLeft size={20} />
        </button>
        <h2 className="text-md font-semibold">{selectedCycle}</h2>
        <button
          onClick={() => {
            if (cycleIndex < cycles.length - 1) setSelectedCycle(cycles[cycleIndex + 1]);
          }}
          disabled={cycleIndex === cycles.length - 1}
          className="text-gray-500 disabled:opacity-50"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
      <div style={{ width: '100%', height: 250 }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
export default ReportsPieChart;
