import React, { useState, useEffect } from 'react';
import AttendeeCard from "../components/Attendee_Insights/AttendeeCard";
import BarChart from "../components/Attendee_Insights/BarChart";
import PieChart from "../components/Attendee_Insights/PieChart";
import AttendeeAges from "../components/Attendee_Insights/AttendeeAges";
import { analyticsAPI } from '../api/analyticsAPI';

export default function AttendeeInsights() {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState({
    attendeeInsights: null,
    locationAnalytics: null,
    ageGroupAnalytics: null,
    genderAnalytics: null,
    interestAnalytics: null,
    totalAttendees: 0
  });

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };

      // Fetch all required analytics data in parallel
      const [
        attendeeInsights,
        locationAnalytics,
        ageGroupAnalytics,
        genderAnalytics,
        interestAnalytics
      ] = await Promise.all([
        analyticsAPI.getAttendeeInsights(params),
        analyticsAPI.getLocationAnalytics(params),
        analyticsAPI.getAgeGroupAnalytics(params),
        analyticsAPI.getGenderAnalytics(params),
        analyticsAPI.getInterestAnalytics(params)
      ]);

      setAnalyticsData({
        attendeeInsights: attendeeInsights.data,
        locationAnalytics: locationAnalytics.data,
        ageGroupAnalytics: ageGroupAnalytics.data,
        genderAnalytics: genderAnalytics.data,
        interestAnalytics: interestAnalytics.data,
        totalAttendees: attendeeInsights.data?.totalAttendees || 0
      });

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate, dateRange.endDate]);

  // Helper functions for data processing
  const getTopAgeGroup = () => {
    if (!analyticsData.ageGroupAnalytics?.ageGroups?.length) return { group: '18-24 Years', percentage: '0%', count: 0 };
    
    const topAge = analyticsData.ageGroupAnalytics.ageGroups.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
    
    return {
      group: `${topAge.ageRange} Years`,
      percentage: `${((topAge.count / analyticsData.totalAttendees) * 100).toFixed(0)}%`,
      count: topAge.count
    };
  };

  const getTopGender = () => {
    if (!analyticsData.genderAnalytics?.genderDistribution?.length) return { gender: 'Male', percentage: '0%', count: 0 };
    
    const topGender = analyticsData.genderAnalytics.genderDistribution.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
    
    return {
      gender: topGender.gender,
      percentage: `${((topGender.count / analyticsData.totalAttendees) * 100).toFixed(0)}%`,
      count: topGender.count
    };
  };

  const getTopLocation = () => {
    if (!analyticsData.locationAnalytics?.locations?.length) return { location: 'Colombo', percentage: '0%', count: 0 };
    
    const topLocation = analyticsData.locationAnalytics.locations.reduce((prev, current) => 
      (prev.attendeeCount > current.attendeeCount) ? prev : current
    );
    
    return {
      location: topLocation.city || topLocation.location,
      percentage: `${((topLocation.attendeeCount / analyticsData.totalAttendees) * 100).toFixed(0)}%`,
      count: topLocation.attendeeCount
    };
  };

  const getTopInterest = () => {
    if (!analyticsData.interestAnalytics?.interests?.length) return { interest: 'Music', percentage: '0%', count: 0 };
    
    const topInterest = analyticsData.interestAnalytics.interests.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
    
    return {
      interest: topInterest.interest || topInterest.category,
      percentage: `${((topInterest.count / analyticsData.totalAttendees) * 100).toFixed(0)}%`,
      count: topInterest.count
    };
  };

  const getTotalEngagement = () => {
    // Calculate total engagement from social media reach or other metrics
    if (!analyticsData.attendeeInsights?.socialMediaReach) return { platform: 'Facebook ADS', percentage: '0%', count: 0 };
    
    const socialReach = analyticsData.attendeeInsights.socialMediaReach;
    const platforms = [
      { name: 'Facebook', count: socialReach.facebook || 0 },
      { name: 'Instagram', count: socialReach.instagram || 0 },
      { name: 'Twitter', count: socialReach.twitter || 0 }
    ];
    
    const topPlatform = platforms.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
    
    return {
      platform: `${topPlatform.name} ADS`,
      percentage: `${((topPlatform.count / (analyticsData.totalAttendees || 1)) * 100).toFixed(0)}%`,
      count: topPlatform.count
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#F2F2F2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendee insights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#F2F2F2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error: </strong>{error}
          </div>
          <button 
            onClick={fetchAnalyticsData}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get processed data
  const topAge = getTopAgeGroup();
  const topGender = getTopGender();
  const topLocation = getTopLocation();
  const topInterest = getTopInterest();
  const totalEngagement = getTotalEngagement();
  return (
    <div className="bg-[#F2F2F2] min-h-screen">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-6 border-b border-gray-200 mr-6 ml-6 mt-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            All Attendee Insights
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Attendees Count */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Attendees: {analyticsData.totalAttendees.toLocaleString()}
            </span>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-500 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M3 6H21L18 12V18L15 21V12L3 6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-gray-700 font-medium">Filter</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3 top-3 text-gray-400"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Content - Left Cards and Right Graphs */}
        <div className="flex gap-6 h-[800px]">
          {/* Left Section - Stats Cards */}
          <div className="w-80 h-full flex flex-col justify-between">
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE AGE"
              value={topAge.group}
              trend="increase"
              trendValue={topAge.percentage}
              numberValue={topAge.count.toLocaleString()}
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE GENDER"
              value={topGender.gender}
              trend="increase"
              trendValue={topGender.percentage}
              numberValue={topGender.count.toLocaleString()}
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE LOCATION"
              value={topLocation.location}
              trend="decrease"
              trendValue={topLocation.percentage}
              numberValue={topLocation.count.toLocaleString()}
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE INTERESTS"
              value={topInterest.interest}
              trend="increase"
              trendValue={topInterest.percentage}
              numberValue={topInterest.count.toLocaleString()}
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="TOTAL ENGAGEMENT"
              value={totalEngagement.platform}
              trend="decrease"
              trendValue={totalEngagement.percentage}
              numberValue={totalEngagement.count.toLocaleString()}
            />
          </div>

          {/* Right Section - Charts */}
          <div className="flex-1 flex flex-col gap-6 h-full">
            {/* Bar Chart - Takes 60% of height */}
            <div className="flex-[3]">
              <BarChart 
                data={analyticsData.locationAnalytics?.locations || []}
              />
            </div>

            {/* Bottom Charts Row - Takes 40% of height */}
            <div className="flex-[2] grid grid-cols-2 gap-6">
              {/* Attendee Interests Donut Chart */}
              <div className="h-full">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full h-full flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                    ATTENDEE INTERESTS
                  </h3>
                  <div className="flex-1 min-h-0">
                    <AttendeeAges 
                      data={analyticsData.interestAnalytics?.interests || []}
                    />
                  </div>
                </div>
              </div>
              {/* Attendee Ages Pie Chart */}
              <div className="h-full">
                <PieChart 
                  data={analyticsData.ageGroupAnalytics?.ageGroups || []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
