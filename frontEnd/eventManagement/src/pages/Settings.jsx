import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/authAPI";
import authAPI from "../api/authAPI";
import { usersAPI } from "../api/usersAPI";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile form data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.profileDetails?.phone || "",
        });

        // Try to fetch fresh user data from backend
        try {
          const response = await authAPI.getMe();
          if (response.success && response.data) {
            setCurrentUser(response.data);
            setProfileData({
              name: response.data.name || "",
              email: response.data.email || "",
              phone: response.data.profileDetails?.phone || "",
            });
          }
        } catch (error) {
          console.log('Could not fetch fresh user data:', error.message);
          // Continue with cached data, no need to show error to user
        }
      }
    };

    loadUserProfile();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!profileData.name.trim()) {
        showMessage("error", "Name is required");
        return;
      }

      if (!profileData.email.trim()) {
        showMessage("error", "Email is required");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        showMessage("error", "Please enter a valid email address");
        return;
      }

      // Prepare the profile data for the API
      const updateData = {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        profileDetails: {
          phone: profileData.phone.trim(),
        }
      };

      // Call the API to update the profile
      const response = await usersAPI.updateProfile(updateData);
      
      if (response.success) {
        // Update the current user state with the new data
        setCurrentUser(response.data);
        showMessage("success", "Profile updated successfully!");
      } else {
        showMessage("error", response.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage("error", error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwordData.currentPassword.trim()) {
      showMessage("error", "Current password is required!");
      return;
    }

    if (!passwordData.newPassword.trim()) {
      showMessage("error", "New password is required!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters long!");
      return;
    }

    // Check password strength
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(passwordData.newPassword)) {
      showMessage("error", "Password must contain uppercase, lowercase, number, and special character!");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        showMessage("success", "Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showMessage("error", response.message || "Failed to update password.");
      }
    } catch (error) {
      console.error('Password update error:', error);
      showMessage("error", error.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#111111] m-4 rounded-2xl">
      {/* Header */}
      <div className="mb-8  rounded-lg p-3 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-200">
            Manage your account settings and preferences
          </p>
        </div>
        <img
          src="/assets/sidebar/cogwheel.png"
          alt="Settings"
          className="w-20 h-20"
        />
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900 text-green-300 border border-green-700"
              : "bg-red-900 text-red-300 border border-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-[#1a1a1a] p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#2a2a2a] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#232323]"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#111111] rounded-2xl p-8">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Profile Information
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* User Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-medium">
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={
                      currentUser?.role === "admin" ? "Administrator" : "User"
                    }
                    disabled
                    className="w-full bg-[#1a1a1a] text-gray-400 border border-gray-700 rounded-lg px-4 py-3"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Security Settings
            </h2>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <div className="bg-[#2a2a2a] p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">
                  Password Requirements:
                </h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}      
      </div>
    </div>
  );
}
