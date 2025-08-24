import { useNavigate, useLocation } from "react-router-dom";

export default function EventDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event;

  // Default event data if none provided
  const eventData = event || {
    title: "Colombo Music Festival 2025",
    date: "April 12, 2025",
    time: "6:00PM - 10:30PM",
    venue: "Viharamahadevi Open Air Theater, Colombo",
    description:
      "Get ready for Sri Lanka's biggest music festival – the Colombo Music Festival 2025! 🎵🔥 This electrifying open-air concert will feature top international and local artists, bringing an unforgettable night of music, lights, and amazing energy to the Viharamahadevi Open Air Theater for a night filled with live performances, immersive stage effects, and a festival atmosphere like no other! Whether you're into pop, rock, EDM, or reggae, this festival has something for every music enthusiast!",
    price: "2500LKR",
    totalSeats: "1200",
    availableSeats: "523",
    popularity: "High Popularity",
    expectedAttendance: "+1000",
    tags: ["#Music", "#Festival"],
  };

  // Safely handle tags - ensure it's always an array
  const tagsDisplay =
    eventData.tags && Array.isArray(eventData.tags)
      ? eventData.tags.join(", ")
      : "#Music, #Festival";

  // Seat allocation data for heatmap
  const seatData = [
    [0, 0, 2, 2, 2, 0, 0],
    [0, 1, 1, 1, 1, 0, 0],
    [2, 2, 2, 2, 1, 1, 1, 1, 1],
    [2, 2, 0, 2, 2, 2, 2, 2, 2, 0],
    [2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0],
    [2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 0],
    [2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0],
  ];

  const getSeatColor = (status) => {
    switch (status) {
      case 0:
        return "#E5E7EB"; // Gray - Available
      case 1:
        return "#C084FC"; // Light purple - Reserved Seats
      case 2:
        return "#7C3AED"; // Dark purple - Paid Seats
      default:
        return "#E5E7EB";
    }
  };

  const Seat = ({ status, index }) => (
    <div
      key={index}
      className="w-6 h-6 rounded-md mx-0.5 my-0.5"
      style={{
        backgroundColor: getSeatColor(status),
        transition: "all 0.2s ease",
      }}
    />
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center px-6 py-4 border-b border-gray-200 relative ">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer absolute left-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <img
            src="/assets/EventDetails/Back Arrow.svg"
            alt="Back"
          />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
      </div>

      <div className="flex gap-6 p-6 ">
        {/* Left Section - Event Details */}
        <div className="flex-1 space-y-4">
          {/* Top Row - Event Name and Event Date */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.title}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Pen.svg"
                  alt="Edit"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>
            <div className="w-72">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.date}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Window Color.svg"
                  alt="Calendar"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>
          </div>

          {/* Second Row - Event Venue and Event Time */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Venue
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.venue}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Location.svg"
                  alt="Location"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>
            <div className="w-72">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.time}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Time Machine.svg"
                  alt="Time"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>
          </div>

          {/* Event Description - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description
            </label>
            <textarea
              value={eventData.description}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 h-24 resize-none text-sm"
              readOnly
            />
          </div>

          {/* Statistics Row - 4 columns */}
          <div className="flex gap-4">
            {/* Ticket Price */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Price
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.price}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Price Tag USD.svg"
                  alt="Price"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>

            {/* Seat Amount */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seat Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.totalSeats}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Flight Seat.svg"
                  alt="Seats"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>

            {/* Available Seats */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Seats
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.availableSeats}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Waiting Room.svg"
                  alt="Available"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>

            {/* Popularity */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Popularity
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventData.popularity}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  readOnly
                />
                <img
                  src="/assets/EventDetails/Popular.svg"
                  alt="Popularity"
                  className="absolute right-3 top-3 w-4 h-4"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row - Seat Allocation and Right Side */}
          <div className="flex gap-6 ">
            {/* Seat Allocation */}
            <div
              className="flex-1 bg-gray-50 rounded-lg p-4 "
              style={{ width: "60%" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Seat Allocation
              </h3>

              {/* Legend */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#7C3AED" }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Paid Seats
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#C084FC" }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Reserved Seats
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#E5E7EB" }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Available
                  </span>
                </div>
              </div>

              {/* Seat Map */}
              <div className="flex justify-center">
                <div className="inline-block">
                  {seatData.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center mb-1">
                      {row.map((seatStatus, seatIndex) => (
                        <Seat
                          key={`${rowIndex}-${seatIndex}`}
                          status={seatStatus}
                          index={`${rowIndex}-${seatIndex}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Elements */}
            <div className="w-72 space-y-4" style={{ width: "40%" }}>
              <div
                className="flex justify-between items-center gap-10"
                style={{ width: "100%" }}
              >
                {/* Tags */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tagsDisplay}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                      readOnly
                    />
                    <img
                      src="/assets/EventDetails/Tags.svg"
                      alt="Tags"
                      className="absolute right-3 top-3 w-4 h-4"
                    />
                  </div>
                </div>

                {/* Expected Attendance */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Attendance
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={eventData.expectedAttendance}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                      readOnly
                    />
                    <img
                      src="/assets/EventDetails/Group.svg"
                      alt="Attendance"
                      className="absolute right-3 top-3 w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-gray-50 rounded-lg p-4 text-center flex justify-between items-center" style={{ border: "1px solid #ADADAD" }}>
                <div className="ml-5">
                  <img
                    src="/assets/EventDetails/frame 1.svg"
                    alt="QR Code"
                  />
                </div>
                <div className="flex flex-col items-start mr-10">
                  <p
                    className="text-gray-700"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Scan QR code for easy
                  </p>
                  <p
                    className="text-gray-700"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    payments
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div
                className="flex items-center justify-between gap-4 pt-2"
                style={{ width: "100%" }}
              >
                <button className="cursor-pointer flex-1 px-6 py-2 bg-[#CF730A] text-white rounded-lg font-medium hover:bg-[#ac5e05] transition-colors text-sm">
                  EDIT
                </button>
                <button className="cursor-pointer flex-1 px-6 py-2 bg-[#1A6291] text-white rounded-lg font-medium hover:bg-[#175680] transition-colors text-sm">
                  Attendee Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
