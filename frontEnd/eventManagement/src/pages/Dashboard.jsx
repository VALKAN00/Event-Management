import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { analyticsAPI } from "../api/analyticsAPI";
import { bookingAPI } from "../api/bookingAPI";
import eventsAPI from "../api/eventsAPI";
import NormalCard from "../components/dashboard/NormalCard";
import UpComing from "../components/dashboard/UpComing";
import NetSalesChart from "../components/dashboard/LineChart";
import CustomerEngagementChart from "../components/dashboard/DonutChart";
import Notifications from "../components/dashboard/Notifications";
import socketService from "../services/socketService";
import LatestEventHeatMap from "../components/dashboard/HeatMap";

const icon1 = "/assets/dashboard/Dancing.svg";
const icon2 = "/assets/dashboard/Movie Ticket.svg";
const icon3 = "/assets/dashboard/Transaction.svg";

export default function Dashboard() {
  const { user } = useAuth();
  const { notifications, loading: notificationsLoading } = useNotifications();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalEvents: 0,
      totalBookings: 0,
      totalRevenue: 0,
      totalTicketsSold: 0,
      averageTicketPrice: 0
    },
    revenueData: {
      summary: {
        totalRevenue: 0,
        growthPercentage: 0,
        totalBookings: 0
      },
      dailyRevenue: []
    },
    upcomingEvents: [],
    recentBookings: [],
    eventStatusBreakdown: [],
    customerEngagement: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('week');
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [
        dashboardStats,
        revenueAnalytics,
        customerEngagement,
        upcomingEventsResponse,
        recentBookings
      ] = await Promise.all([
        analyticsAPI.getDashboardStats({ period }),
        analyticsAPI.getRevenueAnalytics({ period }),
        analyticsAPI.getCustomerEngagement({ period }),
        eventsAPI.getUpcomingEvents({ limit: 20 }), // Get more events for "See All" functionality
        bookingAPI.getMyBookings({ limit: 5, status: 'confirmed' })
      ]);

      // Extract upcoming events from response
      const upcomingEventsData = upcomingEventsResponse?.data?.events || 
                                upcomingEventsResponse?.events || 
                                upcomingEventsResponse?.data || 
                                [];

      setDashboardData({
        overview: dashboardStats.data?.overview || {
          totalEvents: 0,
          totalBookings: 0,
          totalRevenue: 0,
          totalTicketsSold: 0,
          averageTicketPrice: 0
        },
        revenueData: revenueAnalytics.data || {
          summary: {
            totalRevenue: 0,
            growthPercentage: 0,
            totalBookings: 0
          },
          dailyRevenue: []
        },
        upcomingEvents: upcomingEventsData,
        recentBookings: recentBookings.data?.bookings || [],
        eventStatusBreakdown: dashboardStats.data?.eventStatusBreakdown || [],
        customerEngagement: customerEngagement.data?.engagementData || []
      });

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      
      // Set fallback data with some mock upcoming events
      setDashboardData({
        overview: {
          totalEvents: 28,
          totalBookings: 2598,
          totalRevenue: 623500,
          totalTicketsSold: 2598,
          averageTicketPrice: 240
        },
        revenueData: {
          summary: {
            totalRevenue: 623500,
            growthPercentage: 15.8,
            totalBookings: 2598
          },
          dailyRevenue: []
        },
        upcomingEvents: [
          {
            _id: '1',
            title: 'Cynosure Festival',
            name: 'Cynosure Festival',
            date: '2025-03-24T10:00:00Z',
            venue: { name: 'Cultural Center', city: 'Colombo' }
          },
          {
            _id: '2',
            title: 'Tech Conference',
            name: 'Tech Conference',
            date: '2025-04-15T09:00:00Z',
            venue: { name: 'Convention Center', city: 'Gampaha' }
          },
          {
            _id: '3',
            title: 'Art Exhibition',
            name: 'Art Exhibition', 
            date: '2025-05-30T11:00:00Z',
            venue: { name: 'Art Gallery', city: 'Kandy' }
          },
          {
            _id: '4',
            title: 'Music Festival',
            name: 'Music Festival',
            date: '2025-06-12T16:00:00Z',
            venue: { name: 'Beach Resort', city: 'Bentota' }
          },
          {
            _id: '5',
            title: 'Food Fair',
            name: 'Food Fair',
            date: '2025-07-25T12:00:00Z',
            venue: { name: 'Exhibition Center', city: 'Colombo' }
          }
        ],
        recentBookings: [],
        eventStatusBreakdown: [],
        customerEngagement: []
      });
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Socket.IO real-time updates for dashboard
  useEffect(() => {
    if (!user) return;

    // Connect to Socket.IO and join dashboard room
    socketService.connect();
    socketService.joinRoom('dashboard');

    // Track connection status
    const updateConnectionStatus = () => {
      setIsSocketConnected(socketService.isConnected);
    };

    // Set up connection status listeners
    socketService.on('connect', updateConnectionStatus);
    socketService.on('disconnect', updateConnectionStatus);

    // Initial status update
    updateConnectionStatus();

    // Set up real-time event listeners for dashboard updates
    const handleAnalyticsUpdated = () => {
      fetchDashboardData();
    };

    const handleEventUpdated = () => {
      fetchDashboardData();
    };

    const handleBookingUpdated = () => {
      fetchDashboardData();
    };

    // Register event listeners
    socketService.onAnalyticsUpdated(handleAnalyticsUpdated);
    socketService.onEventUpdated(handleEventUpdated);
    socketService.onBookingUpdated(handleBookingUpdated);

    // Cleanup on unmount
    return () => {
      socketService.off('connect', updateConnectionStatus);
      socketService.off('disconnect', updateConnectionStatus);
      socketService.off('analyticsUpdated', handleAnalyticsUpdated);
      socketService.off('eventUpdated', handleEventUpdated);
      socketService.off('bookingUpdated', handleBookingUpdated);
    };
  }, [user, fetchDashboardData]);

  // Loading state
  if (loading && !dashboardData.overview.totalEvents) {
    return (
      <div className="Dashboard ml-8 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Dashboard ml-8 h-full">
      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800 text-sm">
              Using fallback data. {error}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Container */}
      <div className="p-3 sm:p-4">
        
        {/* Mobile Layout (< 1024px) */}
        <div className="lg:hidden space-y-4">
          
          {/* 1. Stats Cards - 3 cards on top */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <NormalCard
              icon={icon1}
              title="EVENTS"
              counter={dashboardData.overview.totalEvents}
              text="Events"
              color="#1968AF"
              loading={loading}
              growth={period === 'month' ? 12.5 : null}
            />
            <NormalCard
              icon={icon2}
              title="BOOKINGS"
              counter={dashboardData.overview.totalBookings}
              text="Bookings"
              color="#F29D38"
              loading={loading}
              growth={period === 'month' ? 8.3 : null}
            />
            <NormalCard
              icon={icon3}
              title="REVENUE"
              counter={dashboardData.overview.totalRevenue}
              text="LKR"
              color="#197920"
              loading={loading}
              growth={dashboardData.revenueData.summary.growthPercentage}
            />
          </div>

          {/* 2. Line Chart */}
          <div className="w-full">
            <NetSalesChart 
              data={dashboardData.revenueData.dailyRevenue}
              loading={loading}
              period={period}
              onPeriodChange={setPeriod}
            />
          </div>

          {/* 3. Donut Chart */}
          <div className="w-full">
            <CustomerEngagementChart 
              data={dashboardData.customerEngagement}
              loading={loading}
            />
          </div>

          {/* 4. Heat Map */}
          <div className="w-full">
            <LatestEventHeatMap 
              events={dashboardData.upcomingEvents}
              loading={loading}
            />
          </div>

          {/* 5. Upcoming Events and Notifications - same row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <UpComing 
                events={dashboardData.upcomingEvents}
                loading={loading}
              />
            </div>
            <div className="w-full">
              <Notifications 
                notifications={notifications}
                loading={notificationsLoading}
              />
            </div>
          </div>
          
        </div>

        {/* Desktop Layout (>= 1024px) - Original Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-4 h-full">
            
            {/* Left Content Area - spans 9 columns */}
            <div className="col-span-9 flex flex-col h-full">
              
              {/* Top Row - Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-4 flex-shrink-0">
                <NormalCard
                  icon={icon1}
                  title="EVENTS"
                  counter={dashboardData.overview.totalEvents}
                  text="Events"
                  color="#1968AF"
                  loading={loading}
                  growth={period === 'month' ? 12.5 : null}
                />
                <NormalCard
                  icon={icon2}
                  title="BOOKINGS"
                  counter={dashboardData.overview.totalBookings}
                  text="Bookings"
                  color="#F29D38"
                  loading={loading}
                  growth={period === 'month' ? 8.3 : null}
                />
                <NormalCard
                  icon={icon3}
                  title="REVENUE"
                  counter={dashboardData.overview.totalRevenue}
                  text="LKR"
                  color="#197920"
                  loading={loading}
                  growth={dashboardData.revenueData.summary.growthPercentage}
                />
              </div>

              {/* Middle Row - Charts */}
              <div className="grid grid-cols-5 gap-4 h-90 flex-shrink-0">
                {/* Net Sales Chart - spans 3 columns */}
                <div className="col-span-3 h-full">
                  <NetSalesChart 
                    data={dashboardData.revenueData.dailyRevenue}
                    loading={loading}
                    period={period}
                    onPeriodChange={setPeriod}
                  />
                </div>
                
                {/* Customer Engagement Chart - spans 2 columns */}
                <div className="col-span-2 h-full">
                  <CustomerEngagementChart 
                    data={dashboardData.customerEngagement}
                    loading={loading}
                  />
                </div>
              </div>

              {/* Bottom Row - Latest Event Heat Map */}
              <div className="flex-1 min-h-0" style={{width: '100%'}}>
                <LatestEventHeatMap 
                  events={dashboardData.upcomingEvents}
                  loading={loading}
                />
              </div>
              
            </div>

            {/* Right Sidebar - spans 3 columns */}
            <div className="col-span-3 h-full flex flex-col">
              <div className="flex-1 mb-4">
                <UpComing 
                  events={dashboardData.upcomingEvents}
                  loading={loading}
                />
              </div>
              <div className="flex-1">
                <Notifications 
                  notifications={notifications}
                  loading={notificationsLoading}
                />
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
