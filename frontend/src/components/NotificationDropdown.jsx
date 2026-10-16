import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { BellIcon } from './Icons';
import { getNotifications, markAllAsRead, markAsRead } from '../services/notificationService';

const NotificationDropdown = () => {
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const load = useCallback(() => {
    getNotifications()
      .then(({ data }) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!socket) return undefined;
    const handler = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    socket.on('notification:new', handler);
    return () => socket.off('notification:new', handler);
  }, [socket]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = async () => {
    setOpen((o) => !o);
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClick = async (n) => {
    if (!n.read) {
      await markAsRead(n._id);
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative rounded-xl p-2.5 text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
        aria-label="Notifications"
      >
        <BellIcon size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-marigold px-1 text-[10px] font-extrabold text-ink ring-2 ring-paper">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="card scroll-quiet absolute right-0 mt-3 max-h-96 w-80 max-w-[calc(100vw-2rem)] animate-pop overflow-y-auto p-2 shadow-pop">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="font-display text-base font-bold">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} className="text-xs font-semibold text-brand-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-ink-mute">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n._id}
                to={n.link || '#'}
                onClick={() => handleClick(n)}
                className={`flex gap-3 rounded-xl px-2.5 py-2.5 text-sm transition hover:bg-paper ${
                  !n.read ? 'bg-brand-50/70' : ''
                }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-brand-600' : 'bg-transparent'}`}
                />
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{n.text}</span>
                  <span className="mt-0.5 block text-xs text-ink-mute">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
