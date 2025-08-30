import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import analyticsAPI from '../../api/analyticsAPI';

const AttendeeReports = ({ loading: parentLoading }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real attendee data from backend
  useEffect(() => {
    const fetchAttendeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching attendee data...');
        
        // Try to get attendee insights from real backend
        const response = await analyticsAPI.getAttendeeAnalytics({
          period: 'month'
        });
        
        console.log('Attendee data response:', response);
        
        if (response && response.success && response.data) {
          setData(response.data);
        } else {
          throw new Error('No data received from API');
        }
      } catch (err) {
        console.error('Error fetching attendee data:', err);
        setError(err.message);
        
        // Set fallback mock data for development
        console.log('Using fallback mock data');
        setData({
          summary: {
            totalAttendees: 1245,
            totalAttendances: 2890,
            returningAttendeeRate: "42.5"
          },
          demographics: {
            ageGroups: {
              "18-24": 145,
              "25-34": 467,
              "35-44": 398,
              "45-54": 189,
              "55+": 46
            },
            genderDistribution: {
              "male": 578,
              "female": 534,
              "other": 133
            },
            locationDistribution: {
              "Colombo": 456,
              "Kandy": 234,
              "Galle": 178,
              "Jaffna": 123,
              "Negombo": 89,
              "Other": 165
            }
          },
          interests: {
            "music": 356,
            "technology": 289,
            "sports": 234,
            "art": 178,
            "food": 145,
            "travel": 123
          },
          attendanceGrowth: [
            { month: 'Jan', attendees: 234, events: 12 },
            { month: 'Feb', attendees: 345, events: 15 },
            { month: 'Mar', attendees: 467, events: 18 },
            { month: 'Apr', attendees: 398, events: 16 },
            { month: 'May', attendees: 534, events: 22 },
            { month: 'Jun', attendees: 612, events: 25 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendeeData();
  }, []);

  if (loading || parentLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p className="text-red-500">⚠️ Using fallback data for development</p>
          <p className="text-sm mt-2">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>No attendee data available</p>
        </div>
      </div>
    );
  }

  // Transform data for charts
  const ageGroupData = Object.entries(data.demographics?.ageGroups || {}).map(([age, count]) => ({
    age,
    count,
    percentage: ((count / data.summary?.totalAttendees) * 100).toFixed(1)
  }));

  const genderData = Object.entries(data.demographics?.genderDistribution || {}).map(([gender, count]) => ({
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    count,
    percentage: ((count / data.summary?.totalAttendees) * 100).toFixed(1)
  }));

  const locationData = Object.entries(data.demographics?.locationDistribution || {})
    .map(([location, count]) => ({
      location,
      count,
      percentage: ((count / data.summary?.totalAttendees) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const interestData = Object.entries(data.interests || {})
    .map(([interest, count]) => ({
      interest: interest.charAt(0).toUpperCase() + interest.slice(1),
      count,
      percentage: ((count / data.summary?.totalAttendees) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const growthData = data.attendanceGrowth || [];

  // Color schemes
  const AGE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
  const GENDER_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendee Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{data.summary?.totalAttendees?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-500">Total Attendees</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{data.summary?.totalAttendances?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-500">Total Attendances</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{data.summary?.returningAttendeeRate || 0}%</p>
            <p className="text-sm text-gray-500">Returning Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{Object.keys(data.interests || {}).length}</p>
            <p className="text-sm text-gray-500">Interest Categories</p>
          </div>
        </div>
      </div>

      {/* Age Groups - Horizontal Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Group Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="age" type="category" width={60} />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'count' ? 'Attendees' : name]}
                  labelFormatter={(label) => `Age Group: ${label}`}
                />
                <Bar dataKey="count" fill="#8884d8">
                  {ageGroupData.map((entry, index) => (
                    <Cell key={`age-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution - Vertical Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'count' ? 'Attendees' : name]}
                  labelFormatter={(label) => `Gender: ${label}`}
                />
                <Bar dataKey="count" fill="#82ca9d">
                  {genderData.map((entry, index) => (
                    <Cell key={`gender-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Location and Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations - Area Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="location" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Attendees']}
                  labelFormatter={(label) => `Location: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#ff7c7c" 
                  fill="#ff7c7c" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Interests - Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Interests</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="interest" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Interested Attendees']}
                  labelFormatter={(label) => `Interest: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Growth Trend - Full Width */}
      {growthData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Growth Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="attendees" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Attendees"
                />
                <Area 
                  type="monotone" 
                  dataKey="events" 
                  stackId="2"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Events"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeReports;
