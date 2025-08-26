import React from "react";

//import images
const facebookIcon = (
  <img src="assets/Attendee_Insights/facebook.png" alt="Facebook" />
);
const instagramIcon = (
  <img src="assets/Attendee_Insights/instagram.png" alt="Instagram" />
);
const twitterIcon = (
  <img src="assets/Attendee_Insights/twitter.png" alt="Twitter" />
);
const qrCodeIcon = (
  <img src="assets/Attendee_Insights/qr-code.png" alt="QR Code" />
);

const EngagementCard = () => {
  const engagementData = [
    {
      name: "Instagram Mentions",
      value: "5,200",
      icon: instagramIcon,
      bgColor: "#84c4c5",
    },
    {
      name: "Facebook Shares",
      value: "3,800",
      icon: facebookIcon,
      bgColor: "#84c4c5",
    },
    {
      name: "Twitter Tweets",
      value: "1,200",
      icon: twitterIcon,
      bgColor: "#84c4c5",
    },
    {
      name: "Event Check-ins (QR scans)",
      value: "9,500",
      icon: qrCodeIcon,
      bgColor: "#84c4c5",
    },
  ];

  const totalCount = "19700";

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Engagement & Social Media Reach
        </h3>
        <div className="flex items-center gap-2">
          <img src="assets/Attendee_Insights/image.png" alt="speaker" className="w-8 h-8"  />
          <p className="text-sm text-gray-600">
            How attendees engaged with the event
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-7">
        {engagementData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: item.iconBg }}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
            </div>
            <span className="text-lg font-bold" style={{ color: item.bgColor }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            TOTAL COUNT :
          </span>
          <span className="text-xl font-bold text-[#84c4c5]">{totalCount}</span>
        </div>
      </div>
    </div>
  );
};

export default EngagementCard;
