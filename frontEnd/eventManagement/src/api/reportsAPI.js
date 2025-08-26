// API service for analytics
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust based on your auth implementation
};

// API headers with authentication
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const analyticsAPI = {
  // Get dashboard statistics
  getDashboardStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/dashboard?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/revenue?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get event performance analytics
  getEventPerformance: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/events/performance?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get attendee insights
  getAttendeeInsights: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/attendees/insights?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get location analytics
  getLocationAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/attendees/locations?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get interest analytics
  getInterestAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/attendees/interests?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get age group analytics
  getAgeGroupAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/attendees/age-groups?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get gender analytics
  getGenderAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/attendees/gender?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get social media reach
  getSocialMediaReach: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/social-media?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Export analytics data
  exportAnalytics: async (type, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/analytics/export/${type}?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    // Handle file download
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
  }
};

export default analyticsAPI;
