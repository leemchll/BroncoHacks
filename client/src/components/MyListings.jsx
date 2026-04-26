import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function MyListings({ currentUser, onClose, onViewListing, onDeleteListing }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;
    fetch(`${API_URL}/api/listings/user/${currentUser.id}`)
      .then(r => r.json())
      .then(data => { setListings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentUser?.id]);

  const handleDelete = async (id) => {
    await onDeleteListing(id);
    setListings(prev => prev.filter(l => l.id !== id));
    setConfirmDeleteId(null);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900 text-lg">My Listings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
              <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm">No listings yet</p>
              <p className="text-xs text-gray-300">Create your first listing to get started</p>
            </div>
          )}

          {!loading && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listings.map(listing => (
                <div key={listing.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                  <div className="flex gap-3 p-3">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                      {listing.image ? (
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{listing.title}</p>
                      <p className="font-semibold text-sm mt-0.5" style={{ color: '#5C9657' }}>${listing.price}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{listing.condition}{listing.location ? ` · ${listing.location}` : ''}</p>
                      <p className="text-xs text-gray-300 mt-0.5">{formatTime(listing.timePosted)}</p>
                    </div>
                  </div>

                  <div className="flex border-t border-gray-100">
                    <button
                      onClick={() => { onViewListing(listing); onClose(); }}
                      className="flex-1 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      View
                    </button>
                    <div className="w-px bg-gray-100" />
                    {confirmDeleteId === listing.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="flex-1 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Confirm
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex-1 py-2 text-xs font-medium text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(listing.id)}
                        className="flex-1 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
