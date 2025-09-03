import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import eventsAPI from "../../api/eventsAPI";
import EventQRCode from "../booking/EventQRCode";

export default function EventDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth(); // Uncommented for role-based access control
  
  // State management
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Get event ID from params or location state
  const eventId = params.id || location.state?.eventId || location.state?.event?.id;
  const shouldStartInEditMode = location.state?.editMode === true;

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) {
        setError("No event ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await eventsAPI.getEventById(eventId);
        console.log('Event details response:', response); // Debug log
        
        // Handle the response structure
        let eventData = null;
        if (response.success && response.data) {
          eventData = response.data;
        } else if (response._id || response.id) {
          // Direct event object
          eventData = response;
        }
        
        if (eventData) {
          setEvent(eventData);
          setEditFormData({
            name: eventData.name || '',
            description: eventData.description || '',
            venue: {
              name: eventData.venue?.name || '',
              address: eventData.venue?.address || '',
              city: eventData.venue?.city || ''
            },
            pricing: {
              ticketPrice: eventData.pricing?.ticketPrice || 0,
              currency: eventData.pricing?.currency || 'LKR'
            }
          });
          
          // Auto-start edit mode if requested from EventCard (only for admins)
          if (shouldStartInEditMode && user?.role === 'admin') {
            setIsEditing(true);
          }
        } else {
          throw new Error('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        
        // Handle specific error messages
        let errorMessage = err.message || 'Failed to fetch event details';
        if (err.message === 'Event date must be in the future') {
          errorMessage = 'This event has a past date. Event viewing restrictions may apply.';
          console.warn('Attempted to fetch past event with ID:', eventId);
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, shouldStartInEditMode, user?.role]);

  // Additional state for edit validation and success messages
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle edit form changes
  const handleEditChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      setEditError(null);
      setEditSuccess(null);
      
      // Validate required fields
      if (!editFormData.name?.trim()) {
        setEditError('Event name is required');
        return;
      }
      
      if (!editFormData.description?.trim()) {
        setEditError('Event description is required');
        return;
      }
      
      if (!editFormData.venue?.name?.trim()) {
        setEditError('Venue name is required');
        return;
      }
      
      if (!editFormData.venue?.city?.trim()) {
        setEditError('Venue city is required');
        return;
      }
      
      if (!editFormData.pricing?.ticketPrice || editFormData.pricing.ticketPrice < 0) {
        setEditError('Valid ticket price is required');
        return;
      }
      
      const updateData = {
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        venue: {
          ...event.venue, // Keep existing venue data
          name: editFormData.venue.name.trim(),
          city: editFormData.venue.city.trim(),
          address: editFormData.venue.address?.trim() || event.venue?.address
        },
        pricing: {
          ...event.pricing, // Keep existing pricing data
          ticketPrice: parseFloat(editFormData.pricing.ticketPrice),
          currency: editFormData.pricing.currency || event.pricing?.currency || 'LKR'
        }
      };
      
      console.log('Updating event with data:', updateData);
      
      const response = await eventsAPI.updateEvent(eventId, updateData);
      console.log('Update response:', response);
      
      // Update local state with response data
      if (response.success && response.data) {
        setEvent(response.data);
        setEditSuccess('Event updated successfully!');
      } else if (response._id || response.id) {
        // Direct event object response
        setEvent(response);
        setEditSuccess('Event updated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
      
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setEditSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating event:', err);
      setEditError(err.message || 'Failed to update event');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
    setEditSuccess(null);
    
    // Reset form data to original event data
    if (event) {
      setEditFormData({
        name: event.name || '',
        description: event.description || '',
        venue: {
          name: event.venue?.name || '',
          address: event.venue?.address || '',
          city: event.venue?.city || ''
        },
        pricing: {
          ticketPrice: event.pricing?.ticketPrice || 0,
          currency: event.pricing?.currency || 'LKR'
        }
      });
    }
  };

  // Handle starting edit mode
  const handleStartEdit = () => {
    // Only allow admins to edit
    if (user?.role !== 'admin') {
      console.warn('Only admin users can edit events');
      return;
    }
    
    setIsEditing(true);
    setEditError(null);
    setEditSuccess(null);
    
    // Initialize edit form data with current event data
    if (event) {
      setEditFormData({
        name: event.name || '',
        description: event.description || '',
        venue: {
          name: event.venue?.name || '',
          address: event.venue?.address || '',
          city: event.venue?.city || ''
        },
        pricing: {
          ticketPrice: event.pricing?.ticketPrice || 0,
          currency: event.pricing?.currency || 'LKR'
        }
      });
    }
  };

  // Transform API event data to display format
  const getEventDisplayData = () => {
    if (!event) {
      // Default event data if none provided (fallback)
      return {
        title: "Loading...",
        date: "Loading...",
        time: "Loading...",
        venue: "Loading...",
        description: "Loading...",
        price: "0LKR",
        totalSeats: "0",
        availableSeats: "0",
        popularity: "Medium",
        expectedAttendance: "0",
        tags: ["Loading..."],
      };
    }

    // Format event data from API
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const timeString = `${event.time?.start || "09:00"} - ${event.time?.end || "18:00"}`;
    const venue = `${event.venue?.name || "Unknown Venue"}, ${event.venue?.city || "Unknown City"}`;
    const price = `${event.pricing?.ticketPrice || 0}${event.pricing?.currency || "LKR"}`;
    
    // Calculate popularity based on booking percentage
    const totalSeats = event.seatConfiguration?.totalSeats || 0;
    const bookedSeats = event.seatConfiguration?.bookedSeats || 0;
    const occupancyRate = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;
    
    let popularity = "Low";
    if (occupancyRate > 70) popularity = "High";
    else if (occupancyRate > 40) popularity = "Medium";
    
    return {
      title: event.name || "Untitled Event",
      date: formattedDate,
      time: timeString,
      venue: venue,
      description: event.description || "No description available",
      price: price,
      totalSeats: (totalSeats || 0).toString(),
      availableSeats: (event.seatConfiguration?.availableSeats || 0).toString(),
      popularity: `${popularity} Popularity`,
      expectedAttendance: `+${totalSeats || 0}`,
      tags: event.tags || event.categories || ["#Event"],
    };
  };

  const eventData = getEventDisplayData();

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
      className="w-4 h-4 sm:w-6 sm:h-6 rounded-md mx-0.5 my-0.5"
      style={{
        backgroundColor: getSeatColor(status),
        transition: "all 0.2s ease",
      }}
    />
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-4 border-b border-gray-200 relative">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer absolute left-4 sm:left-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <img
            src="/assets/EventDetails/Back Arrow.svg"
            alt="Back"
          />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Event Details</h1>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading event details...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 max-w-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">Error loading event</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Event Content */}
      {!loading && !error && event && (
        <div className="p-4 sm:p-6">
          {/* Success Message */}
          {editSuccess && (
            <div className="mb-4 bg-green-50 border border-green-300 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 font-medium">{editSuccess}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {editError && (
            <div className="mb-4 bg-red-50 border border-red-300 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-medium">{editError}</p>
              </div>
            </div>
          )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Event Details */}
          <div className="flex-1 space-y-4">
            {/* Top Row - Event Name and Event Date */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={isEditing ? editFormData.name : eventData.title}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm ${
                      isEditing ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                    readOnly={!isEditing}
                    placeholder={isEditing ? "Enter event name" : ""}
                  />
                  {!isEditing && (
                    <img
                      src="/assets/EventDetails/Pen.svg"
                      alt="Edit"
                      className="absolute right-3 top-3 w-4 h-4"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 sm:w-72 sm:flex-none">
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
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Venue
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={isEditing ? `${editFormData.venue?.name || ''}, ${editFormData.venue?.city || ''}` : eventData.venue}
                    onChange={(e) => {
                      if (isEditing) {
                        const parts = e.target.value.split(', ');
                        const venueName = parts[0] || '';
                        const venueCity = parts.slice(1).join(', ') || parts[1] || '';
                        handleEditChange('venue.name', venueName);
                        handleEditChange('venue.city', venueCity);
                      }
                    }}
                    className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm ${
                      isEditing ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                    readOnly={!isEditing}
                    placeholder={isEditing ? "Venue Name, City" : ""}
                  />
                  {!isEditing && (
                    <img
                      src="/assets/EventDetails/Location.svg"
                      alt="Location"
                      className="absolute right-3 top-3 w-4 h-4"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 sm:w-72 sm:flex-none">
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
                value={isEditing ? editFormData.description : eventData.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
                className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 h-24 resize-none text-sm ${
                  isEditing ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                }`}
                readOnly={!isEditing}
                placeholder={isEditing ? "Enter event description" : ""}
              />
            </div>

            {/* Statistics Row - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Ticket Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={isEditing ? `${editFormData.pricing?.ticketPrice || 0}${editFormData.pricing?.currency || 'LKR'}` : eventData.price}
                    onChange={(e) => {
                      if (isEditing) {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        const numericValue = parseFloat(value) || 0;
                        handleEditChange('pricing.ticketPrice', numericValue);
                      }
                    }}
                    className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm ${
                      isEditing ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                    readOnly={!isEditing}
                    placeholder={isEditing ? "Enter price (numbers only)" : ""}
                  />
                  {!isEditing && (
                    <img
                      src="/assets/EventDetails/Price Tag USD.svg"
                      alt="Price"
                      className="absolute right-3 top-3 w-4 h-4"
                    />
                  )}
                </div>
              </div>

              {/* Seat Amount */}
              <div>
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
              <div>
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
              <div>
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
            <div className="flex flex-col lg:flex-row gap-6 ">
              {/* Seat Allocation */}
              <div className="flex-1 lg:w-3/5 bg-gray-50 rounded-lg p-4 border-1 border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Seat Allocation
                </h3>

                {/* Legend */}
                <div className="flex flex-wrap items-center  justify-center gap-4 mb-4">
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
                <div className="flex justify-center overflow-x-auto">
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
              <div className="flex-1 lg:w-2/5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {/* Tags */}
                  <div>
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
                  <div>
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
                <div className="bg-gray-50 rounded-lg flex justify-start items-center" style={{ border: "1px solid #ADADAD" }}>
                  <EventQRCode event={event} size={window.innerWidth < 640 ? 80 : 120} />
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="cursor-pointer w-full sm:flex-1 px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        CANCEL
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="cursor-pointer w-full sm:flex-1 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        {isSaving && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {isSaving ? 'SAVING...' : 'SAVE'}
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Only show EDIT and Attendee Insights buttons for admin users */}
                      {user?.role === 'admin' && (
                        <>
                          <button 
                            onClick={handleStartEdit}
                            className="cursor-pointer w-full sm:flex-1 px-6 py-2 bg-[#CF730A] text-white rounded-lg font-medium hover:bg-[#ac5e05] transition-colors text-sm"
                          >
                            EDIT
                          </button>
                          <button 
                            onClick={() => navigate('/Single_Attendee_Insights', { state: { event: eventData } })}
                            className="cursor-pointer w-full sm:flex-1 px-6 py-2 bg-[#1A6291] text-white rounded-lg font-medium hover:bg-[#175680] transition-colors text-sm"
                          >
                            Attendee Insights
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
