
import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationsCard from "./NotificationsCard";


export default function Notifications({ notifications = [], loading }) {
  const navigate = useNavigate();
  
  // Icons for different notification types
  const cardIcon = "/assets/dashboard/Notifications/Card Payment.svg";
  const bankIcon = "/assets/dashboard/Notifications/Bank Building.svg";
  const alarmIcon = "/assets/dashboard/Notifications/Alarm Clock.svg";

  // Default notifications if no data
  const defaultNotifications = [
    {
      id: 1,
      type: 'payment',
      title: "Paycheck released for artists",
      subtitle: "@Wayo Event",
      icon: cardIcon
    },
    {
      id: 2,
      type: 'bank',
      title: "Total revenue has been",
      subtitle: "transferred to bank",
      icon: bankIcon
    },
    {
      id: 3,
      type: 'reminder',
      title: "@Alan Walker Event in 3 days",
      subtitle: "",
      icon: alarmIcon
    },
    {
      id: 4,
      type: 'payment',
      title: "Paycheck released for artists",
      subtitle: "@Cynderex Event",
      icon: cardIcon
    },
    {
      id: 5,
      type: 'payment',
      title: "Paycheck released for artists",
      subtitle: "@Get Together Event",
      icon: cardIcon
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'payment':
      case 'booking_created':
        return cardIcon;
      case 'bank':
      case 'event_created':
        return bankIcon;
      case 'reminder':
      case 'event_upcoming':
      case 'event_updated':
        return alarmIcon;
      case 'booking_cancelled':
        return cardIcon;
      default:
        return cardIcon;
    }
  };

  // Map real notifications to dashboard format
  const mapNotificationToCardFormat = (notification) => {
    return {
      id: notification._id || notification.id,
      type: notification.type,
      title: notification.title,
      subtitle: notification.message || notification.description || "",
      icon: getIcon(notification.type)
    };
  };

  const displayNotifications = notifications.length > 0 
    ? notifications.slice(0, 5).map(mapNotificationToCardFormat)
    : defaultNotifications;

  return (
    <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-100 w-full max-w-xs mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-2">
        <h2 className="text-sm sm:text-base font-bold text-gray-800">
          Notifications
        </h2>
        <img src="/assets/dashboard/Upcoming/Arrow.svg" alt="Arrow" className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>
      
      {/* Divider */}
      <hr className="border-gray-200 w-full mb-2" />
      
      {/* Notifications List */}
      <div className="w-full space-y-0 flex-1 overflow-hidden">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 py-1 sm:py-1.5 border-b border-gray-100 last:border-b-0">
              <div className="animate-pulse bg-gray-200 w-3 h-3 sm:w-4 sm:h-4 rounded"></div>
              <div className="flex-1">
                <div className="animate-pulse bg-gray-200 h-2 sm:h-2.5 w-20 sm:w-24 mb-1 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-1.5 w-14 sm:w-16 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          displayNotifications.slice(0, 5).map((notification) => (
            <NotificationsCard
              key={notification.id || notification._id}
              icon={notification.icon || getIcon(notification.type)}
              title={notification.title || notification.message}
              subtitle={notification.subtitle || notification.description}
            />
          ))
        )}
      </div>
      
      {/* See All Link */}
      <div className="w-full flex justify-end mt-1.5 sm:mt-2">
        <button 
          onClick={() => navigate('/notifications')}
          className="text-xs sm:text-sm text-gray-600 underline hover:text-gray-800 bg-transparent border-none cursor-pointer"
        >
          See All
        </button>
      </div>
    </div>
  );
}
