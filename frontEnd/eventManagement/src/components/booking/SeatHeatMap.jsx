import React, { useState, useEffect } from 'react';

const SeatHeatMap = ({ selectedEvent, assignedSeats = [] }) => {
  const [seatData, setSeatData] = useState([]);

  useEffect(() => {
    if (selectedEvent?.seatConfiguration?.seatMap) {
      // Get all seats from the event
      const allSeats = selectedEvent.seatConfiguration.seatMap;
      
      // Group seats by row and section for better visualization
      const seatsByRow = {};
      
      allSeats.forEach(seat => {
        const rowKey = `${seat.section || 'General'}-${seat.row || 'R1'}`;
        if (!seatsByRow[rowKey]) {
          seatsByRow[rowKey] = [];
        }
        
        // Check if this seat is being assigned in current booking
        const isCurrentlyAssigned = assignedSeats.some(
          assignedSeat => assignedSeat.seatNumber === seat.seatNumber &&
                         assignedSeat.row === seat.row &&
                         assignedSeat.section === seat.section
        );
        
        seatsByRow[rowKey].push({
          ...seat,
          isCurrentlyAssigned
        });
      });
      
      // Sort seats within each row
      Object.keys(seatsByRow).forEach(rowKey => {
        seatsByRow[rowKey].sort((a, b) => {
          const seatA = parseInt(a.seatNumber.replace(/\D/g, '')) || 0;
          const seatB = parseInt(b.seatNumber.replace(/\D/g, '')) || 0;
          return seatA - seatB;
        });
      });
      
      setSeatData(seatsByRow);
    }
  }, [selectedEvent, assignedSeats]);

  const getSeatColor = (seat) => {
    if (seat.isCurrentlyAssigned) {
      return 'bg-yellow-400 border-yellow-500'; // Currently being assigned
    }
    
    switch (seat.status) {
      case 'available':
        return 'bg-green-200 border-green-300 hover:bg-green-300';
      case 'occupied':
      case 'booked':
        return 'bg-red-300 border-red-400';
      case 'reserved':
        return 'bg-orange-200 border-orange-300';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  const getSeatIcon = (seat) => {
    if (seat.isCurrentlyAssigned) {
      return '⭐'; // Star for currently assigned seats
    }
    
    switch (seat.status) {
      case 'available':
        return '✓';
      case 'occupied':
      case 'booked':
        return '✗';
      case 'reserved':
        return '⏳';
      default:
        return '○';
    }
  };

  if (!selectedEvent || Object.keys(seatData).length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0V17m0-10a2 2 0 012-2h2a2 2 0 002 2" />
          </svg>
          <p>No seat map available for this event</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-900 mb-2">Seat Map</h4>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
            <span>Your Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 border border-red-400 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 border border-orange-300 rounded"></div>
            <span>Reserved</span>
          </div>
        </div>
      </div>

      {/* Stage/Screen Area */}
      <div className="bg-gray-800 text-white text-center py-2 mb-4 rounded">
        STAGE/SCREEN
      </div>

      {/* Seat Map */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {Object.entries(seatData).map(([rowKey, seats]) => {
          const [section, row] = rowKey.split('-');
          return (
            <div key={rowKey} className="flex items-center gap-2">
              {/* Row Label */}
              <div className="w-16 text-xs font-medium text-gray-600 text-right">
                {section !== 'General' ? `${section} ${row}` : row}
              </div>
              
              {/* Seats in Row */}
              <div className="flex flex-wrap gap-1">
                {seats.map((seat, index) => (
                  <div
                    key={`${seat.seatNumber}-${index}`}
                    className={`
                      w-6 h-6 rounded border text-xs flex items-center justify-center
                      transition-colors cursor-pointer
                      ${getSeatColor(seat)}
                    `}
                    title={`Seat ${seat.seatNumber} - ${seat.status}${seat.isCurrentlyAssigned ? ' (Your Seat)' : ''}`}
                  >
                    <span className="text-xs font-bold">
                      {getSeatIcon(seat)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Seats:</span>
            <span className="ml-2 text-gray-600">
              {selectedEvent.seatConfiguration?.totalSeats || Object.values(seatData).flat().length}
            </span>
          </div>
          <div>
            <span className="font-medium">Available:</span>
            <span className="ml-2 text-green-600">
              {Object.values(seatData).flat().filter(seat => seat.status === 'available').length}
            </span>
          </div>
          <div>
            <span className="font-medium">Your Seats:</span>
            <span className="ml-2 text-yellow-600">
              {assignedSeats.length}
            </span>
          </div>
          <div>
            <span className="font-medium">Occupied:</span>
            <span className="ml-2 text-red-600">
              {Object.values(seatData).flat().filter(seat => ['occupied', 'booked'].includes(seat.status)).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatHeatMap;
