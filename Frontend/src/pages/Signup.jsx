import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import AuthLayout from '../components/auth/AuthLayout';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import StatusBanner from '../components/common/StatusBanner';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin }));
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the platform to start booking stays immediately. The first user remains your admin account based on backend logic."
      asideTitle="Set up your booking workspace"
      asideText="This onboarding experience now feels more like a real product: calmer form spacing, better hierarchy, and clearer trust messaging."
    >
      {error && <StatusBanner type="error">{error}</StatusBanner>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Full name" id="signup-name">
          <input
            id="signup-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </FormField>
        <FormField label="Email address" id="signup-email">
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </FormField>
        <FormField label="Password" id="signup-password" hint="Use a strong password for your admin or guest account.">
          <input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </FormField>
        <Button className="w-full" type="submit">Create account</Button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-600">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
