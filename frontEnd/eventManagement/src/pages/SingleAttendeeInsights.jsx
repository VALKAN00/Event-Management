import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AttendeeAgeChart from "../components/Single_Attendee_Insights/AttendeeAgeChart";
import AttendeeInterestsChart from "../components/Single_Attendee_Insights/AttendeeInterestsChart";
import AttendeeLocationsChart from "../components/Single_Attendee_Insights/AttendeeLocationsChart";
import EngagementCard from "../components/Single_Attendee_Insights/EngagementCard";
import LocationTable from "../components/Single_Attendee_Insights/LocationTable";

export default function SingleAttendeeInsights() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state?.event;

  // Default event data if none provided (fallback)
  const defaultEvent = {
    title: "Colombo Music Festival 2025",
    date: "April 12, 2025",
    time: "6:00PM - 10:30PM",
    venue: "Viharamahadevi Open Air Theater, Colombo",
    availableSeats: "523"
  };

  const event = eventData || defaultEvent;
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <img
                src="assets/EventDetails/Back Arrow.svg"
                alt="Back"
                className="w-8 h-8"
              />
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Attendee Insights - {event.title}
            </h1>
          </div>
          
          <div className="w-full sm:w-auto sm:ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full sm:w-80 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          {/* Event Details */}
          <div className="text-sm text-gray-600 space-y-1">
            <div>• Event Venue : {event.venue}</div>
            <div>• Event Date : {event.date}</div>
            <div>• Event Time: {event.time}</div>
          </div>

          {/* Attendees Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 w-full sm:w-auto justify-center sm:justify-start">            
              <span className="text-sm font-medium text-gray-700">
                Attendees: {event.availableSeats}
              </span>
              <img src="assets/Attendee_Insights/image2.png" alt="Attendees" className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 w-full sm:w-auto justify-center sm:justify-start">
              <img src="assets/Attendee_Insights/image3.png" alt="filter" className="w-6 h-6" />
              <span className="text-sm font-medium text-gray-700">Filter</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-600"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-8 space-y-6">
            {/* Attendee Age Chart */}
            <div className="h-64 sm:h-80 lg:h-96">
              <AttendeeAgeChart />
            </div>

            {/* Bottom Row - Two Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 sm:h-80 lg:h-96">
                <AttendeeInterestsChart />
              </div>
              <div className="h-64 sm:h-80 lg:h-96">
                <AttendeeLocationsChart />
              </div>
            </div>
          </div>

          {/* Right Column - Engagement & Location Table */}
          <div className="lg:col-span-4 space-y-6">
            <div className="h-64 sm:h-80 lg:h-96">
              <EngagementCard />
            </div>
            <div className="h-64 sm:h-80 lg:h-96">
              <LocationTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
