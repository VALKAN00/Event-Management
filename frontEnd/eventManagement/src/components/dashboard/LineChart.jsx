import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NetSalesChart = () => {
  const filter = 'Weekly';

  const data = [
    { name: 'Week 1', value: 35000, percentage: 17.3 },
    { name: 'Week 2', value: 22000, percentage: 10.9 },
    { name: 'Week 3', value: 46000, percentage: 22.7 },
    { name: 'Week 4', value: 15000, percentage: 7.4 },
    { name: 'Week 5', value: 28000, percentage: 13.8 },
    { name: 'Week 6', value: 34000, percentage: 16.8 },
    { name: 'Week 7', value: 22500, percentage: 11.1 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600">{`${label}`}</p>
          <p className="text-red-500 font-semibold">
            {`${payload[0].value.toLocaleString()} LKR`}
          </p>
          <p className="text-gray-500 text-sm">
            {`${payload[0].payload.percentage}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={3} fill="#ef4444" stroke="#ffffff" strokeWidth={1} />
        <text 
          x={cx} 
          y={cy - 30} 
          textAnchor="middle" 
          className="text-xs font-semibold fill-gray-700"
        >
          {(payload.value / 1000).toFixed(0)}k
        </text>
        <text 
          x={cx} 
          y={cy - 12} 
          textAnchor="middle" 
          className="text-xs fill-gray-500"
        >
          {payload.percentage}%
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-blue-200 p-4 w-full" style={{ height: '340px' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">NET SALES</h2>
          <svg width="10" height="6" viewBox="0 0 12 8" fill="none" className="text-gray-400">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="flex items-center bg-black text-white px-3 py-1 rounded-full">
          <img 
            src="/assets/dashboard/LineChart/Filter.svg" 
            alt="Filter" 
            className="w-3 h-3 mr-1"
          />
          <span className="text-xs font-medium">Filter: {filter}</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-xs">Total Revenue</p>
          <p className="text-red-500 text-sm font-bold">156,500 LKR</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total Tickets</p>
          <p className="text-red-500 text-sm font-bold">2438 Tickets</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total Events</p>
          <p className="text-red-500 text-sm font-bold">32 Events</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 30,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="linear"
              dataKey="value"
              stroke="#ef4444"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetSalesChart;