import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function TopInternshipCompaniesChart({ companies }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Top Internship Companies</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={companies} barCategoryGap="30%"> {/* Adjusted bar spacing */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '10px', color: '#6B7280' }}
          />
          <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} /> {/* Changed color to blue */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
