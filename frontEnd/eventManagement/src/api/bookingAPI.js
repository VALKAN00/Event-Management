// API service for bookings
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

// Get authentication token (you'll need to implement this based on your auth system)
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

export const bookingAPI = {
  // Get user's bookings
  getMyBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/bookings/my?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get single booking details
  getBooking: async (bookingId) => {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    return handleResponse(response);
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(response);
  },

  // Confirm booking (admin)
  confirmBooking: async (bookingId) => {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}/confirm`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Check in booking (admin)
  checkInBooking: async (bookingId) => {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}/checkin`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get event bookings (admin)
  getEventBookings: async (eventId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/bookings/event/${eventId}?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Validate QR code (admin)
  validateQRCode: async (qrData) => {
    const response = await fetch(`${BASE_URL}/bookings/validate-qr`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ qrData })
    });
    return handleResponse(response);
  },

  // Get booking analytics (admin)
  getBookingAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/bookings/analytics/summary?${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

export default bookingAPI;
