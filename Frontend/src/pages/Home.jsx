import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import HotelCard from '../components/hotel/HotelCard';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const { data } = await api.get('/hotels');
      setHotels(data);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'We could not load hotels right now. Please try again shortly.'
      });
    }
  };

  const handleBook = async (hotelId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/bookings?hotel=${hotelId}`);
  };

  const handleDelete = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await api.delete(`/hotels/${hotelId}`);
      setHotels(hotels.filter(h => h._id !== hotelId));
      setStatus({
        type: 'success',
        message: 'Hotel deleted successfully.'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to delete this hotel.'
      });
    }
  };

  const featuredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const haystack = `${hotel.name} ${hotel.location}`.toLowerCase();
        return haystack.includes(searchTerm.toLowerCase());
      })
      .slice(0, 6);
  }, [hotels, searchTerm]);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.25),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_28%)]" />
        <PageContainer className="hero-grid px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              Modern stays, faster booking, cleaner experience
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find beautiful hotels and book your next stay with confidence.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Discover standout rooms, compare pricing quickly, and manage bookings in one polished hotel platform.
              </p>
            </div>

            <div className="glass-surface max-w-3xl rounded-[28px] border border-white/70 p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.4)]">
              <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Destination or hotel</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by city or hotel name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Guests</span>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-500">
                    2 guests
                  </div>
                </div>

                <div className="flex items-end">
                  <Button className="w-full md:w-auto" onClick={() => navigate('/hotels')}>
                    Explore 
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['500+', 'Curated stays'],
                ['24/7', 'Booking support'],
                ['4.8/5', 'Guest satisfaction']
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm">
                  <div className="text-2xl font-bold text-slate-900">{value}</div>
                  <div className="mt-1 text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-full bg-amber-300/30 blur-2xl lg:block" />
            <div className="absolute -right-4 bottom-8 hidden h-28 w-28 rounded-full bg-teal-300/30 blur-2xl lg:block" />
            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white p-3 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)]">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
                alt="Premium hotel suite"
                className="h-[440px] w-full rounded-[24px] object-cover"
              />
              <div className="glass-surface absolute bottom-8 left-8 right-8 rounded-3xl border border-white/60 p-5 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Top-rated escape</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Skyline Grand Retreat</h2>
                    <p className="mt-1 text-sm text-slate-600">Infinity pool, city views, breakfast included</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                    <div className="text-sm font-semibold text-emerald-700">From</div>
                    <div className="text-lg font-bold text-slate-900">₹22,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section id="discover-hotels" className="pt-6">
        <PageContainer className="space-y-8 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured stays"
            title="Hotels your guests will want to book"
            description="A card system built for scanning quickly: location, pricing, and actions stay clear on desktop and mobile."
            action={(
              <Link
                to={user?.isAdmin ? '/add-hotel' : '/login'}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                {user?.isAdmin ? 'Add a new hotel' : 'Sign in to book'}
              </Link>
            )}
          />

          {status.message && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {status.message}
            </div>
          )}

          {featuredHotels.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">No hotels found</h3>
              <p className="mt-2 text-slate-500">
                Try a different destination search or add your first hotel listing.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredHotels.map((hotel) => (
                <div key={hotel._id} className="space-y-3">
                  <HotelCard
                    hotel={hotel}
                    isAdmin={user?.isAdmin}
                    onBook={handleBook}
                    onDelete={handleDelete}
                  />
                  <div className="flex items-center justify-between px-1">
                    <Link to={`/hotels/${hotel._id}`} className="text-sm font-semibold text-teal-700 transition hover:text-teal-600">
                      View full details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PageContainer>
      </section>

      <section className="pt-14">
        <PageContainer className="px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-[32px] bg-slate-900 px-6 py-8 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.85)] sm:px-8 lg:grid-cols-3 lg:px-10">
            {[
              {
                title: 'Clear pricing',
                body: 'Show nightly cost early so users can decide without jumping between screens.'
              },
              {
                title: 'Fast admin actions',
                body: 'Keep create and delete actions visible only for admins while the public experience stays focused.'
              },
              {
                title: 'Stronger engagement',
                body: 'Use trust signals, premium imagery, and featured sections to increase bookings and retention.'
              }
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>
    </div>
  );
};

export default Home;
