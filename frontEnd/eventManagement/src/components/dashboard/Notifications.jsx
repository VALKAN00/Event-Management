
import NotificationsCard from "./NotificationsCard";

// Icons for different notification types
const cardIcon = "/assets/dashboard/Notifications/Card Payment.svg";
const bankIcon = "/assets/dashboard/Notifications/Bank Building.svg";
const alarmIcon = "/assets/dashboard/Notifications/Alarm Clock.svg";

export default function Notifications({ notifications = [], loading }) {
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

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const getIcon = (type) => {
    switch (type) {
      case 'payment':
        return cardIcon;
      case 'bank':
        return bankIcon;
      case 'reminder':
        return alarmIcon;
      default:
        return cardIcon;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full h-full flex flex-col" style={{width: '256px'}}>
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-3">
        <h2 className="text-lg font-bold text-gray-800">
          Notifications
        </h2>
        <img src="/assets/dashboard/Upcoming/Arrow.svg" alt="Arrow" />
      </div>
      
      {/* Divider */}
      <hr className="border-gray-200 w-full mb-3" />
      
      {/* Notifications List */}
      <div className="w-full space-y-0 flex-1 overflow-hidden">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0">
              <div className="animate-pulse bg-gray-200 w-5 h-5 rounded"></div>
              <div className="flex-1">
                <div className="animate-pulse bg-gray-200 h-3 w-24 mb-1 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-2 w-16 rounded"></div>
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
      <div className="w-full flex justify-end mt-3">
        <a href="#" className="text-sm text-gray-600 underline hover:text-gray-800">
          See All
        </a>
      </div>
    </div>
  );
}
