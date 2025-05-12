import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Mon', reports: 5 },
  { name: 'Tue', reports: 8 },
  { name: 'Wed', reports: 6 },
  { name: 'Thu', reports: 10 },
  { name: 'Fri', reports: 7 },
  { name: 'Sat', reports: 4 },
  { name: 'Sun', reports: 9 }
];

export default function ChartCard({ title }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={sampleData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
