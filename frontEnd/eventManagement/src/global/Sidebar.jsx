import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authAPI from '../api/authAPI';
import QuickEventModal from '../components/sidebar/QuickEventModal';
import Toast from '../components/sidebar/Toast';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [openSections, setOpenSections] = useState({
        mainNavigation: true,
        supportManagement: false,
        additionalFeatures: false,
        accountManagement: false
    });
    const [showQuickEventModal, setShowQuickEventModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    // Effect to handle user role changes and reset sidebar state if needed
    useEffect(() => {
        // Reset sidebar sections when user changes or when switching between admin/user
        // This ensures clean state when switching accounts
        
        // Reset to default state when user role changes
        setOpenSections({
            mainNavigation: true,
            supportManagement: false,
            additionalFeatures: false,
            accountManagement: false
        });
        
        // Close any open modals when user changes
        setShowQuickEventModal(false);
        setToast(null);
    }, [user?.role, user?.id]); // Depend on both role and id to catch user switches

    // Handle window resize to close mobile menu on larger screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                setIsMobileMenuOpen(false);
            } else {
                // On mobile, always ensure sidebar is not collapsed and main sections are open
                setIsCollapsed(false);
                setOpenSections(prev => ({
                    ...prev,
                    mainNavigation: true,
                    supportManagement: true
                }));
            }
        };

        // Call once on mount to set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleItemClick = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            // Call the logout API
            await authAPI.logout();
            // Use AuthContext logout to properly clear state
            logout();
            // Navigate to login page
            navigate('/login');
        } catch {
            // Even if API call fails, use AuthContext logout and redirect
            logout();
            navigate('/login');
        } finally {
            setLogoutLoading(false);
        }
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
            // Close mobile menu on navigation
            setIsMobileMenuOpen(false);
        };

        return (
            <button
                onClick={handleClick}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-gray-800 ${
                    isActive(path) ? 'bg-gray-800 border-r-2 border-green-500' : ''
                } ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}
                title={isCollapsed && !isMobileMenuOpen ? label : ''}
            >
                <img src={icon} alt={label} className="w-5 h-5 flex-shrink-0" />
                {(!isCollapsed || isMobileMenuOpen) && <span className="text-sm text-white">{label}</span>}
                {hasNotification && (!isCollapsed || isMobileMenuOpen) && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
                )}
                {hasNotification && isCollapsed && !isMobileMenuOpen && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
                )}
            </button>
        );
    };

    const SectionHeader = ({ title, isOpen, onToggle }) => (
        <button
            onClick={isCollapsed && !isMobileMenuOpen ? () => {} : onToggle}
            className={`w-full flex items-center justify-between px-4 py-3 text-white hover:bg-gray-800 transition-colors ${
                isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''
            }`}
            title={isCollapsed && !isMobileMenuOpen ? title : ''}
        >
            {(!isCollapsed || isMobileMenuOpen) && <span className="text-sm font-medium">{title}</span>}
            {isCollapsed && !isMobileMenuOpen && (
                <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
            )}
            {(!isCollapsed || isMobileMenuOpen) && (
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            )}
        </button>
    );

    return (
        <>
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Button */}
            <button
                onClick={() => {
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                    // Ensure main sections are open when mobile menu opens
                    if (!isMobileMenuOpen) {
                        setOpenSections(prev => ({
                            ...prev,
                            mainNavigation: true,
                            supportManagement: true
                        }));
                    }
                }}
                className="fixed top-4 left-4 z-50 bg-[#111111] text-white p-2 rounded-lg lg:hidden"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar */}
            <div className={`
                bg-[#111111] text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out
                ${/* Mobile styles */ ''}
                fixed lg:relative z-50 lg:z-30
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${/* Desktop responsive width */ ''}
                ${isCollapsed && !isMobileMenuOpen ? 'w-16 lg:w-16' : 'w-80 lg:w-80'}
                ${/* Mobile responsive height and scrolling */ ''}
                max-lg:w-80 max-lg:h-screen max-lg:overflow-y-auto
                lg:min-h-screen
            `}>
                {/* Logo Section */}
                <div className={`p-6 border-b border-gray-700 flex-shrink-0 ${isCollapsed && !isMobileMenuOpen ? 'p-4' : ''}`}>
                    <div className={`flex items-center gap-3 ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}>
                        <img 
                            src="/assets/sidebar/logo.svg" 
                            alt="EventX Studio Logo" 
                            className="object-contain flex-shrink-0"
                            style={{ width: "60px", height: "60px" }}
                        />
                        {(!isCollapsed || isMobileMenuOpen) && (
                            <div>
                                <h1 className="text-2xl font-bold">EventX</h1>
                                <p className="text-2xl text-gray-400" style={{ fontFamily: 'Reenie Beanie, cursive' }}>Studio</p>
                            </div>
                        )}
                    </div>
                </div>

            {/* Quick Add Button - Only for Admins */}
            {isAdmin && (
                <div className={`p-4 flex-shrink-0 ${isCollapsed && !isMobileMenuOpen ? 'p-2' : ''}`}>
                    <button 
                        onClick={handleQuickEventClick}
                        className={`cursor-pointer w-full bg-[#282828] hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
                            isCollapsed && !isMobileMenuOpen ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed && !isMobileMenuOpen ? 'Add Quick Event' : ''}
                    >
                        <div className="bg-[#C1FF72] flex items-center justify-center flex-shrink-0" style={{width:"36px", height:"36px", borderRadius:"10px"}}>
                            <span className="text-black text-lg">+</span>
                        </div>
                        {(!isCollapsed || isMobileMenuOpen) && (
                            <div className="text-left">
                                <div className="text-sm font-semibold">Add Quick Event</div>
                                <div className="text-xs opacity-80">Events</div>
                            </div>
                        )}
                    </button>
                </div>
            )}

            {/* Navigation Sections */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Main Navigation */}
                <div className="border-b border-gray-700 flex-shrink-0">
                    <SectionHeader
                        title="Main Navigation"
                        isOpen={openSections.mainNavigation}
                        onToggle={() => toggleSection('mainNavigation')}
                    />
                    {/* Show content when section is open and (not collapsed OR mobile menu is open) */}
                    {openSections.mainNavigation && (!isCollapsed || isMobileMenuOpen) && (
                        <div className="pb-2">
                            {/* Dashboard - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Control Panel.png"
                                    label="Dashboard"
                                    path="/dashboard"
                                />
                            )}
                            <MenuItem
                                icon="/assets/sidebar/Event Accepted.png"
                                label={isAdmin ? "Manage Events" : "Events"}
                                path="/manage-events"
                            />
                            <MenuItem
                                icon="/assets/sidebar/New Ticket.png"
                                label="Booking & Tickets"
                                path="/booking-tickets"
                            />
                            {/* Attendee Insights - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Collaborating In Circle.png"
                                    label="Attendee Insights"
                                    path="/attendee-insights"
                                />
                            )}
                            {/* Analytics & Reports - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Statistics.png"
                                    label="Analytics & Reports"
                                    path="/reports-dashboard"
                                />
                            )}
                        </div>
                    )}
                    {/* Collapsed state - Desktop only (icons only) */}
                    {isCollapsed && !isMobileMenuOpen && (
                        <div className="pb-2">
                            {/* Dashboard - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Control Panel.png"
                                    label="Dashboard"
                                    path="/dashboard"
                                />
                            )}
                            <MenuItem
                                icon="/assets/sidebar/Event Accepted.png"
                                label={isAdmin ? "Manage Events" : "Events"}
                                path="/manage-events"
                            />
                            <MenuItem
                                icon="/assets/sidebar/New Ticket.png"
                                label="Booking & Tickets"
                                path="/booking-tickets"
                            />
                            {/* Attendee Insights - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Collaborating In Circle.png"
                                    label="Attendee Insights"
                                    path="/attendee-insights"
                                />
                            )}
                            {/* Analytics & Reports - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Statistics.png"
                                    label="Analytics & Reports"
                                    path="/reports-dashboard"
                                />
                            )}
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
                    {openSections.supportManagement && (!isCollapsed || isMobileMenuOpen) && (
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
                    {/* Collapsed state - Desktop only */}
                    {isCollapsed && !isMobileMenuOpen && (
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

                {/* Additional Features - Only for Admins */}
                {isAdmin && (
                    <div className="border-b border-gray-700 flex-shrink-0">
                        <SectionHeader
                            title="Additional Features"
                            isOpen={openSections.additionalFeatures}
                            onToggle={() => toggleSection('additionalFeatures')}
                        />
                        {openSections.additionalFeatures && (!isCollapsed || isMobileMenuOpen) && (
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
                        {/* Collapsed state - Desktop only */}
                        {isCollapsed && !isMobileMenuOpen && (
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
                )}

                {/* Account Management */}
                <div className="flex-shrink-0">
                    <SectionHeader
                        title="Account Management"
                        isOpen={openSections.accountManagement}
                        onToggle={() => toggleSection('accountManagement')}
                    />
                    {openSections.accountManagement && (!isCollapsed || isMobileMenuOpen) && (
                        <div className="pb-2">
                            {/* Manage Users - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Add User Male.png"
                                    label="Manage Users"
                                    path="/manage-users"
                                />
                            )}
                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="flex items-center gap-4 p-3 w-full text-left rounded-lg hover:bg-red-600 transition-colors group disabled:opacity-50"
                            >
                                <img 
                                    src="/assets/sidebar/Logout.png" 
                                    alt="Logout" 
                                    className="w-5 h-5"
                                />
                                <span className="text-sm text-red-300">
                                    {logoutLoading ? 'Logging out...' : 'Logout'}
                                </span>
                            </button>
                        </div>
                    )}
                    {/* Collapsed state - Desktop only */}
                    {isCollapsed && !isMobileMenuOpen && (
                        <div className="pb-2">
                            {/* Manage Users - Only for Admins */}
                            {isAdmin && (
                                <MenuItem
                                    icon="/assets/sidebar/Add User Male.png"
                                    label="Manage Users"
                                    path="/manage-users"
                                />
                            )}
                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="flex items-center justify-center p-3 w-full text-left rounded-lg hover:bg-red-600 transition-colors group disabled:opacity-50"
                                title={logoutLoading ? 'Logging out...' : 'Logout'}
                            >
                                <img 
                                    src="/assets/sidebar/Logout.png" 
                                    alt="Logout" 
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
        
        {/* Quick Event Modal - Rendered outside sidebar for full-screen overlay */}
        <QuickEventModal
            isOpen={showQuickEventModal}
            onClose={() => setShowQuickEventModal(false)}
            onSuccess={handleQuickEventSuccess}
        />
        </>
    );
}
