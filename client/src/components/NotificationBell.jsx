import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Film, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications.js';
import { formatRelativeTime } from '../utils/format.js';

export default function NotificationBell() {
  const { items, unreadCount, markRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  /* Close on outside click or Escape */
  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const recentItems = items.slice(0, 5);

  const getIcon = (type) => {
    switch (type) {
      case 'booking_confirmed': return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />;
      case 'booking_cancelled': return <AlertTriangle className="w-3.5 h-3.5" style={{ color: 'var(--color-error)' }} />;
      case 'payment_failed':    return <AlertTriangle className="w-3.5 h-3.5" style={{ color: 'var(--color-warning)' }} />;
      case 'refund_issued':     return <RotateCcw     className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />;
      default:                  return <Film          className="w-3.5 h-3.5" style={{ color: 'var(--color-muted)' }} />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 rounded-xl transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4 text-white/70" aria-hidden />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold text-white leading-4 text-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
            aria-hidden
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
          role="dialog"
          aria-label="Notifications panel"
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h4
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--color-text)' }}
            >
              Notifications
            </h4>
            <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </span>
          </div>

          {/* Items */}
          <div className="divide-y max-h-80 overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
            {recentItems.length === 0 ? (
              <p className="p-6 text-center text-xs" style={{ color: 'var(--color-muted)' }}>
                No notifications yet.
              </p>
            ) : (
              recentItems.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && markRead(n._id)}
                  className="px-4 py-3 flex gap-3 text-xs cursor-pointer transition-colors"
                  style={{
                    backgroundColor: !n.read ? 'var(--color-primary-soft)' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!n.read) e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  role="button"
                  tabIndex={0}
                  aria-label={n.message}
                  onKeyDown={(e) => { if (e.key === 'Enter') !n.read && markRead(n._id); }}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p
                      className="line-clamp-2 leading-relaxed"
                      style={{
                        color: !n.read ? 'var(--color-text)' : 'var(--color-muted)',
                        fontWeight: !n.read ? 500 : 400,
                      }}
                    >
                      {n.message}
                    </p>
                    <span className="text-[10px] block" style={{ color: 'var(--color-muted)' }}>
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  {!n.read && (
                    <span
                      className="w-2 h-2 rounded-full self-center shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      aria-hidden
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2.5 text-center border-t"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface-2)',
            }}
          >
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-primary)' }}
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
