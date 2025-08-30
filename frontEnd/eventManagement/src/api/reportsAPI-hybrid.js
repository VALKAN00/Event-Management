// Hybrid API service for analytics - tries real backend first, falls back to mock data
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API headers with authentication
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Mock data fallbacks
const mockData = {
  dashboard: {
    success: true,
    data: {
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
        }
      ],
      upcomingEvents: [
        {
          _id: '1',
          name: 'Digital Marketing Summit',
          date: '2025-02-15T09:00:00Z',
          venue: { name: 'Convention Center', city: 'Colombo' },
          analytics: { totalBookings: 45 }
        }
      ]
    }
  },
  revenue: {
    success: true,
    data: {
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
        { _id: '2', eventName: 'Music Festival Summer', totalRevenue: 389000, totalBookings: 189, totalTickets: 445, averageTicketPrice: 2650 }
      ]
    }
  },
  attendees: {
    success: true,
    data: {
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
        { _id: 'Galle', count: 456, percentage: 13.2 }
      ],
      topInterests: [
        { _id: 'Technology', count: 1234, percentage: 35.7 },
        { _id: 'Music', count: 987, percentage: 28.6 },
        { _id: 'Food & Drink', count: 567, percentage: 16.4 }
      ]
    }
  },
  events: {
    success: true,
    data: {
      revenueByEvent: [
        { _id: '1', eventName: 'Tech Conference 2025', totalRevenue: 456000, totalBookings: 234, totalTickets: 567, averageTicketPrice: 2850 },
        { _id: '2', eventName: 'Music Festival Summer', totalRevenue: 389000, totalBookings: 189, totalTickets: 445, averageTicketPrice: 2650 },
        { _id: '3', eventName: 'Digital Marketing Summit', totalRevenue: 234000, totalBookings: 123, totalTickets: 278, averageTicketPrice: 3200 }
      ]
    }
  }
};

// Hybrid fetch function - tries real API first, falls back to mock
const hybridFetch = async (endpoint, mockKey) => {
  try {
    console.log(`Attempting to fetch from real API: ${endpoint}`);
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Real API success for ${endpoint}`);
    return data;
  } catch (error) {
    console.warn(`⚠️  Real API failed for ${endpoint}:`, error.message);
    console.log(`🔄 Falling back to mock data for ${mockKey}`);
    return mockData[mockKey];
  }
};

export const analyticsAPI = {
  // Get dashboard statistics (hybrid: real API + mock fallback)
  getDashboardStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/dashboard?${queryString}`;
    return hybridFetch(endpoint, 'dashboard');
  },

  // Get revenue analytics (hybrid: real API + mock fallback)
  getRevenueAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/revenue?${queryString}`;
    return hybridFetch(endpoint, 'revenue');
  },

  // Get event performance analytics (hybrid: real API + mock fallback)
  getEventPerformance: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/events/performance?${queryString}`;
    return hybridFetch(endpoint, 'events');
  },

  // Get attendee insights (hybrid: real API + mock fallback)
  getAttendeeInsights: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/attendees/insights?${queryString}`;
    return hybridFetch(endpoint, 'attendees');
  },

  // Basic implementations for other functions
  getLocationAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/attendees/locations?${queryString}`;
    return hybridFetch(endpoint, 'attendees');
  },

  getInterestAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/attendees/interests?${queryString}`;
    return hybridFetch(endpoint, 'attendees');
  },

  getAgeGroupAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/attendees/age-groups?${queryString}`;
    return hybridFetch(endpoint, 'attendees');
  },

  getGenderAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/attendees/gender?${queryString}`;
    return hybridFetch(endpoint, 'attendees');
  },

  getSocialMediaReach: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${BASE_URL}/analytics/social-media?${queryString}`;
    return hybridFetch(endpoint, 'attendees');
  },

  // Export analytics data
  exportAnalytics: async (type, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${BASE_URL}/analytics/export/${type}?${queryString}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Export failed from backend');
      }
      
      // Handle file download from backend
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log(`✅ Real API export success for ${type}`);
    } catch (error) {
      console.warn(`⚠️  Real API export failed for ${type}:`, error.message);
      console.log(`🔄 Falling back to mock export`);
      
      // Fallback to mock export with comprehensive data
      const generateComprehensiveCSV = (exportType) => {
        switch(exportType) {
          case 'dashboard':
            return `Metric,Value,Period,Last Updated
Total Events,24,Last Month,${new Date().toISOString()}
Total Revenue,2450000,Last Month,${new Date().toISOString()}
Total Bookings,1248,Last Month,${new Date().toISOString()}
Total Attendees,1156,Last Month,${new Date().toISOString()}
Average Ticket Price,2850,Last Month,${new Date().toISOString()}
Revenue Per Event,102083,Last Month,${new Date().toISOString()}
Attendance Rate,73%,Last Month,${new Date().toISOString()}
Top Event Category,Technology,Last Month,${new Date().toISOString()}
Top Location,Colombo,Last Month,${new Date().toISOString()}
Growth Rate,12.5%,Month over Month,${new Date().toISOString()}`;

          case 'attendees':
            return `Date,Event Name,Event Category,Attendee Name,Email,Age Group,Gender,Location,Registration Date,Ticket Type,Amount Paid,Status
2025-01-15,Tech Conference 2025,Technology,John Doe,john.doe@email.com,25-34,Male,Colombo,2025-01-10T09:30:00Z,VIP,5000,Confirmed
2025-01-15,Tech Conference 2025,Technology,Jane Smith,jane.smith@email.com,35-44,Female,Kandy,2025-01-11T14:15:00Z,Regular,2500,Confirmed
2025-01-16,Digital Marketing Summit,Marketing,Mike Johnson,mike.j@email.com,25-34,Male,Gampaha,2025-01-12T11:20:00Z,Premium,3500,Confirmed
2025-01-16,Digital Marketing Summit,Marketing,Sarah Wilson,sarah.w@email.com,18-24,Female,Colombo,2025-01-13T16:45:00Z,Regular,2000,Confirmed
2025-01-17,AI Workshop,Technology,David Brown,david.b@email.com,35-44,Male,Negombo,2025-01-14T10:30:00Z,VIP,4000,Confirmed
2025-01-17,AI Workshop,Technology,Emily Davis,emily.d@email.com,25-34,Female,Matara,2025-01-15T12:00:00Z,Regular,2500,Confirmed
2025-01-18,Business Networking,Business,Alex Turner,alex.t@email.com,45-54,Male,Colombo,2025-01-16T08:30:00Z,Premium,3000,Confirmed
2025-01-18,Business Networking,Business,Lisa Anderson,lisa.a@email.com,25-34,Female,Kurunegala,2025-01-17T15:20:00Z,Regular,2200,Confirmed`;

          case 'events':
            return `Date,Event Name,Event Category,Venue,City,Organizer,Capacity,Tickets Sold,Revenue,Avg Ticket Price,Status,Start Date,End Date,Duration (Hours)
2025-01-15,Tech Conference 2025,Technology,Convention Center,Colombo,Tech Corp,500,342,850000,2485,Completed,2025-01-15T09:00:00Z,2025-01-15T18:00:00Z,9
2025-01-16,Digital Marketing Summit,Marketing,Hilton Hotel,Kandy,Marketing Pro,300,198,495000,2500,Completed,2025-01-16T10:00:00Z,2025-01-16T17:00:00Z,7
2025-01-17,AI Workshop,Technology,Tech Hub,Gampaha,AI Solutions,150,125,312500,2500,Completed,2025-01-17T14:00:00Z,2025-01-17T18:00:00Z,4
2025-01-18,Business Networking,Business,Business Center,Colombo,BizNet,200,167,501000,3000,Completed,2025-01-18T18:00:00Z,2025-01-18T22:00:00Z,4
2025-01-19,Creative Design Workshop,Design,Art Gallery,Negombo,Design Studio,100,89,267000,3000,Completed,2025-01-19T10:00:00Z,2025-01-19T16:00:00Z,6
2025-01-20,Startup Pitch Day,Business,Innovation Hub,Matara,Startup Inc,250,201,402000,2000,Completed,2025-01-20T09:00:00Z,2025-01-20T17:00:00Z,8`;

          case 'revenue':
            return `Date,Event Name,Event Category,Total Revenue,Ticket Sales,Sponsorship,Merchandise,Refunds,Net Revenue,Profit Margin,Cost,ROI
2025-01-15,Tech Conference 2025,Technology,850000,750000,80000,20000,5000,845000,65%,296750,184.8%
2025-01-16,Digital Marketing Summit,Marketing,495000,450000,35000,10000,2000,493000,58%,207060,138.0%
2025-01-17,AI Workshop,Technology,312500,280000,25000,7500,1500,311000,70%,93300,233.4%
2025-01-18,Business Networking,Business,501000,420000,60000,21000,3000,498000,62%,189240,163.2%
2025-01-19,Creative Design Workshop,Design,267000,240000,20000,7000,1000,266000,55%,119700,122.3%
2025-01-20,Startup Pitch Day,Business,402000,360000,30000,12000,2500,399500,60%,159800,150.1%`;

          case 'complete':
          default:
            return `Date,Event Name,Event Category,Venue,City,Total Revenue,Tickets Sold,Attendees,Capacity,Attendance Rate,Avg Ticket Price,Revenue Per Attendee,Status,Organizer,Start Time,End Time
2025-01-15,Tech Conference 2025,Technology,Convention Center,Colombo,850000,342,320,500,64%,2485,2656,Completed,Tech Corp,09:00,18:00
2025-01-16,Digital Marketing Summit,Marketing,Hilton Hotel,Kandy,495000,198,185,300,62%,2500,2676,Completed,Marketing Pro,10:00,17:00
2025-01-17,AI Workshop,Technology,Tech Hub,Gampaha,312500,125,118,150,79%,2500,2649,Completed,AI Solutions,14:00,18:00
2025-01-18,Business Networking,Business,Business Center,Colombo,501000,167,159,200,80%,3000,3151,Completed,BizNet,18:00,22:00
2025-01-19,Creative Design Workshop,Design,Art Gallery,Negombo,267000,89,84,100,84%,3000,3179,Completed,Design Studio,10:00,16:00
2025-01-20,Startup Pitch Day,Business,Innovation Hub,Matara,402000,201,192,250,77%,2000,2094,Completed,Startup Inc,09:00,17:00
2025-01-21,Music Festival,Entertainment,Beach Resort,Bentota,750000,500,485,600,81%,1500,1546,Upcoming,Music Events,16:00,23:00
2025-01-22,Food & Wine Expo,Food & Beverage,Exhibition Center,Colombo,380000,190,0,300,0%,2000,0,Upcoming,Culinary Arts,11:00,19:00`;
        }
      };

      const csvContent = generateComprehensiveCSV(type);
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }
};

export default analyticsAPI;
