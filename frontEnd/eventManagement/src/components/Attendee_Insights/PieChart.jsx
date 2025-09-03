import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AttendeeInterestsChart = ({ data = [] }) => {
  // Simple hardcoded data for testing
  const chartData = [
    { name: '18-24', value: 320, color: '#8b5cf6' },
    { name: '25-34', value: 450, color: '#dc2626' },
    { name: '35-44', value: 280, color: '#10b981' },
    { name: '45-54', value: 150, color: '#f59e0b' },
    { name: '55+', value: 50, color: '#3b82f6' }
  ];

  console.log('PieChart received data:', data);
  console.log('PieChart chartData:', chartData);

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-y-1 gap-x-3 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs text-gray-700 font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">ATTENDEE AGES</h3>

      <div className="flex-1" style={{ minHeight: '250px', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelStyle={{ color: '#374151' }}
            />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendeeInterestsChart;
