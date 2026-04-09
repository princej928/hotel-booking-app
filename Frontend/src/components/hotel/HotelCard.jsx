import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImageError, getFallbackImage } from '../../utils/hotelHelpers';
import useWishlist from '../../hooks/useWishlist';

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(hotel._id);
  
  // Safe fallbacks for data
  const emoji = hotel.emoji || '🏨';
  const displayIndex = hotel.displayIndex || 1;
  const expBullets = hotel.experienceBullets?.length ? hotel.experienceBullets : ['Experience nature', 'Relaxation'];
  const actBullets = hotel.activityBullets?.length ? hotel.activityBullets : ['Local dining', 'Relaxing spa'];
  const tourBullets = hotel.tourBullets?.length ? hotel.tourBullets : ['City sightseeing', 'Nature walk'];
  
  // Images
  const img1 = hotel.image || getFallbackImage(hotel._id);
  const img2 = hotel.gallery?.[0] || getFallbackImage(hotel._id + '1');
  const img3 = hotel.gallery?.[1] || getFallbackImage(hotel._id + '2');
  const totalPhotos = (hotel.gallery?.length || 0) + 1;

  // Calculate Tags (Max 2)
  const badges = [];
  if (hotel.isEcoFriendly) badges.push('Eco-Friendly 🌱');
  if (hotel.price > 25000) badges.push('Top Experience ⭐');
  else if (hotel.price < 20000) badges.push('Best Value 💰');
  if (badges.length > 2) badges.length = 2; // enforce max 2

  // Determine icon for experience based on type or just use standard
  const expIcon = hotel.experienceType === 'Eco-Retreat' ? '🌴' : 
                  hotel.experienceType === 'Heritage' ? '🏛️' : 
                  hotel.experienceType === 'Adventure' ? '❄️' : '✨';

  return (
    <article 
      onClick={() => navigate('/hotels/' + hotel._id)} 
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 mb-8"
    >
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-slate-900 leading-tight">
          {emoji} {displayIndex}. {hotel.name}
        </h3>
        <p className="mt-1.5 font-bold tracking-wide text-teal-600 uppercase text-xs">
          Core Experience: {hotel.experienceType}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 h-48 md:h-64 w-full">
        <div className="relative h-full w-full">
          <img src={img1} alt={hotel.name} className="h-full w-full rounded-2xl object-cover hover:opacity-90 transition" onError={(e) => handleImageError(e, hotel._id)}/>
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {badges.map((badge, idx) => (
              <span key={idx} className="rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md shadow-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <img src={img2} alt="Interior" className="h-full w-full rounded-2xl object-cover hover:opacity-90 transition" onError={(e) => handleImageError(e, hotel._id + '1')}/>
        <div className="relative h-full w-full">
           <img src={img3} alt="Exterior" className="h-full w-full rounded-2xl object-cover hover:opacity-90 transition" onError={(e) => handleImageError(e, hotel._id + '2')}/>
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(hotel._id); }} 
             className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-slate-400 shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white hover:text-rose-500 active:scale-95"
           >
             <svg fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-6 w-6 transition-colors duration-300 ${isSaved ? 'text-rose-500' : ''}`}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
             </svg>
           </button>
           <div className="absolute bottom-3 right-3 rounded-xl bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
             📸 {totalPhotos}
           </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {hotel.experienceType === 'Heritage' && <><span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">🎭 Royal Dinner</span><span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">🖼️ Art Tour</span><span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">🚙 Vintage Drive</span></>}
        {hotel.experienceType === 'Eco-Retreat' && <><span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">🌴 Tree Climbing</span><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">🛶 Canoe Ride</span><span className="rounded-full bg-lime-50 px-3 py-1.5 text-xs font-semibold text-lime-700">🥬 Organic Dining</span></>}
        {hotel.experienceType === 'Adventure' && <><span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">🏂 Snow Trekking</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">🔥 Bonfire</span><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">⛰️ Valley Trip</span></>}
        {hotel.experienceType === 'Luxury' && <><span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">🌊 Sunset Sail</span><span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">🧘 Yoga</span><span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">🏄 Water Sports</span></>}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            {expIcon} Experience:
          </h4>
          <ul className="ml-8 mt-2 list-disc space-y-1 text-slate-700">
            {expBullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>

        {isExpanded && (
          <>
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                🎭 Activities:
              </h4>
              <ul className="ml-8 mt-2 list-disc space-y-1 text-slate-700">
                {actBullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                🧭 Tours:
              </h4>
              <ul className="ml-8 mt-2 list-disc space-y-1 text-slate-700">
                {tourBullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <del>₹{Math.round(hotel.price * 1.15)}</del> 
            <span className="rounded-md bg-teal-50 px-1.5 py-0.5 font-bold text-teal-700">-15%</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">₹{hotel.price}</span>
            <span className="text-sm text-slate-500">/ night</span>
          </div>
        </div>
        
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <svg className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </article>
  );
}
