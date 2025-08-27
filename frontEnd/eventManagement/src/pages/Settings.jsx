import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/authAPI";
import authAPI from "../api/authAPI";

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
    bio: "",
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    eventReminders: true,
    weeklyReports: false,
    marketingEmails: false,
  });


  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.profileDetails?.phone || "",
        bio: user.profileDetails?.bio || "",
      });
    }
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would call your user update API
      showMessage("success", "Profile updated successfully!");
    } catch {
      showMessage("error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showMessage("success", "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showMessage("error", error.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
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
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
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
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
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
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
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
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
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
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
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

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-6">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg"
                >
                  <div>
                    <h3 className="text-white font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {key === "emailNotifications" &&
                        "Receive notifications via email"}
                      {key === "pushNotifications" &&
                        "Receive push notifications in browser"}
                      {key === "smsNotifications" &&
                        "Receive notifications via SMS"}
                      {key === "eventReminders" &&
                        "Get reminders about upcoming events"}
                      {key === "weeklyReports" &&
                        "Receive weekly summary reports"}
                      {key === "marketingEmails" &&
                        "Receive promotional emails"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [key]: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        )}      
      </div>
    </div>
  );
}
