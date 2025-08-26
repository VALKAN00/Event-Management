import EventCard from "../components/ManageEvents/EventCard";

import { useNavigate } from "react-router-dom";

export default function ManageEvents() {
  const navigate = useNavigate();

  // Sample event data with different icons and details
  const events = [
    {
      title: "Colombo Music Festival",
      date: "12 April 2025",
      time: "09.00PM to 11.30PM",
      venue: "Open Air Theater, Colombo",
      icon: "/assets/ManageEvent/Microphone.svg",
      price: "5000LKR",
      sold: "2500",
      available: "1800",
      status: "upcoming",
    },
    {
      title: "Lanka Supercar Show",
      date: "15 April 2025",
      time: "09.00PM to 11.30PM",
      venue: "Lanka Supercar Show",
      icon: "/assets/ManageEvent/Sedan.svg",
      price: "3000LKR",
      sold: "2500",
      available: "0",
      status: "upcoming",
    },
    {
      title: "Rock & Roll Night",
      date: "03 March 2025",
      time: "09.00PM to 11.30PM",
      venue: "Open Air Theater, Colombo",
      icon: "/assets/ManageEvent/Rock Music.svg",
      price: "3000LKR",
      sold: "1500",
      available: "1500",
      status: "closed",
    },
    {
      title: "Galle Literary Fair",
      date: "14 April 2025",
      time: "09.00AM to 12.00PM",
      venue: "Open Air Theater, Galle",
      icon: "/assets/ManageEvent/Paint Palette.svg",
      price: "2000LKR",
      sold: "1500",
      available: "600",
      status: "upcoming",
    },
    {
      title: "Kandy Art Exhibition",
      date: "19 April 2025",
      time: "09.00PM to 11.30PM",
      venue: "Open Air Theater, Colombo",
      icon: "/assets/ManageEvent/Paint Palette.svg",
      price: "4000LKR",
      sold: "750",
      available: "0",
      status: "upcoming",
    },
    {
      title: "Sri Lanka Food Fest",
      date: "02 March 2025",
      time: "09.00PM to 11.30PM",
      venue: "Open Air Theater, Colombo",
      icon: "/assets/ManageEvent/Popcorn.svg",
      price: "2000LKR",
      sold: "700",
      available: "600",
      status: "closed",
    },
    {
      title: "Tech Lanka Expo 2025",
      date: "18 April 2025",
      time: "10.00AM to 01.30PM",
      venue: "Open Air Theater, Colombo",
      icon: "/assets/ManageEvent/Laptop.svg",
      price: "1000LKR",
      sold: "800",
      available: "400",
      status: "upcoming",
    },
    {
      title: "New Year's Eve Fireworks",
      date: "24 April 2025",
      time: "09.00PM to 11.30PM",
      venue: "Open Air Theater, Colombo",
      icon: "/assets/ManageEvent/Face Mask.svg",
      price: "1500LKR",
      sold: "1500",
      available: "0",
      status: "upcoming",
    },
    {
      title: "Colombo Music Festival",
      date: "24 February 2025",
      time: "09.00PM to 11.30PM",
      venue: "Open Air Theater, Colombo",
      icon: "/assets/ManageEvent/Microphone.svg",
      price: "5000LKR",
      sold: "1500",
      available: "1100",
      status: "closed",
    },
  ];

  return (
    <div className="min-h-screen mb-4">
      {/* Header Section */}
      <div className="p-4 mb-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Event Management Section
          </h1>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Filter Button */}
            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-600"
              >
                <path
                  d="M3 6H21L18 12V18L15 21V12L3 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-gray-700 font-medium">Filter</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-400"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="cursor-pointer absolute left-3 top-3 text-gray-400"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* New Event Button */}
            <button
              className="cursor-pointer flex items-center gap-2 px-4 py-2  text-white border-2 border-blue-600  hover:bg-blue-100 transition-colors"
              style={{ borderRadius: "15px", height: "46px" }}
            >
              <img src="/assets/ManageEvent/Plus.svg" alt="Add" />
              <span className="font-medium text-[#0122F5]">New Event</span>
            </button>

            {/* Attendee Insights Button */}
            <button
              onClick={() => navigate('/attendee-insights')}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-orange-400 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              style={{ borderRadius: "15px", height: "46px" }}
            >
              <span className="font-medium">Attendee Insights</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-orange-400"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Sort By:</span>
              <button className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium">Status</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Pick Date */}
            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-600"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-gray-700 font-medium">Pick Date</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicators - Aligned with card columns */}
      <div className="flex items-center justify-center mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#1A28BF] rounded-full"></div>
            <span className="text-gray-700 font-medium">Up-Coming Events</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#1ABF46] rounded-full"></div>
            <span className="text-gray-700 font-medium">Pending Events</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#BF1A1A] rounded-full"></div>
            <span className="text-gray-700 font-medium">Closed Events</span>
          </div>
        </div>
      </div>

      {/* Events Grid - 3 cards per row */}
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
