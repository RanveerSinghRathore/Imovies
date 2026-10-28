import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl p-6 flex flex-col gap-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: danger ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 166, 35, 0.12)',
              borderColor: danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 166, 35, 0.3)',
              color: danger ? 'var(--color-error)' : 'var(--color-warning)',
            }}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="confirm-title" className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              {title}
            </h2>
            {message && <p className="mt-1 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{message}</p>}
          </div>
        </div>
        <div className="flex gap-2.5 justify-end pt-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: danger ? 'var(--color-error)' : 'var(--color-warning)',
            }}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
