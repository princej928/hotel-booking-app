import Button from '../common/Button';
import { getStableRating, getFacilities, handleImageError, getFallbackImage } from '../../utils/hotelHelpers';

export default function HotelCard({ hotel, isAdmin, onBook, onDelete }) {
  const rating = getStableRating(hotel._id, hotel.price);
  const facilities = getFacilities(hotel.price);
  return (
    <article className="hotel-card overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_65px_-32px_rgba(15,23,42,0.4)]">
      <div className="relative overflow-hidden">
        <img
          src={hotel.image || getFallbackImage(hotel._id)}
          alt={hotel.name}
          className="hotel-card-image h-60 w-full object-cover"
          loading="lazy"
          onError={(e) => handleImageError(e, hotel._id)}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          Guest favorite
        </div>
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

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">Starting from</div>
            <div className="text-2xl font-bold text-slate-900">₹{hotel.price}</div>
            <div className="text-sm text-slate-500">per night</div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button onClick={() => onBook(hotel._id)}>Book now</Button>
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
