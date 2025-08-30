import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  // Handle empty or invalid data
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <p className="text-sm text-gray-600">No revenue data available</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center text-gray-500">
          <p>No data to display</p>
        </div>
      </div>
    );
  }

  // Transform the data for the chart
  const chartData = data?.dailyRevenue?.map((item, index) => {
    let dateLabel = '';
    
    // Handle different data structures
    if (item._id) {
      // Backend aggregation format with _id object
      if (item._id.day && item._id.month) {
        dateLabel = `${item._id.day}/${item._id.month}`;
      } else if (item._id.week) {
        dateLabel = `Week ${item._id.week}`;
      } else if (item._id.month) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dateLabel = monthNames[item._id.month - 1] || `Month ${item._id.month}`;
      } else {
        dateLabel = `Day ${index + 1}`;
      }
    } else if (item.name) {
      // Formatted backend data with name field
      dateLabel = item.name;
    } else {
      // Fallback
      dateLabel = `Day ${index + 1}`;
    }

    return {
      date: dateLabel,
      revenue: item.dailyRevenue || item.revenue || item.value || 0,
      bookings: item.dailyBookings || item.bookings || 0,
      tickets: item.dailyTickets || item.tickets || 0
    };
  }) || [];

  const formatCurrency = (value) => `LKR ${value.toLocaleString()}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
          <p className="text-sm text-gray-600">Daily revenue for the selected period</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(data?.summary?.totalRevenue || 0)}
          </p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? formatCurrency(value) : value,
                name === 'revenue' ? 'Revenue' : name === 'bookings' ? 'Bookings' : 'Tickets'
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="bookings" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Growth indicator */}
      {data?.summary?.growthPercentage !== undefined && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Growth vs Previous Period:</span>
            <span className={`text-sm font-semibold ${
              data.summary.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.summary.growthPercentage >= 0 ? '+' : ''}{data.summary.growthPercentage}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
