import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/listings';
import { formatDistanceToNow } from '../utils/formatTime';

const conditionColors = {
  'New': 'bg-blue-100 text-blue-700',
  'Like New': 'bg-green-100 text-green-700',
  'Good': 'bg-yellow-100 text-yellow-700',
  'Fair': 'bg-orange-100 text-orange-700',
  'Poor': 'bg-red-100 text-red-700',
};

export default function ListingModal({ listing, onClose, onToggleSave, isSaved }) {
  const [activeImage, setActiveImage] = useState(0);
  const [messageSent, setMessageSent] = useState(false);
  const [messageText, setMessageText] = useState('');

  const category = CATEGORIES.find(c => c.id === listing.category);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setMessageText('');
  };

  const images = listing.images?.length ? listing.images : [listing.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="md:rounded-l-2xl overflow-hidden bg-gray-100">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={images[activeImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x400/e5e7eb/9ca3af?text=${encodeURIComponent(listing.category)}`;
                }}
              />
              {listing.price === 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500 text-white">FREE</span>
              )}
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-green-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 flex flex-col gap-4">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span>{category?.icon}</span>
                  <span>{category?.label}</span>
                </span>
                <button
                  onClick={() => onToggleSave(listing.id)}
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                    isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:text-red-500'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 leading-snug">{listing.title}</h2>

              <div className="flex items-center gap-2 mt-2">
                <p className="text-2xl font-bold" style={{ color: listing.price === 0 ? '#5C9657' : '#111827' }}>
                  {listing.price === 0 ? 'Free' : `$${listing.price}`}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColors[listing.condition] || 'bg-gray-100 text-gray-600'}`}>
                  {listing.condition}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-0.5">Location</div>
                <div className="font-medium text-gray-800 text-xs flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {listing.location}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-0.5">Posted</div>
                <div className="font-medium text-gray-800 text-xs">{formatDistanceToNow(listing.timePosted)}</div>
              </div>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#7FB37A' }}>

                {listing.sellerAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{listing.seller}</div>
                <div className="text-xs text-gray-400">{listing.location}</div>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Message / Contact */}
            <div className="mt-auto">
              {messageSent ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm text-green-700 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Message sent! The seller will respond soon.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-2">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Hi ${listing.seller.split(' ')[0]}, is this still available?`}
                    rows={2}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#5C9657' }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#4a7a45'; }}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5C9657'}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}