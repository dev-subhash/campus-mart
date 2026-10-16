import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  requestPasswordReset,
  verifyPasswordReset,
  resetPassword,
} from '../services/authService';
import { extractErrorMessage } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', emailOtp: '', password: '', confirm: '' });
  const [resetId, setResetId] = useState('');
  const [developmentOtps, setDevelopmentOtps] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (step === 3 && form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      if (step === 1) {
        const { data } = await requestPasswordReset({ email: form.email });
        setResetId(data.resetId);
        setDevelopmentOtps(data.developmentOtps || null);
        setStep(2);
      } else if (step === 2) {
        await verifyPasswordReset({ resetId, emailOtp: form.emailOtp });
        setStep(3);
      } else {
        await resetPassword({ resetId, password: form.password });
        navigate('/login', { replace: true, state: { message: 'Password changed. You can now log in.' } });
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="animate-rise w-full max-w-sm">
        <Link to="/login" className="mb-8 flex items-center gap-2.5 font-display text-xl font-extrabold">
          <span className="flex h-9 w-9 -rotate-6 items-center justify-center rounded-xl bg-brand-600 text-white">C</span>
          Campus Mart
        </Link>
        <h1 className="text-3xl font-extrabold">Reset your password</h1>
        <p className="mb-7 mt-1.5 text-sm text-ink-soft">
          {step === 1 ? 'Enter your account email to receive a verification code.' : step === 2 ? 'Enter the verification code sent to your email.' : 'Choose a new password.'}
        </p>
        {error && <div className="alert-error mb-4">{error}</div>}
        {developmentOtps && (
          <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Local development code: {developmentOtps.email || 'sent by email'}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          {step === 1 && <>
            <div><label htmlFor="email" className="label">Email</label><input id="email" type="email" required className="input" value={form.email} onChange={update('email')} /></div>
          </>}
          {step === 2 && <>
            <div><label htmlFor="emailOtp" className="label">Email OTP</label><input id="emailOtp" inputMode="numeric" pattern="\d{6}" maxLength={6} required className="input" value={form.emailOtp} onChange={update('emailOtp')} /></div>
          </>}
          {step === 3 && <>
            <div><label htmlFor="password" className="label">New password</label><input id="password" type="password" minLength={6} required className="input" value={form.password} onChange={update('password')} /></div>
            <div><label htmlFor="confirm" className="label">Confirm password</label><input id="confirm" type="password" minLength={6} required className="input" value={form.confirm} onChange={update('confirm')} /></div>
          </>}
          <button type="submit" className="btn-primary w-full !py-3" disabled={submitting}>
            {submitting ? 'Please wait...' : step === 1 ? 'Send verification codes' : step === 2 ? 'Verify codes' : 'Change password'}
          </button>
        </form>
        <p className="mt-7 text-center text-sm text-ink-soft"><Link to="/login" className="font-bold text-brand-600 hover:underline">Back to login</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
