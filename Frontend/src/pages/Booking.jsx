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
  const [date, setDate] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user._id) {
      setStatus({ type: 'error', message: 'Please log in before creating a booking.' });
      return;
    }

    try {
      await api.post('/bookings', {
        user: user._id,
        hotel: hotelId,
        date
      });
      setStatus({ type: 'success', message: 'Booking created successfully.' });
      setDate('');
      fetchBookings();
    } catch (error) {
      setStatus({ type: 'error', message: 'Booking failed. Please try again.' });
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

              <FormField label="Booking date" id="booking-date">
                <input
                  id="booking-date"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </FormField>

              <Button type="submit">Confirm booking</Button>
            </form>
          </div>

          <BookingSummaryCard hotel={selectedHotel} selectedDate={date} count={hotels.length} />
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
                    <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Price</th>
                    <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-t border-slate-200">
                      <td className="px-5 py-4 font-semibold text-slate-900">{booking.hotel.name}</td>
                      <td className="px-5 py-4 text-slate-600">{booking.hotel.location}</td>
                      <td className="px-5 py-4 text-slate-600">₹{booking.hotel.price}</td>
                      <td className="px-5 py-4 text-slate-600">{new Date(booking.date).toLocaleDateString()}</td>
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
