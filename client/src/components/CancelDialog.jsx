import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function CancelDialog({
  isOpen,
  booking,
  loading = false,
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen || !booking) return null;

  return (
    <div
      onClick={() => !loading && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border p-6 space-y-5 shadow-2xl relative"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base" style={{ color: 'var(--color-error)' }}>
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Cancel Ticket Booking</span>
          </div>
          <button
            disabled={loading}
            onClick={onClose}
            className="p-1.5 rounded-xl border transition-colors hover:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-muted)',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm" style={{ color: 'var(--color-text)' }}>
          <p>
            Are you sure you want to cancel your booking for <strong style={{ color: 'var(--color-text)' }}>{booking.show?.movie?.title}</strong>?
          </p>

          <div
            className="p-4 rounded-2xl border space-y-2 text-xs"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex justify-between" style={{ color: 'var(--color-muted)' }}>
              <span>Seats to be released:</span>
              <span className="font-bold text-[var(--color-primary)]">{booking.seats.join(', ')}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--color-muted)' }}>
              <span>Refund amount:</span>
              <span className="font-bold" style={{ color: 'var(--color-success)' }}>₹{booking.amount}</span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            Upon cancellation, your seats will be released immediately. A full refund will be processed through Razorpay to your original payment method. This action cannot be undone.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors disabled:opacity-40"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            Keep Booking
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-error)',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
            }}
          >
            {loading ? 'Processing…' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
}
