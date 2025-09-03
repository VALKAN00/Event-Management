import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AttendeeInterestsChart = () => {
  const data = [
    { name: 'Live Music 🎵', value: 50, percentage: 34.5, color: '#fec362' },
    { name: 'Innovation 🚀', value: 35, percentage: 24.1, color: '#0c7cf3' },
    { name: 'EDM Music 🎧', value: 35, percentage: 24.1, color: '#1c8546' },
    { name: 'Food Festivals 🍴', value: 25, percentage: 17.2, color: '#db5c5c' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Count: {data.value}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, value, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
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

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4 text-center">ATTENDEE INTERESTS</h3>

      <div className="flex-1 min-h-0 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={window.innerWidth < 640 ? 45 : 60}
              innerRadius={window.innerWidth < 640 ? 25 : 35}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-2 flex-shrink-0 mt-1">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700 text-xs sm:text-sm font-medium truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeInterestsChart;
