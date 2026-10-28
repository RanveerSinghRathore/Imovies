import React from 'react';
import { X } from 'lucide-react';

function PillGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category label */}
      <span
        className="text-[11px] font-semibold uppercase tracking-wider shrink-0"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}:
      </span>

      {/* "All" chip */}
      <Chip
        active={!value}
        onClick={() => onChange('')}
        label={`All ${label}s`}
      />

      {/* Option chips */}
      {options.map((opt) => (
        <Chip
          key={opt}
          active={value === opt}
          onClick={() => onChange(value === opt ? '' : opt)}
          label={opt}
        />
      ))}
    </div>
  );
}

function Chip({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
        color:           active ? '#ffffff'               : 'var(--color-text)',
        border:          active
          ? '1px solid var(--color-primary)'
          : '1px solid var(--color-border)',
        boxShadow: active ? '0 2px 8px rgba(248,68,100,0.25)' : 'none',
        '--tw-ring-color': 'var(--color-primary)',
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default function FilterBar({
  genres = [],
  languages = [],
  selectedGenre = '',
  selectedLanguage = '',
  onGenreChange,
  onLanguageChange,
  onReset,
}) {
  const hasActiveFilters = Boolean(selectedGenre || selectedLanguage);

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {genres.length > 0 && (
        <PillGroup
          label="Genre"
          options={genres}
          value={selectedGenre}
          onChange={onGenreChange}
        />
      )}

      {languages.length > 0 && (
        <PillGroup
          label="Language"
          options={languages}
          value={selectedLanguage}
          onChange={onLanguageChange}
        />
      )}

      {hasActiveFilters && (
        <div className="pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
            style={{
              color: 'var(--color-primary)',
              '--tw-ring-color': 'var(--color-primary)',
            }}
            aria-label="Clear all filters"
          >
            <X className="w-3.5 h-3.5" aria-hidden />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
