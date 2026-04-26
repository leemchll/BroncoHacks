import { useState, useEffect } from 'react';

const INITIAL_FORM = {
  username: '',
  name: '',
  email: '',
  password: '',
};

/**
 * @file RegisterModal.jsx
 * @description Modal for registering a new user account
 */
export default function RegisterModal({ onClose, onSubmit, errorMessage }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  /**
   * @function validate
   * @description Validates registration form fields
   */
  const validate = () => {
    const errs = {};

    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password.trim()) errs.password = 'Password is required';

    if (form.username.trim() && form.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }

    if (form.password.trim() && form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    return errs;
  };

  /**
   * @function handleSubmit
   * @description Handles registration form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    await onSubmit({
      username: form.username.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });
  };

  /**
   * @function setField
   * @description Updates form state and clears field errors
   */
  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create Account</h2>
            <p className="text-xs text-gray-400">Join Unimart and start buying or selling</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.username}
              onChange={setField('username')}
              placeholder="michelle123"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors ${
                errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={setField('name')}
              placeholder="Michelle"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={setField('email')}
              placeholder="you@example.com"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={setField('password')}
              placeholder="At least 6 characters"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {errorMessage}
            </p>
          )}

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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4a7a45')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5C9657')}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}