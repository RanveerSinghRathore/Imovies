import React from 'react';
import { formatTime, formatPrice } from '../utils/format.js';

export default function ShowtimeButton({ show, onSelect }) {
  const isSoldOut = Boolean(
    show.isSoldOut ||
    show.availableSeats === 0 ||
    show.status === 'sold_out'
  );

  const isFillingFast = !isSoldOut && Boolean(
    show.isFillingFast ||
    (typeof show.availableSeats === 'number' && show.availableSeats > 0 && show.availableSeats <= 15) ||
    show.status === 'filling_fast'
  );

  // Status styling: Green for available, Orange for filling fast, Grey & disabled for sold out
  let borderColor = 'var(--color-success)';
  let textColor = 'var(--color-success)';
  let hoverBg = 'rgba(34, 197, 94, 0.08)';
  let statusText = 'Available';

  if (isSoldOut) {
    borderColor = 'var(--color-border)';
    textColor = 'var(--color-muted)';
    hoverBg = 'transparent';
    statusText = 'Sold Out';
  } else if (isFillingFast) {
    borderColor = 'var(--color-warning)';
    textColor = 'var(--color-warning)';
    hoverBg = 'rgba(245, 166, 35, 0.08)';
    statusText = 'Filling Fast';
  }

  return (
    <button
      onClick={() => !isSoldOut && onSelect(show._id)}
      disabled={isSoldOut}
      className="group relative flex flex-col items-center justify-center min-w-[100px] px-3.5 py-2 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: borderColor,
        borderWidth: '1.5px',
        borderStyle: 'solid',
        '--tw-ring-color': borderColor,
      }}
      onMouseEnter={(e) => {
        if (!isSoldOut) {
          e.currentTarget.style.backgroundColor = hoverBg;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSoldOut) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          e.currentTarget.style.transform = 'none';
        }
      }}
      title={`${formatTime(show.startTime)} — ${statusText}`}
      aria-label={`${formatTime(show.startTime)}, ${show.language || 'Original'}, ${formatPrice(show.price)}, ${statusText}`}
    >
      <div className="flex items-center gap-1">
        <span
          className="text-xs sm:text-sm font-bold tracking-tight"
          style={{ color: isSoldOut ? 'var(--color-muted)' : textColor }}
        >
          {formatTime(show.startTime)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
        <span className="font-semibold" style={{ color: isSoldOut ? 'var(--color-muted)' : 'var(--color-text)' }}>
          {formatPrice(show.price)}
        </span>
        <span>•</span>
        <span className="uppercase font-medium">
          {show.language || '2D'}
        </span>
      </div>
    </button>
  );
}
