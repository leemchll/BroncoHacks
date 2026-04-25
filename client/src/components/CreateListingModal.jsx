import { useState, useEffect } from 'react';
import { CATEGORIES, CONDITIONS } from '../data/listings';

const INITIAL_FORM = {
  title: '',
  price: '',
  category: 'textbooks',
  condition: 'Good',
  description: '',
  location: '',
  imageUrl: '',
};

export default function CreateListingModal({ onClose, onSubmit, isLoggedIn, currentUser }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (form.price === '') errs.price = 'Price is required';
    if (Number(form.price) < 0) errs.price = 'Price cannot be negative';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const newListing = {
      id: Date.now(),
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category,
      condition: form.condition,
      description: form.description.trim(),
      location: form.location.trim(),
      image: form.imageUrl.trim() || `https://picsum.photos/seed/${Date.now()}/400/300`,
      images: [form.imageUrl.trim() || `https://picsum.photos/seed/${Date.now()}/400/300`],
      seller: currentUser || 'You',
      sellerAvatar: (currentUser || 'YO').slice(0, 2).toUpperCase(),
      timePosted: new Date().toISOString(),
      saved: false,
    };
    onSubmit(newListing);
    setSubmitted(true);
  };

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0f7ef' }}>
            <svg className="w-8 h-8" style={{ color: '#5C9657' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Listing Created!</h3>
          <p className="text-sm text-gray-500 mb-6">Your listing is now live and visible to other students.</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#5C9657' }}
          >
            View Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create a Listing</h2>
            <p className="text-xs text-gray-400">Sell or give away something to fellow students</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g., Calculus Textbook 8th Edition"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category + Condition row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition <span className="text-red-400">*</span>
              </label>

              <select
                value={form.condition}
                onChange={set('condition')}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
              >
                {CONDITIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number"
                value={form.price}
                onChange={set('price')}
                placeholder="0 for free items"
                min="0"
                step="0.01"
                className={`w-full pl-7 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${
                  errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            <p className="text-xs text-gray-400 mt-1">Enter 0 to list as a free item</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Describe the item — edition, condition details, what's included, pickup notes..."
              rows={4}
              className={`w-full px-3 py-2.5 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300 ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description
                ? <p className="text-xs text-red-500">{errors.description}</p>
                : <span />
              }
              <p className="text-xs text-gray-400">{form.description.length} chars</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location / Campus <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={set('location')}
              placeholder="e.g., Cal Poly Pomona"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${
                errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>

          {/* Image URL (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={set('imageUrl')}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank to use a placeholder image</p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: '#5C9657' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4a7a45'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5C9657'}
            >
              Post Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
