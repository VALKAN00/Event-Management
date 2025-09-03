import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import notificationsAPI from '../api/notificationsAPI';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://eventx-studio-backend.onrender.com', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        newSocket.emit('join', user.id);
      });

      // Listen for new notifications
      newSocket.on('newNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/assets/header/Notification.png'
          });
        }
      });

      newSocket.on('disconnect', () => {
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return; // Don't fetch if not authenticated
    
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data || []);
    } catch {
      // Error fetching notifications - fail silently
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return; // Don't fetch if not authenticated
    
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch {
      // Error fetching unread count - fail silently
    }
  }, [user]);

  // Fetch initial notifications only when user is authenticated
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [fetchNotifications, fetchUnreadCount, user]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!user) return; // Don't proceed if not authenticated
    
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // Error marking notification as read - fail silently
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return; // Don't proceed if not authenticated
    
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch {
      // Error marking all notifications as read - fail silently
    }
  }, [user]);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationsAPI.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      );
      // Update unread count if deleted notification was unread
      const deletedNotif = notifications.find(n => n._id === notificationId);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch {
      // Error deleting notification - fail silently
    }
  }, [notifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
