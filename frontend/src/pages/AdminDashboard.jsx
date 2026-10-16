import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import {
  getStats,
  getAllUsers,
  setUserStatus,
  setUserRole,
  getAllProducts,
  removeProduct,
} from '../services/adminService';
import { extractErrorMessage } from '../services/api';

const TABS = ['Overview', 'Users', 'Products'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes, productsRes] = await Promise.all([
        getStats(),
        getAllUsers(),
        getAllProducts(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data.products);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleUserStatus = async (u) => {
    const { data } = await setUserStatus(u._id, !u.isActive);
    setUsers((prev) => prev.map((x) => (x._id === u._id ? data.user : x)));
  };

  const toggleUserRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    const { data } = await setUserRole(u._id, nextRole);
    setUsers((prev) => prev.map((x) => (x._id === u._id ? data.user : x)));
  };

  const handleRemoveProduct = async () => {
    await removeProduct(confirmRemove._id);
    setProducts((prev) => prev.filter((p) => p._id !== confirmRemove._id));
    setConfirmRemove(null);
  };

  if (loading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorState message={error} onRetry={load} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl">Admin dashboard</h1>

      <div className="mb-8 inline-flex gap-1 rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-ink/[.06]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
              tab === t ? 'bg-ink text-white' : 'text-ink-soft hover:bg-paper'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['Total users', stats.totalUsers],
            ['Total listings', stats.totalProducts],
            ['Available', stats.availableProducts],
            ['Sold', stats.soldProducts],
          ].map(([label, value]) => (
            <div key={label} className="card p-5">
              <p className="text-xs font-semibold text-ink-mute">{label}</p>
              <p className="mt-2 font-display text-4xl font-extrabold">{value}</p>
            </div>
          ))}

          <div className="card col-span-2 p-6 sm:col-span-4">
            <p className="mb-4 font-display text-lg font-bold">Listings by category</p>
            <div className="space-y-3">
              {stats.categoryBreakdown.map((c) => (
                <div key={c._id} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 font-semibold text-ink-soft">{c._id}</span>
                  <div className="h-2.5 flex-1 rounded-full bg-brand-50">
                    <div
                      className="h-2.5 rounded-full bg-brand-600"
                      style={{
                        width: `${Math.min(100, (c.count / stats.totalProducts) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-ink">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Users' && (
        <div className="card scroll-quiet overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/[.06] bg-paper/60 text-left text-xs font-bold text-ink-mute">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ink/[.04] transition last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-paper text-ink-mute'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-mute">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserRole(u)}
                      className="text-xs font-bold text-brand-600 hover:underline"
                    >
                      {u.role === 'admin' ? 'Demote' : 'Make admin'}
                    </button>
                    <button
                      onClick={() => toggleUserStatus(u)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      {u.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Products' && (
        <div className="card scroll-quiet overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/[.06] bg-paper/60 text-left text-xs font-bold text-ink-mute">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-ink/[.04] transition last:border-0 hover:bg-paper/60">
                  <td
                    className="px-4 py-3 font-medium cursor-pointer hover:text-brand-700"
                    onClick={() => navigate(`/products/${p._id}`)}
                  >
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{p.seller?.name}</td>
                  <td className="px-4 py-3">₹{p.price}</td>
                  <td className="px-4 py-3 capitalize">{p.status}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setConfirmRemove(p)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        title="Remove this product?"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setConfirmRemove(null)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={handleRemoveProduct}>
              Remove
            </button>
          </>
        }
      >
        <p className="text-sm">
          "{confirmRemove?.title}" will be permanently removed from the marketplace.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default AdminDashboard;
