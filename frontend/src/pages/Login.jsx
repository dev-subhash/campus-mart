import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-brand-600 opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-10 h-60 w-60 rounded-full bg-marigold opacity-20 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5 font-display text-2xl font-extrabold">
          <span className="flex h-10 w-10 -rotate-6 items-center justify-center rounded-xl bg-marigold text-ink">C</span>
          Campus Mart
        </Link>
        <div className="relative">
          <h2 className="font-display text-5xl font-extrabold leading-[1.02]">
            Your campus, one tap away.
          </h2>
          <p className="mt-4 max-w-sm text-white/65">Textbooks, electronics, furniture, and more — straight from fellow students.</p>
          <div className="mt-8 flex gap-3">
            <span className="price-tag -rotate-3 text-xl">₹250</span>
            <span className="price-tag rotate-2 text-xl">₹1,200</span>
            <span className="price-tag -rotate-1 text-xl">₹90</span>
          </div>
        </div>
        <p className="relative text-xs text-white/40">Built for students, by students.</p>
      </aside>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="animate-rise w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5 font-display text-xl font-extrabold lg:hidden">
            <span className="flex h-9 w-9 -rotate-6 items-center justify-center rounded-xl bg-brand-600 text-white">C</span>
            Campus Mart
          </Link>
        <h1 className="text-3xl font-extrabold">Welcome back</h1>
          <p className="mb-7 mt-1.5 text-sm text-ink-soft">Log in to Campus Mart</p>

        {error && (
          <div className="alert-error mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-semibold text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button type="submit" className="btn-primary w-full !py-3" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-ink-soft">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
