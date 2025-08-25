import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const AttendeeInterestsChart = () => {
  const data = [
    { name: '18 - 24 Years', value: 2345, percentage: 57.8, color: '#8b5cf6' },
    { name: '25 - 34 Years', value: 1342, percentage: 33.1, color: '#dc2626' },
    { name: '35 - 44 Years', value: 245, percentage: 6.0, color: '#10b981' },
    { name: '44 + Years', value: 124, percentage: 3.1, color: '#f59e0b' },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, value, payload }) => {
    const RADIAN = Math.PI / 180;
    // Position labels outside the pie chart
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        {/* Value outside the chart */}
        <text 
          x={x} 
          y={y - 6} 
          fill="#374151" 
          textAnchor="middle" 
          dominantBaseline="central"
          className="text-xs font-bold"
        >
          {value}
        </text>
        {/* Percentage below the value */}
        <text 
          x={x} 
          y={y + 6} 
          fill="#6B7280" 
          textAnchor="middle" 
          dominantBaseline="central"
          className="text-xs"
        >
          {payload.percentage}%
        </text>
      </g>
    );
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-y-1 gap-x-3 mt-4 ">
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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full h-full flex flex-col ">
      <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">ATTENDEE AGES</h3>

      <div className="flex-1 min-h-0 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              outerRadius={70}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendeeInterestsChart;
