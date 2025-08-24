import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomerEngagementChart = () => {
  const data = [
    { name: 'Event- A', value: 450, percentage: 29.4, color: '#8b5cf6' },
    { name: 'Event- B', value: 250, percentage: 16.3, color: '#3b82f6' },
    { name: 'Event- C', value: 170, percentage: 11.1, color: '#f59e0b' },
    { name: 'Event- D', value: 370, percentage: 24.2, color: '#10b981' },
    { name: 'Event- E', value: 290, percentage: 19.0, color: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Value: {data.value}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        {/* Value inside the segment */}
        <text 
          x={x} 
          y={y - 6} 
          fill="white" 
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
          fill="white" 
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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full h-full">
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-800 text-center mb-3">
        Customer Engagement
      </h2>

      {/* Chart */}
      <div className="h-48 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={40}
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
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
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

export default CustomerEngagementChart;
