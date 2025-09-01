import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventsAPI from '../api/eventsAPI';

export default function SearchEventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) {
                setError('No event ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Try to get event details from API
                const response = await eventsAPI.getEventById(id);
                console.log('Event details response:', response);

                // Handle the response structure
                let eventData = null;
                if (response.success && response.data) {
                    eventData = response.data;
                } else if (response._id || response.id) {
                    eventData = response;
                } else {
                    throw new Error('Invalid response structure');
                }

                if (eventData) {
                    setEvent(eventData);
                } else {
                    throw new Error('Event not found');
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError(error.message || 'Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleBookEvent = () => {
        // Navigate to booking page with event ID as query parameter
        navigate(`/booking-tickets?eventId=${id}`);
    };

    const handleBackToSearch = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Event</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={handleBackToSearch}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Event Not Found</h2>
                    <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
                    <button
                        onClick={handleBackToSearch}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const eventDate = new Date(event.date);
    const isPastEvent = eventDate < new Date();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBackToSearch}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Search
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
                        <div></div> {/* Spacer for center alignment */}
                    </div>
                </div>
            </div>

            {/* Event Details Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Event Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12 text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 text-black">
                                <h1 className="text-4xl font-bold mb-4">
                                    {event.name || event.title || 'Untitled Event'}
                                </h1>
                                <p className="text-xl opacity-90 mb-4">
                                    {event.description || 'No description available'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {event.categories && event.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {category}
                                        </span>
                                    ))}
                                    {isPastEvent && (
                                        <span className="bg-red-500 bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium">
                                            Past Event
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Information Grid */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Date & Time */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                    Date & Time
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-700">
                                        {eventDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                {event.time && (
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-700">
                                            {event.time.start} - {event.time.end}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Venue */}
                            {event.venue && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Venue
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-700 font-medium">{event.venue.name}</span>
                                        </div>
                                        <div className="ml-8 text-gray-600">
                                            <p>{event.venue.address}</p>
                                            <p>{event.venue.city}, {event.venue.country}</p>
                                        </div>
                                        {event.venue.capacity && (
                                            <div className="ml-8 text-sm text-gray-500">
                                                Capacity: {event.venue.capacity} people
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Pricing */}
                            {event.pricing && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Pricing
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        <span className="text-2xl font-bold text-green-600">
                                            {event.pricing.currency} {event.pricing.ticketPrice}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Seating */}
                            {event.seatConfiguration && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Seating
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Total Seats:</span>
                                            <span className="font-medium">{event.seatConfiguration.totalSeats}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Available Seats:</span>
                                            <span className="font-medium text-green-600">
                                                {event.seatConfiguration.availableSeats}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleBackToSearch}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Back to Search
                                </button>
                                {!isPastEvent && event.seatConfiguration?.availableSeats > 0 ? (
                                    <button
                                        onClick={handleBookEvent}
                                        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                        <span>Book This Event</span>
                                    </button>
                                ) : isPastEvent ? (
                                    <button
                                        disabled
                                        className="px-8 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                                    >
                                        Event Has Ended
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="px-8 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                                    >
                                        Sold Out
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}