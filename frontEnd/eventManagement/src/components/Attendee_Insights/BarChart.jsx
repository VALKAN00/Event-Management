import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const AttendeeLocationChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = [
    { location: '853', value: 853, percentage: '11.7%', color: '#3b82f6' },
    { location: '743', value: 743, percentage: '10.2%', color: '#ef4444' },
    { location: '763', value: 763, percentage: '10.5%', color: '#10b981' },
    { location: '934', value: 934, percentage: '12.9%', color: '#8b5cf6' },
    { location: '783', value: 783, percentage: '10.8%', color: '#1f2937' },
    { location: '643', value: 643, percentage: '8.9%', color: '#f59e0b' },
    { location: '687', value: 687, percentage: '9.5%', color: '#06b6d4' },
    { location: '936', value: 936, percentage: '12.9%', color: '#84cc16' },
    { location: '573', value: 573, percentage: '7.9%', color: '#6b7280' },
    { location: '345', value: 345, percentage: '4.8%', color: '#ec4899' },
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
            data={data} 
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
              domain={[0, 1000]}
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
              {data.map((entry, index) => (
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