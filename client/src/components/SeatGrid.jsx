import React from 'react';
import Seat from './Seat.jsx';
import { formatPrice } from '../utils/format.js';

export default function SeatGrid({
  seats = [],
  selectedSeats = [],
  heldSeats = [],
  onToggleSeat,
  isHeldMode = false,
  price = 0,
}) {
  // Group seats by row letter
  const rowsMap = new Map();
  seats.forEach((seat) => {
    if (!rowsMap.has(seat.row)) {
      rowsMap.set(seat.row, []);
    }
    rowsMap.get(seat.row).push(seat);
  });

  // Sort rows A to Z, and seats in row by number 1..N
  const sortedRowLetters = Array.from(rowsMap.keys()).sort();
  sortedRowLetters.forEach((rowLetter) => {
    rowsMap.get(rowLetter).sort((a, b) => a.number - b.number);
  });

  // Group into tiers (e.g., top rows = Premium, lower rows = Classic/Executive)
  const tierThreshold = Math.ceil(sortedRowLetters.length * 0.4);
  const premiumRows = sortedRowLetters.slice(0, Math.max(1, tierThreshold));
  const standardRows = sortedRowLetters.slice(Math.max(1, tierThreshold));

  const renderRow = (rowLetter) => {
    const rowSeats = rowsMap.get(rowLetter) || [];

    return (
      <div key={rowLetter} className="flex items-center gap-2 sm:gap-3">
        {/* Left Row Label */}
        <span
          className="w-5 text-center text-xs font-bold shrink-0 select-none"
          style={{ color: 'var(--color-muted)' }}
        >
          {rowLetter}
        </span>

        {/* Seats in Row */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {rowSeats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.label);
            const isHeldByMe = isHeldMode
              ? heldSeats.includes(seat.label)
              : seat.isMine;

            return (
              <Seat
                key={seat.label}
                seat={seat}
                isSelected={isSelected}
                isHeldByMe={isHeldByMe}
                disabled={isHeldMode}
                onToggle={onToggleSeat}
              />
            );
          })}
        </div>

        {/* Right Row Label */}
        <span
          className="w-5 text-center text-xs font-bold shrink-0 select-none"
          style={{ color: 'var(--color-muted)' }}
        >
          {rowLetter}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-10 select-none">
      {/* ── Curved Cinema Screen Indicator ────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center max-w-xl mx-auto px-4 pt-2">
        {/* Glow arc */}
        <div
          className="w-full h-4 rounded-t-[140px] border-t-4 transition-all"
          style={{
            borderColor: '#F84464',
            background: 'linear-gradient(to bottom, rgba(248, 68, 100, 0.22) 0%, transparent 100%)',
            boxShadow: '0 -6px 20px rgba(248, 68, 100, 0.25)',
          }}
        />
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--color-muted)' }}
          >
            All eyes this way • Screen
          </span>
        </div>
      </div>

      {/* ── Horizontally Scrollable Seat Matrix ────────────────────────── */}
      <div className="overflow-x-auto pb-6 scrollbar-hide">
        <div className="inline-block min-w-full flex flex-col items-center gap-6 px-4">

          {/* Premium Tier */}
          {premiumRows.length > 0 && (
            <div className="w-full flex flex-col items-center gap-3">
              <div
                className="w-full max-w-md flex items-center justify-between px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide uppercase"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted)',
                }}
              >
                <span>Recliner / Premium</span>
                <span className="font-extrabold text-[var(--color-primary)]">
                  {price ? formatPrice(price) : ''}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                {premiumRows.map(renderRow)}
              </div>
            </div>
          )}

          {/* Standard / Classic Tier */}
          {standardRows.length > 0 && (
            <div className="w-full flex flex-col items-center gap-3 pt-2">
              <div
                className="w-full max-w-md flex items-center justify-between px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide uppercase"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted)',
                }}
              >
                <span>Executive / Classic</span>
                <span className="font-extrabold text-[var(--color-primary)]">
                  {price ? formatPrice(price) : ''}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                {standardRows.map(renderRow)}
              </div>
            </div>
          )}

          {/* Fallback if tiers didn't split */}
          {premiumRows.length === 0 && standardRows.length === 0 && (
            <div className="flex flex-col items-center gap-2">
              {sortedRowLetters.map(renderRow)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
