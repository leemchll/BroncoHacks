// Strip any accidental trailing slash so fetch URLs never contain double slashes
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');
