import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import HotelCard from '../components/hotel/HotelCard';
import StatusBanner from '../components/common/StatusBanner';

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const { data } = await api.get('/hotels');
        setHotels(data);
      } catch (error) {
        setStatus({ type: 'error', message: 'Unable to load the hotel listings right now.' });
      }
    };

    loadHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    return [...hotels]
      .filter((hotel) => `${hotel.name} ${hotel.location}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sortBy === 'price-asc' ? a.price - b.price : b.price - a.price));
  }, [hotels, query, sortBy]);

  const handleDelete = async (hotelId) => {
    if (!window.confirm('Delete this hotel listing?')) return;

    try {
      await api.delete(`/hotels/${hotelId}`);
      setHotels((current) => current.filter((hotel) => hotel._id !== hotelId));
      setStatus({ type: 'success', message: 'Hotel removed successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Could not delete this hotel.' });
    }
  };

  const handleBook = (hotelId) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    navigate(`/bookings?hotel=${hotelId}`);
  };

  return (
    <div className="pb-16 pt-8">
      <PageContainer className="space-y-8 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Browse"
          title="Explore hotel listings"
          description="Search by location, compare prices, and move into a cleaner booking flow."
          action={
            user?.isAdmin ? (
              <Link
                to="/add-hotel"
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Add hotel
              </Link>
            ) : null
          }
        />

        <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1.4fr_220px]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Search hotel or city</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Goa, Bengaluru, Ocean Pearl..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>

        {status.message && <StatusBanner type={status.type}>{status.message}</StatusBanner>}

        {filteredHotels.length === 0 ? (
          <EmptyState
            title="No hotels match this search"
            description="Adjust your filters or add a new property to make this catalog more useful."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <div key={hotel._id} className="space-y-3">
                <HotelCard hotel={hotel} isAdmin={false} onBook={handleBook} onDelete={() => {}} />
                <div className="flex items-center justify-between px-1">
                  <Link
                    to={`/hotels/${hotel._id}`}
                    className="text-sm font-semibold text-teal-700 transition hover:text-teal-600"
                  >
                    View full details
                  </Link>
                  {user?.isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(hotel._id)}
                      className="text-sm font-semibold text-rose-600 transition hover:text-rose-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
