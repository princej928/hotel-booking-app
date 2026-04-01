import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AuthLayout from '../components/auth/AuthLayout';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import StatusBanner from '../components/common/StatusBanner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const requestOtp = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      const { data } = await api.post('/auth/forgot-password/request-otp', { email });
      setOtpSent(true);
      setDevOtp(data.devOtp || '');
      setStatus({ type: 'success', message: data.message });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Could not send OTP'
      });
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      const { data } = await api.post('/auth/forgot-password/verify-otp', {
        email,
        otp,
        newPassword
      });
      setStatus({ type: 'success', message: data.message });
      setOtp('');
      setNewPassword('');
      setDevOtp('');
      setOtpSent(false);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Could not verify OTP'
      });
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Request an OTP, receive it by email when mail is configured, and then set a new password securely."
      asideTitle="Recover account access"
      asideText="This flow now uses a one-time password. If SMTP email is configured on the backend, the OTP is mailed automatically. Otherwise, a development OTP is shown on screen for testing."
    >
      {status.message && <StatusBanner type={status.type}>{status.message}</StatusBanner>}
      {devOtp && (
        <StatusBanner type="info">
          Development OTP: <strong>{devOtp}</strong>. Configure SMTP in the backend `.env` to send real emails.
        </StatusBanner>
      )}
      <form onSubmit={otpSent ? verifyOtp : requestOtp} className="space-y-5">
        <FormField label="Registered email" id="forgot-email">
          <input
            id="forgot-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </FormField>
        {otpSent && (
          <>
            <FormField label="OTP code" id="forgot-otp">
              <input
                id="forgot-otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </FormField>
            <FormField label="New password" id="forgot-password">
              <input
                id="forgot-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </FormField>
          </>
        )}
        <Button className="w-full" type="submit">
          {otpSent ? 'Verify OTP and update password' : 'Send OTP'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Remembered it?{' '}
        <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-600">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
