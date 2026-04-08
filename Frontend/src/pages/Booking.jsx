import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import StatusBanner from '../components/common/StatusBanner';
import EmptyState from '../components/common/EmptyState';
import BookingSummaryCard from '../components/booking/BookingSummaryCard';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('Standard');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();
  const selectedHotelFromUrl = new URLSearchParams(location.search).get('hotel');

  useEffect(() => {
    if (user._id) {
      fetchBookings();
    }
    fetchHotels();
  }, [user._id]);

  useEffect(() => {
    if (selectedHotelFromUrl) {
      setHotelId(selectedHotelFromUrl);
    }
  }, [selectedHotelFromUrl]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get(`/bookings/user/${user._id}`);
      setBookings(data);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to fetch your bookings.' });
    }
  };

  const fetchHotels = async () => {
    try {
      const { data } = await api.get('/hotels');
      setHotels(data);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to load hotel options.' });
    }
  };

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => hotel._id === hotelId),
    [hotels, hotelId]
  );

  const { finalTotal, subtotal, taxes, days } = useMemo(() => {
    if (!selectedHotel || !checkInDate || !checkOutDate) return { finalTotal: 0, subtotal: 0, taxes: 0, days: 0 };
    const date1 = new Date(checkInDate);
    const date2 = new Date(checkOutDate);
    const timeDiff = date2.getTime() - date1.getTime();
    let computedDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (computedDays <= 0) computedDays = 0;
    
    const roomMultipliers = { Standard: 1, Deluxe: 1.5, Suite: 2.5 };
    let basePrice = selectedHotel.price * computedDays;
    let multiplier = roomMultipliers[roomType] || 1;
    let computedSubtotal = Math.round(basePrice * multiplier);
    let computedTaxes = Math.round(computedSubtotal * 0.12);
    return { finalTotal: computedSubtotal + computedTaxes, days: computedDays, subtotal: computedSubtotal, taxes: computedTaxes };
  }, [selectedHotel, checkInDate, checkOutDate, roomType]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user._id) {
      setStatus({ type: 'error', message: 'Please log in before creating a booking.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/bookings', {
        user: user._id,
        hotel: hotelId,
        checkInDate,
        checkOutDate,
        guests,
        roomType,
        totalPrice: finalTotal
      });
      setStatus({ type: 'success', message: 'Booking created successfully.' });
      alert('🎉 Booking confirmed successfully! Check your recent bookings below.');
      setCheckInDate('');
      setCheckOutDate('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchBookings();
    } catch (error) {
      setStatus({ type: 'error', message: 'Booking failed. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-16 pt-8">
      <PageContainer className="space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Booking center</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Plan and manage your stays</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Choose a hotel, confirm a date, and keep track of previous bookings in one clearer page.
            </p>
          </div>
          <Link to="/hotels" className="text-sm font-semibold text-teal-700 transition hover:text-teal-600">
            Browse more hotels
          </Link>
        </div>

        {status.message && <StatusBanner type={status.type}>{status.message}</StatusBanner>}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.28)] sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Create a new booking</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Keep the booking form short and decision-friendly. Guests should always understand what they are reserving.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormField label="Guest name" id="booking-guest">
                <input
                  id="booking-guest"
                  value={user.name || ''}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
              </FormField>

              <FormField label="Choose hotel" id="booking-hotel">
                <select
                  id="booking-hotel"
                  required
                  value={hotelId}
                  onChange={(event) => setHotelId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                >
                  <option value="">Select a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name} - {hotel.location}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Check-in Date" id="booking-checkin">
                  <input
                    id="booking-checkin"
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(event) => setCheckInDate(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </FormField>
                <FormField label="Check-out Date" id="booking-checkout">
                  <input
                    id="booking-checkout"
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(event) => setCheckOutDate(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Guests" id="booking-guests">
                  <input
                    id="booking-guests"
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={guests}
                    onChange={(event) => setGuests(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </FormField>
                <FormField label="Room Type" id="booking-room">
                  <select
                    id="booking-room"
                    required
                    value={roomType}
                    onChange={(event) => setRoomType(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Executive Suite</option>
                  </select>
                </FormField>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm booking'}
              </Button>
            </form>
          </div>

          <BookingSummaryCard hotel={selectedHotel} checkInDate={checkInDate} checkOutDate={checkOutDate} roomType={roomType} days={days} subtotal={subtotal} taxes={taxes} finalTotal={finalTotal} />
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.24)] sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your recent bookings</h2>
              <p className="mt-2 text-sm text-slate-500">A clearer history table helps guests trust what was actually reserved.</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No bookings yet"
                description="When you reserve a hotel, it will appear here with stay date and property details."
                action={<Button as={Link} to="/hotels">Explore hotels</Button>}
              />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-[24px] border border-slate-200">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Hotel</th>
                    <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Location</th>
                    <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Dates</th>
                    <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Room</th>
                    <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-t border-slate-200">
                      <td className="px-5 py-4 font-semibold text-slate-900">{booking.hotel.name}</td>
                      <td className="px-5 py-4 text-slate-600">{booking.hotel.location}</td>
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : (booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A')}
                        <br />
                        <span className="text-slate-400">to</span> {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{booking.roomType || 'Standard'}</td>
                      <td className="px-5 py-4 font-bold text-slate-900">₹{booking.totalPrice || booking.hotel.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Booking;
