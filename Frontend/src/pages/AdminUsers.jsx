import { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeading from '../components/common/SectionHeading';
import StatusBanner from '../components/common/StatusBanner';
import EmptyState from '../components/common/EmptyState';

import api from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Could not load users' });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user and their bookings?')) return;

    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      setStatus({ type: 'success', message: data.message });
      setUsers((current) => current.filter((user) => user._id !== userId));
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Could not delete user' });
    }
  };

  return (
    <div className="pb-16 pt-8">
      <PageContainer className="space-y-8 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Admin"
          title="Manage user accounts"
          description="As admin, you can review all registered users and remove accounts from the records when needed."
        />

        {status.message && <StatusBanner type={status.type}>{status.message}</StatusBanner>}

        {users.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Registered accounts will appear here once people sign up."
          />
        ) : (
          <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Name</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Email</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Role</th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Created</th>
                  <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-semibold text-slate-900">{user.name}</td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4 text-slate-600">{user.isAdmin ? 'Admin' : 'User'}</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      {!user.isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)}
                          className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      )}
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
