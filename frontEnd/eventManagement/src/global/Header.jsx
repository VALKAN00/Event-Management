
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/authAPI';
import { useNotifications } from '../context/NotificationContext';
import eventsAPI from '../api/eventsAPI';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const { unreadCount } = useNotifications();
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        try {
            // Get current user data
            const user = getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error('Error getting current user:', error);
            setCurrentUser(null);
        }
    }, []);

    // Handle clicks outside of dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search for events when query changes
    useEffect(() => {
        const searchEvents = async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true);
                try {
                    console.log('Searching for:', searchQuery);
                    
                    // Try to search from API first
                    const response = await eventsAPI.searchEvents(searchQuery, { limit: 3 });
                    console.log('API Response:', response);
                    
                    // Handle different response structures
                    let results = [];
                    if (response.data && response.data.events) {
                        results = response.data.events;
                    } else if (response.events) {
                        results = response.events;
                    } else if (Array.isArray(response)) {
                        results = response;
                    }
                    
                    console.log('Search results:', results);
                    
                    // If we have real results from API, use them
                    if (results && results.length > 0) {
                        setSearchResults(results);
                        setShowDropdown(true);
                        console.log('Using real API results');
                    } else {
                        // Only use fake events as absolute fallback
                        console.log('No real results found, using fallback');
                        const fakeEvents = [
                            {
                                _id: 'fake1',
                                name: 'Tech Innovation Summit 2025',
                                description: 'Annual technology conference featuring AI and blockchain innovations',
                                categories: ['Technology'],
                                date: '2025-02-15T10:00:00Z'
                            },
                            {
                                _id: 'fake2', 
                                name: 'Music Festival Extravaganza',
                                description: 'Live music performances from top artists around the world',
                                categories: ['Live Music'],
                                date: '2025-03-20T18:00:00Z'
                            },
                            {
                                _id: 'fake3',
                                name: 'Food & Culture Fair',
                                description: 'Explore diverse cuisines and cultural performances',
                                categories: ['Food Festivals'],
                                date: '2025-04-10T12:00:00Z'
                            }
                        ];
                        
                        // Filter fake events based on search query
                        const filteredFakes = fakeEvents.filter(event => 
                            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
                        ).slice(0, 3);
                        
                        setSearchResults(filteredFakes);
                        setShowDropdown(true);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    
                    // Try to get all events as fallback
                    try {
                        console.log('Trying to get all events as fallback...');
                        const allEventsResponse = await eventsAPI.getEvents();
                        console.log('All events response:', allEventsResponse);
                        
                        const allEvents = allEventsResponse.events || allEventsResponse.data || [];
                        
                        // Filter all events locally
                        const filteredEvents = allEvents.filter(event => 
                            (event.name && event.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
                        ).slice(0, 3);
                        
                        if (filteredEvents.length > 0) {
                            setSearchResults(filteredEvents);
                            setShowDropdown(true);
                            console.log('Using filtered events from getEvents');
                        } else {
                            setSearchResults([]);
                            setShowDropdown(true);
                        }
                    } catch (fallbackError) {
                        console.error('Fallback error:', fallbackError);
                        setSearchResults([]);
                        setShowDropdown(true);
                    }
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        };

        const timeoutId = setTimeout(searchEvents, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search see all page with search query
            navigate(`/search-see-all?search=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
        }
    };

    const handleEventClick = (eventId) => {
        if (eventId.startsWith('fake')) {
            // For fake events, just show an alert for demonstration
            alert(`This is a demo event. In a real app, this would navigate to event details for ${eventId}`);
        } else {
            // Navigate to SearchEventDetails page for all real events
            navigate(`/search-event-details/${eventId}`);
        }
        setShowDropdown(false);
        setSearchQuery('');
    };

    return (
        <div className="bg-[#111111] text-white px-6 py-3 flex items-center justify-between" style={{width:"100%", height:"80px",borderRadius:"20px"}}>
            {/* Left side - User Info */}
            <div className="flex items-center gap-3">
                {currentUser ? (
                    <>
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold leading-tight">
                                Welcome {currentUser.name || 'User'}
                            </h2>
                            <div className="flex items-center gap-2">
                                    {currentUser.role === 'admin' ? 'Admin' : 'User'}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <img 
                            src="/assets/header/Avatar.png" 
                            alt="User Avatar" 
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold leading-tight">Welcome Guest</h2>
                            <p className="text-sm text-gray-300 leading-tight">Please login</p>
                        </div>
                    </>
                )}
            </div>

            {/* Right side - Search and Icons */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative" ref={dropdownRef}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="relative flex items-center">
                            <img 
                                src="/assets/header/Search.png" 
                                alt="Search" 
                                className="cursor-pointer absolute left-3 w-4 h-4 opacity-60"
                            />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-white text-black pl-10 pr-4 py-2 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Search Results Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <>
                                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                                        Top {searchResults.length} results for "{searchQuery}"
                                    </div>
                                    {searchResults.map((event) => (
                                        <div
                                            key={event._id}
                                            onClick={() => handleEventClick(event._id)}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs font-bold">
                                                        {(event.name || event.title) ? (event.name || event.title).charAt(0).toUpperCase() : 'E'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                        {event.name || event.title || 'Untitled Event'}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 truncate">
                                                        {event.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                            {event.categories && event.categories.length > 0 ? event.categories[0] : 'Event'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </span>
                                                        {new Date(event.date) < new Date() && (
                                                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                                                Past Event
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="px-4 py-2 text-center border-t bg-gray-50">
                                        <button
                                            onClick={handleSearchSubmit}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View all results for "{searchQuery}"
                                        </button>
                                    </div>
                                </>
                            ) : searchQuery.trim().length >= 2 && !isSearching ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    <div className="text-sm">No events found for "{searchQuery}"</div>
                                    <div className="text-xs mt-1">Try different keywords or browse all events</div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                {/* Notification Icon */}
                <button 
                    onClick={() => navigate('/notifications')}
                    className="cursor-pointer relative bg-white p-2 hover:bg-blue-600 rounded-full transition-all duration-200 group"
                >
                    <img 
                        src="/assets/header/Notification.png" 
                        alt="Notifications" 
                        className="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-200"
                    />
                    {/* Notification badge */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Event Status Icon */}
                <button className="cursor-pointer p-2 bg-white hover:bg-green-600 rounded-full transition-all duration-200 group">
                    <img 
                        src="/assets/header/Event Accepted.png" 
                        alt="Events" 
                        className="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-200"
                    />
                </button>
            </div>
        </div>
    );
}
