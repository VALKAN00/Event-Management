import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import eventsAPI from '../api/eventsAPI';
import '../css/SearchSeeAll.css';

const SearchSeeAll = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(9); // Show 9 events per page
    const [totalEvents, setTotalEvents] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Extract search query from URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const query = urlParams.get('search') || '';
        setSearchQuery(query);
    }, [location.search]);

    // Fetch events based on search query
    useEffect(() => {
        const fetchEvents = async () => {
            if (!searchQuery.trim()) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await eventsAPI.searchEvents(searchQuery);
                console.log('Search API response:', response);
                
                // Handle the response structure - events might be in response.data.events or response.data
                const eventsList = response.data?.events || response.data || [];
                setEvents(eventsList);
                setTotalEvents(eventsList.length);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setEvents([]);
                setTotalEvents(0);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [searchQuery]);

    // Calculate pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(totalEvents / eventsPerPage);

    const handleEventClick = (eventId) => {
        navigate(`/search-event-details/${eventId}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="search-see-all">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Searching for events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-see-all">
            <div className="search-header">
                <h1>Search Results</h1>
                {searchQuery && (
                    <p className="search-query">
                        Showing results for: <span className="query-text">"{searchQuery}"</span>
                    </p>
                )}
                <p className="results-count">
                    {totalEvents} {totalEvents === 1 ? 'event' : 'events'} found
                </p>
            </div>

            {events.length === 0 ? (
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No events found</h3>
                    <p>We couldn't find any events matching your search criteria.</p>
                    <button 
                        className="back-button"
                        onClick={() => navigate('/')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <>
                    <div className="events-grid">
                        {currentEvents.map((event) => (
                            <div 
                                key={event._id} 
                                className="event-card"
                                onClick={() => handleEventClick(event._id)}
                            >
                                <div className="event-image">
                                    {event.imageUrl ? (
                                        <img src={event.imageUrl} alt={event.name || event.title} />
                                    ) : (
                                        <div className="placeholder-image">
                                            <span>📅</span>
                                        </div>
                                    )}
                                </div>
                                <div className="event-content">
                                    <h3 className="event-title">
                                        {event.name || event.title}
                                    </h3>
                                    <p className="event-description">
                                        {event.description ? 
                                            (event.description.length > 120 ? 
                                                `${event.description.substring(0, 120)}...` : 
                                                event.description
                                            ) : 
                                            'No description available'
                                        }
                                    </p>
                                    <div className="event-details">
                                        <div className="event-date">
                                            <span className="icon">📅</span>
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="event-location">
                                            <span className="icon">📍</span>
                                            <span>{event.location || 'Location TBA'}</span>
                                        </div>
                                        <div className="event-price">
                                            <span className="icon">💰</span>
                                            <span>${event.price || '0'}</span>
                                        </div>
                                    </div>
                                    <div className="event-category">
                                        <span className="category-tag">
                                            {event.category || 'General'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            
                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <button
                                            key={pageNumber}
                                            className={`pagination-number ${
                                                currentPage === pageNumber ? 'active' : ''
                                            }`}
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button 
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchSeeAll;