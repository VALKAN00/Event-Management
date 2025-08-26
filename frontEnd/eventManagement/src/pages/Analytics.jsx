import React, { useState, useEffect } from 'react';
import DashboardOverview from '../components/reports/DashboardOverview';
import RevenueChart from '../components/reports/RevenueChart';
import AttendeeReports from '../components/reports/AttendeeReports';
import EventReports from '../components/reports/EventReports';
import RecentActivity from '../components/reports/RecentActivity';
import ReportFilters from '../components/reports/ReportFilters';
// import reportsAPI from '../api/reportsAPI';

// Mock data - Replace with actual API calls
const mockDashboardData = {
  overview: {
    totalEvents: 24,
    totalBookings: 1248,
    totalRevenue: 2450000,
    totalTicketsSold: 3456,
    averageTicketPrice: 2850
  },
  eventStatusBreakdown: [
    { _id: 'upcoming', count: 8 },
    { _id: 'ongoing', count: 2 },
    { _id: 'completed', count: 14 }
  ],
  recentBookings: [
    {
      _id: '1',
      user: { name: 'John Doe', email: 'john@example.com' },
      event: { name: 'Tech Conference 2025', venue: { city: 'Colombo' } },
      bookingDate: '2025-01-20T10:30:00Z',
      totalAmount: 5000,
      status: 'confirmed',
      seats: ['A1', 'A2']
    },
    {
      _id: '2',
      user: { name: 'Jane Smith', email: 'jane@example.com' },
      event: { name: 'Music Festival', venue: { city: 'Kandy' } },
      bookingDate: '2025-01-19T15:45:00Z',
      totalAmount: 3500,
      status: 'pending',
      seats: ['B10']
    }
  ],
  upcomingEvents: [
    {
      _id: '1',
      name: 'Digital Marketing Summit',
      date: '2025-02-15T09:00:00Z',
      venue: { name: 'Convention Center', city: 'Colombo' },
      analytics: { totalBookings: 45 }
    },
    {
      _id: '2',
      name: 'Food & Wine Festival',
      date: '2025-02-20T17:00:00Z',
      venue: { name: 'Galle Face Green', city: 'Colombo' },
      analytics: { totalBookings: 78 }
    }
  ]
};

const mockRevenueData = {
  summary: {
    totalRevenue: 2450000,
    previousPeriodRevenue: 2100000,
    growthPercentage: 16.67,
    totalBookings: 1248,
    totalTickets: 3456
  },
  dailyRevenue: [
    { _id: { year: 2025, month: 1, day: 15 }, dailyRevenue: 125000, dailyBookings: 45, dailyTickets: 120 },
    { _id: { year: 2025, month: 1, day: 16 }, dailyRevenue: 89000, dailyBookings: 32, dailyTickets: 89 },
    { _id: { year: 2025, month: 1, day: 17 }, dailyRevenue: 156000, dailyBookings: 56, dailyTickets: 167 },
    { _id: { year: 2025, month: 1, day: 18 }, dailyRevenue: 98000, dailyBookings: 38, dailyTickets: 102 },
    { _id: { year: 2025, month: 1, day: 19 }, dailyRevenue: 134000, dailyBookings: 49, dailyTickets: 145 },
    { _id: { year: 2025, month: 1, day: 20 }, dailyRevenue: 178000, dailyBookings: 67, dailyTickets: 189 }
  ],
  revenueByEvent: [
    { _id: '1', eventName: 'Tech Conference 2025', totalRevenue: 456000, totalBookings: 234, totalTickets: 567, averageTicketPrice: 2850 },
    { _id: '2', eventName: 'Music Festival Summer', totalRevenue: 389000, totalBookings: 189, totalTickets: 445, averageTicketPrice: 2650 },
    { _id: '3', eventName: 'Digital Marketing Summit', totalRevenue: 234000, totalBookings: 123, totalTickets: 278, averageTicketPrice: 3200 },
    { _id: '4', eventName: 'Food & Wine Festival', totalRevenue: 178000, totalBookings: 89, totalTickets: 198, averageTicketPrice: 2890 }
  ]
};

const mockAttendeeData = {
  totalAttendees: 3456,
  uniqueAttendees: 2890,
  repeatAttendees: 566,
  averageAge: 28.5,
  ageGroups: [
    { _id: '18-25', count: 1234, percentage: 35.7 },
    { _id: '26-35', count: 1567, percentage: 45.3 },
    { _id: '36-45', count: 456, percentage: 13.2 },
    { _id: '46+', count: 199, percentage: 5.8 }
  ],
  genderBreakdown: [
    { _id: 'Male', count: 1890, percentage: 54.7 },
    { _id: 'Female', count: 1456, percentage: 42.1 },
    { _id: 'Other', count: 110, percentage: 3.2 }
  ],
  topLocations: [
    { _id: 'Colombo', count: 1456, percentage: 42.1 },
    { _id: 'Kandy', count: 789, percentage: 22.8 },
    { _id: 'Galle', count: 456, percentage: 13.2 },
    { _id: 'Jaffna', count: 234, percentage: 6.8 },
    { _id: 'Negombo', count: 189, percentage: 5.5 }
  ],
  topInterests: [
    { _id: 'Technology', count: 1234, percentage: 35.7 },
    { _id: 'Music', count: 987, percentage: 28.6 },
    { _id: 'Food & Drink', count: 567, percentage: 16.4 },
    { _id: 'Business', count: 456, percentage: 13.2 },
    { _id: 'Arts', count: 212, percentage: 6.1 }
  ]
};

export default function Analytics() {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
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

  // Fetch data based on active tab and filters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock API calls - Replace with actual API calls
        switch (activeTab) {
          case 'overview':
            setDashboardData(mockDashboardData);
            break;
          case 'revenue':
            setRevenueData(mockRevenueData);
            break;
          case 'attendees':
            setAttendeeData(mockAttendeeData);
            break;
          case 'events':
            setEventPerformanceData(mockRevenueData);
            break;
          default:
            setDashboardData(mockDashboardData);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, filters.period, filters.startDate, filters.endDate]);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock API calls - Replace with actual API calls
      switch (activeTab) {
        case 'overview':
          setDashboardData(mockDashboardData);
          break;
        case 'revenue':
          setRevenueData(mockRevenueData);
          break;
        case 'attendees':
          setAttendeeData(mockAttendeeData);
          break;
        case 'events':
          setEventPerformanceData(mockRevenueData);
          break;
        default:
          setDashboardData(mockDashboardData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
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
      // TODO: Implement actual export functionality
      console.log('Exporting:', type, 'with filters:', filters);
      alert(`Exporting ${type} report...`);
      // await analyticsAPI.exportAnalytics(type, filters);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

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
                  <RevenueChart data={mockRevenueData} loading={loading} />
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
