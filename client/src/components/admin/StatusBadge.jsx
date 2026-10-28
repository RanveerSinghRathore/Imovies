import React from 'react';

const STATUS_STYLES = {
  confirmed:      { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.35)', text: 'var(--color-success)' },
  paid:           { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.35)', text: 'var(--color-success)' },
  active:         { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.35)', text: 'var(--color-success)' },
  upcoming:       { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)', text: '#38BDF8' },
  pending:        { bg: 'rgba(245, 166, 35, 0.12)', border: 'rgba(245, 166, 35, 0.35)', text: 'var(--color-warning)' },
  refund_pending: { bg: 'rgba(245, 166, 35, 0.12)', border: 'rgba(245, 166, 35, 0.35)', text: 'var(--color-warning)' },
  cancelled:      { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.35)', text: 'var(--color-error)' },
  failed:         { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.35)', text: 'var(--color-error)' },
  refunded:       { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', text: '#A855F7' },
  expired:        { bg: 'var(--color-surface-2)', border: 'var(--color-border)', text: 'var(--color-muted)' },
  inactive:       { bg: 'var(--color-surface-2)', border: 'var(--color-border)', text: 'var(--color-muted)' },
  past:           { bg: 'var(--color-surface-2)', border: 'var(--color-border)', text: 'var(--color-muted)' },
};

export default function StatusBadge({ status, label }) {
  const styleConfig = STATUS_STYLES[status] || {
    bg: 'var(--color-surface-2)',
    border: 'var(--color-border)',
    text: 'var(--color-muted)',
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase border"
      style={{
        backgroundColor: styleConfig.bg,
        borderColor: styleConfig.border,
        color: styleConfig.text,
      }}
    >
      {label || status}
    </span>
  );
}
