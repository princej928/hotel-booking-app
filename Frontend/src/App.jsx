import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddHotel from './pages/AddHotel';
import Booking from './pages/Booking';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import ForgotPassword from './pages/ForgotPassword';
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import AdminRoute from './components/auth/AdminRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import api from './api';
import './App.css';

function App() {
  const [authTick, setAuthTick] = useState(0);

  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setAuthTick((value) => value + 1);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        localStorage.setItem(
          'user',
          JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            isAdmin: data.isAdmin
          })
        );
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setAuthTick((value) => value + 1);
      }
    };

    syncAuth();
    window.addEventListener('auth-changed', syncAuth);

    return () => {
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar key={authTick} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-hotel" element={<AdminRoute><AddHotel /></AdminRoute>} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
