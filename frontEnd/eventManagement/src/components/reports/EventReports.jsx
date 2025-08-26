import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EventReports = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-80 bg-gray-100 rounded"></div>
      </div>
    );
  }

  // Transform event performance data
  const chartData = data?.revenueByEvent?.map(event => ({
    name: event.eventName?.length > 20 
      ? event.eventName.substring(0, 20) + '...' 
      : event.eventName,
    fullName: event.eventName,
    revenue: event.totalRevenue,
    bookings: event.totalBookings,
    tickets: event.totalTickets,
    avgPrice: event.averageTicketPrice
  })) || [];

  const formatCurrency = (value) => `LKR ${value.toLocaleString()}`;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-green-600">Revenue: {formatCurrency(data.revenue)}</p>
            <p className="text-blue-600">Bookings: {data.bookings}</p>
            <p className="text-purple-600">Tickets: {data.tickets}</p>
            <p className="text-orange-600">Avg Price: {formatCurrency(data.avgPrice)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Event Performance</h3>
          <p className="text-sm text-gray-600">Revenue and booking performance by event</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{chartData.length}</p>
          <p className="text-sm text-gray-500">Events Analyzed</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                yAxisId="revenue"
                orientation="left"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <YAxis 
                yAxisId="bookings"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="revenue"
                dataKey="revenue" 
                fill="#10B981" 
                name="Revenue"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="bookings"
                dataKey="bookings" 
                fill="#3B82F6" 
                name="Bookings"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500">
          No event performance data available
        </div>
      )}

      {/* Performance Summary */}
      {data?.summary && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(data.summary.totalRevenue || 0)}
            </p>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{data.summary.totalBookings || 0}</p>
            <p className="text-sm text-gray-500">Total Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(data.summary.averageEventRevenue || 0)}
            </p>
            <p className="text-sm text-gray-500">Avg per Event</p>
          </div>
        </div>
      )}

      {/* Top Performing Events */}
      {chartData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Top Performers</h4>
          <div className="space-y-2">
            {chartData.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{event.fullName}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(event.revenue)}</p>
                  <p className="text-sm text-gray-500">{event.bookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventReports;
