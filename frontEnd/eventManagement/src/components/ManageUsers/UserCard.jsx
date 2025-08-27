import { useState } from 'react';

export default function UserCard({ user, onEdit, onDelete, onToggleStatus }) {
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      await onToggleStatus(user.id);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-900 text-green-300 border-green-700' 
      : 'bg-red-900 text-red-300 border-red-700';
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-900 text-purple-300 border-purple-700' 
      : 'bg-blue-900 text-blue-300 border-blue-700';
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* User Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-medium">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          
          {/* User Info */}
          <div>
            <h3 className="text-white font-semibold text-lg">{user.name || 'Unknown User'}</h3>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.isActive)}`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* User Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Role</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
            {user.role === 'admin' ? 'Administrator' : 'User'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Joined</span>
          <span className="text-white text-sm">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Last Login</span>
          <span className="text-white text-sm">
            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
          </span>
        </div>

        {user.profileDetails?.phone && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Phone</span>
            <span className="text-white text-sm">{user.profileDetails.phone}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Edit
        </button>
        
        <button
          onClick={handleStatusToggle}
          disabled={loading}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            user.isActive
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50`}
        >
          {loading ? 'Loading...' : (user.isActive ? 'Deactivate' : 'Activate')}
        </button>
        
        <button
          onClick={() => onDelete(user)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
