import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import eventsAPI from '../../api/eventsAPI';
import DeleteModal from '../common/DeleteModal';
import Toast from '../common/Toast';

export default function EventCard({ event, onEventDeleted }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleViewDetails = () => {
    const eventId = event.originalData?._id || event.originalData?.id || event.id;
    if (eventId) {
      navigate(`/event-details/${eventId}`, { state: { event: event.originalData || event } });
    } else {
      // Fallback to state-only navigation if no ID
      navigate('/event-details', { state: { event: event.originalData || event } });
    }
  };

  const handleEditEvent = () => {
    setShowDropdown(false);
    const eventId = event.originalData?._id || event.originalData?.id || event.id;
    if (eventId) {
      // Navigate to EventDetails.jsx in edit mode
      navigate(`/event-details/${eventId}`, { 
        state: { 
          event: event.originalData || event,
          editMode: true // This will trigger edit mode in EventDetails
        } 
      });
    } else {
      // Fallback to state-only navigation if no ID
      navigate('/event-details', { 
        state: { 
          event: event.originalData || event,
          editMode: true
        } 
      });
    }
  };

  const handleDeleteEvent = () => {
    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const eventId = event.originalData?._id || event.originalData?.id || event.id;
      
      if (!eventId) {
        throw new Error('Event ID not found');
      }

      console.log('Deleting event:', eventId);
      
      // Call the API to delete the event
      await eventsAPI.deleteEvent(eventId);
      
      // Close modal
      setShowDeleteModal(false);
      
      // Show success toast
      setToast({
        show: true,
        message: `"${event?.title || 'Event'}" has been deleted successfully!`,
        type: 'success'
      });
      
      // Notify parent component to refresh the events list
      if (onEventDeleted) {
        onEventDeleted(eventId);
      }
      
    } catch (error) {
      console.error('Error deleting event:', error);
      setToast({
        show: true,
        message: `Failed to delete event: ${error.message || 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  const handleCloseToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Toggle dropdown
  const handleDropdownToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowDropdown(!showDropdown);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#1A28BF';
      case 'active':
        return '#1ABF46';
      case 'closed':
        return '#BF1A1A';
      case 'cancelled':
        return '#9CA3AF';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-90">
      {/* Header with icon, title and menu */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <img src={event?.icon || "/assets/ManageEvent/Popcorn.svg"} alt="Event Icon"/>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {event?.title || "Event Title"}
          </h2>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleDropdownToggle}
            className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src="/assets/ManageEvent/dots.svg" alt="More Options"/>
          </button>
          
          {/* Enhanced Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button 
                onClick={handleEditEvent}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2 border-b border-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Event
              </button>
              <button 
                onClick={handleDeleteEvent}
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getStatusColor(event?.status) }}
        ></div>
        <span className="text-sm font-medium text-gray-600 capitalize">
          {event?.status || 'upcoming'}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <img src="/assets/ManageEvent/Cash.svg" alt="Ticket Price" />
          <span className="text-green-600 font-semibold">
            {event?.price || "0LKR"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <img src="/assets/ManageEvent/Flight Seat.svg" alt="Seats Available" />
          <span className="text-purple-500 font-semibold">
            {event?.available || "0"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <img src="/assets/ManageEvent/Ticket.svg" alt="Tickets Sold" /> 
          <span className="text-red-500 font-semibold">
            {event?.sold || "0"}
          </span>
        </div>
        
      </div>

      {/* Separator */}
      <div className="border-t border-[#666666] mb-4"></div>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        <div className="flex">
          <span className="text-gray-600 text-sm font-medium w-16">Venue :</span>
          <span className="text-gray-900 text-sm font-medium">
            {event?.venue || "Open Air Theater, Colombo"}
          </span>
        </div>
        <div className="flex">
          <span className="text-gray-600 text-sm font-medium w-16">Date :</span>
          <span className="text-gray-900 text-sm font-medium">
            {event?.date || "12 April 2025"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex">
            <span className="text-gray-600 text-sm font-medium w-16">Time :</span>
            <span className="text-gray-900 text-sm font-medium">
              {event?.time || "09.00PM to 11.30PM"}
            </span>
          </div>
          
          {/* Arrow Button */}
          <button 
            onClick={handleViewDetails}
            className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <img src="/assets/ManageEvent/Back Arrow.svg" alt="Arrow" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        itemName={event?.title || 'this event'}
        message={`You are about to permanently delete this event. This will remove all associated data including bookings, analytics, and attendee information.`}
        isDeleting={isDeleting}
      />

      {/* Success/Error Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={handleCloseToast}
        duration={4000}
      />
    </div>
  );
}
