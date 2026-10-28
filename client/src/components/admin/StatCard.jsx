import React from 'react';

export default function StatCard({ label, value, sub, icon: Icon, loading }) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-2 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
          {label}
        </span>
        {Icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-soft)' }}
          >
            <Icon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          </div>
        )}
      </div>
      {loading ? (
        <div
          className="h-8 w-24 rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
      ) : (
        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
          {value}
        </p>
      )}
      {sub && !loading && <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{sub}</p>}
    </div>
  );
}
