import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Film } from 'lucide-react';

/* Gradient fallback when poster is missing or broken */
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#1a1a2e,#16213e)',
  'linear-gradient(135deg,#0f0c29,#302b63)',
  'linear-gradient(135deg,#200122,#6f0000)',
  'linear-gradient(135deg,#0f2027,#203a43)',
  'linear-gradient(135deg,#1d1d1d,#3a3a3a)',
];

function gradientFor(id = '') {
  const idx = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
}

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);
  const showFallback = imgError || !movie.poster;
  const rating = movie.averageRating ?? movie.rating ?? 0;
  const votes  = movie.totalRatings  ?? movie.votes  ?? 0;

  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group relative flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        borderRadius: '16px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        '--tw-ring-color': 'var(--color-primary)',
        '--tw-ring-offset-color': 'var(--color-bg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.18)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {/* ── Poster area (2:3 ratio) ───────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2/3' }}>

        {showFallback ? (
          /* Gradient fallback */
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center"
            style={{ background: gradientFor(movie._id) }}
          >
            <Film className="w-10 h-10 opacity-40 text-white" aria-hidden />
            <span className="text-sm font-semibold text-white/80 line-clamp-3 leading-snug">
              {movie.title}
            </span>
          </div>
        ) : (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Certificate badge – top-left */}
        {movie.certificate && (
          <span
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(0,0,0,0.65)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            aria-label={`Certificate: ${movie.certificate}`}
          >
            {movie.certificate}
          </span>
        )}

        {/* Rating strip – bottom of poster */}
        {rating > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-3 py-2"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            }}
          >
            <Star
              className="w-3.5 h-3.5 shrink-0 fill-current"
              style={{ color: 'var(--color-star)' }}
              aria-hidden
            />
            <span className="text-xs font-bold text-white">
              {rating.toFixed(1)}
            </span>
            {votes > 0 && (
              <span className="text-[10px] text-white/60">
                ({votes >= 1000 ? `${(votes / 1000).toFixed(1)}K` : votes})
              </span>
            )}
          </div>
        )}

        {/* Hover overlay CTA */}
        <div
          className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to top, rgba(248,68,100,0.75) 0%, transparent 60%)' }}
        >
          <span className="text-xs font-bold text-white tracking-wide">
            Book Tickets →
          </span>
        </div>
      </div>

      {/* ── Info area ─────────────────────────────────────────────────── */}
      <div className="px-3 py-3 flex flex-col gap-1.5">
        <h3
          className="text-sm font-semibold line-clamp-1 transition-colors duration-150 group-hover:text-[var(--color-primary)]"
          style={{ color: 'var(--color-text)' }}
        >
          {movie.title}
        </h3>

        {/* Genre chips row */}
        {movie.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-muted)',
                }}
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Language / format tags */}
        {movie.languages?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {movie.languages.slice(0, 3).map((l) => (
              <span
                key={l}
                className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase"
                style={{
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                }}
              >
                {l}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
