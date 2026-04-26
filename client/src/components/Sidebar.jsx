import { useState, useEffect } from 'react';
import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from '../data/listings';

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
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
  const [expandedCategories, setExpandedCategories] = useState(() =>
    selectedCategory !== 'all' ? new Set([selectedCategory]) : new Set()
  );

  useEffect(() => {
    if (selectedCategory !== 'all') {
      setExpandedCategories((prev) => new Set([...prev, selectedCategory]));
    }
  }, [selectedCategory]);

  const toggleExpand = (catId, e) => {
    e.stopPropagation();
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleCategoryClick = (catId) => {
    onCategoryChange(catId);
    onSubcategoryChange('');
    if (catId !== 'all') {
      setExpandedCategories((prev) => new Set([...prev, catId]));
    }
  };

  const handleSubcategoryClick = (catId, subId) => {
    onCategoryChange(catId);
    onSubcategoryChange(subId);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== '' ||
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
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
        <div className="space-y-0.5">
          {/* All Categories */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'font-semibold text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={selectedCategory === 'all' ? { backgroundColor: '#7FB37A' } : {}}
          >
            All Categories
          </button>

          {/* Main categories with subcategories */}
          {CATEGORIES.filter(cat => cat.id !== 'all').map(cat => {
            const isCatActive = selectedCategory === cat.id;
            const isExpanded = expandedCategories.has(cat.id);

            return (
              <div key={cat.id}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      isCatActive && !selectedSubcategory
                        ? 'font-semibold text-white'
                        : isCatActive
                        ? 'font-medium text-gray-800 bg-gray-100'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={isCatActive && !selectedSubcategory ? { backgroundColor: '#7FB37A' } : {}}
                  >
                    {cat.label}
                  </button>
                  <button
                    onClick={(e) => toggleExpand(cat.id, e)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {isExpanded && cat.subcategories.length > 0 && (
                  <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
                    {cat.subcategories.map(sub => {
                      const isSubActive = isCatActive && selectedSubcategory === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubcategoryClick(cat.id, sub.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                            isSubActive
                              ? 'font-semibold text-white'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                          style={isSubActive ? { backgroundColor: '#7FB37A' } : {}}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
