import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    // Use the API base URL for socket connection
    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to Socket.IO server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Socket.IO server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket.IO connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket.IO disconnected manually');
    }
  }

  // Join specific rooms for targeted updates
  joinRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit(`join-${room}`);
      console.log(`📊 Joined ${room} room for real-time updates`);
    }
  }

  // User management events
  onUserCreated(callback) {
    if (this.socket) {
      this.socket.on('userCreated', (data) => {
        console.log('🔔 Received userCreated event:', data);
        callback(data);
      });
    }
  }

  onUserUpdated(callback) {
    if (this.socket) {
      this.socket.on('userUpdated', (data) => {
        console.log('🔔 Received userUpdated event:', data);
        callback(data);
      });
    }
  }

  onUserDeleted(callback) {
    if (this.socket) {
      this.socket.on('userDeleted', (data) => {
        console.log('🔔 Received userDeleted event:', data);
        callback(data);
      });
    }
  }

  // Event management events
  onEventCreated(callback) {
    if (this.socket) {
      this.socket.on('eventCreated', callback);
    }
  }

  onEventUpdated(callback) {
    if (this.socket) {
      this.socket.on('eventUpdated', callback);
    }
  }

  onEventDeleted(callback) {
    if (this.socket) {
      this.socket.on('eventDeleted', callback);
    }
  }

  // Booking events
  onBookingCreated(callback) {
    if (this.socket) {
      this.socket.on('bookingCreated', callback);
    }
  }

  onBookingUpdated(callback) {
    if (this.socket) {
      this.socket.on('bookingUpdated', callback);
    }
  }

  onBookingCancelled(callback) {
    if (this.socket) {
      this.socket.on('bookingCancelled', callback);
    }
  }

  // Dashboard analytics events
  onAnalyticsUpdated(callback) {
    if (this.socket) {
      this.socket.on('analyticsUpdated', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Generic event listener
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Generic event emitter
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
