import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import PageContainer from './PageContainer';

const navLinkClass = (active) =>
  `rounded-full px-3 py-2 text-sm font-medium transition ${
    active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'
  }`;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <PageContainer className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-sm">
              VS
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-slate-900">Velvet Sands</div>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-teal-600">Curated Experiences</div>
            </div>
          </Link>

          {!token && (
            <Link
              to="/signup"
              className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 lg:hidden"
            >
              Sign up
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav className="flex flex-wrap items-center gap-2 rounded-full bg-slate-100/80 p-1.5">
            <Link to="/" className={navLinkClass(location.pathname === '/')}>Home</Link>
            <Link to="/hotels" className={navLinkClass(location.pathname.startsWith('/hotels'))}>Experiences</Link>
            {token && <Link to="/bookings" className={navLinkClass(location.pathname === '/bookings')}>My Bookings</Link>}
            {user?.isAdmin && <Link to="/add-hotel" className={navLinkClass(location.pathname === '/add-hotel')}>Add Hotel</Link>}
            {user?.isAdmin && <Link to="/admin/users" className={navLinkClass(location.pathname === '/admin/users')}>Users</Link>}
            {user?.isAdmin && <Link to="/admin/bookings" className={navLinkClass(location.pathname === '/admin/bookings')}>Records</Link>}
          </nav>

          <div className="flex items-center gap-3">
            {token ? (
              <>
                <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 sm:block">
                  Signed in as <span className="font-semibold text-slate-900">{user?.name || 'Guest'}</span>
                </div>
                <Button variant="secondary" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900">
                  Login
                </Link>
                <Button as={Link} to="/signup">Create account</Button>
              </>
            )}
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
