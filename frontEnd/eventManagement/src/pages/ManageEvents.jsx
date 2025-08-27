import EventCard from "../components/ManageEvents/EventCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import eventsAPI from "../api/eventsAPI";
import { useAuth } from "../context/AuthContext";

export default function ManageEvents() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  
  // Category icon mapping
  const categoryIcons = {
    "Live Music": "/assets/ManageEvent/Microphone.svg",
    "EDM Music": "/assets/ManageEvent/Rock Music.svg",
    "Innovation": "/assets/ManageEvent/Laptop.svg",
    "Food Festivals": "/assets/ManageEvent/Popcorn.svg",
    "Sports": "/assets/ManageEvent/Sedan.svg",
    "Art": "/assets/ManageEvent/Paint Palette.svg",
    "Technology": "/assets/ManageEvent/Laptop.svg",
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {};
        // Only add organizer filter if user is available
        if (user?.id) {
          params.organizer = user.id;
        }
        
        const response = await eventsAPI.getEvents(params);
        console.log('API Response:', response); // Debug log
        
        // Handle the backend response structure: { success: true, data: { events: [], pagination: {} } }
        let eventsData = [];
        if (response.success && response.data && Array.isArray(response.data.events)) {
          eventsData = response.data.events;
        } else if (Array.isArray(response.events)) {
          // Fallback for direct events array
          eventsData = response.events;
        } else if (Array.isArray(response.data)) {
          // Fallback for direct data array
          eventsData = response.data;
        } else if (Array.isArray(response)) {
          // Fallback for direct response array
          eventsData = response;
        }
        
        console.log('Processed events data:', eventsData); // Debug log
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if not in auth loading state
    if (!authLoading) {
      fetchEvents();
    }
  }, [user, authLoading]);

  // Refresh events function for error retry
  const refreshEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (user?.id) {
        params.organizer = user.id;
      }
      
      const response = await eventsAPI.getEvents(params);
      console.log('Refresh API Response:', response); // Debug log
      
      // Handle the backend response structure: { success: true, data: { events: [], pagination: {} } }
      let eventsData = [];
      if (response.success && response.data && Array.isArray(response.data.events)) {
        eventsData = response.data.events;
      } else if (Array.isArray(response.events)) {
        // Fallback for direct events array
        eventsData = response.events;
      } else if (Array.isArray(response.data)) {
        // Fallback for direct data array
        eventsData = response.data;
      } else if (Array.isArray(response)) {
        // Fallback for direct response array
        eventsData = response;
      }
      
      setEvents(eventsData);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match component format
  const transformEventData = (apiEvent) => {
    try {
      // Validate that apiEvent exists and has required properties
      if (!apiEvent || typeof apiEvent !== 'object') {
        console.warn('Invalid apiEvent:', apiEvent);
        return null;
      }

      const category = apiEvent.categories?.[0] || "Technology";
      const icon = categoryIcons[category] || "/assets/ManageEvent/Popcorn.svg";
      
      // Format date
      const eventDate = new Date(apiEvent.date || new Date());
      const formattedDate = eventDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      
      // Format time
      const timeString = `${apiEvent.time?.start || "09:00"} to ${apiEvent.time?.end || "11:00"}`;
      
      // Format venue
      const venue = `${apiEvent.venue?.name || "Unknown Venue"}, ${apiEvent.venue?.city || "Colombo"}`;
      
      // Calculate status based on current date
      const now = new Date();
      const isEventPast = eventDate < now;
      const isEventToday = eventDate.toDateString() === now.toDateString();
      
      let status = apiEvent.status || "upcoming";
      if (isEventPast && status !== "cancelled") {
        status = "closed";
      } else if (isEventToday && status === "upcoming") {
        status = "active";
      }
      
      return {
        id: apiEvent._id || apiEvent.id || Math.random().toString(36),
        title: apiEvent.name || "Untitled Event",
        date: formattedDate,
        time: timeString,
        venue: venue,
        icon: icon,
        price: `${apiEvent.pricing?.ticketPrice || 0}${apiEvent.pricing?.currency || "LKR"}`,
        sold: apiEvent.seatConfiguration?.bookedSeats?.toString() || "0",
        available: apiEvent.seatConfiguration?.availableSeats?.toString() || "0",
        status: status,
        originalData: apiEvent
      };
    } catch (error) {
      console.error('Error transforming event data:', error, apiEvent);
      return null;
    }
  };

  // Filter and sort events
  const getFilteredAndSortedEvents = () => {
    // Ensure events is an array before processing
    if (!Array.isArray(events)) {
      console.warn('Events is not an array:', events);
      return [];
    }

    try {
      let filteredEvents = events.map(transformEventData).filter(event => event !== null);

      // Apply search filter
      if (searchTerm) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (filterStatus !== "all") {
        filteredEvents = filteredEvents.filter(event => event.status === filterStatus);
      }

      // Apply date filter
      if (selectedDate) {
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.originalData.date);
          const filterDate = new Date(selectedDate);
          return eventDate.toDateString() === filterDate.toDateString();
        });
      }

      // Apply sorting
      filteredEvents.sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(a.originalData.date) - new Date(b.originalData.date);
          case "status":
            return a.status.localeCompare(b.status);
          case "name":
            return a.title.localeCompare(b.title);
          case "price":
            return parseFloat(a.price) - parseFloat(b.price);
          default:
            return 0;
        }
      });

      return filteredEvents;
    } catch (error) {
      console.error('Error in getFilteredAndSortedEvents:', error);
      return [];
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleFilterToggle = () => {
    // Cycle through filter options
    const statuses = ["all", "upcoming", "active", "closed"];
    const currentIndex = statuses.indexOf(filterStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setFilterStatus(statuses[nextIndex]);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleDatePick = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handle event deletion callback from EventCard
  const handleEventDeleted = (deletedEventId) => {
    // Remove the deleted event from the local state
    setEvents(prevEvents => 
      prevEvents.filter(event => 
        (event._id || event.id) !== deletedEventId
      )
    );
  };

  const filteredEvents = getFilteredAndSortedEvents();

  return (
    <div className="min-h-screen mb-4">
      {/* Header Section */}
      <div className="p-4 mb-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Event Management Section
            {user?.name && <span className="text-lg font-normal text-gray-600 ml-2">- Welcome, {user.name}!</span>}
          </h1>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Filter Button */}
            <button 
              onClick={handleFilterToggle}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-600"
              >
                <path
                  d="M3 6H21L18 12V18L15 21V12L3 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Filter: {filterStatus === "all" ? "All Events" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-400"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-64 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="cursor-pointer absolute left-3 top-3 text-gray-400"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* New Event Button */}
            <button
              onClick={handleCreateEvent}
              className="cursor-pointer flex items-center gap-2 px-4 py-2  text-white border-2 border-blue-600  hover:bg-blue-100 transition-colors"
              style={{ borderRadius: "15px", height: "46px" }}
            >
              <img src="/assets/ManageEvent/Plus.svg" alt="Add" />
              <span className="font-medium text-[#0122F5]">New Event</span>
            </button>

            {/* Attendee Insights Button */}
            <button
              onClick={() => navigate('/attendee-insights')}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-orange-400 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              style={{ borderRadius: "15px", height: "46px" }}
            >
              <span className="font-medium">Attendee Insights</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-orange-400"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="date">Date</option>
                <option value="status">Status</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Pick Date */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDatePick}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading events...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 max-w-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">Error loading events</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={refreshEvents}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Events Content */}
      {!loading && !error && (
        <>
          {/* Status Indicators - Aligned with card columns */}
          <div className="flex items-center justify-center mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-[#1A28BF] rounded-full"></div>
                <span className="text-gray-700 font-medium">
                  Up-Coming Events ({filteredEvents.filter(e => e.status === 'upcoming').length})
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-[#1ABF46] rounded-full"></div>
                <span className="text-gray-700 font-medium">
                  Active Events ({filteredEvents.filter(e => e.status === 'active').length})
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-[#BF1A1A] rounded-full"></div>
                <span className="text-gray-700 font-medium">
                  Closed Events ({filteredEvents.filter(e => e.status === 'closed').length})
                </span>
              </div>
            </div>
          </div>

          {/* Events Grid - 3 cards per row */}
          <div className="flex items-center justify-center">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {filteredEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEventDeleted={handleEventDeleted}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedDate || filterStatus !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Get started by creating your first event"}
                </p>
                {(!searchTerm && !selectedDate && filterStatus === "all") && (
                  <div className="mt-6">
                    <button
                      onClick={handleCreateEvent}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create New Event
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
