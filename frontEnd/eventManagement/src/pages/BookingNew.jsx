import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../api/bookingAPI';
import BookingCard from '../components/booking/BookingCard';
import BookingDetailsModal from '../components/booking/BookingDetailsModal';
import BookingFilters from '../components/booking/BookingFilters';
import BookingStats from '../components/booking/BookingStats';
import Pagination from '../components/booking/Pagination';
import CreateBookingForm from '../components/booking/CreateBookingForm';
import QRScanner from '../components/booking/QRScanner';

export default function Booking() {
  const { user } = useAuth();
  
  // State management
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'bookingDate',
    sortOrder: 'desc'
  });
  
  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch bookings from API
  const fetchBookings = async (page = 1, filterParams = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: 10,
        ...filterParams
      };
      
      console.log('Fetching bookings with params:', params);
      
      const response = await bookingAPI.getMyBookings(params);
      console.log('Bookings response:', response);
      
      if (response.success) {
        setBookings(response.data.bookings || response.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalBookings(response.data.pagination?.totalCount || response.data.length || 0);
        setCurrentPage(page);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchBookings(1, filters);
    }
  }, [user]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchBookings(1, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchBookings(page, filters);
  };

  // Handle booking selection
  const handleBookingSelect = async (booking) => {
    try {
      setLoading(true);
      const detailedBooking = await bookingAPI.getBooking(booking._id);
      
      if (detailedBooking.success) {
        setSelectedBooking(detailedBooking.data);
      } else {
        setSelectedBooking(booking);
      }
      
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setSelectedBooking(booking);
      setShowDetailsModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId, reason = 'Cancelled by user') => {
    try {
      const response = await bookingAPI.cancelBooking(bookingId, reason);
      
      if (response.success) {
        setSuccessMessage('Booking cancelled successfully');
        // Refresh bookings list
        fetchBookings(currentPage, filters);
        setShowDetailsModal(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setErrorMessage(err.message || 'Failed to cancel booking');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Handle new booking creation
  const handleCreateBooking = async (bookingData) => {
    try {
      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.success) {
        setSuccessMessage('Booking created successfully');
        setShowCreateForm(false);
        // Refresh bookings list
        fetchBookings(currentPage, filters);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setErrorMessage(err.message || 'Failed to create booking');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Handle QR code validation
  const handleQRValidation = async (qrData) => {
    try {
      const response = await bookingAPI.validateQRCode(qrData);
      
      if (response.success) {
        setSuccessMessage(`QR Code validated successfully for booking: ${response.data.bookingId}`);
        setShowQRScanner(false);
        
        // Refresh bookings to show updated status
        fetchBookings(currentPage, filters);
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Invalid QR code');
      }
    } catch (err) {
      console.error('Error validating QR code:', err);
      setErrorMessage(err.message || 'Failed to validate QR code');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Handle check-in
  const handleCheckIn = async (bookingId) => {
    try {
      const response = await bookingAPI.checkInBooking(bookingId);
      
      if (response.success) {
        setSuccessMessage('Check-in successful');
        // Refresh bookings list
        fetchBookings(currentPage, filters);
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to check in');
      }
    } catch (err) {
      console.error('Error checking in:', err);
      setErrorMessage(err.message || 'Failed to check in');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Calculate booking statistics
  const getBookingStats = () => {
    const totalConfirmed = bookings.filter(b => b.status === 'confirmed').length;
    const totalPending = bookings.filter(b => b.status === 'pending').length;
    const totalCancelled = bookings.filter(b => b.status === 'cancelled').length;
    const totalCheckedIn = bookings.filter(b => b.checkInDetails?.isCheckedIn).length;
    const totalRevenue = bookings
      .filter(b => ['confirmed', 'checked-in'].includes(b.status))
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      total: totalBookings,
      confirmed: totalConfirmed,
      pending: totalPending,
      cancelled: totalCancelled,
      checkedIn: totalCheckedIn,
      revenue: totalRevenue
    };
  };

  const stats = getBookingStats();

  // Render loading state
  if (loading && bookings.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <div className="flex gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowQRScanner(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2m-6 0h-2m0 0h2m-4 0h2" />
              </svg>
              Scan QR
            </button>
          )}
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Booking
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-300 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-300 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Booking Statistics */}
        <BookingStats 
          stats={stats}
          loading={loading}
        />

        {/* Filters */}
        <BookingFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="bg-red-50 border border-red-300 rounded-lg p-6 max-w-md text-center">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Bookings</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button 
                onClick={() => fetchBookings(currentPage, filters)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {!error && (
          <>
            {bookings.length === 0 && !loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Bookings Found</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {filters.search || filters.status ? 'Try adjusting your filters' : 'Start by creating your first booking'}
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Booking
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onSelect={() => handleBookingSelect(booking)}
                      onCancel={user?.role === 'admin' ? handleCancelBooking : undefined}
                      onCheckIn={user?.role === 'admin' ? handleCheckIn : undefined}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalBookings}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
          onCancel={user?.role === 'admin' ? handleCancelBooking : undefined}
          onCheckIn={user?.role === 'admin' ? handleCheckIn : undefined}
        />
      )}

      {showCreateForm && (
        <CreateBookingForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateBooking}
        />
      )}

      {showQRScanner && user?.role === 'admin' && (
        <QRScanner
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onScan={handleQRValidation}
        />
      )}
    </div>
  );
}
