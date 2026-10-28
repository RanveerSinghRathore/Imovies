import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Film, Building2, Calendar, Ticket, Users,
  Menu, X, ExternalLink, LogOut, Shield,
} from 'lucide-react';
import { logout } from '../../redux/authSlice.js';

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/movies',    label: 'Movies',    icon: Film },
  { to: '/admin/theatres',  label: 'Theatres',  icon: Building2 },
  { to: '/admin/shows',     label: 'Shows',     icon: Calendar },
  { to: '/admin/bookings',  label: 'Bookings',  icon: Ticket },
  { to: '/admin/users',     label: 'Users',     icon: Users },
];

function SidebarContent({ onNav }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNav}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isActive
                ? 'shadow-sm'
                : 'hover:opacity-85'
            }`
          }
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'var(--color-primary-soft)' : 'transparent',
            color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
            border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
          })}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex theme-transition"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 border-r sticky top-0 h-screen overflow-y-auto flex-shrink-0 print:hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="px-5 py-4 border-b flex items-center gap-2.5" style={{ borderColor: 'var(--color-border)' }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))' }}
          >
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider block" style={{ color: 'var(--color-text)' }}>
              IMovies Admin
            </span>
            <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>Management Suite</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <SidebarContent onNav={() => {}} />
        </div>

        <div className="px-5 py-4 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold transition-colors hover:opacity-85"
            style={{ color: 'var(--color-muted)' }}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Back to Client Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold transition-colors hover:opacity-85 w-full cursor-pointer"
            style={{ color: 'var(--color-error)' }}
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden print:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="relative z-10 w-64 border-r flex flex-col h-full shadow-2xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                Admin Panel
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg"
                style={{ color: 'var(--color-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <SidebarContent onNav={() => setDrawerOpen(false)} />
            </div>
            <div className="px-5 py-4 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
              <Link
                to="/"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: 'var(--color-muted)' }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Back to Client Site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-semibold w-full cursor-pointer"
                style={{ color: 'var(--color-error)' }}
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b backdrop-blur-md print:hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl border"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Signed in as: <strong className="font-bold" style={{ color: 'var(--color-text)' }}>{user?.name || 'Administrator'}</strong>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
