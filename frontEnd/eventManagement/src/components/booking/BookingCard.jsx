import React from 'react';

const BookingCard = ({ booking, onSelect, onCancel, onCheckIn, onConfirm }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.event?.name || 'Event Name'}
          </h3>
          <p className="text-sm text-gray-600">
            Booking ID: {booking.bookingId}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Event Date</p>
          <p className="text-sm font-medium text-gray-900">
            {booking.event?.date ? formatDate(booking.event.date) : 'TBD'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Booking Date</p>
          <p className="text-sm font-medium text-gray-900">
            {formatDate(booking.bookingDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-sm font-medium text-gray-900">
            {booking.currency} {booking.totalAmount?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Seats</p>
          <p className="text-sm font-medium text-gray-900">
            {booking.seats?.length || 0} seat(s)
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Venue</p>
        <p className="text-sm font-medium text-gray-900">
          {booking.event?.venue?.name || 'Venue TBD'}, {booking.event?.venue?.city || ''}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onSelect(booking)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
        
        {booking.status === 'pending' && onConfirm && (
          <button
            onClick={() => onConfirm(booking._id)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Confirm Booking
          </button>
        )}
        
        {booking.status === 'pending' && onCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        )}
        
        {booking.status === 'confirmed' && !booking.checkInDetails?.isCheckedIn && onCheckIn && (
          <button
            onClick={() => onCheckIn(booking._id)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Check In
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
