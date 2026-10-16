import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getNotifications()
      .then(({ data }) => setNotifications(data.notifications))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleClick = async (n) => {
    if (!n.read) {
      await markAsRead(n._id);
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    }
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button onClick={handleMarkAll} className="text-sm font-bold text-brand-600 hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications yet" />
      ) : (
        <div className="card divide-y divide-ink/[.06] overflow-hidden">
          {notifications.map((n) => (
            <Link
              key={n._id}
              to={n.link || '#'}
              onClick={() => handleClick(n)}
              className={`flex gap-3 px-5 py-4 transition hover:bg-paper ${!n.read ? 'bg-brand-50/70' : ''}`}
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-brand-600' : 'bg-transparent'}`} />
              <span>
                <span className="block text-sm font-medium text-ink">{n.text}</span>
                <span className="mt-1 block text-xs text-ink-mute">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Notifications;
