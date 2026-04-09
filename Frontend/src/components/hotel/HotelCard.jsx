import Button from '../common/Button';
import { getStableRating, getFacilities, handleImageError, getFallbackImage } from '../../utils/hotelHelpers';
import useWishlist from '../../hooks/useWishlist';
import { useNavigate } from 'react-router-dom';

export default function HotelCard({ hotel, isAdmin, onBook, onDelete }) {
  const navigate = useNavigate();
  const rating = Number(getStableRating(hotel._id, hotel.price));
  const facilities = getFacilities(hotel._id, hotel.price);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(hotel._id);
  const oldPrice = Math.round(hotel.price * 1.15); // Mock 15% discount
  const highlightTag = rating > 4.5 ? 'Top Rated' : rating >= 4.2 ? 'Great Location' : 'Best Value';

  return (
    <article onClick={() => navigate('/hotels/' + hotel._id)} className="hotel-card group flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_65px_-32px_rgba(15,23,42,0.4)]">
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={hotel.image || getFallbackImage(hotel._id)}
          alt={hotel.name}
          className="hotel-card-image h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => handleImageError(e, hotel._id)}
        />
        <div className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
          {highlightTag}
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(hotel._id); }} 
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-slate-400 shadow-sm backdrop-blur transition-all hover:scale-110 hover:bg-white hover:text-red-500"
        >
          <svg fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-5 w-5 ${isSaved ? 'text-red-500' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{hotel.location}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-3 py-2 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Rating</div>
            <div className="text-sm font-bold text-slate-900">{rating}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {facilities.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4 mt-auto">
          <div>
            <div className="text-xs font-medium text-slate-500">
              <del>₹{oldPrice}</del> <span className="ml-1 font-bold text-teal-600">-15%</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">₹{hotel.price}</div>
            <div className="text-xs text-slate-500">+ taxes per night</div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button onClick={() => onBook(hotel._id)} className="transition-transform active:scale-95 group-hover:bg-teal-700">
              Reserve
            </Button>
            {isAdmin && (
              <Button variant="danger" onClick={() => onDelete(hotel._id)}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
