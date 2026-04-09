import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImageError, getFallbackImage } from '../../utils/hotelHelpers';

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  // Determine icon for experience based on type or just use standard
  const expIcon = hotel.experienceType === 'Eco-Retreat' ? '🌴' : 
                  hotel.experienceType === 'Heritage' ? '🏛️' : 
                  hotel.experienceType === 'Adventure' ? '❄️' : '✨';

  return (
    <article 
      onClick={() => navigate('/hotels/' + hotel._id)} 
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 mb-8"
    >
      <h3 className="mb-4 text-2xl font-bold text-slate-900">
        {emoji} {displayIndex}. {hotel.name}
      </h3>

      <div className="grid grid-cols-3 gap-3 md:gap-4 h-48 md:h-64 w-full">
        <img src={img1} alt={hotel.name} className="h-full w-full rounded-2xl object-cover hover:opacity-90 transition" onError={(e) => handleImageError(e, hotel._id)}/>
        <img src={img2} alt="Interior" className="h-full w-full rounded-2xl object-cover hover:opacity-90 transition" onError={(e) => handleImageError(e, hotel._id + '1')}/>
        <div className="relative h-full w-full">
           <img src={img3} alt="Exterior" className="h-full w-full rounded-2xl object-cover hover:opacity-90 transition" onError={(e) => handleImageError(e, hotel._id + '2')}/>
           <div className="absolute bottom-3 right-3 rounded-xl bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
             📸 {totalPhotos}
           </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
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

      <div className="mt-6 flex justify-center border-t border-slate-100 pt-6">
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
