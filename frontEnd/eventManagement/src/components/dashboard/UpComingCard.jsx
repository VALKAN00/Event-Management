export default function UpComingCard({icon, eventName, date }) {
  return (
    <div className="UpComingCard flex justify-start items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow" 
         style={{ width: "220px", minHeight: "60px" }}>
      <div className="flex-shrink-0">
        <img src={icon} alt={eventName} className="w-10 h-10 object-cover rounded-full" />
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <span className="text-black font-semibold text-sm leading-tight mb-1 truncate" 
              title={eventName}>
          Event: {eventName}
        </span>
        <span className="text-gray-600 font-medium text-xs leading-tight truncate" 
              title={date}>
          Date: {date}
        </span>
      </div>
    </div>
  );
}
