import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const AttendeeLocationsChart = () => {
  const data = [
    { name: 'Colombo', value: 227, percentage: 43.4, color: '#3b82f6' },
    { name: 'Kandy', value: 123, percentage: 23.5, color: '#ef4444' },
    { name: 'Galle', value: 52, percentage: 9.9, color: '#10b981' },
    { name: 'Jaffna', value: 70, percentage: 13.4, color: '#f59e0b' },
    { name: 'International', value: 143, percentage: 27.3, color: '#ec4899' },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">ATTENDEE LOCATIONS</h3>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 30,
              bottom: 60,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              horizontal={true} 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              domain={[0, 300]}
              ticks={[0, 50, 100, 150, 200, 250, 300]}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              barSize={35}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Value labels below bars - positioned better */}
      <div className="flex justify-between px-8 mt-1">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center" style={{width: '60px'}}>
            <span className="text-sm font-bold text-gray-900">{item.value}</span>
            <span className="text-xs text-gray-500">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeLocationsChart;
