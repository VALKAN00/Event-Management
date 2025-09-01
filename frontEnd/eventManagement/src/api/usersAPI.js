const API_BASE_URL = 'http://localhost:5000/api';

// Utility function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// User Management API Functions
export const usersAPI = {
  // Get all users (Admin only)
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.search && { search: params.search }),
      ...(params.role && { role: params.role }),
      ...(params.isActive !== undefined && { isActive: params.isActive })
    }).toString();

    try {
      const response = await fetch(`${API_BASE_URL}/users?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Return fallback data structure
      return {
        success: false,
        data: {
          users: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
          },
          stats: {
            totalUsers: 0,
            activeUsers: 0,
            adminUsers: 0,
            regularUsers: 0
          }
        },
        message: 'Failed to fetch users from server'
      };
    }
  },

  // Get user by ID
  getUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create user (Admin only)
  createUser: async (userData) => {
    try {
      // First register the user through auth endpoint
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password || 'TempPassword123!', // Temporary password
          role: userData.role || 'user'
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update current user's profile
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await handleResponse(response);
      
      // Update the stored user data in localStorage
      if (data.success && data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }
      
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Update user role (Admin only)
  updateUserRole: async (userId, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Toggle user status (activate/deactivate)
  toggleUserStatus: async (userId, isActive) => {
    try {
      const endpoint = isActive ? 'activate' : 'deactivate';
      const response = await fetch(`${API_BASE_URL}/users/${userId}/${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=1&limit=1`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await handleResponse(response);
      return data.data.stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      
      // Return fallback stats
      return {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        regularUsers: 0
      };
    }
  }
};

// Export as default for backwards compatibility
export default usersAPI;
