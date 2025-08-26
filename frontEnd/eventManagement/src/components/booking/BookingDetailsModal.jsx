import React from 'react';

const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Booking ID:</span>
                  <p className="font-medium text-gray-900">{booking.bookingId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Booking Date:</span>
                  <p className="font-medium text-gray-900">{formatDate(booking.bookingDate)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Event Name:</span>
                  <p className="font-medium text-gray-900">{booking.event?.name || 'Event Name'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date & Time:</span>
                  <p className="font-medium text-gray-900">
                    {booking.event?.date ? formatDate(booking.event.date) : 'TBD'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Venue:</span>
                  <p className="font-medium text-gray-900">
                    {booking.event?.venue?.name || 'Venue TBD'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seats Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Seats</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {booking.seats?.map((seat, index) => (
                  <div key={index} className="bg-white rounded-md p-3 border border-gray-200">
                    <div className="text-sm text-gray-600">Seat {seat.seatNumber}</div>
                    {seat.row && (
                      <div className="text-xs text-gray-500">Row: {seat.row}</div>
                    )}
                    {seat.section && (
                      <div className="text-xs text-gray-500">Section: {seat.section}</div>
                    )}
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {booking.currency} {seat.price?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <p className="font-medium text-gray-900">
                    {booking.currency} {booking.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <p className="font-medium text-gray-900 capitalize">
                    {booking.paymentDetails?.method || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <p className="font-medium text-gray-900 capitalize">
                    {booking.paymentDetails?.paymentStatus || 'N/A'}
                  </p>
                </div>
                {booking.paymentDetails?.transactionId && (
                  <div>
                    <span className="text-sm text-gray-600">Transaction ID:</span>
                    <p className="font-medium text-gray-900">
                      {booking.paymentDetails.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QR Code */}
          {booking.qrCode?.image && booking.status === 'confirmed' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">QR Code</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <img
                  src={booking.qrCode.image}
                  alt="Booking QR Code"
                  className="mx-auto mb-2"
                  style={{ maxWidth: '200px' }}
                />
                <p className="text-sm text-gray-600">
                  Show this QR code at the event entrance
                </p>
              </div>
            </div>
          )}

          {/* Attendee Information */}
          {booking.attendeeInfo && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendee Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  {booking.attendeeInfo.name && (
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <p className="font-medium text-gray-900">{booking.attendeeInfo.name}</p>
                    </div>
                  )}
                  {booking.attendeeInfo.email && (
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium text-gray-900">{booking.attendeeInfo.email}</p>
                    </div>
                  )}
                  {booking.attendeeInfo.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="font-medium text-gray-900">{booking.attendeeInfo.phone}</p>
                    </div>
                  )}
                  {booking.attendeeInfo.specialRequirements && (
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">Special Requirements:</span>
                      <p className="font-medium text-gray-900">{booking.attendeeInfo.specialRequirements}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Check-in Details */}
          {booking.checkInDetails?.isCheckedIn && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Check-in Details</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Checked in on: {formatDate(booking.checkInDetails.checkInTime)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
