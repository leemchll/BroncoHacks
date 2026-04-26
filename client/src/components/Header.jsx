import { useState } from 'react';

export default function Header({ searchQuery, onSearchChange, onCreateListing, onLogin, onRegister, isLoggedIn, userName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7FB37A' }}>
            <span className="text-white font-bold text-sm">U</span>
          </div>
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
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: '#7FB37A' }}
              >
                {userName?.slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={onLogin}
                className="text-sm text-gray-500 hover:text-gray-700 hidden sm:block"
              >
                Sign out
              </button>
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