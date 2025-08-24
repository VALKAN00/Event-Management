export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-90">
      {/* Header with icon, title and menu */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <img src={event?.icon || "/assets/ManageEvent/Popcorn.svg"} alt="Event Icon"/>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {event?.title || "Colombo Music Festival"}
          </h2>
        </div>
        <button className="cursor-pointer p-1">
          <img src="/assets/ManageEvent/dots.svg" alt="More Options"/>
        </button>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <img src="/assets/ManageEvent/Cash.svg" alt="Ticket Price" />
          <span className="text-green-600 font-semibold">
            {event?.price || "5000LKR"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <img src="/assets/ManageEvent/Flight Seat.svg" alt="Seats Available" />
          <span className="text-purple-500 font-semibold">
            {event?.available || "1800"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <img src="/assets/ManageEvent/Ticket.svg" alt="Tickets Sold" /> 
          <span className="text-red-500 font-semibold">
            {event?.sold || "2500"}
          </span>
        </div>
        
      </div>

      {/* Separator */}
      <div className="border-t border-[#666666] mb-4"></div>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        <div className="flex">
          <span className="text-gray-600 text-sm font-medium w-16">Venue :</span>
          <span className="text-gray-900 text-sm font-medium">
            {event?.venue || "Open Air Theater, Colombo"}
          </span>
        </div>
        <div className="flex">
          <span className="text-gray-600 text-sm font-medium w-16">Date :</span>
          <span className="text-gray-900 text-sm font-medium">
            {event?.date || "12 April 2025"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex">
            <span className="text-gray-600 text-sm font-medium w-16">Time :</span>
            <span className="text-gray-900 text-sm font-medium">
              {event?.time || "09.00PM to 11.30PM"}
            </span>
          </div>
          
          {/* Arrow Button */}
          <button className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <img src="/assets/ManageEvent/Back Arrow.svg" alt="Arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}
