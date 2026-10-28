import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Film, MapPin, Menu, X, LogOut, Sun, Moon, ChevronDown, User,
} from 'lucide-react';
import { useCity } from '../context/CityContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { logout } from '../redux/authSlice.js';
import SearchBar from './SearchBar.jsx';
import NotificationBell from './NotificationBell.jsx';

const NAV_LINKS = [
  { label: 'Movies', to: '/movies' },
  { label: 'Stream',  to: '/movies?format=stream' },
  { label: 'Events',  to: '/movies?format=event' },
  { label: 'Plays',   to: '/movies?format=play' },
  { label: 'Sports',  to: '/movies?format=sports' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { selectedCity, setSelectedCity, cities } = useCity();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [cityOpen, setCityOpen]     = useState(false);

  /* Shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + '?');

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── Tier 1 – Brand bar ───────────────────────────────────────────── */}
      <div
        className="w-full transition-shadow duration-200"
        style={{
          backgroundColor: 'var(--color-header)',
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.35)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg"
            aria-label="IMovies home"
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))' }}
            >
              <Film className="w-5 h-5 text-white" aria-hidden />
            </div>
            <span
              className="text-xl font-extrabold tracking-tight text-white hidden sm:block"
            >
              IMovies
            </span>
          </Link>

          {/* Search – grows to fill space */}
          <div className="flex-1 max-w-xl hidden md:block">
            <NavSearchBar />
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-2">

            {/* City selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-medium transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                style={{ color: 'var(--color-header-muted)' }}
                aria-label="Select city"
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} aria-hidden />
                <span style={{ color: 'var(--color-header-text)' }}>
                  {selectedCity || 'All Cities'}
                </span>
                <ChevronDown className="w-3 h-3" aria-hidden />
              </button>

              {cityOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-44 rounded-2xl overflow-hidden shadow-2xl z-50 border py-1"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {['', ...cities].map((c) => (
                    <button
                      key={c || '__all__'}
                      onClick={() => { setSelectedCity(c); setCityOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none"
                      style={{
                        color: selectedCity === c
                          ? 'var(--color-primary)'
                          : 'var(--color-text)',
                        fontWeight: selectedCity === c ? 600 : 400,
                      }}
                    >
                      {c || 'All Cities'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark'
                ? <Sun  className="w-4 h-4 text-yellow-300" aria-hidden />
                : <Moon className="w-4 h-4 text-white/70"   aria-hidden />
              }
            </button>

            {/* Notification bell (only when logged in) */}
            {user && (
              <div className="hidden md:block">
                <NotificationBell />
              </div>
            )}

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div
                  className="flex items-center gap-2 px-3 h-9 rounded-xl text-xs font-medium"
                  style={{ color: 'var(--color-header-muted)' }}
                >
                  <User className="w-3.5 h-3.5" aria-hidden />
                  <span style={{ color: 'var(--color-header-text)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 h-9 flex items-center rounded-xl text-xs font-semibold transition-colors hover:bg-white/10"
                    style={{ color: 'var(--color-warning)' }}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center h-9 px-4 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                style={{ background: 'var(--color-primary)' }}
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex md:hidden p-2 rounded-xl transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen
                ? <X    className="w-5 h-5 text-white" aria-hidden />
                : <Menu className="w-5 h-5 text-white" aria-hidden />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Tier 2 – Category strip (desktop) ───────────────────────────── */}
      <div
        className="hidden md:block w-full"
        style={{ backgroundColor: 'var(--color-header-strip)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1" aria-label="Content categories">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="relative px-4 py-3 text-xs font-semibold tracking-wide uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
                style={{
                  color: isActive(to.split('?')[0])
                    ? 'var(--color-primary)'
                    : 'var(--color-header-muted)',
                }}
              >
                {label}
                {isActive(to.split('?')[0]) && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ backgroundColor: 'var(--color-header)' }}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 py-4 space-y-3 border-t border-white/10">

          {/* Mobile search */}
          <NavSearchBar />

          {/* City selector */}
          <div
            className="flex items-center gap-2 px-3 h-11 rounded-xl border text-sm"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-header-text)' }}
          >
            <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} aria-hidden />
            <select
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setMobileOpen(false); }}
              className="bg-transparent flex-1 focus:outline-none text-sm"
              style={{ color: 'var(--color-header-text)' }}
              aria-label="Select city"
            >
              <option value="" style={{ backgroundColor: '#333545' }}>All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c} style={{ backgroundColor: '#333545' }}>{c}</option>
              ))}
            </select>
          </div>

          {/* Category links */}
          <nav className="flex flex-wrap gap-2" aria-label="Content categories">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors"
                style={{
                  backgroundColor: isActive(to.split('?')[0])
                    ? 'var(--color-primary)'
                    : 'rgba(255,255,255,0.08)',
                  color: 'var(--color-header-text)',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth row */}
          <div
            className="flex items-center justify-between pt-3 border-t border-white/10"
          >
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80 font-medium">
                  Hi, {user.name.split(' ')[0]}
                </span>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ color: 'var(--color-warning)', backgroundColor: 'rgba(245,166,35,0.12)' }}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)' }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Inline search bar used in both tiers ──────────────────────────────── */
function NavSearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/movies?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden
      >
        {/* Search icon inline so we don't need a separate import */}
        <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search movies, events, plays…"
        aria-label="Search"
        className="w-full h-10 pl-10 pr-4 rounded-xl text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{
          backgroundColor: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#ffffff',
        }}
        onFocus={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
        onBlur={(e)  => { e.target.style.backgroundColor = 'rgba(255,255,255,0.10)'; }}
      />
    </form>
  );
}
