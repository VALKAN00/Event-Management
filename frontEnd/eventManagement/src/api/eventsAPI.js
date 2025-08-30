const API_BASE_URL = 'http://localhost:5000/api';

const eventsAPI = {
  // Create a new event
  createEvent: async (eventData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create event');
    }
    
    return data;
  },

  // Get all events
  getEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/events?${queryString}` : `${API_BASE_URL}/events`;
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add auth header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      headers: headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }
    
    return data;
  },

  // Get event by ID
  getEventById: async (id) => {
    const token = localStorage.getItem('token');
    const headers = {};
    
    // Add auth header if token exists (for private events or enhanced details)
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event');
    }
    
    return data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update event');
    }
    
    return data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete event');
    }
    
    return { success: true };
  },

  // Search events
  searchEvents: async (query, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params });
    const response = await fetch(`${API_BASE_URL}/events/search?${searchParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to search events');
    }
    
    return data;
  },

  // Get events by category
  getEventsByCategory: async (category, params = {}) => {
    const searchParams = new URLSearchParams({ category, ...params });
    const response = await fetch(`${API_BASE_URL}/events/category?${searchParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events by category');
    }
    
    return data;
  },

  // Get popular events
  getPopularEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/events/popular?${queryString}` : `${API_BASE_URL}/events/popular`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch popular events');
    }
    
    return data;
  },

  // Get upcoming events
  getUpcomingEvents: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_BASE_URL}/events/upcoming?${queryString}` : `${API_BASE_URL}/events/upcoming`;
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add auth header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('🔄 Fetching upcoming events from:', url);
      
      const response = await fetch(url, {
        headers: headers
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Failed to fetch upcoming events:', data.message);
        throw new Error(data.message || 'Failed to fetch upcoming events');
      }
      
      console.log('✅ Successfully fetched upcoming events:', data);
      return data;
    } catch (error) {
      console.error('❌ Error in getUpcomingEvents:', error);
      throw error;
    }
  },

  // Bookmark event
  bookmarkEvent: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/events/${id}/bookmark`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to bookmark event');
    }
    
    return data;
  },

  // Remove bookmark
  removeBookmark: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/events/${id}/bookmark`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to remove bookmark');
    }
    
    return { success: true };
  }
};

export default eventsAPI;
