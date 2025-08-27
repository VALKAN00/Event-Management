export default function DeleteConfirmModal({ user, isOpen, onClose, onConfirm, loading }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#111111] rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Delete User</h3>
            <p className="text-sm text-gray-400">This action cannot be undone</p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{user.name || 'Unknown User'}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 mb-6">
          <h4 className="text-red-300 font-medium mb-2">Warning</h4>
          <p className="text-red-200 text-sm">
            Are you sure you want to delete this user? This will permanently remove:
          </p>
          <ul className="text-red-200 text-sm mt-2 space-y-1">
            <li>• User account and profile</li>
            <li>• All associated data</li>
            <li>• Event bookings and history</li>
            <li>• Access to the system</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
}
