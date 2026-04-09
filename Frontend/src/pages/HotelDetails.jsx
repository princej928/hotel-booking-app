import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency, getStableRating, getFacilities, handleImageError, getFallbackImage } from '../utils/hotelHelpers';
import useWishlist from '../hooks/useWishlist';
import ReviewSection from '../components/hotel/ReviewSection';

const gallery = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
];

const nearbyTours = [
  { id: 1, title: 'Heritage City Walk', duration: '2 hrs', desc: 'Discover hidden architectural gems with a local expert.', tag: 'Velvet Curated' },
  { id: 2, title: 'Sunset River Cruise', duration: '3 hrs', desc: 'Relaxing evening cruise with live acoustic music.', tag: 'Local Guide' },
  { id: 3, title: 'Mountain Trail Hike', duration: 'Half day', desc: 'A scenic guided hike through beautiful pine forests.', tag: 'Velvet Curated' },
  { id: 4, title: 'Authentic Cooking Class', duration: '2.5 hrs', desc: 'Master local recipes in a traditional homestay kitchen.', tag: 'Local Guide' },
];

export default function HotelDetails() {
  const { id } = useParams();
  const [hotels, setHotels] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    api.get('/hotels').then(({ data }) => setHotels(data)).catch(() => setHotels([]));
  }, []);

  const hotel = useMemo(() => hotels.find((item) => item._id === id), [hotels, id]);

  if (!hotels.length && !hotel) {
    return (
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <PageContainer>
          <EmptyState title="Loading hotel details" description="Please wait while we load this property." />
        </PageContainer>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <PageContainer>
          <EmptyState
            title="Hotel not found"
            description="This property may have been removed or the link may be incorrect."
            action={<Button as={Link} to="/hotels">Back to hotels</Button>}
          />
        </PageContainer>
      </div>
    );
  }

  const rating = getStableRating(hotel._id, hotel.price);
  const amenities = getFacilities(hotel._id, hotel.price);
  const isSaved = isInWishlist(hotel._id);
  const oldPrice = Math.round(hotel.price * 1.15);

  const displayGallery = [
    hotel.gallery?.[0] || hotel.image || gallery[0],
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', // luxurious bathroom
    'https://images.unsplash.com/photo-1512918728675-ed5a9ec8f5d0?auto=format&fit=crop&w=1200&q=80'  // balcony view
  ];
  const nearbyToursWithImages = nearbyTours.map((tour, index) => ({
    ...tour,
    image: displayGallery[index % displayGallery.length] || getFallbackImage(`${hotel._id}-${index}`)
  }));

  const handleOpenGallery = (idx) => {
    setActiveImageIndex(idx);
    setIsGalleryOpen(true);
  };

  return (
    <div className="pb-40 pt-8 lg:pb-16">
      <PageContainer className="space-y-8 px-4 sm:px-6 lg:px-8">
        {isGalleryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
            <button onClick={() => setIsGalleryOpen(false)} className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button onClick={() => setActiveImageIndex((prev) => (prev === 0 ? 2 : prev - 1))} className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={displayGallery[activeImageIndex]} alt="Gallery Expanded" className="max-h-[85vh] max-w-full scale-100 rounded-lg object-contain transition-transform duration-300" />
            <button onClick={() => setActiveImageIndex((prev) => (prev === 2 ? 0 : prev + 1))} className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">Hotel details</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{hotel.name}</h1>
            <p className="text-lg text-slate-500">{hotel.location}</p>
          </div>
          <button onClick={() => toggleWishlist(hotel._id)} className="mt-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:scale-105 hover:bg-slate-50">
            <svg fill={isSaved ? "currentColor" : "none" } viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-7 w-7 ${isSaved ? 'text-red-500' : 'text-slate-400'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <img onClick={() => handleOpenGallery(0)} src={displayGallery[0]} alt={hotel.name} className="h-[420px] w-full cursor-pointer rounded-[30px] object-cover transition duration-300 hover:opacity-90 sm:col-span-2" onError={(e) => handleImageError(e, hotel._id)} />
            <img onClick={() => handleOpenGallery(1)} src={displayGallery[1]} alt="" className="h-52 w-full cursor-pointer rounded-[28px] object-cover transition duration-300 hover:opacity-90" onError={(e) => handleImageError(e, hotel._id + '1')} />
            <img onClick={() => handleOpenGallery(2)} src={displayGallery[2]} alt="" className="h-52 w-full cursor-pointer rounded-[28px] object-cover transition duration-300 hover:opacity-90" onError={(e) => handleImageError(e, hotel._id + '2')} />
          </div>

          <aside className="fixed bottom-0 left-0 z-40 w-full rounded-t-[30px] border-t border-slate-200 bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] lg:sticky lg:top-24 lg:h-fit lg:rounded-[30px] lg:border lg:shadow-[0_22px_55px_-30px_rgba(15,23,42,0.3)]">
            <div className="flex items-center justify-between lg:block">
              <div>
                <p className="hidden text-sm text-slate-500 lg:block">Average nightly price</p>
                <p className="text-sm font-medium text-slate-500 lg:hidden"><del>{formatCurrency(oldPrice)}</del> <span className="ml-1 font-bold text-teal-600">-15%</span></p>
                <p className="mt-1 text-3xl font-extrabold text-slate-900 lg:mt-2 lg:text-4xl">{formatCurrency(hotel.price)}</p>
                <p className="text-xs font-medium text-slate-500 lg:hidden">+ taxes</p>
                <p className="mt-1 hidden text-sm text-slate-500 lg:block"><del>{formatCurrency(oldPrice)}</del> <span className="ml-1 font-bold text-teal-600">-15%</span></p>
                <p className="hidden text-sm text-slate-500 lg:block">Taxes calculated during booking</p>
              </div>
              <Button as={Link} to={`/bookings?hotel=${hotel._id}`} className="px-8 shadow-md lg:hidden">
                Reserve
              </Button>
            </div>

            <div className="mt-6 hidden space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600 lg:block">
              <div className="flex justify-between">
                <span>Rating</span>
                <span className="font-semibold text-slate-900">{rating} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="font-semibold text-slate-900">After 2 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="font-semibold text-slate-900">Before 11 AM</span>
              </div>
            </div>

            <Button as={Link} to={`/bookings?hotel=${hotel._id}`} className="mt-6 hidden w-full lg:flex">
              Reserve this hotel
            </Button>
          </aside>
        </div>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Explore Around</h2>
            <span className="text-sm font-semibold text-teal-600">Nearby Tours</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 mb-6">Curated local experiences just steps from your stay.</p>
          
          <div className="flex overflow-x-auto gap-4 pb-4 px-1 snap-x snap-mandatory">
            {nearbyToursWithImages.map((tour, index) => (
              <div key={tour.id} className="group relative flex-none w-[260px] cursor-pointer flex-col overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 snap-start">
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    onError={(event) => handleImageError(event, `${hotel._id}-tour-${index}`)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md uppercase tracking-wider">{tour.tag}</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{tour.title}</h3>
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {tour.duration}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mb-4">{tour.desc}</p>
                  
                  <button className="mt-auto w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-900 hover:text-white active:scale-95">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Available Room Types</h2>
          <p className="mt-2 text-sm text-slate-500">Choose your perfect accommodation during booking.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900">Standard Room</h3>
              <p className="mt-1 text-sm text-slate-500">Perfect for short stays. Includes essentials.</p>
              <div className="mt-4 font-semibold text-teal-700">Base Price ({formatCurrency(hotel.price)})</div>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
              <div className="mb-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">Most Popular</div>
              <h3 className="font-bold text-slate-900">Deluxe Room</h3>
              <p className="mt-1 text-sm text-slate-500">More space, better views, premium amenities.</p>
              <div className="mt-4 font-semibold text-teal-700">1.5x Base Price ({formatCurrency(Math.round(hotel.price * 1.5))})</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-900 text-white">
              <h3 className="font-bold text-white">Executive Suite</h3>
              <p className="mt-1 text-sm text-slate-300">Ultimate luxury with separate living area.</p>
              <div className="mt-4 font-semibold text-teal-300">2.5x Base Price ({formatCurrency(Math.round(hotel.price * 2.5))})</div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Why guests choose this stay</h2>
            <p className={`mt-4 text-base leading-8 text-slate-600 transition-all duration-300 ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
              {hotel.name} offers a polished stay experience in {hotel.location}, combining a convenient location,
              comfortable interiors, and a booking flow that keeps pricing and actions easy to understand. Guests particularly appreciate the pristine maintenance, immediate access to local hotspots, and the consistently high standard of service delivered by the incredibly friendly staff.
            </p>
            <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="mt-2 text-sm font-bold text-teal-600 hover:text-teal-800">
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
            </button>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Included amenities</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {(showAllAmenities ? amenities : amenities.slice(0, 4)).map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  {item}
                </span>
              ))}
            </div>
            {amenities.length > 4 && (
              <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="mt-4 text-sm font-bold text-teal-600 hover:text-teal-800">
                {showAllAmenities ? 'Show fewer amenities' : `Show all ${amenities.length} amenities`}
              </button>
            )}
          </section>
        </div>

        <ReviewSection />
      </PageContainer>
    </div>
  );
}
