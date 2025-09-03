import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomerEngagementChart = ({ data = [], loading = false }) => {
  const [chartReady, setChartReady] = useState(false);
  const chartContainerRef = useRef(null);

  // Check if chart container has dimensions
  useEffect(() => {
    const checkDimensions = () => {
      if (chartContainerRef.current) {
        const { offsetWidth, offsetHeight } = chartContainerRef.current;
        if (offsetWidth > 0 && offsetHeight > 0) {
          setChartReady(true);
        }
      }
    };

    // Check immediately
    checkDimensions();

    // Set a timeout to check again in case of delayed rendering
    const timer = setTimeout(checkDimensions, 100);

    return () => clearTimeout(timer);
  }, [loading]);
  // Diverse color palette for different events
  const eventColors = [
    '#8b5cf6', // Purple
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6'  // Teal
  ];

  // Fallback data if no real data is provided
  const fallbackData = [
    { name: 'Event- A', value: 450, percentage: 29.4, color: eventColors[0] },
    { name: 'Event- B', value: 250, percentage: 16.3, color: eventColors[1] },
    { name: 'Event- C', value: 170, percentage: 11.1, color: eventColors[2] },
    { name: 'Event- D', value: 370, percentage: 24.2, color: eventColors[3] },
    { name: 'Event- E', value: 290, percentage: 19.0, color: eventColors[4] },
  ];

  // Process real data from backend
  const processData = (backendData) => {
    if (!backendData || backendData.length === 0) {
      return fallbackData;
    }

    // Calculate total for percentages
    const total = backendData.reduce((sum, item) => sum + (item.value || item.totalBookings || 0), 0);
    
    return backendData.map((item, index) => ({
      name: item.name || item.eventName || `Event ${index + 1}`,
      value: item.value || item.totalBookings || 0,
      percentage: total > 0 ? ((item.value || item.totalBookings || 0) / total * 100).toFixed(1) : 0,
      color: eventColors[index % eventColors.length]
    }));
  };

  const chartData = processData(data);

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
    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 w-full min-h-[280px] sm:min-h-[340px]">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-bold text-gray-800 text-center mb-2 sm:mb-3">
        Customer Engagement
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-32 sm:h-48">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Chart */}
      <div ref={chartContainerRef} className="h-35 sm:h-48 mb-2 sm:mb-3" style={{ minHeight: '128px' }}>
        {chartReady ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={128}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={70}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                className="sm:outerRadius-80 sm:innerRadius-40"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <span className="text-gray-500 text-sm">Loading chart...</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 sm:gap-y-2 gap-x-2 sm:gap-x-4">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700 text-xs font-medium truncate">{entry.name}</span>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
};

export default CustomerEngagementChart;
