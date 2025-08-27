// Authentication API service
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Helper function to store user data
const storeUserData = (token, user) => {
  if (token) {
    localStorage.setItem('token', token);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle different error types
    if (response.status === 401) {
      // Unauthorized - clear any stored tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// API headers
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Authentication API functions
const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data on successful registration
    if (data.success && data.token) {
      storeUserData(data.token, data.user);
    }
    
    return data;
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data on successful login
    if (data.success && data.token) {
      storeUserData(data.token, data.user);
      
      // Optionally fetch the complete user profile for most up-to-date data
      try {
        const profileResponse = await fetch(`${BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.success && profileData.data) {
            storeUserData(null, profileData.data);
          }
        }
      } catch {
        console.log('Could not fetch updated profile, using login data');
      }
    }
    
    return data;
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    
    // Clear stored data regardless of response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    const data = await handleResponse(response);
    return data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    
    const data = await handleResponse(response);
    
    // Update stored user data
    if (data.success && data.data) {
      storeUserData(null, data.data);
    }
    
    return data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await fetch(`${BASE_URL}/auth/update-password`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(passwordData)
    });
    
    return await handleResponse(response);
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    
    return await handleResponse(response);
  },

  // Reset password
  resetPassword: async (resetToken, newPassword) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password/${resetToken}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ password: newPassword })
    });
    
    return await handleResponse(response);
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email/${token}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return await handleResponse(response);
  },

  // Resend verification email
  resendVerificationEmail: async () => {
    const response = await fetch(`${BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    
    return await handleResponse(response);
  }
};

// Helper functions for auth state management
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Clear invalid data
    localStorage.removeItem('user');
    return null;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default authAPI;
