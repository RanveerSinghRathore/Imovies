import React from 'react';
import { formatDate } from '../utils/format.js';

export default function DateTabs({ dates = [], selectedDate, onSelectDate }) {
  if (dates.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {dates.map((dateStr) => {
        const isSelected = selectedDate === dateStr;
        const formatted = formatDate(dateStr, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
        const parts = formatted.split(' ');
        const weekday = parts[0] || '';
        const day = parts[1] || '';
        const month = parts[2] || '';

        return (
          <button
            key={dateStr}
            onClick={() => onSelectDate(dateStr)}
            className="flex flex-col items-center justify-center min-w-[68px] py-2 px-3 rounded-2xl text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
            style={{
              backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
              borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: isSelected ? '#FFFFFF' : 'var(--color-text)',
              boxShadow: isSelected ? '0 4px 14px rgba(248, 68, 100, 0.35)' : 'none',
              transform: isSelected ? 'scale(1.04)' : 'none',
              '--tw-ring-color': 'var(--color-primary)',
            }}
          >
            <span
              className="uppercase text-[10px] tracking-wider font-semibold"
              style={{ color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--color-muted)' }}
            >
              {weekday}
            </span>
            <span className="text-base font-extrabold my-0.5 leading-none">
              {day}
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--color-muted)' }}
            >
              {month}
            </span>
          </button>
        );
      })}
    </div>
  );
}
