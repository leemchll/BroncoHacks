import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from '../data/listings';

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedConditions,
  onConditionToggle,
  sortBy,
  onSortChange,
  onClearFilters,
  listingCount,
  isOpen,
  onClose,
}) {
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    selectedConditions.length > 0;

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <p className="text-xs text-gray-500 mt-0.5">{listingCount} listings</p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-medium hover:underline"
            style={{ color: '#5C9657' }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2"
          style={{ focusRingColor: '#7FB37A' }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                selectedCategory === cat.id
                  ? 'font-semibold text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={selectedCategory === cat.id ? { backgroundColor: '#7FB37A' } : {}}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
              min="0"
              className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1"
              style={{ focusRingColor: '#7FB37A' }}
            />
          </div>
          <span className="text-gray-400 text-sm">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
              min="0"
              className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {[
            { label: 'Free', min: '0', max: '0' },
            { label: 'Under $25', min: '1', max: '25' },
            { label: '$25–$100', min: '25', max: '100' },
            { label: '$100+', min: '100', max: '' },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => onPriceChange({ min: preset.min, max: preset.max })}
              className="px-2.5 py-1 text-xs rounded-full border transition-colors"
              style={
                priceRange.min === preset.min && priceRange.max === preset.max
                  ? { borderColor: '#5C9657', backgroundColor: '#f0f7ef', color: '#5C9657', fontWeight: '600' }
                  : { borderColor: '#e5e7eb', color: '#6b7280' }
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Condition</h3>
        <div className="space-y-1.5">
          {CONDITIONS.map(cond => (
            <label key={cond} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedConditions.includes(cond)}
                onChange={() => onConditionToggle(cond)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                style={{ accentColor: '#5C9657' }}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cond}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative bg-white w-72 max-w-full h-full overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900">Filters & Sort</span>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent />
            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#5C9657' }}
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}