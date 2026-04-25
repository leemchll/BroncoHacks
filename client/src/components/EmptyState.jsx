export default function EmptyState({ searchQuery, selectedCategory, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f0f7ef' }}>
        <svg className="w-10 h-10" style={{ color: '#7FB37A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No listings found</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        {searchQuery
          ? `No results for "${searchQuery}". Try a different search or adjust your filters.`
          : 'No listings match your current filters. Try adjusting them to see more.'}
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: '#5C9657' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4a7a45'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5C9657'}
      >
        Clear all filters
      </button>
    </div>
  );
}