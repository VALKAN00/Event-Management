import { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    fetchNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_created':
        return '🎪';
      case 'event_upcoming':
        return '⏰';
      case 'booking_created':
        return '🎫';
      case 'booking_cancelled':
        return '❌';
      case 'event_updated':
        return '📝';
      default:
        return '📧';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'low':
        return 'border-green-500 bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await deleteNotification(notificationId);
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#111111] m-4 rounded-2xl">
      {/* Header */}
      <div className="mb-8 rounded-lg p-3 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-200">
            Stay updated with your events and bookings
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white text-lg font-semibold">{unreadCount}</p>
            <p className="text-gray-400 text-sm">Unread</p>
          </div>
          <img
            src="/assets/header/Notification.png"
            alt="Notifications"
            className="w-20 h-20"
          />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-[#1a1a1a] p-1 rounded-lg">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === tab.id
                  ? "bg-[#2a2a2a] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#232323]"
              }`}
            >
              {tab.label}
              <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-[#111111] rounded-2xl">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-white mb-2">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? "You'll receive notifications about events and bookings here." 
                : `No ${filter} notifications to show.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border transition-all hover:bg-[#1a1a1a] ${
                  notification.read 
                    ? 'border-gray-700 bg-[#0a0a0a]' 
                    : `border-l-4 ${getPriorityColor(notification.priority)}`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        <span className="capitalize">
                          {notification.priority} priority
                        </span>
                        <span className="capitalize">
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 rounded transition-colors"
                        title="Mark as read"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded transition-colors"
                      title="Delete notification"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
