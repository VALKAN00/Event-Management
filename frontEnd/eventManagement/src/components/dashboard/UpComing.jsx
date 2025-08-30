import UpComingCard from "./UpComingCard";
import { useNavigate } from "react-router-dom";

const icon1 = "/assets/dashboard/Upcoming/1.svg";
const icon2 = "/assets/dashboard/Upcoming/2.svg";
const icon3 = "/assets/dashboard/Upcoming/3.svg";
const icon4 = "/assets/dashboard/Upcoming/4.svg";
const icon5 = "/assets/dashboard/Upcoming/5.svg";

const defaultIcons = [icon1, icon2, icon3, icon4, icon5];

export default function UpComing({ events = [], loading }) {
  const navigate = useNavigate();
  
  // Format date for display
  const formatEventDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date TBD';
    }
  };

  // Handle "See All" click
  const handleSeeAll = () => {
    navigate('/upcoming-events');
  };

  // Handle individual event click
  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Check if we have real backend data
  const hasRealData = events && events.length > 0 && events[0]._id;
  
  return (
    <div
      className="NormalCard bg-white flex flex-col justify-between items-start p-4"
      style={{
        width: "256px",
        height: "436px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex items-center gap-2">
          <h2
            className="text-xl text-black"
            style={{
              fontSize: "18px",
              color: "#4F4F4F",
              fontFamily: "Poppins",
              fontWeight: 800,
            }}
          >
            Upcoming Events
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <img 
            src="/assets/dashboard/Upcoming/Arrow.svg" 
            alt="Upcoming Event" 
            className="cursor-pointer"
            onClick={handleSeeAll}
          />
        </div>
      </div>

      {/* Events List Section */}
      <div className="flex flex-col space-y-3 flex-1 overflow-hidden">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg"
            >
              <div className="animate-pulse bg-gray-200 w-10 h-10 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            </div>
          ))
        ) : events && events.length > 0 ? (
          events.slice(0, 3).map((event, index) => (
            <div 
              key={event._id || index}
              className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors p-1"
              onClick={() => handleEventClick(event._id)}
            >
              <UpComingCard
                icon={defaultIcons[index] || icon1}
                eventName={event.title || event.name || 'Event Name'}
                date={formatEventDate(event.date)}
              />
            </div>
          ))
        ) : (
          // Fallback to default static events if no data
          <div className="space-y-3">
            {/* Info message about fallback data */}
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              📍 Showing sample events (backend connection pending)
            </div>
            
            <div className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors p-1">
              <UpComingCard
                icon={icon1}
                eventName="Cynosure Festival"
                date="24 March 2025"
              />
            </div>
            <div className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors p-1">
              <UpComingCard
                icon={icon2}
                eventName="Tech Conference"
                date="15 April 2025"
              />
            </div>
            <div className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors p-1">
              <UpComingCard
                icon={icon3}
                eventName="Art Exhibition"
                date="30 May 2025"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* See All button positioned at bottom right */}
      <div className="w-full flex justify-end mt-auto pt-4 border-t border-gray-100">
        <button
          onClick={handleSeeAll}
          className="text-black underline hover:text-blue-600 transition-colors text-sm font-medium"
        >
          See All
        </button>
      </div>
    </div>
  );
}
