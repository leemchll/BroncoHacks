import { useState, useRef, useEffect } from 'react';
import icon from '../../imports/icon.png';

export default function Header({
  searchQuery, onSearchChange, onCreateListing, onLogin, onRegister,
  isLoggedIn, userName, unreadCount, onOpenMessages, onOpenMyListings,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <img src={icon} alt="Unimart" className="w-8 h-8 object-contain" />
          <span className="font-bold text-xl text-gray-900 hidden sm:block">
            Uni<span style={{ color: '#5C9657' }}>mart</span>
          </span>
        </a>

        {/* Search Bar - Desktop */}
        <div className="flex-1 max-w-2xl mx-2 hidden sm:block">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for textbooks, calculators, electronics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile search toggle */}
        <button
          className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Right buttons */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={onCreateListing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#5C9657' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4a7a45'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5C9657'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Create Listing</span>
            <span className="sm:hidden">List</span>
          </button>
        </div>

        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: '#7FB37A' }}
              >
                {userName?.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">{userName}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <button
                  onClick={() => { setDropdownOpen(false); onOpenMyListings?.(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  My Listings
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); onOpenMessages?.(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-auto text-xs font-bold text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#5C9657' }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { setDropdownOpen(false); onLogin(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
            <div className="flex items-center gap-2">
              <button
              onClick={onLogin}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: '#5C9657' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4a7a45')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5C9657')}
            >
              Log in
            </button>
              <button
                onClick={onRegister}
                className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#5C9657' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4a7a45')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5C9657')}
              >
                Register
              </button>
            </div>
          )}
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}