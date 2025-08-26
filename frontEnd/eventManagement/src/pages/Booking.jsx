import React, { useState, useEffect } from 'react';
import BookingCard from '../components/booking/BookingCard';
import BookingDetailsModal from '../components/booking/BookingDetailsModal';
import BookingFilters from '../components/booking/BookingFilters';
import BookingStats from '../components/booking/BookingStats';
import Pagination from '../components/booking/Pagination';
import CreateBookingForm from '../components/booking/CreateBookingForm';
import QRScanner from '../components/booking/QRScanner';

// Mock data - Replace with actual API calls
const mockBookings = [
  {
    _id: '1',
    bookingId: 'BK123456789ABC',
    event: {
      name: 'Colombo Music Festival 2025',
      date: '2025-04-12T18:00:00Z',
      venue: {
        name: 'Viharamahadevi Open Air Theater',
        city: 'Colombo'
      }
    },
    seats: [
      { seatNumber: 'A1', row: 'A', section: 'VIP', price: 5000 },
      { seatNumber: 'A2', row: 'A', section: 'VIP', price: 5000 }
    ],
    totalAmount: 10000,
    currency: 'LKR',
    bookingDate: '2025-04-01T10:30:00Z',
    status: 'confirmed',
    paymentDetails: {
      method: 'card',
      paymentStatus: 'completed',
      transactionId: 'TXN123456789'
    },
    attendeeInfo: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+94771234567'
    },
    checkInDetails: {
      isCheckedIn: false
    },
    qrCode: {
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    }
  },
  {
    _id: '2',
    bookingId: 'BK987654321XYZ',
    event: {
      name: 'Tech Conference 2025',
      date: '2025-05-15T09:00:00Z',
      venue: {
        name: 'Colombo Convention Center',
        city: 'Colombo'
      }
    },
    seats: [
      { seatNumber: 'B15', row: 'B', section: 'Standard', price: 2500 }
    ],
    totalAmount: 2500,
    currency: 'LKR',
    bookingDate: '2025-04-15T14:20:00Z',
    status: 'pending',
    paymentDetails: {
      method: 'mobile',
      paymentStatus: 'pending'
    },
    attendeeInfo: {
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+94779876543'
    },
    checkInDetails: {
      isCheckedIn: false
    }
  },
  {
    _id: '3',
    bookingId: 'BK456789123DEF',
    event: {
      name: 'Food Festival Kandy',
      date: '2025-06-20T16:00:00Z',
      venue: {
        name: 'Royal Botanical Gardens',
        city: 'Kandy'
      }
    },
    seats: [
      { seatNumber: 'C10', row: 'C', section: 'Premium', price: 3500 }
    ],
    totalAmount: 3500,
    currency: 'LKR',
    bookingDate: '2025-05-01T11:45:00Z',
    status: 'cancelled',
    paymentDetails: {
      method: 'card',
      paymentStatus: 'refunded'
    },
    attendeeInfo: {
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+94112345678'
    },
    checkInDetails: {
      isCheckedIn: false
    }
  }
];

const mockStats = {
  totalBookings: 125,
  confirmedBookings: 89,
  totalRevenue: 450000,
  cancelledBookings: 12
};

export default function Booking() {
  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'bookingDate-desc'
  });

  // Simulate API calls
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
        setLoading(false);
      }, 1000);
    };

    const fetchStats = async () => {
      setStatsLoading(true);
      setTimeout(() => {
        setStats(mockStats);
        setStatsLoading(false);
      }, 800);
    };

    fetchBookings();
    fetchStats();
  }, []);

  // Filter and search functionality
  const applyFilters = () => {
    let filtered = [...bookings];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(booking =>
        booking.bookingId.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.event.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(booking =>
        new Date(booking.bookingDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(booking =>
        new Date(booking.bookingDate) <= new Date(filters.endDate)
      );
    }

    // Sorting
    const [sortField, sortOrder] = filters.sortBy.split('-');
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'bookingDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        search: '',
        status: '',
        startDate: '',
        endDate: '',
        sortBy: 'bookingDate-desc'
      });
      setFilteredBookings(bookings);
      setCurrentPage(1);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  // Modal handlers
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      // TODO: Implement API call
      console.log('Creating booking:', bookingData);
      
      // Mock response - replace with actual API call
      const newBooking = {
        ...bookingData,
        _id: Date.now().toString(),
        bookingId: `BK${Date.now()}`,
        bookingDate: new Date().toISOString(),
        status: 'pending',
        currency: 'LKR'
      };
      
      setBookings(prev => [newBooking, ...prev]);
      setFilteredBookings(prev => [newBooking, ...prev]);
      
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleQRScan = async (qrData) => {
    try {
      // TODO: Implement QR validation API call
      console.log('Validating QR:', qrData);
      
      // Mock validation
      const booking = bookings.find(b => 
        b.bookingId === qrData || 
        b.bookingId.toLowerCase().includes(qrData.toLowerCase())
      );
      
      if (booking) {
        if (booking.status === 'confirmed') {
          await handleCheckIn(booking._id);
          setIsQRScannerOpen(false);
          alert('Check-in successful!');
        } else {
          alert('Booking must be confirmed before check-in.');
        }
      } else {
        alert('Invalid booking ID or QR code.');
      }
    } catch (error) {
      console.error('Error validating QR:', error);
      alert('QR validation failed. Please try again.');
    }
  };

  // Action handlers
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // TODO: Implement API call
      console.log('Cancelling booking:', bookingId);
      // Update local state
      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      setFilteredBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    }
  };

  const handleCheckIn = async (bookingId) => {
    // TODO: Implement API call
    console.log('Checking in booking:', bookingId);
    // Update local state
    setBookings(prev =>
      prev.map(booking =>
        booking._id === bookingId
          ? {
              ...booking,
              status: 'checked-in',
              checkInDetails: {
                ...booking.checkInDetails,
                isCheckedIn: true,
                checkInTime: new Date().toISOString()
              }
            }
          : booking
      )
    );
    setFilteredBookings(prev =>
      prev.map(booking =>
        booking._id === bookingId
          ? {
              ...booking,
              status: 'checked-in',
              checkInDetails: {
                ...booking.checkInDetails,
                isCheckedIn: true,
                checkInTime: new Date().toISOString()
              }
            }
          : booking
      )
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track all event bookings
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsQRScannerOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                QR Scanner
              </button>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                New Booking
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <BookingStats stats={stats} loading={statsLoading} />

        {/* Filters */}
        <BookingFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={applyFilters}
        />

        {/* Bookings Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                All Bookings ({filteredBookings.length})
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onView={handleViewBooking}
                    onCancel={handleCancelBooking}
                    onCheckIn={handleCheckIn}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredBookings.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredBookings.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Create Booking Modal */}
      <CreateBookingForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBooking}
        events={mockBookings.map(b => b.event)} // Replace with actual events from API
      />

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleQRScan}
      />
    </div>
  );
}
