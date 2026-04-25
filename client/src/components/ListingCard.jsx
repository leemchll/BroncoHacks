import { formatDistanceToNow } from '../utils/formatTime';
import { CATEGORIES } from '../data/listings';

const conditionColors = {
  'New': 'bg-blue-100 text-blue-700',
  'Like New': 'bg-green-100 text-green-700',
  'Good': 'bg-yellow-100 text-yellow-700',
  'Fair': 'bg-orange-100 text-orange-700',
  'Poor': 'bg-red-100 text-red-700',
};

export default function ListingCard({ listing, onSelect, onToggleSave, isSaved }) {
  const category = CATEGORIES.find(c => c.id === listing.category);

  return (
    <div
      className="listing-card bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group"
      onClick={() => onSelect(listing)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(listing.category)}`;
          }}
        />

        {/* Price badge */}
        <div className="absolute top-2 left-2">
          {listing.price === 0 ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
              FREE
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-gray-900 shadow-sm">
              ${listing.price}
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
            isSaved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          title={isSaved ? 'Remove from saved' : 'Save listing'}
        >
          <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category tag */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span>{category?.icon}</span>
            <span>{category?.label}</span>
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${conditionColors[listing.condition] || 'bg-gray-100 text-gray-600'}`}>
            {listing.condition}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-green-700 transition-colors">
          {listing.title}
        </h3>

        {/* Price (large) */}
        <p className="text-lg font-bold mb-2" style={{ color: listing.price === 0 ? '#5C9657' : '#1F2937' }}>
          {listing.price === 0 ? 'Free' : `$${listing.price}`}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-2 mt-auto">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: '#7FB37A' }}>
              {listing.sellerAvatar}
            </div>
            <span className="truncate">{listing.seller}</span>
          </div>
          <span className="shrink-0 ml-1">{formatDistanceToNow(listing.timePosted)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{listing.location}</span>
        </div>
      </div>
    </div>
  );
}