import { useEffect, useState } from 'react';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import SectionHeading from '../components/common/SectionHeading';
import StatusBanner from '../components/common/StatusBanner';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/hotelHelpers';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Could not load bookings' });
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Delete this booking record?')) return;

    try {
      const { data } = await api.delete(`/admin/bookings/${bookingId}`);
      setStatus({ type: 'success', message: data.message });
      setBookings((current) => current.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Could not delete booking' });
    }
  };

  return (
    <div className="pb-16 pt-8">
      <PageContainer className="space-y-8 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Admin"
          title="Manage booking records"
          description="Review all bookings across the platform and delete incorrect or unwanted records."
        />

        {status.message && <StatusBanner type={status.type}>{status.message}</StatusBanner>}

        {bookings.length === 0 ? (
          <EmptyState
            title="No bookings found"
            description="Once users start reserving hotels, their booking records will appear here."
          />
        ) : (
          <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">User</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Email</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Hotel</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Stay</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Guests</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Room</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Total</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Booked On</th>
                  <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-semibold text-slate-900">{booking.user?.name || 'Deleted user'}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.user?.email || '--'}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.hotel?.name || 'Deleted hotel'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {formatDate(booking.checkInDate || booking.date)}
                      <br />
                      <span className="text-slate-400">to</span> {formatDate(booking.checkOutDate)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{booking.guests || 1}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.roomType || 'Standard'}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{formatCurrency(booking.totalPrice || booking.hotel?.price)}</td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(booking.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(booking._id)}
                        className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
