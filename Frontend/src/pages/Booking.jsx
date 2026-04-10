import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import StatusBanner from '../components/common/StatusBanner';
import EmptyState from '../components/common/EmptyState';
import BookingSummaryCard from '../components/booking/BookingSummaryCard';
import { formatCurrency, formatDate } from '../utils/hotelHelpers';

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
  const [latestBooking, setLatestBooking] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();
  const selectedHotelFromUrl = new URLSearchParams(location.search).get('hotel');
  const today = new Date().toISOString().split('T')[0];

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

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;

    try {
      const { data } = await api.delete(`/bookings/${bookingId}`);
      setBookings((current) => current.filter((booking) => booking._id !== bookingId));
      setStatus({ type: 'success', message: data.message });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Could not delete this booking.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const validationMessage = useMemo(() => {
    if (!hotelId) return 'Choose a hotel to continue.';
    if (!checkInDate || !checkOutDate) return 'Select both check-in and check-out dates.';
    if (checkInDate < today) return 'Check-in date cannot be in the past.';
    if (checkOutDate <= checkInDate) return 'Check-out date must be after check-in date.';
    if (!days) return 'Booking must be for at least one night.';
    if (Number(guests) < 1 || Number(guests) > 10) return 'Guests must be between 1 and 10.';
    return '';
  }, [hotelId, checkInDate, checkOutDate, today, days, guests]);
  const shouldShowValidationMessage = Boolean(hotelId || checkInDate || checkOutDate);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user._id) {
      setStatus({ type: 'error', message: 'Please log in before creating a booking.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (validationMessage) {
      setStatus({ type: 'error', message: validationMessage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        user: user._id,
        hotel: hotelId,
        checkInDate,
        checkOutDate,
        guests: Number(guests),
        roomType,
        totalPrice: finalTotal
      });
      setStatus({ type: 'success', message: 'Booking confirmed. Your stay now appears in recent bookings below.' });
      setLatestBooking(data);
      setCheckInDate('');
      setCheckOutDate('');
      setGuests(2);
      setRoomType('Standard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchBookings();
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Booking failed. Please try again.' });
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

        {latestBooking && (
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-900 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Latest confirmation</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              <span className="font-semibold">{latestBooking.hotel?.name || selectedHotel?.name || 'Hotel booked'}</span>
              <span>{formatDate(latestBooking.checkInDate)} to {formatDate(latestBooking.checkOutDate)}</span>
              <span>{latestBooking.roomType || roomType}</span>
              <span>{formatCurrency(latestBooking.totalPrice || finalTotal)}</span>
            </div>
          </div>
        )}

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
                  onChange={(event) => {
                    setHotelId(event.target.value);
                    setLatestBooking(null);
                  }}
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
                    min={today}
                    value={checkInDate}
                    onChange={(event) => {
                      const nextCheckInDate = event.target.value;
                      setCheckInDate(nextCheckInDate);
                      setLatestBooking(null);

                      if (checkOutDate && checkOutDate <= nextCheckInDate) {
                        setCheckOutDate('');
                      }
                    }}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </FormField>
                <FormField label="Check-out Date" id="booking-checkout">
                  <input
                    id="booking-checkout"
                    type="date"
                    required
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={(event) => {
                      setCheckOutDate(event.target.value);
                      setLatestBooking(null);
                    }}
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
                    onChange={(event) => {
                      setGuests(event.target.value);
                      setLatestBooking(null);
                    }}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </FormField>
                <FormField label="Room Type" id="booking-room">
                  <select
                    id="booking-room"
                    required
                    value={roomType}
                    onChange={(event) => {
                      setRoomType(event.target.value);
                      setLatestBooking(null);
                    }}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Executive Suite</option>
                  </select>
                </FormField>
              </div>

              {shouldShowValidationMessage && validationMessage && (
                <StatusBanner type="info">{validationMessage}</StatusBanner>
              )}

              <Button type="submit" disabled={isSubmitting || Boolean(validationMessage)}>
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
                    <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-t border-slate-200">
                      <td className="px-5 py-4 font-semibold text-slate-900">{booking.hotel.name}</td>
                      <td className="px-5 py-4 text-slate-600">{booking.hotel.location}</td>
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(booking.checkInDate || booking.date)}
                        <br />
                        <span className="text-slate-400">to</span> {formatDate(booking.checkOutDate)}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{booking.roomType || 'Standard'}</td>
                      <td className="px-5 py-4 font-bold text-slate-900">{formatCurrency(booking.totalPrice || booking.hotel.price)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                        >
                          Cancel
                        </button>
                      </td>
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
