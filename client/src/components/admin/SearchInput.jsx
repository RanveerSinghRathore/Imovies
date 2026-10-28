import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search…', delay = 400 }) {
  const [local, setLocal] = useState(value || '');
  const timer = useRef(null);

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), delay);
  };

  const clear = () => {
    setLocal('');
    clearTimeout(timer.current);
    onChange('');
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="relative w-full max-w-sm">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: 'var(--color-muted)' }}
      />
      <input
        type="search"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
          '--tw-ring-color': 'var(--color-primary)',
        }}
      />
      {local && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:opacity-80"
          style={{ color: 'var(--color-muted)' }}
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
