export default function CategoryCard({ category, onEdit, onDelete, onToggleStatus }) {
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

  const getCategoryColor = (name) => {
    const colors = {
      'Live Music': 'from-purple-500 to-pink-600',
      'EDM Music': 'from-blue-500 to-cyan-600',
      'Innovation': 'from-yellow-500 to-orange-600',
      'Food Festivals': 'from-red-500 to-pink-600',
      'Sports': 'from-green-500 to-blue-600',
      'Art': 'from-purple-500 to-indigo-600',
      'Technology': 'from-gray-500 to-blue-600'
    };
    return colors[name] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-900 text-green-300 border-green-700' 
      : 'bg-red-900 text-red-300 border-red-700';
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
      {/* Category Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor(category.name)} p-6 text-center`}>
        <div className="text-4xl mb-3">{getCategoryIcon(category.name)}</div>
        <h3 className="text-white text-xl font-bold">{category.name}</h3>
        <p className="text-white/80 text-sm mt-1">{category.description}</p>
      </div>

      {/* Category Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{category.eventCount}</p>
            <p className="text-gray-400 text-sm">Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{category.totalBookings}</p>
            <p className="text-gray-400 text-sm">Bookings</p>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(category.isActive)}`}>
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="text-gray-400 text-sm">
            Created {new Date(category.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          
          <button
            onClick={() => onToggleStatus(category.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category.isActive
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {category.isActive ? 'Deactivate' : 'Activate'}
          </button>
          
          <button
            onClick={() => onDelete(category)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
