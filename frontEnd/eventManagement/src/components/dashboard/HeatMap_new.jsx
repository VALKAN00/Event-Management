import React from 'react';

const LatestEventHeatMap = ({ events = [], loading = false }) => {
  // Generate seating data - represents seat status
  // 0 = To be sold (gray), 1 = Reserved Seats (light purple), 2 = Paid Seats (dark purple)
  const seatData = [
    [0, 0, 2, 2, 2, 0],
    [0, 1, 1, 1, 1, 0, 1, 0],
    [0, 2, 2, 2, 0, 1, 1, 1, 1, 1],
    [2, 2, 0, 2, 2, 2, 2, 2, 2, 0],
  ];

  // Get the latest event from the events array
  const latestEvent = events && events.length > 0 ? events[0] : null;
  
  // Default event data
  const defaultEvent = {
    name: 'Alan Walker EDM Festival',
    date: new Date('2025-03-28T10:00:00Z')
  };

  const eventData = latestEvent || defaultEvent;
  const eventName = eventData.name || eventData.title || defaultEvent.name;
  const eventDate = new Date(eventData.date || defaultEvent.date);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 0: return '#D1D5DB'; // Gray - To be sold
      case 1: return '#A78BFA'; // Light purple - Reserved Seats
      case 2: return '#7C3AED'; // Dark purple - Paid Seats
      default: return '#D1D5DB';
    }
  };

  const Seat = ({ status, index }) => (
    <div
      key={index}
      className="w-9 h-9 rounded-md mx-1 my-1"
      style={{
        backgroundColor: getSeatColor(status),
        transition: 'all 0.2s ease'
      }}
    />
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full max-w-5xl mx-auto" style={{height: '314px'}}>
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Latest Event</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Event Information */}
          <div className="flex-shrink-0 w-full md:w-64">
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-600 mb-1">Event Name:</h3>
              <p className="text-sm font-semibold text-gray-900">{eventName}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-600 mb-1">Event Date:</h3>
              <p className="text-sm font-semibold text-gray-900">{formatDate(eventDate)}</p>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7C3AED' }}></div>
                <span className="text-xs font-medium text-gray-700">Paid Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A78BFA' }}></div>
                <span className="text-xs font-medium text-gray-700">Reserved Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D1D5DB' }}></div>
                <span className="text-xs font-medium text-gray-700">To be sold</span>
              </div>
            </div>
          </div>

          {/* Seating Chart */}
          <div className="flex-1 min-w-0">
            <div className="rounded-lg p-4 overflow-hidden">
              {seatData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center items-center mb-2">
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
      )}
    </div>
  );
};

export default LatestEventHeatMap;
