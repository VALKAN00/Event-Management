import React, { useState, useEffect } from 'react';
import DashboardOverview from '../components/reports/DashboardOverview';
import RevenueChart from '../components/reports/RevenueChart';
import AttendeeReports from '../components/reports/AttendeeReports';
import EventReports from '../components/reports/EventReports';
import RecentActivity from '../components/reports/RecentActivity';
import ReportFilters from '../components/reports/ReportFilters';
import analyticsAPI from '../api/reportsAPI-hybrid';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { user } = useAuth();
  
  // State management (hooks must be at the top)
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    period: 'month',
    startDate: '',
    endDate: '',
    exportType: 'complete'
  });

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [attendeeData, setAttendeeData] = useState(null);
  const [eventPerformanceData, setEventPerformanceData] = useState(null);

  // Helper function to create filter params
  const createFilterParams = React.useCallback(() => {
    const params = { period: filters.period };
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    return params;
  }, [filters.period, filters.startDate, filters.endDate]);

  // Fetch data based on active tab and filters
  useEffect(() => {
    if (!user) return; // Don't fetch if not authenticated
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = createFilterParams();

        switch (activeTab) {
          case 'overview': {
            const dashboardResponse = await analyticsAPI.getDashboardStats(params);
            setDashboardData(dashboardResponse.data);
            
            // Also fetch revenue data for the overview chart
            const revenueResponse = await analyticsAPI.getRevenueAnalytics(params);
            setRevenueData(revenueResponse.data);
            break;
          }
          case 'revenue': {
            const revenueResponse = await analyticsAPI.getRevenueAnalytics(params);
            setRevenueData(revenueResponse.data);
            break;
          }
          case 'attendees': {
            const attendeeResponse = await analyticsAPI.getAttendeeInsights(params);
            setAttendeeData(attendeeResponse.data);
            break;
          }
          case 'events': {
            const eventResponse = await analyticsAPI.getEventPerformance(params);
            setEventPerformanceData(eventResponse.data);
            break;
          }
          default: {
            const defaultResponse = await analyticsAPI.getDashboardStats(params);
            setDashboardData(defaultResponse.data);
            
            // Also fetch revenue data for the overview chart
            const revenueResponse = await analyticsAPI.getRevenueAnalytics(params);
            setRevenueData(revenueResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError(error.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, createFilterParams, user]);

  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const params = createFilterParams();

      switch (activeTab) {
        case 'overview': {
          const dashboardResponse = await analyticsAPI.getDashboardStats(params);
          setDashboardData(dashboardResponse.data);
          
          // Also fetch revenue data for the overview chart
          const revenueResponse = await analyticsAPI.getRevenueAnalytics(params);
          setRevenueData(revenueResponse.data);
          break;
        }
        case 'revenue': {
          const revenueResponse = await analyticsAPI.getRevenueAnalytics(params);
          setRevenueData(revenueResponse.data);
          break;
        }
        case 'attendees': {
          const attendeeResponse = await analyticsAPI.getAttendeeInsights(params);
          setAttendeeData(attendeeResponse.data);
          break;
        }
        case 'events': {
          const eventResponse = await analyticsAPI.getEventPerformance(params);
          setEventPerformanceData(eventResponse.data);
          break;
        }
        default: {
          const defaultResponse = await analyticsAPI.getDashboardStats(params);
          setDashboardData(defaultResponse.data);
          
          // Also fetch revenue data for the overview chart
          const revenueResponse = await analyticsAPI.getRevenueAnalytics(params);
          setRevenueData(revenueResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error.message || 'Failed to refresh analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle export
  const handleExport = async (type) => {
    try {
      const params = createFilterParams();
      await analyticsAPI.exportAnalytics(type, params);
    } catch (error) {
      console.error('Export error:', error);
      setError(error.message || 'Export failed. Please try again.');
    }
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-8">Please log in to access analytics dashboard.</p>
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

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'revenue', label: 'Revenue', icon: '💰' },
    { key: 'attendees', label: 'Attendees', icon: '👥' },
    { key: 'events', label: 'Events', icon: '🎯' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="mt-1 text-sm text-gray-600">
                Comprehensive insights into your event performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => refreshData()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Analytics Data</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <DashboardOverview stats={dashboardData} loading={loading} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RevenueChart data={revenueData} loading={loading} />
                </div>
                <div>
                  <RecentActivity data={dashboardData} loading={loading} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <RevenueChart data={revenueData} loading={loading} />
              <EventReports data={revenueData} loading={loading} />
            </div>
          )}

          {activeTab === 'attendees' && (
            <AttendeeReports data={attendeeData} loading={loading} />
          )}

          {activeTab === 'events' && (
            <EventReports data={eventPerformanceData} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}
