import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page = 1,
  totalPages = 1,
  hasNext = false,
  hasPrev = false,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  /* Build a compact page-number window: prev, current, next + ellipsis */
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    const neighbours = 1;
    const left  = Math.max(2, page - neighbours);
    const right = Math.min(totalPages - 1, page + neighbours);
    pages.push(1);
    if (left > 2) pages.push('…left');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('…right');
    pages.push(totalPages);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1.5 pt-8"
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2"
        aria-label="Previous page"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          '--tw-ring-color': 'var(--color-primary)',
        }}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        typeof p === 'string' ? (
          <span
            key={p + i}
            className="w-9 h-9 flex items-center justify-center text-sm"
            style={{ color: 'var(--color-muted)' }}
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => p !== page && onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className="w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: p === page ? 'var(--color-primary)' : 'var(--color-surface)',
              color:           p === page ? '#ffffff'               : 'var(--color-text)',
              border:          p === page
                ? '1px solid var(--color-primary)'
                : '1px solid var(--color-border)',
              boxShadow: p === page ? '0 2px 8px rgba(248,68,100,0.3)' : 'none',
              '--tw-ring-color': 'var(--color-primary)',
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2"
        aria-label="Next page"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          '--tw-ring-color': 'var(--color-primary)',
        }}
      >
        <ChevronRight className="w-4 h-4" aria-hidden />
      </button>
    </nav>
  );
}
