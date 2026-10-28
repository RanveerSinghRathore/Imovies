import React from 'react';

export default function FormField({ label, error, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
          {label}{required && <span className="text-[var(--color-primary)] ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{hint}</p>}
      {error && <p className="text-xs font-medium" style={{ color: 'var(--color-error)' }}>{error}</p>}
    </div>
  );
}

export function inputCls(error) {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus-visible:ring-2 ${
    error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
  } bg-[var(--color-surface-2)] text-[var(--color-text)] placeholder-[var(--color-muted)]`;
}

export function selectCls(error) {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus-visible:ring-2 ${
    error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
  } bg-[var(--color-surface-2)] text-[var(--color-text)]`;
}
