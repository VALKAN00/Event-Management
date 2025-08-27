export default function CategoryFilters({ filters, onFilterChange, onClearFilters }) {
  const predefinedCategories = [
    'Live Music',
    'EDM Music', 
    'Innovation',
    'Food Festivals',
    'Sports',
    'Art',
    'Technology'
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'events_desc', label: 'Most Events' },
    { value: 'events_asc', label: 'Least Events' },
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' }
  ];

  const hasActiveFilters = () => {
    return filters.search || 
           filters.category !== 'all' || 
           filters.status !== 'all' || 
           filters.sortBy !== 'name';
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-700 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search categories..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="min-w-[200px]">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">All Categories</option>
            {predefinedCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="min-w-[150px]">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="min-w-[180px]">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="px-4 py-3 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-xl transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-400 text-sm">Active filters:</span>
            
            {filters.search && (
              <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm border border-blue-700">
                Search: "{filters.search}"
              </span>
            )}
            
            {filters.category !== 'all' && (
              <span className="px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-sm border border-purple-700">
                Category: {filters.category}
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm border border-green-700">
                Status: {filters.status}
              </span>
            )}
            
            {filters.sortBy !== 'name' && (
              <span className="px-3 py-1 bg-orange-900 text-orange-300 rounded-full text-sm border border-orange-700">
                Sort: {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
