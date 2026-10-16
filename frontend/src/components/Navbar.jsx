import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import Avatar from './Avatar';
import { ChatIcon, PlusIcon, SearchIcon } from './Icons';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkCls = 'rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-brand-50 hover:text-brand-700';
  const itemCls = 'block rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700';

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[.06] bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="mr-2 flex items-center gap-2.5 font-display text-xl font-extrabold text-ink">
            <span className="flex h-9 w-9 -rotate-6 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[0_6px_14px_-6px_rgba(67,56,240,.7)]">
              C
            </span>
            <span className="hidden sm:inline">Campus Mart</span>
          </Link>

          <Link to="/products" className={`${linkCls} inline-flex items-center gap-1.5`}>
            <SearchIcon size={16} />
            <span className="hidden sm:inline">Browse products</span>
            <span className="sm:hidden">Browse</span>
          </Link>
        </div>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          {user ? (
            <>
              <Link to="/products/new" className="btn-primary !px-4 !py-2">
                <PlusIcon size={16} />
                <span>Sell</span>
              </Link>
              <Link to="/chat" className={`${linkCls} inline-flex items-center gap-1.5 !px-2.5`} aria-label="Chat">
                <ChatIcon size={19} />
                <span className="hidden md:inline">Chat</span>
              </Link>
              <NotificationDropdown />
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center rounded-full transition hover:opacity-90"
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                >
                  <Avatar person={user} size={38} />
                </button>
                {menuOpen && (
                  <div className="card absolute right-0 mt-3 w-56 animate-pop p-1.5 shadow-pop">
                    <div className="mb-1 flex items-center gap-3 rounded-lg bg-paper px-3 py-2.5">
                      <Avatar person={user} size={32} ring={false} />
                      <p className="truncate text-sm font-bold">{user.name}</p>
                    </div>
                    <Link to="/profile" className={itemCls} onClick={() => setMenuOpen(false)}>
                      Profile
                    </Link>
                    <Link to="/my-listings" className={itemCls} onClick={() => setMenuOpen(false)}>
                      My listings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className={itemCls} onClick={() => setMenuOpen(false)}>
                        Admin dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-2">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
