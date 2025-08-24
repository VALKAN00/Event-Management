
import NotificationsCard from "./NotificationsCard";

// Icons for different notification types
const cardIcon = "/assets/dashboard/Notifications/Card Payment.svg";
const bankIcon = "/assets/dashboard/Notifications/Bank Building.svg";
const alarmIcon = "/assets/dashboard/Notifications/Alarm Clock.svg";

export default function Notifications() {
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
        <NotificationsCard
          icon={cardIcon}
          title="Paycheck released for artists"
          subtitle="@Wayo Event"
        />
        <NotificationsCard
          icon={bankIcon}
          title="Total revenue has been"
          subtitle="transferred to bank"
        />
        <NotificationsCard
          icon={alarmIcon}
          title="@Alan Walker Event in 3 days"
          subtitle=""
        />
        <NotificationsCard
          icon={cardIcon}
          title="Paycheck released for artists"
          subtitle="@Cynderex Event"
        />
        <NotificationsCard
          icon={cardIcon}
          title="Paycheck released for artists"
          subtitle="@Get Together Event"
        />
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
