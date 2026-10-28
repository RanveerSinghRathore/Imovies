import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load content. Please try again.',
  onRetry,
}) {
  return (
    <div
      className="py-16 px-4 text-center flex flex-col items-center justify-center rounded-3xl border transition-colors max-w-lg mx-auto"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: 'var(--color-error)',
        }}
      >
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      <p className="text-xs sm:text-sm max-w-sm mt-1 mb-5 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-opacity hover:opacity-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
            '--tw-ring-color': 'var(--color-primary)',
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
