
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../api/authAPI';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Add search functionality here
        console.log('Search query:', searchQuery);
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
                <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="relative flex items-center">
                        <img 
                            src="/assets/header/Search.png" 
                            alt="Search" 
                            className="cursor-pointer absolute left-3 w-4 h-4 opacity-60"
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-white text-black pl-10 pr-4 py-2 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </form>

                {/* Notification Icon */}
                <button className="cursor-pointer relative bg-white p-2 hover:bg-blue-600 rounded-full transition-all duration-200 group">
                    <img 
                        src="/assets/header/Notification.png" 
                        alt="Notifications" 
                        className="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-200"
                    />
                    {/* Notification badge */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        3
                    </span>
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
