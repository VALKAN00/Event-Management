import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingAPI } from '../api/bookingAPI';
import BookingQRCode from '../components/booking/BookingQRCode';

const TicketPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // Try to get booking by bookingId
        const response = await bookingAPI.getMyBookings();
        const bookingData = response.data?.bookings?.find(b => b.bookingId === bookingId);
        
        if (bookingData) {
          setBooking(bookingData);
        } else {
          setError('Booking not found');
        }
      } catch {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The ticket you\'re looking for could not be found.'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Ticket Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎫 Digital Ticket</h1>
          <p className="text-gray-600">Your event ticket details</p>
        </div>

        {/* Main Ticket Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{booking.event?.name}</h2>
                <p className="text-blue-100">Booking ID: {booking.bookingId}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Event Date & Time</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {booking.event?.date ? formatDate(booking.event.date) : 'TBD'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Venue</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {booking.event?.venue?.name || 'Venue TBD'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.event?.venue?.city || ''}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Seats</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {booking.seats?.length || 0} seat(s)
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Amount</h3>
                  <p className="text-xl font-bold text-green-600">
                    {booking.currency} {booking.totalAmount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Right Column - QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <BookingQRCode booking={booking} size={150} />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Show this QR code at the venue for entry
                </p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Booking Date:</span>
                  <span className="ml-2 font-medium">{formatDate(booking.bookingDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Event Description:</span>
                  <span className="ml-2 font-medium">{booking.event?.description || 'No description available'}</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Please arrive at least 30 minutes before the event starts</li>
                <li>• Bring a valid ID for verification</li>
                <li>• This ticket is non-transferable</li>
                <li>• Screenshots of this ticket are also accepted</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-xs text-gray-500">
              Generated on {new Date().toLocaleDateString()} • EventX Studio
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print Ticket
          </button>
          <button
            onClick={() => window.location.href = '/booking-tickets'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
