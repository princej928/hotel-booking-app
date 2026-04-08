import { useState, useEffect } from 'react';

export default function useWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hotel_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load wishlist', e);
    }
  }, []);

  const toggleWishlist = (hotelId) => {
    setWishlist((current) => {
      let updated;
      if (current.includes(hotelId)) {
        updated = current.filter((id) => id !== hotelId);
      } else {
        updated = [...current, hotelId];
      }
      localStorage.setItem('hotel_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (hotelId) => wishlist.includes(hotelId);

  return { wishlist, toggleWishlist, isInWishlist };
}
