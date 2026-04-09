export const getStableRating = (id, price) => {
  const numPrice = Number(price) || 0;
  const baseRating = numPrice > 15000 ? 4.7 : numPrice > 8000 ? 4.3 : 3.8;
  const hash = id && typeof id === 'string' ? id.charCodeAt(id.length - 1) % 5 : 0;
  const rating = baseRating + (hash * 0.1) - 0.2;
  return Math.min(Math.max(rating, 3.5), 5.0).toFixed(1);
};

export const getFacilities = (id, price) => {
  const numPrice = Number(price) || 0;
  const hash = id && typeof id === 'string' ? id.charCodeAt(id.length - 1) % 5 : 0;
  
  const baseAmenities = ['High-Speed WiFi', 'Climate Control AC'];
  
  const cheapPool = [
    ['Flat-screen TV', 'Daily Housekeeping', 'Free Parking', 'Coffee Maker'],
    ['Cable TV', 'Daily Cleaning', 'Coffee Maker', 'Wake-up Service'],
    ['Housekeeping', 'Free Parking', 'Vending Machine', '24/7 Front Desk'],
    ['HD TV', 'Luggage Storage', 'Lobby Lounge', 'Microwave'],
    ['Free Parking', 'Housekeeping', 'Pet Friendly', 'Laundry Service']
  ];
  
  const midPool = [
    ['Outdoor Pool', 'Fitness Center', 'Complimentary Breakfast', 'Mini Bar', 'Room Service'],
    ['Continental Breakfast', 'Room Service', 'Mini Fridge', 'Executive Lounge', 'Gym'],
    ['24/7 Gym', 'Hot Breakfast', 'Business Center', 'Cocktail Bar', 'Concierge'],
    ['Indoor Pool', 'Breakfast Buffet', 'Room Service', 'Concierge', 'Valet Parking'],
    ['Rooftop Bar', 'Room Service', 'Valet Parking', 'Yoga Studio', 'Smart TV']
  ];
  
  const luxuryPool = [
    ['Award-winning Spa', 'Infinity Pool', 'Fine Dining Restaurant', 'Personal Butler', 'Helipad Access', 'Limo Service'],
    ['Luxury Spa', 'Private Pool Cabanas', 'Michelin Star Chef', '24/7 Butler', 'In-room Massage', 'Valet'],
    ['Rooftop Infinity Pool', 'Fine Dining', 'Dedicated Butler', 'Helicopter Tours', 'Private Golf Course', 'Tennis Court'],
    ['Wellness Spa', 'Private Beach Access', 'Butler Service', 'Personal Shopper', 'Signature Dining', 'Yacht Access'],
    ['Heated Private Pool', 'Executive Butler', 'Private Chef', 'Couples Massage', 'Ski-in/Ski-out', 'Chauffeur Service']
  ];

  let selectedPool = [];
  if (numPrice > 18000) selectedPool = luxuryPool[hash];
  else if (numPrice > 5000) selectedPool = midPool[hash];
  else selectedPool = cheapPool[hash];
  
  return [...baseAmenities, ...selectedPool];
};

const fallbacks = [
  'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89fae42360b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c0d12c5b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7bef511?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80'
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
