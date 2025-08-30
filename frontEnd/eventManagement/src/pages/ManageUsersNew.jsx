import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/authAPI";
import { usersAPI } from "../api/usersAPI";
import UserFilters from "../components/ManageUsers/UserFilters";
import UserTable from "../components/ManageUsers/UserTable";
import UserCard from "../components/ManageUsers/UserCard";
import UserModal from "../components/ManageUsers/UserModal";
import DeleteConfirmModal from "../components/ManageUsers/DeleteConfirmModal";

export default function ManageUsers() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [viewMode, setViewMode] = useState("table");

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
  });

  // Message state
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize component with authentication check and data loading
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Get current user for authentication
        const userData = await getCurrentUser();
        setCurrentUser(userData);

        // If user is admin, fetch users from backend
        if (userData?.role === 'admin') {
          await fetchUsers();
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        showMessage("error", "Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch users from backend
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      
      const response = await usersAPI.getAllUsers({
        page: 1,
        limit: 100, // Get all users for now
        search: params.search || filters.search,
        role: params.role || filters.role,
        isActive: params.isActive !== undefined ? params.isActive : 
                 (filters.status === 'active' ? true : 
                  filters.status === 'inactive' ? false : undefined)
      });

      if (response.success) {
        const usersData = response.data.users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          profileDetails: {
            phone: user.profileDetails?.phone || '',
            bio: user.profileDetails?.bio || ''
          }
        }));
        
        setUsers(usersData);
        setFilteredUsers(usersData);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage("error", "Failed to load users from server. Please try again.");
      
      // Keep current users or use empty array
      if (users.length === 0) {
        setUsers([]);
        setFilteredUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    // Status filter
    if (filters.status) {
      const isActive = filters.status === "active";
      filtered = filtered.filter((user) => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  // Calculate user stats
  const userStats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    admins: users.filter((u) => u.role === "admin").length,
    newThisMonth: users.filter((u) => {
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", role: "", status: "" });
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode("create");
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      const newStatus = !user.isActive;

      // Call backend API
      const response = await usersAPI.toggleUserStatus(userId, newStatus);
      
      if (response.success) {
        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isActive: newStatus } : user
          )
        );

        showMessage(
          "success",
          `User ${newStatus ? "activated" : "deactivated"} successfully!`
        );
      } else {
        throw new Error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      showMessage("error", "Failed to update user status. Please try again.");
    }
  };

  const handleSaveUser = async (userData, mode) => {
    try {
      if (mode === "create") {
        // Call backend API to create user
        const response = await usersAPI.createUser({
          ...userData,
          password: userData.password || 'TempPassword123!'
        });

        if (response.success) {
          // Refresh users list
          await fetchUsers();
          showMessage("success", "User created successfully!");
        } else {
          throw new Error(response.message || 'Failed to create user');
        }
      } else {
        // Call backend API to update user
        const response = await usersAPI.updateUser(selectedUser.id, userData);

        if (response.success) {
          // Update local state
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id
                ? {
                    ...user,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    profileDetails: {
                      ...user.profileDetails,
                      phone: userData.phone,
                      bio: userData.bio,
                    },
                  }
                : user
            )
          );
          showMessage("success", "User updated successfully!");
        } else {
          throw new Error(response.message || 'Failed to update user');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error(error.message || "Failed to save user. Please try again.");
    }
  };

  const handleConfirmDelete = async (userId) => {
    try {
      // Call backend API to delete user
      const response = await usersAPI.deleteUser(userId);

      if (response.success) {
        // Remove from local state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setShowDeleteModal(false);
        setSelectedUser(null);
        showMessage("success", "User deleted successfully!");
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showMessage("error", "Failed to delete user. Please try again.");
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-900 text-red-300 border border-red-700 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>
            You don't have permission to access user management. Administrator
            privileges required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#F2F2F2]">
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-[#111111] p-3 rounded-lg">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
            <p className="text-gray-400">
              Manage user accounts, roles, and permissions
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 6h18m-9 8h9"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>

            {/* Add User Button */}
            <button
              onClick={handleCreateUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add User
            </button>
          </div>
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

        {/* Filters */}
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          userStats={userStats}
        />

        {/* User List */}
        {viewMode === "table" ? (
          <UserTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
            loading={loading}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-white">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No users found
                  </h3>
                  <p>
                    No users match your current filters. Try adjusting your
                    search criteria.
                  </p>
                </div>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onToggleStatus={handleToggleUserStatus}
                />
              ))
            )}
          </div>
        )}

        {/* Modals */}
        <UserModal
          user={selectedUser}
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
          mode={modalMode}
        />

        <DeleteConfirmModal
          user={selectedUser}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          loading={false}
        />
      </div>
    </div>
  );
}
