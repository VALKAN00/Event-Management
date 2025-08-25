import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AttendeeAgesChart = () => {
  const data = [
    { name: 'Interest - A', value: 218, percentage: 19.5, color: '#8b5cf6' },
    { name: 'Interest - B', value: 265, percentage: 24.7, color: '#3b82f6' },
    { name: 'Interest - C', value: 123, percentage: 11.5, color: '#f59e0b' },
    { name: 'Interest - D', value: 218, percentage: 19.5, color: '#10b981' },
    { name: 'Interest - E', value: 265, percentage: 24.2, color: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">Interest: {data.name}</p>
          <p className="text-sm text-gray-600">Count: {data.value}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, value, payload }) => {
    const RADIAN = Math.PI / 180;
    // Position labels outside the donut chart
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

  return (
    <div className="w-full h-full flex flex-col" style={{height: "300px"}}>
      {/* Chart */}
      <div className="flex-1 min-h-0 mb-2 ">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={70}
              innerRadius={45}
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
      <div className="grid grid-cols-2 gap-y-1 gap-x-3 flex-shrink-0 mt-1">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700 text-xs font-medium truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeAgesChart;
