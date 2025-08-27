export default function DeleteConfirmModal({ isOpen, onClose, category, onConfirm }) {
  if (!isOpen || !category) return null;

  const getCategoryIcon = (name) => {
    const icons = {
      'Live Music': '🎤',
      'EDM Music': '🎵',
      'Innovation': '💡',
      'Food Festivals': '🍕',
      'Sports': '⚽',
      'Art': '🎨',
      'Technology': '💻'
    };
    return icons[name] || '📅';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="text-center mb-6">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Delete Category</h2>
          <p className="text-gray-400 mb-4">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
        </div>

        {/* Category Info */}
        <div className="bg-[#111111] rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getCategoryIcon(category.name)}</span>
            <div>
              <h3 className="text-white font-semibold">{category.name}</h3>
              <p className="text-gray-400 text-sm">{category.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-white">{category.eventCount}</p>
              <p className="text-gray-400 text-sm">Events</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">{category.totalBookings}</p>
              <p className="text-gray-400 text-sm">Bookings</p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        {(category.eventCount > 0 || category.totalBookings > 0) && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-red-300 font-medium text-sm">Warning</p>
                <p className="text-red-300 text-sm">
                  This category has associated events and bookings. Deleting it may affect existing data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(category.id)}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            Delete Category
          </button>
        </div>
      </div>
    </div>
  );
}
