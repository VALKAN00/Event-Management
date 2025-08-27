export default function CategoryTable({ categories, onEdit, onDelete, onToggleStatus }) {
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

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-900 text-green-300 border border-green-700">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-900 text-red-300 border border-red-700">
        Inactive
      </span>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-700 text-center">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Categories Found</h3>
        <p className="text-gray-400">No categories match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-6 text-gray-300 font-semibold">Category</th>
              <th className="text-left p-6 text-gray-300 font-semibold">Description</th>
              <th className="text-center p-6 text-gray-300 font-semibold">Events</th>
              <th className="text-center p-6 text-gray-300 font-semibold">Bookings</th>
              <th className="text-center p-6 text-gray-300 font-semibold">Status</th>
              <th className="text-center p-6 text-gray-300 font-semibold">Created</th>
              <th className="text-center p-6 text-gray-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr 
                key={category.id} 
                className={`border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors ${
                  index === categories.length - 1 ? 'border-b-0' : ''
                }`}
              >
                {/* Category Name */}
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                    <div>
                      <h3 className="text-white font-semibold">{category.name}</h3>
                      <p className="text-gray-400 text-sm">ID: {category.id}</p>
                    </div>
                  </div>
                </td>

                {/* Description */}
                <td className="p-6">
                  <p className="text-gray-300 max-w-xs truncate" title={category.description}>
                    {category.description}
                  </p>
                </td>

                {/* Event Count */}
                <td className="p-6 text-center">
                  <span className="text-white font-semibold text-lg">{category.eventCount}</span>
                </td>

                {/* Booking Count */}
                <td className="p-6 text-center">
                  <span className="text-white font-semibold text-lg">{category.totalBookings}</span>
                </td>

                {/* Status */}
                <td className="p-6 text-center">
                  {getStatusBadge(category.isActive)}
                </td>

                {/* Created Date */}
                <td className="p-6 text-center">
                  <span className="text-gray-400 text-sm">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onToggleStatus(category.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        category.isActive
                          ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-900/30'
                          : 'text-green-400 hover:text-green-300 hover:bg-green-900/30'
                      }`}
                      title={category.isActive ? 'Deactivate Category' : 'Activate Category'}
                    >
                      {category.isActive ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={() => onDelete(category)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
