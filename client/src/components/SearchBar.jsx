import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search movies…',
}) {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: 'var(--color-muted)' }}
        aria-hidden
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-11 pl-10 pr-10 rounded-xl text-sm transition-colors focus:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          '--tw-ring-color': 'var(--color-primary)',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
        onBlur={(e)  => { e.target.style.borderColor = 'var(--color-border)'; }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors hover:opacity-80"
          aria-label="Clear search"
          style={{ color: 'var(--color-muted)' }}
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
