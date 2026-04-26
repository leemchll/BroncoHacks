import { useState, useMemo, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import icon from '../imports/icon.png';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ListingCard from './components/ListingCard';
import ListingModal from './components/ListingModal';
import CreateListingModal from './components/CreateListingModal';
import EmptyState from './components/EmptyState';
import { mockListings, CATEGORIES } from './data/listings';
import LoginModal from './components/LoginModal.jsx';
import RegisterModal from './components/RegisterModal.jsx';
import ChatModal from './components/ChatModal.jsx';
import MessagesPanel from './components/MessagesPanel.jsx';
import MyListings from './components/MyListings.jsx';

const SOCKET_URL = 'http://localhost:5001';

export default function App() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [savedListings, setSavedListings] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatListing, setChatListing] = useState(null);
  const [chatConversationId, setChatConversationId] = useState(null);
  const [chatReceiverId, setChatReceiverId] = useState(null);
  const [showMessagesPanel, setShowMessagesPanel] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Global notification socket (lives as long as user is logged in)
  const notifSocketRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/listings')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch(() => setListings(mockListings));
  }, []);

  // Manage notification socket when user logs in/out
  useEffect(() => {
    if (!currentUser) {
      if (notifSocketRef.current) {
        notifSocketRef.current.disconnect();
        notifSocketRef.current = null;
      }
      setUnreadCount(0);
      return;
    }

    // Fetch initial unread count
    fetch(`http://localhost:5001/api/messages/unread/${currentUser.id}`)
      .then(r => r.json())
      .then(d => setUnreadCount(d.count || 0))
      .catch(() => {});

    // Connect notification socket
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    notifSocketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('registerUser', currentUser.id);
    });

    socket.on('updateUnreadCount', () => {
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
      notifSocketRef.current = null;
    };
  }, [currentUser?.id]);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      return;
    }
    setLoginError('');
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setRegisterError('');
    setShowRegisterModal(true);
  };

  const handleLoginSubmit = async ({ username, password }) => {
    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.message || 'Login failed'); return; }
      setLoginError('');
      setIsLoggedIn(true);
      setCurrentUser(data.user);
      setShowLoginModal(false);
    } catch {
      setLoginError('Something went wrong while logging in.');
    }
  };

  const handleRegisterSubmit = async ({ username, name, email, password }) => {
    try {
      const res = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setRegisterError(data.message || 'Registration failed'); return; }
      setRegisterError('');
      setIsLoggedIn(true);
      setCurrentUser(data.user);
      setShowRegisterModal(false);
    } catch {
      setRegisterError('Something went wrong while registering.');
    }
  };

  const handleToggleSave = (id) => {
    setSavedListings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubcategory('');
    setPriceRange({ min: '', max: '' });
    setSelectedConditions([]);
    setSortBy('newest');
    setShowSavedOnly(false);
  };

  const handleConditionToggle = (cond) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleCreateListing = async (formData) => {
    try {
      const res = await fetch('http://localhost:5001/api/listings', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { console.error('Error creating listing:', data.message); return; }
      setListings((prev) => [data, ...prev]);
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  // Open chat from listing modal
  const handleOpenChat = (listing) => {
    setChatListing(listing);
    setChatConversationId(null);
    setChatReceiverId(listing.sellerId);
    setShowChatModal(true);
  };

  // Open chat from messages panel (conversation already exists)
  const handleOpenChatFromInbox = (listing, convId, receiverId) => {
    setChatListing(listing);
    setChatConversationId(convId);
    setChatReceiverId(receiverId);
    setShowMessagesPanel(false);
    setShowChatModal(true);
  };

  // Called by ChatModal when messages are marked as read
  const handleMarkRead = (count) => {
    setUnreadCount(prev => Math.max(0, prev - count));
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/listings/${listingId}?userId=${currentUser.id}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setListings(prev => prev.filter(l => l.id !== listingId));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const filteredListings = useMemo(() => {
    let result = [...listings];
    if (showSavedOnly) result = result.filter((l) => savedListings.has(l.id));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.seller?.toLowerCase().includes(q) ||
          l.location?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') result = result.filter((l) => l.category === selectedCategory);
    if (selectedSubcategory) result = result.filter((l) => l.subcategory === selectedSubcategory);
    if (priceRange.min !== '') result = result.filter((l) => l.price >= Number(priceRange.min));
    if (priceRange.max !== '') result = result.filter((l) => l.price <= Number(priceRange.max));
    if (selectedConditions.length > 0) result = result.filter((l) => selectedConditions.includes(l.condition));
    switch (sortBy) {
      case 'newest': result.sort((a, b) => new Date(b.timePosted) - new Date(a.timePosted)); break;
      case 'oldest': result.sort((a, b) => new Date(a.timePosted) - new Date(b.timePosted)); break;
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      default: break;
    }
    return result;
  }, [listings, searchQuery, selectedCategory, selectedSubcategory, priceRange, selectedConditions, sortBy, showSavedOnly, savedListings]);

  const categoryLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Categories';
  const subcategoryLabel = (() => {
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    return cat?.subcategories.find((s) => s.id === selectedSubcategory)?.label || '';
  })();
  const hasActiveFilters =
    selectedCategory !== 'all' || selectedSubcategory !== '' ||
    priceRange.min !== '' || priceRange.max !== '' ||
    selectedConditions.length > 0 || searchQuery || showSavedOnly;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateListing={() => setShowCreateModal(true)}
        onLogin={handleLoginClick}
        onRegister={handleRegisterClick}
        isLoggedIn={isLoggedIn}
        userName={currentUser?.username || ''}
        unreadCount={unreadCount}
        onOpenMessages={() => setShowMessagesPanel(true)}
        onOpenMyListings={() => setShowMyListings(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #5C9657 0%, #7FB37A 60%, #A8D5A3 100%)' }}
        >
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Student Marketplace</h1>
            <p className="text-sm sm:text-base opacity-90">Buy, sell, and discover deals from students near you</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {CATEGORIES.slice(1).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory(''); }}
                  className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors backdrop-blur-sm"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-12 w-48 h-48 rounded-full bg-white/10" />
        </div>

        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-green-500" />}
            </button>

            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors"
              style={showSavedOnly ? { borderColor: '#fca5a5', backgroundColor: '#fef2f2', color: '#dc2626' } : { borderColor: '#e5e7eb', backgroundColor: 'white', color: '#4b5563' }}
            >
              <svg className="w-4 h-4" fill={showSavedOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Saved
              {savedListings.size > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                  {savedListings.size}
                </span>
              )}
            </button>

            {selectedCategory !== 'all' && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#7FB37A' }}>
                {categoryLabel}
                <button onClick={() => { setSelectedCategory('all'); setSelectedSubcategory(''); }} className="ml-1 hover:opacity-70">×</button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#5C9657' }}>
                {subcategoryLabel}
                <button onClick={() => setSelectedSubcategory('')} className="ml-1 hover:opacity-70">×</button>
              </span>
            )}
            {(priceRange.min !== '' || priceRange.max !== '') && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#7FB37A' }}>
                ${priceRange.min || '0'} – {priceRange.max ? `$${priceRange.max}` : 'any'}
                <button onClick={() => setPriceRange({ min: '', max: '' })} className="ml-1 hover:opacity-70">×</button>
              </span>
            )}
            {selectedConditions.map((cond) => (
              <span key={cond} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#7FB37A' }}>
                {cond}
                <button onClick={() => handleConditionToggle(cond)} className="ml-1 hover:opacity-70">×</button>
              </span>
            ))}
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="text-xs font-medium hover:underline" style={{ color: '#5C9657' }}>
                Clear all
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500 shrink-0">
            <span className="font-semibold text-gray-800">{filteredListings.length}</span>{' '}
            listing{filteredListings.length !== 1 ? 's' : ''}
            {searchQuery && <span> for "<span className="font-medium">{searchQuery}</span>"</span>}
          </p>
        </div>

        <div className="flex gap-6">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={setSelectedSubcategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedConditions={selectedConditions}
            onConditionToggle={handleConditionToggle}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
            listingCount={filteredListings.length}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isLoggedIn={isLoggedIn}
            unreadCount={unreadCount}
            onOpenMessages={() => setShowMessagesPanel(true)}
          />

          <main className="flex-1 min-w-0">
            {filteredListings.length === 0 ? (
              <EmptyState searchQuery={searchQuery} selectedCategory={selectedCategory} onClear={handleClearFilters} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={setSelectedListing}
                    onToggleSave={handleToggleSave}
                    isSaved={savedListings.has(listing.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={icon} alt="Unimart" className="w-7 h-7 object-contain" />
              <span className="font-bold text-gray-700">Uni<span style={{ color: '#5C9657' }}>mart</span></span>
              <span className="text-gray-300 text-sm">·</span>
              <span className="text-xs text-gray-400">Student Marketplace</span>
            </div>
            <p className="text-xs text-gray-400">© 2026 Unimart · Built for students, by students</p>
            <p className="text-xs text-gray-400">
              Icons made by{' '}
              <a href="https://www.flaticon.com/authors/freepik" title="Freepik" className="underline hover:text-gray-600">Freepik</a>
              {' '}from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon" className="underline hover:text-gray-600">www.flaticon.com</a>
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Safety Tips</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onToggleSave={handleToggleSave}
          isSaved={savedListings.has(selectedListing.id)}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onOpenChat={handleOpenChat}
        />
      )}

      {showCreateModal && (
        <CreateListingModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateListing}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => { setShowLoginModal(false); setLoginError(''); }}
          onSubmit={handleLoginSubmit}
          errorMessage={loginError}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => { setShowRegisterModal(false); setRegisterError(''); }}
          onSubmit={handleRegisterSubmit}
          errorMessage={registerError}
        />
      )}

      {showChatModal && chatListing && (
        <ChatModal
          listing={chatListing}
          currentUser={currentUser}
          onClose={() => { setShowChatModal(false); setChatListing(null); setChatConversationId(null); }}
          initialConversationId={chatConversationId}
          explicitReceiverId={chatReceiverId}
          onMarkRead={handleMarkRead}
        />
      )}

      {showMessagesPanel && (
        <MessagesPanel
          currentUser={currentUser}
          onClose={() => setShowMessagesPanel(false)}
          onOpenChat={handleOpenChatFromInbox}
          onMarkRead={handleMarkRead}
        />
      )}

      {showMyListings && (
        <MyListings
          currentUser={currentUser}
          onClose={() => setShowMyListings(false)}
          onViewListing={setSelectedListing}
          onDeleteListing={handleDeleteListing}
        />
      )}
    </div>
  );
}
