import React from 'react';

/**
 * Seat Button Component
 * Explicit semantic colors (same across light & dark themes):
 * - available: outlined green (#22C55E)
 * - selected / heldByMe: filled primary (#F84464)
 * - held (by others): amber (#F5A623)
 * - booked: neutral grey (#6B7280 / #2E2E3A)
 */
export default function Seat({ seat, isSelected, isHeldByMe, onToggle, disabled }) {
  const { label, number, status } = seat;

  let btnClasses = '';
  let btnStyle = {};
  let isDisabled = disabled;

  if (status === 'booked') {
    // Booked = Grey
    btnClasses = 'cursor-not-allowed opacity-35';
    btnStyle = {
      backgroundColor: 'var(--color-surface-2)',
      borderColor: 'var(--color-border)',
      borderWidth: '1.5px',
      color: 'var(--color-muted)',
    };
    isDisabled = true;
  } else if (status === 'held' && !isHeldByMe) {
    // Held by someone else = Amber
    btnClasses = 'cursor-not-allowed opacity-75';
    btnStyle = {
      backgroundColor: 'rgba(245, 166, 35, 0.15)',
      borderColor: '#F5A623',
      borderWidth: '1.5px',
      color: '#F5A623',
    };
    isDisabled = true;
  } else if (isSelected || isHeldByMe) {
    // Selected = Filled primary
    btnClasses = 'font-bold scale-105 shadow-md';
    btnStyle = {
      backgroundColor: '#F84464',
      borderColor: '#F84464',
      borderWidth: '1.5px',
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(248, 68, 100, 0.4)',
    };
  } else {
    // Available = Outlined green
    btnClasses = 'hover:scale-108 active:scale-95 transition-transform';
    btnStyle = {
      backgroundColor: 'transparent',
      borderColor: '#22C55E',
      borderWidth: '1.5px',
      color: '#22C55E',
    };
  }

  return (
    <button
      type="button"
      aria-label={`Seat ${label}, ${status}${isSelected ? ', selected' : ''}${isHeldByMe ? ', held by you' : ''}`}
      disabled={isDisabled}
      onClick={() => onToggle(label)}
      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 select-none ${btnClasses}`}
      style={{
        ...btnStyle,
        borderStyle: 'solid',
        '--tw-ring-color': '#F84464',
      }}
    >
      {number}
    </button>
  );
}
