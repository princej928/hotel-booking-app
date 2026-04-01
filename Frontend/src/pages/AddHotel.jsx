import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import StatusBanner from '../components/common/StatusBanner';

const AddHotel = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/hotels', { 
        name, 
        location, 
        price: Number(price) 
      });
      setStatus({ type: 'success', message: 'Hotel added successfully.' });
      navigate('/');
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to add hotel.' });
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <PageContainer className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.95)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">Admin panel</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Create a new hotel listing</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Use this screen to expand inventory with clear pricing and location information before guests begin booking.
          </p>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.32)] sm:p-8">
          {status.message && <StatusBanner type={status.type}>{status.message}</StatusBanner>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Hotel name" id="hotel-name">
              <input
                id="hotel-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grand Plaza"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </FormField>
            <FormField label="Location" id="hotel-location">
              <input
                id="hotel-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Karnataka"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </FormField>
            <FormField label="Price per night" id="hotel-price">
              <input
                id="hotel-price"
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 150"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </FormField>
            <Button className="w-full" type="submit">Add hotel</Button>
          </form>
        </div>
      </PageContainer>
    </div>
  );
};

export default AddHotel;
