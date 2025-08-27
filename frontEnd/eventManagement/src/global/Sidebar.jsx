import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authAPI from '../api/authAPI';
import LogoutModal from '../components/auth/LogoutModal';
import QuickEventModal from '../components/sidebar/QuickEventModal';
import Toast from '../components/sidebar/Toast';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [openSections, setOpenSections] = useState({
        mainNavigation: true,
        supportManagement: false,
        additionalFeatures: false,
        accountManagement: false
    });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showQuickEventModal, setShowQuickEventModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleItemClick = (path) => {
        navigate(path);
    };

    const handleLogoutConfirm = async () => {
        try {
            setLogoutLoading(true);
            // Call the logout API
            await authAPI.logout();
            // Navigate to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, clear local storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } finally {
            setLogoutLoading(false);
            setShowLogoutModal(false);
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const handleQuickEventClick = () => {
        setShowQuickEventModal(true);
    };

    const handleQuickEventSuccess = () => {
        // Show success message
        setToast({
            message: 'Event created successfully! 🎉',
            type: 'success'
        });
        // Optionally navigate to manage events page after a delay
        setTimeout(() => {
            navigate('/manage-events');
        }, 2000);
    };

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/' || location.pathname === '/dashboard';
        }
        return location.pathname === path;
    };

    const MenuItem = ({ icon, label, path, hasNotification = false }) => {
        const handleClick = () => {
            handleItemClick(path);
        };

        return (
            <button
                onClick={handleClick}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-gray-800 ${
                    isActive(path) ? 'bg-gray-800 border-r-2 border-green-500' : ''
                }`}
            >
                <img src={icon} alt={label} className="w-5 h-5" />
                <span className="text-sm text-white">{label}</span>
                {hasNotification && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
                )}
            </button>
        );
    };

    const SectionHeader = ({ title, isOpen, onToggle }) => (
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-gray-800 transition-colors"
        >
            <span className="text-sm font-medium">{title}</span>
            <svg
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );

    return (
        <div className="bg-[#111111] text-white w-80 min-h-screen flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img 
                        src="/assets/sidebar/logo.png" 
                        alt="EventX Studio Logo" 
                        className="object-contain"
                        style={{ width: "40px", height: "40px" }}
                    />
                    <div>
                        <h1 className="text-lg font-bold">EventX</h1>
                        <p className="text-xs text-gray-400">Studio</p>
                    </div>
                </div>
            </div>

            {/* Quick Add Button */}
            <div className="p-4 flex-shrink-0">
                <button 
                    onClick={handleQuickEventClick}
                    className="cursor-pointer w-full bg-[#282828] hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center gap-3 transition-colors"
                >
                    <div className=" bg-[#C1FF72] flex items-center justify-center"style={{width:"36px", height:"36px", borderRadius:"10px"}}>
                        <span className="text-black text-lg">+</span>
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-semibold">Add Quick Event</div>
                        <div className="text-xs opacity-80">Events</div>
                    </div>
                </button>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 flex flex-col">
                {/* Main Navigation */}
                <div className="border-b border-gray-700 flex-shrink-0">
                    <SectionHeader
                        title="Main Navigation"
                        isOpen={openSections.mainNavigation}
                        onToggle={() => toggleSection('mainNavigation')}
                    />
                    {openSections.mainNavigation && (
                        <div className="pb-2">
                            <MenuItem
                                icon="/assets/sidebar/Control Panel.png"
                                label="Dashboard"
                                path="/dashboard"
                            />
                            <MenuItem
                                icon="/assets/sidebar/Event Accepted.png"
                                label="Manage Events"
                                path="/manage-events"
                            />
                            <MenuItem
                                icon="/assets/sidebar/New Ticket.png"
                                label="Booking & Tickets"
                                path="/booking-tickets"
                            />
                            <MenuItem
                                icon="/assets/sidebar/Collaborating In Circle.png"
                                label="Attendee Insights"
                                path="/attendee-insights"
                            />
                            <MenuItem
                                icon="/assets/sidebar/Statistics.png"
                                label="Analytics & Reports"
                                path="/reports-dashboard"
                            />
                        </div>
                    )}
                </div>

                {/* Support & Management */}
                <div className="border-b border-gray-700 flex-shrink-0">
                    <SectionHeader
                        title="Support & Management"
                        isOpen={openSections.supportManagement}
                        onToggle={() => toggleSection('supportManagement')}
                    />
                    {openSections.supportManagement && (
                        <div className="pb-2">
                            <MenuItem
                                icon="/assets/sidebar/Customer Support.png"
                                label="Contact Support"
                                path="/contact-support"
                            />
                            <MenuItem
                                icon="/assets/sidebar/Add Reminder.png"
                                label="Notifications"
                                path="/notifications"
                                hasNotification={true}
                            />
                            <MenuItem
                                icon="/assets/sidebar/Settings.png"
                                label="Settings"
                                path="/settings"
                            />
                        </div>
                    )}
                </div>

                {/* Additional Features */}
                <div className="border-b border-gray-700 flex-shrink-0">
                    <SectionHeader
                        title="Additional Features"
                        isOpen={openSections.additionalFeatures}
                        onToggle={() => toggleSection('additionalFeatures')}
                    />
                    {openSections.additionalFeatures && (
                        <div className="pb-2">
                            <MenuItem
                                icon="/assets/sidebar/Speaker.png"
                                label="Marketing"
                                path="/marketing"
                            />
                            <MenuItem
                                icon="/assets/sidebar/Opened Folder.png"
                                label="Event Categories"
                                path="/event-categories"
                            />
                        </div>
                    )}
                </div>

                {/* Account Management */}
                <div className="flex-shrink-0">
                    <SectionHeader
                        title="Account Management"
                        isOpen={openSections.accountManagement}
                        onToggle={() => toggleSection('accountManagement')}
                    />
                    {openSections.accountManagement && (
                        <div className="pb-2">
                            <MenuItem
                                icon="/assets/sidebar/Add User Male.png"
                                label="Manage Users"
                                path="/manage-users"
                            />
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="flex items-center gap-4 p-3 w-full text-left rounded-lg hover:bg-red-600 transition-colors group"
                            >
                                <img 
                                    src="/assets/sidebar/Logout.png" 
                                    alt="Logout" 
                                    className="w-5 h-5"
                                />
                                <span className="text-sm text-red-300">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                loading={logoutLoading}
            />

            {/* Quick Event Modal */}
            <QuickEventModal
                isOpen={showQuickEventModal}
                onClose={() => setShowQuickEventModal(false)}
                onSuccess={handleQuickEventSuccess}
            />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
