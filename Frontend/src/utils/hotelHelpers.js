export const getStableRating = (id, price) => {
  const numPrice = Number(price) || 0;
  const baseRating = numPrice > 15000 ? 4.7 : numPrice > 8000 ? 4.3 : 3.8;
  const hash = id && typeof id === 'string' ? id.charCodeAt(id.length - 1) % 5 : 0;
  const rating = baseRating + (hash * 0.1) - 0.2;
  return Math.min(Math.max(rating, 3.5), 5.0).toFixed(1);
};

export const getFacilities = (price) => {
  const numPrice = Number(price) || 0;
  if (numPrice > 18000) return ['Spa', 'Infinity Pool', 'Fine Dining', 'Butler', 'WiFi'];
  if (numPrice > 10000) return ['Pool', 'Gym', 'Breakfast', 'WiFi', 'Bar'];
  if (numPrice > 5000) return ['Breakfast', 'WiFi', 'AC', 'Room Service'];
  return ['WiFi', 'AC', 'TV', 'Housekeeping'];
};

const fallbacks = [
  'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89fae42360b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c0d12c5b?auto=format&fit=crop&w=800&q=80'
];

export const getFallbackImage = (id = '') => {
  const hash = id && typeof id === 'string' ? id.charCodeAt(id.length - 1) % fallbacks.length : 0;
  return fallbacks[hash];
};

export const handleImageError = (e, id) => {
  const fallback = getFallbackImage(id);
  if (e.target.src !== fallback) {
    e.target.src = fallback;
  }
};
