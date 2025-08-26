import React from "react";

const LocationTable = () => {
  const locationData = [
    {
      location: "Colombo",
      count: 227,
      color: "#3B82F6",
    },
    {
      location: "Kandy",
      count: 123,
      color: "#EF4444",
    },
    {
      location: "Galle",
      count: 143,
      color: "#8B5CF6",
    },
    {
      location: "Jaffna",
      count: 70,
      color: "#F59E0B",
    },
    {
      location: "International",
      count: 52,
      color: "#10B981",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">ATTENDEE LOCATIONS</h3>
      </div>

      {/* Table with clean borders */}
      <div className="border-2 border-gray-800 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 bg-gray-50">
          <div className="text-sm font-semibold text-gray-700 p-3 border-r-2 border-gray-800">
            Location
          </div>
          <div className="text-sm font-semibold text-gray-700 p-3">Count</div>
        </div>

        {/* Table Rows */}
        {locationData.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 ${
              index !== locationData.length - 1
                ? "border-b-2 border-gray-800"
                : ""
            }`}
          >
            <div className="flex items-center gap-3 p-3 border-r-2 border-gray-800 bg-white">
              <span className="text-sm text-gray-700">{item.location}</span>
            </div>
            <div className="text-sm font-semibold text-gray-900 p-3 bg-white flex items-center justify-between">
              {item.count}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationTable;
