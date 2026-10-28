import React from 'react';

export default function SeatLegend() {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 py-3.5 px-6 rounded-2xl border text-xs"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      {/* Available */}
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-md"
          style={{
            border: '2px solid #22C55E',
            backgroundColor: 'transparent',
          }}
        />
        <span className="font-medium">Available</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-md shadow-sm"
          style={{
            backgroundColor: '#F84464',
            border: '2px solid #F84464',
          }}
        />
        <span className="font-semibold" style={{ color: '#F84464' }}>Selected</span>
      </div>

      {/* Held */}
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-md"
          style={{
            backgroundColor: 'rgba(245, 166, 35, 0.2)',
            border: '2px solid #F5A623',
          }}
        />
        <span className="font-medium" style={{ color: '#F5A623' }}>Held</span>
      </div>

      {/* Booked */}
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-md opacity-50"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '2px solid var(--color-border)',
          }}
        />
        <span className="opacity-60">Booked</span>
      </div>
    </div>
  );
}
