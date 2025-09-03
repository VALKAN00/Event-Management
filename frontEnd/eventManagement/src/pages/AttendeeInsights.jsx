import React, { useState, useEffect, useCallback } from 'react';
import AttendeeCard from "../components/Attendee_Insights/AttendeeCard";
import BarChart from "../components/Attendee_Insights/BarChart";
import PieChart from "../components/Attendee_Insights/PieChart";
import AttendeeAges from "../components/Attendee_Insights/AttendeeAges";
import analyticsAPI from '../api/reportsAPI-hybrid';
import { useAuth } from '../context/AuthContext';

export default function AttendeeInsights() {
  const { user } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    period: 'month',
    startDate: '',
    endDate: ''
  });

  // Analytics data state
  const [attendeeData, setAttendeeData] = useState(null);

  // Helper function to create filter params
  const createFilterParams = useCallback(() => {
    const params = { period: filters.period };
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    return params;
  }, [filters.period, filters.startDate, filters.endDate]);

  // Fetch attendee data
  useEffect(() => {
    if (!user) return; // Don't fetch if not authenticated
    
    const fetchAttendeeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = createFilterParams();
        const attendeeResponse = await analyticsAPI.getAttendeeInsights(params);
        setAttendeeData(attendeeResponse.data);
      } catch (error) {
        console.error('Error fetching attendee data:', error);
        setError(error.message || 'Failed to fetch attendee data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendeeData();
  }, [createFilterParams, user]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Helper functions for data processing
  const getTopAgeGroup = () => {
    if (!attendeeData?.demographics?.ageGroups) return { group: '25-34 Years', percentage: '36%', count: 450 };
    
    const ageGroups = attendeeData.demographics.ageGroups;
    const entries = Object.entries(ageGroups);
    if (entries.length === 0) return { group: '25-34 Years', percentage: '36%', count: 450 };
    
    const topAge = entries.reduce((prev, current) => 
      (prev[1] > current[1]) ? prev : current
    );
    
    const totalAttendees = attendeeData.summary?.totalAttendees || attendeeData.summary?.uniqueAttendees || 1;
    
    return {
      group: `${topAge[0]} Years`,
      percentage: `${Math.round((topAge[1] / totalAttendees) * 100)}%`,
      count: topAge[1]
    };
  };

  const getTopGender = () => {
    if (!attendeeData?.demographics?.genderDistribution) return { gender: 'Female', percentage: '52%', count: 650 };
    
    const genderDist = attendeeData.demographics.genderDistribution;
    const entries = Object.entries(genderDist);
    if (entries.length === 0) return { gender: 'Female', percentage: '52%', count: 650 };
    
    const topGender = entries.reduce((prev, current) => 
      (prev[1] > current[1]) ? prev : current
    );
    
    const totalAttendees = attendeeData.summary?.totalAttendees || attendeeData.summary?.uniqueAttendees || 1;
    
    return {
      gender: topGender[0],
      percentage: `${Math.round((topGender[1] / totalAttendees) * 100)}%`,
      count: topGender[1]
    };
  };

  const getTopLocation = () => {
    if (!attendeeData?.demographics?.locationDistribution) return { location: 'Colombo', percentage: '36%', count: 450 };
    
    const locationDist = attendeeData.demographics.locationDistribution;
    const entries = Object.entries(locationDist);
    if (entries.length === 0) return { location: 'Colombo', percentage: '36%', count: 450 };
    
    const topLocation = entries.reduce((prev, current) => 
      (prev[1] > current[1]) ? prev : current
    );
    
    const totalAttendees = attendeeData.summary?.totalAttendees || attendeeData.summary?.uniqueAttendees || 1;
    
    return {
      location: topLocation[0],
      percentage: `${Math.round((topLocation[1] / totalAttendees) * 100)}%`,
      count: topLocation[1]
    };
  };

  const getTopInterest = () => {
    if (!attendeeData?.interests) return { interest: 'Music', percentage: '36%', count: 450 };
    
    const interestDist = attendeeData.interests;
    const entries = Object.entries(interestDist);
    if (entries.length === 0) return { interest: 'Music', percentage: '36%', count: 450 };
    
    const topInterest = entries.reduce((prev, current) => 
      (prev[1] > current[1]) ? prev : current
    );
    
    const totalAttendees = attendeeData.summary?.totalAttendees || attendeeData.summary?.uniqueAttendees || 1;
    
    return {
      interest: topInterest[0],
      percentage: `${Math.round((topInterest[1] / totalAttendees) * 100)}%`,
      count: topInterest[1]
    };
  };

  const getTotalEngagement = () => {
    // Calculate total engagement from social media reach or other metrics
    if (!attendeeData?.engagement?.socialMediaReach) return { platform: 'Instagram ADS', percentage: '256%', count: 3200 };
    
    const socialReach = attendeeData.engagement.socialMediaReach;
    const platforms = [
      { name: 'Facebook', count: socialReach.facebook || 0 },
      { name: 'Instagram', count: socialReach.instagram || 0 },
      { name: 'Twitter', count: socialReach.twitter || 0 }
    ];
    
    const topPlatform = platforms.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
    
    const totalAttendees = attendeeData.summary?.totalAttendees || attendeeData.summary?.uniqueAttendees || 1;
    
    return {
      platform: `${topPlatform.name} ADS`,
      percentage: `${Math.round((topPlatform.count / totalAttendees) * 100)}%`,
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
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-8">Please log in to access attendee insights.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
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
      <div className="bg-white border-b border-gray-200 mx-3 sm:mx-6 mt-3 sm:mt-5 rounded-xl">
        {/* Top row with title and attendees count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="sm:w-5 sm:h-5 text-gray-600"
              >
                <path
                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              All Attendee Insights
            </h1>
          </div>

          {/* Attendees Count */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="sm:w-4 sm:h-4 text-gray-600"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Attendees: {(attendeeData?.summary?.totalAttendees || attendeeData?.summary?.uniqueAttendees || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bottom row with controls */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Filter Button */}
            <button className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 border border-gray-500 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="sm:w-4 sm:h-4 text-gray-600"
              >
                <path
                  d="M3 6H21L18 12V18L15 21V12L3 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-gray-700 font-medium text-sm">Filter</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                className="sm:w-3 sm:h-3 text-gray-400"
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
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 pr-4 py-2 w-full text-sm text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="absolute left-2.5 sm:left-3 top-2.5 sm:w-4 sm:h-4 text-gray-400"
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-3 py-2 text-sm border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="hidden sm:block text-gray-500 text-sm">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2 text-sm border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Stats Cards Section */}
          <div className="w-full xl:w-80">
            {/* Mobile: Grid layout, Desktop: Vertical stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4 xl:gap-6" style={{height: '100%'}}>
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
          </div>

          {/* Charts Section */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            {/* Bar Chart */}
            <div className="min-h-[300px] sm:min-h-[400px] xl:min-h-[480px]">
              <BarChart 
                data={attendeeData?.demographics?.locationDistribution ? 
                  Object.entries(attendeeData.demographics.locationDistribution).map(([city, count]) => ({
                    city,
                    attendeeCount: count
                  })) : 
                  []
                }
              />
            </div>

            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Attendee Interests Donut Chart */}
              <div className="min-h-[300px] sm:min-h-[320px]">
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 w-full h-full flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                    ATTENDEE INTERESTS
                  </h3>
                  <div className="flex-1 min-h-0">
                    <AttendeeAges 
                      data={attendeeData?.interests ? 
                        Object.entries(attendeeData.interests).map(([interest, count]) => ({
                          interest,
                          count
                        })) : 
                        [
                          { interest: 'Music', count: 450 },
                          { interest: 'Technology', count: 325 },
                          { interest: 'Sports', count: 275 },
                          { interest: 'Arts', count: 200 }
                        ]
                      }
                    />
                  </div>
                </div>
              </div>
              
              {/* Attendee Ages Pie Chart */}
              <div className="min-h-[300px] sm:min-h-[320px]">
                <PieChart 
                  data={attendeeData?.demographics?.ageGroups ? 
                    Object.entries(attendeeData.demographics.ageGroups).map(([ageRange, count]) => ({
                      ageRange,
                      count
                    })) : 
                    [
                      { ageRange: '18-24', count: 320 },
                      { ageRange: '25-34', count: 450 },
                      { ageRange: '35-44', count: 280 },
                      { ageRange: '45-54', count: 150 },
                      { ageRange: '55+', count: 50 }
                    ]
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
