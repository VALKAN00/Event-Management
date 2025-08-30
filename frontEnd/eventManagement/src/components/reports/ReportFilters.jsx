import React from 'react';

const ReportFilters = ({ filters, onFilterChange, onExport }) => {
  const periodOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const exportOptions = [
    { 
      value: 'complete', 
      label: 'Complete Report',
      description: 'All data: events, revenue, attendees, venues, organizers'
    },
    { 
      value: 'events', 
      label: 'Event Performance',
      description: 'Event names, categories, venues, capacity, ticket sales, revenue'
    },
    { 
      value: 'attendees', 
      label: 'Attendee Report',
      description: 'Attendee details, event names, demographics, ticket types'
    },
    { 
      value: 'revenue', 
      label: 'Revenue Report',
      description: 'Event revenue, ticket sales, sponsorships, costs, ROI'
    },
    { 
      value: 'dashboard', 
      label: 'Dashboard Summary',
      description: 'High-level overview with key metrics and totals'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Period Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <select
            value={filters.period || 'month'}
            onChange={(e) => onFilterChange('period', e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Date Range */}
        {filters.period === 'custom' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Export Section */}
        <div className={filters.period === 'custom' ? 'md:col-span-2' : 'md:col-span-4'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Reports
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={filters.exportType || 'complete'}
                onChange={(e) => onFilterChange('exportType', e.target.value)}
                className="flex-1 py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {exportOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onExport(filters.exportType || 'complete')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
            
            {/* Export Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-700">
                📊 <strong>Includes:</strong> {exportOptions.find(opt => opt.value === (filters.exportType || 'complete'))?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {filters.period && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Analysis Period: <span className="font-medium text-gray-900">
              {periodOptions.find(p => p.value === filters.period)?.label}
            </span></span>
            <span>Last Updated: <span className="font-medium text-gray-900">
              {new Date().toLocaleString()}
            </span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;
