import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import AuthLayout from '../components/auth/AuthLayout';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import StatusBanner from '../components/common/StatusBanner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin }));
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage bookings, view stays, and access admin controls if your account allows it."
      asideTitle="Return to your hotel dashboard"
      asideText="The new experience keeps actions clearer, forms calmer, and account access more trustworthy for both guests and admins."
    >
      {error && <StatusBanner type="error">{error}</StatusBanner>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Email address" id="login-email">
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </FormField>
        <FormField label="Password" id="login-password">
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </FormField>
        <Button className="w-full" type="submit">Login</Button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-teal-700 hover:text-teal-600">
          Sign up
        </Link>
      </p>
      <p className="mt-3 text-sm text-slate-500">
        Forgot your password?{' '}
        <Link to="/forgot-password" className="font-semibold text-teal-700 hover:text-teal-600">
          Reset it here
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
