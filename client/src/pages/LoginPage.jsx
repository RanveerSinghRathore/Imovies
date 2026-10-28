import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Film, AlertCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { loginUser } from '../redux/authSlice.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      {/* ── Main Container: Split Layout on MD+ ────────────────────────── */}
      <div
        className="w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[520px]"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* ── Left Side Panel (Gradient Brand Experience) ──────────────── */}
        <div
          className="hidden md:flex md:col-span-5 p-8 lg:p-10 flex-col justify-between relative overflow-hidden text-white"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
          }}
        >
          {/* Subtle noise and glow decorations */}
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"
          />
          <div
            className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-black/10 blur-2xl pointer-events-none"
          />

          <div className="relative z-10 space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">IMovies</span>
            </div>

            <div className="space-y-3 pt-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Cinema</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Your Ticket to the Big Screen
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Experience hassle-free reservations with live interactive seat maps and instant digital confirmations.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-3 pt-4 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>5-minute seat locking guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Live seat status with zero double-booking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Official Razorpay verified checkout</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 text-[11px] text-white/70">
            BookMyShow & District cinematic experience
          </div>
        </div>

        {/* ── Right Side Panel: Form ──────────────────────────────────── */}
        <div className="col-span-1 md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--color-muted)' }}>
              Sign in to manage your bookings and secure show tickets.
            </p>
          </div>

          {error && (
            <div
              className="p-3.5 rounded-2xl border text-xs flex items-center gap-2.5"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: 'var(--color-error)',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--color-text)' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 rounded-2xl text-sm transition-colors border focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  '--tw-ring-color': 'var(--color-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--color-text)' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl text-sm transition-colors border focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  '--tw-ring-color': 'var(--color-primary)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-95 active:scale-98 cursor-pointer focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
                boxShadow: '0 8px 24px rgba(248, 68, 100, 0.35)',
                '--tw-ring-color': 'var(--color-primary)',
              }}
            >
              <span>{loading ? 'Authenticating…' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Credentials Quick Pill */}
          <div
            className="p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-2"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-muted)',
            }}
          >
            <span>Demo: <strong style={{ color: 'var(--color-text)' }}>admin@imovies.dev</strong></span>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@imovies.dev', 'admin123')}
              className="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors border hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              Fill Admin Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
