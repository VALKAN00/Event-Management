import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const AttendeeLocationChart = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Transform backend data to chart format with colors
  const chartData = data.length > 0 ? data.map((item, index) => ({
    location: item.city || item.location || `Location ${index + 1}`,
    value: item.attendeeCount || item.count || 0,
    percentage: `${item.percentage || 0}%`,
    color: [
      '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#1f2937',
      '#f59e0b', '#06b6d4', '#84cc16', '#6b7280', '#ec4899'
    ][index % 10]
  })) : [
    // Fallback data when loading or no data
    { location: 'Colombo', value: 450, percentage: '36%', color: '#3b82f6' },
    { location: 'Kandy', value: 320, percentage: '26%', color: '#ef4444' },
    { location: 'Galle', value: 280, percentage: '22%', color: '#10b981' },
    { location: 'Jaffna', value: 200, percentage: '16%', color: '#8b5cf6' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">Location: {label}</p>
          <p className="text-sm text-gray-600">Attendees: {data.value}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 w-full h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">ALL ATTENDEE LOCATIONS</h3>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barCategoryGap="30%"
          >
            <CartesianGrid 
              strokeDasharray="1 1" 
              stroke="#e5e7eb" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="location" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }}
              interval={0}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={[0, 'dataMax']}
              tickCount={6}
              tickFormatter={(value) => value.toString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[20, 20, 0, 0]}
              onMouseEnter={(data, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: hoveredIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                    transition: 'filter 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom labels with percentages */}
      <div className="flex justify-between mt-4 px-8">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="text-center cursor-pointer transition-all duration-200 hover:scale-105"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className={`text-sm font-medium transition-colors ${
                hoveredIndex === index ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              {item.percentage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeLocationChart;