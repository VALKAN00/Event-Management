import React, { useState, useEffect, useRef } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NetSalesChart = ({ data = [], loading, period = 'week', onPeriodChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const dropdownRef = useRef(null);
  const chartContainerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Filter options for the chart
  const filterOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' }
  ];
  // Default fallback data
  const defaultData = [
    { name: 'Week 1', value: 35000, percentage: 17.3, tickets: 145, events: 5 },
    { name: 'Week 2', value: 22000, percentage: 10.9, tickets: 95, events: 3 },
    { name: 'Week 3', value: 46000, percentage: 22.7, tickets: 185, events: 7 },
    { name: 'Week 4', value: 15000, percentage: 7.4, tickets: 65, events: 2 },
    { name: 'Week 5', value: 28000, percentage: 13.8, tickets: 115, events: 4 },
    { name: 'Week 6', value: 34000, percentage: 16.8, tickets: 140, events: 6 },
    { name: 'Week 7', value: 22500, percentage: 11.1, tickets: 90, events: 3 },
  ];

  // Use provided data or fallback to default
  const chartData = data && data.length > 0 ? data : defaultData;
  
  // Calculate totals from the data
  const totalRevenue = chartData.reduce((sum, item) => sum + (item.value || 0), 0);
  const totalTickets = chartData.reduce((sum, item) => sum + (item.tickets || 0), 0);
  const totalEvents = chartData.reduce((sum, item) => sum + (item.events || 0), 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 font-medium">{`${label}`}</p>
          <p className="text-red-500 font-semibold">
            Revenue: {`${payload[0].value.toLocaleString()} LKR`}
          </p>
          <p className="text-blue-500 text-sm">
            Tickets: {`${data.tickets || 0}`}
          </p>
          <p className="text-green-500 text-sm">
            Events: {`${data.events || 0}`}
          </p>
          <p className="text-gray-500 text-sm">
            {`${data.percentage || 0}% of total`}
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
        <circle cx={cx} cy={cy} r={2} fill="#ef4444" stroke="#ffffff" strokeWidth={1} className="sm:r-3" />
        <text 
          x={cx} 
          y={cy - 20} 
          textAnchor="middle" 
          className="text-xs font-semibold fill-gray-700 hidden sm:block"
        >
          {(payload.value / 1000).toFixed(0)}k
        </text>
        <text 
          x={cx} 
          y={cy - 8} 
          textAnchor="middle" 
          className="text-xs fill-gray-500 hidden sm:block"
        >
          {payload.percentage || 0}%
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-blue-200 p-3 sm:p-4 w-full min-h-[280px] sm:min-h-[340px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="animate-pulse bg-gray-200 h-5 sm:h-6 w-24 sm:w-32 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-5 sm:h-6 w-16 sm:w-20 rounded-full"></div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="text-center sm:text-left">
              <div className="animate-pulse bg-gray-200 h-3 w-16 sm:w-20 mb-1 rounded mx-auto sm:mx-0"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-12 sm:w-16 rounded mx-auto sm:mx-0"></div>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="h-32 sm:h-40 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-blue-200 p-3 sm:p-4 w-full min-h-[280px] sm:min-h-[340px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">NET SALES</h2>
          <svg width="8" height="5" viewBox="0 0 12 8" fill="none" className="text-gray-400 sm:w-3 sm:h-2">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center bg-black text-white px-2 sm:px-3 py-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <img 
              src="/assets/dashboard/LineChart/Filter.svg" 
              alt="Filter" 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1"
            />
            <span className="text-xs font-medium hidden sm:inline">Filter: </span>
            <span className="text-xs font-medium">{period}</span>
            <svg 
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (onPeriodChange) {
                      onPeriodChange(option.value);
                    }
                    setShowDropdown(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    period === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center sm:text-left">
          <p className="text-gray-500 text-xs">Total Revenue</p>
          <p className="text-red-500 text-sm font-bold">{totalRevenue.toLocaleString()} LKR</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-gray-500 text-xs">Total Tickets</p>
          <p className="text-red-500 text-sm font-bold">{totalTickets.toLocaleString()} Tickets</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-gray-500 text-xs">Total Events</p>
          <p className="text-red-500 text-sm font-bold">{totalEvents.toLocaleString()} Events</p>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="h-32 sm:h-40" style={{ minHeight: '128px' }}>
        {chartReady ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={128}>
            <RechartsLineChart
              data={chartData}
              margin={{
                top: 30,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                className="sm:text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                className="sm:text-xs"
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="linear"
                dataKey="value"
                stroke="#ef4444"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 4, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <span className="text-gray-500 text-sm">Loading chart...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetSalesChart;