import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { getStableRating, getFacilities, handleImageError, getFallbackImage } from '../utils/hotelHelpers';

const gallery = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
];

export default function HotelDetails() {
  const { id } = useParams();
  const [hotels, setHotels] = useState([]);

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
  const amenities = [...getFacilities(hotel.price), 'Front desk', 'Air conditioning'];

  return (
    <div className="pb-16 pt-8">
      <PageContainer className="space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">Hotel details</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{hotel.name}</h1>
          <p className="text-lg text-slate-500">{hotel.location}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <img src={hotel.gallery?.[0] || hotel.image || gallery[0]} alt={hotel.name} className="h-[420px] w-full rounded-[30px] object-cover sm:col-span-2" onError={(e) => handleImageError(e, hotel._id)} />
            <img src={hotel.gallery?.[1] || gallery[1]} alt="" className="h-52 w-full rounded-[28px] object-cover" onError={(e) => handleImageError(e, hotel._id + '1')} />
            <img src={hotel.gallery?.[2] || gallery[2]} alt="" className="h-52 w-full rounded-[28px] object-cover" onError={(e) => handleImageError(e, hotel._id + '2')} />
          </div>

          <aside className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.3)] lg:sticky lg:top-24 lg:h-fit">
            <p className="text-sm text-slate-500">Average nightly price</p>
            <p className="mt-2 text-4xl font-extrabold text-slate-900">₹{hotel.price}</p>
            <p className="mt-1 text-sm text-slate-500">Taxes calculated during booking</p>

            <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
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

            <Button as={Link} to={`/bookings?hotel=${hotel._id}`} className="mt-6 w-full">
              Reserve this hotel
            </Button>
          </aside>
        </div>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Available Room Types</h2>
          <p className="mt-2 text-sm text-slate-500">Choose your perfect accommodation during booking.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900">Standard Room</h3>
              <p className="mt-1 text-sm text-slate-500">Perfect for short stays. Includes essentials.</p>
              <div className="mt-4 font-semibold text-teal-700">Base Price (₹{hotel.price})</div>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
              <div className="mb-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">Most Popular</div>
              <h3 className="font-bold text-slate-900">Deluxe Room</h3>
              <p className="mt-1 text-sm text-slate-500">More space, better views, premium amenities.</p>
              <div className="mt-4 font-semibold text-teal-700">1.5x Base Price (₹{(hotel.price * 1.5).toFixed(0)})</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-900 text-white">
              <h3 className="font-bold text-white">Executive Suite</h3>
              <p className="mt-1 text-sm text-slate-300">Ultimate luxury with separate living area.</p>
              <div className="mt-4 font-semibold text-teal-300">2.5x Base Price (₹{(hotel.price * 2.5).toFixed(0)})</div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Why guests choose this stay</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {hotel.name} offers a polished stay experience in {hotel.location}, combining a convenient location,
              comfortable interiors, and a booking flow that keeps pricing and actions easy to understand.
            </p>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Included amenities</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {amenities.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
