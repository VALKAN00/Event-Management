import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const AttendeeLocationChart = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Set client-side rendering flag
    setIsClient(true);
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    { location: 'Alexandria', value: 11, percentage: '36%', color: '#3b82f6' },
    { location: 'London', value: 6, percentage: '26%', color: '#ef4444' },
    { location: 'Cairo', value: 8, percentage: '22%', color: '#10b981' }
  ];

  // Add debugging for mobile
  console.log('BarChart - isMobile:', isMobile, 'data:', data, 'chartData:', chartData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-800 text-sm">Location: {label}</p>
          <p className="text-xs sm:text-sm text-gray-600">Attendees: {data.value}</p>
          <p className="text-xs sm:text-sm text-gray-600">Percentage: {data.percentage}</p>
        </div>
      );
    }
    return null;
  };

  // If not client-side rendered yet, show loading state
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 w-full h-full flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">ALL ATTENDEE LOCATIONS</h3>
        <div className="flex-1 min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-32 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 w-full h-full flex flex-col">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">ALL ATTENDEE LOCATIONS</h3>
      
      <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
        <ResponsiveContainer 
          width="100%" 
          height="100%" 
          minHeight={isMobile ? 250 : 300}
          debounceMs={50}
        >
          <BarChart 
            data={chartData} 
            margin={{ 
              top: 10, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? 0 : 5, 
              bottom: isMobile ? 50 : 60 
            }}
            barCategoryGap={isMobile ? "30%" : "45%"}
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
              tick={{ 
                fontSize: isMobile ? 9 : 12, 
                fill: '#6b7280', 
                fontWeight: 'bold' 
              }}
              interval={0}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 50 : 40}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: isMobile ? 9 : 12, 
                fill: '#6b7280' 
              }}
              domain={[0, 'dataMax']}
              tickCount={isMobile ? 4 : 6}
              tickFormatter={(value) => value.toString()}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[isMobile ? 6 : 20, isMobile ? 6 : 20, 0, 0]}
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

      {/* Bottom labels with percentages - Hidden on mobile due to space constraints */}
      {data.length > 0 && (
        <div className="hidden sm:flex justify-between mt-3 lg:mt-4 px-4 lg:px-8">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="text-center cursor-pointer transition-all duration-200 hover:scale-105"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  hoveredIndex === index ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {item.percentage || `${Math.round((item.attendeeCount / data.reduce((sum, d) => sum + (d.attendeeCount || 0), 0)) * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeeLocationChart;