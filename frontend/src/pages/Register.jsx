import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../services/api';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/', { replace: true });
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
            Clear out your hostel room. Fund your next semester.
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
        <h1 className="text-3xl font-extrabold">Create your account</h1>
          <p className="mb-7 mt-1.5 text-sm text-ink-soft">Join your campus marketplace</p>

        {error && (
          <div className="alert-error mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="label">
              Full name
            </label>
            <input
              id="name"
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
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
              minLength={6}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="phone" className="label">Mobile number</label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+919876543210"
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="label">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              className="input"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full !py-3" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
