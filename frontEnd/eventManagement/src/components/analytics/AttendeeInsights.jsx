import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AttendeeInsights = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Age group data
  const ageGroupData = data?.ageGroups?.map(group => ({
    name: group._id || 'Unknown',
    value: group.count,
    percentage: group.percentage
  })) || [];

  // Gender data
  const genderData = data?.genderBreakdown?.map(gender => ({
    name: gender._id || 'Unknown',
    value: gender.count,
    percentage: gender.percentage
  })) || [];

  // Location data (top 5)
  const locationData = data?.topLocations?.slice(0, 5).map(location => ({
    name: location._id || 'Unknown',
    value: location.count,
    percentage: location.percentage
  })) || [];

  // Interest data (top 5)
  const interestData = data?.topInterests?.slice(0, 5).map(interest => ({
    name: interest._id || 'Unknown',
    value: interest.count,
    percentage: interest.percentage
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600">Count: {payload[0].value}</p>
          <p className="text-green-600">Percentage: {payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const ChartContainer = ({ title, data, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        {data.length > 0 ? (
          children
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Age Groups and Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Age Groups" data={ageGroupData}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageGroupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ageGroupData.map((entry, index) => (
                  <Cell key={`age-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Gender Distribution" data={genderData}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`gender-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Top Locations and Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Top Locations" data={locationData}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`location-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Top Interests" data={interestData}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={interestData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {interestData.map((entry, index) => (
                  <Cell key={`interest-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendee Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{data?.totalAttendees || 0}</p>
            <p className="text-sm text-gray-500">Total Attendees</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{data?.uniqueAttendees || 0}</p>
            <p className="text-sm text-gray-500">Unique Attendees</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{data?.repeatAttendees || 0}</p>
            <p className="text-sm text-gray-500">Repeat Attendees</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {data?.averageAge ? Math.round(data.averageAge) : 0}
            </p>
            <p className="text-sm text-gray-500">Average Age</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeInsights;
