import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Film, Clock, Calendar, Globe, Play, Users, ArrowLeft, Star,
} from 'lucide-react';
import { movieApi } from '../api/movieApi.js';
import { useFetch } from '../hooks/useFetch.js';
import { useCity } from '../context/CityContext.jsx';
import { formatDuration, formatDate } from '../utils/format.js';
import ShowtimesSection from '../components/ShowtimesSection.jsx';
import TrailerModal from '../components/TrailerModal.jsx';
import ErrorState from '../components/ErrorState.jsx';

/* ── gradient fallbacks matching MovieCard ─────────────────────────────── */
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#1a1a2e,#16213e)',
  'linear-gradient(135deg,#0f0c29,#302b63)',
  'linear-gradient(135deg,#200122,#6f0000)',
  'linear-gradient(135deg,#0f2027,#203a43)',
];
const gradientFor = (id = '') => {
  const idx = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
};

/* ── Loading skeleton ──────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8 py-6 px-4 max-w-7xl mx-auto">
      <div className="h-5 w-28 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <div className="w-48 sm:w-56 shrink-0 rounded-2xl" style={{ aspectRatio: '2/3', backgroundColor: 'var(--color-surface-2)' }} />
        <div className="flex-1 space-y-4 pt-4">
          <div className="h-6 w-2/3 rounded-xl" style={{ backgroundColor: 'var(--color-surface-2)' }} />
          <div className="h-10 w-4/5 rounded-xl" style={{ backgroundColor: 'var(--color-surface-2)' }} />
          <div className="h-4 w-1/2 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)' }} />
          <div className="h-24 rounded-xl" style={{ backgroundColor: 'var(--color-surface-2)' }} />
        </div>
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const { selectedCity } = useCity();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { data: movieData, loading: movieLoading, error: movieError, refetch: refetchMovie } =
    useFetch(() => movieApi.getMovie(id), [id]);

  const movie = movieData?.data;

  useEffect(() => {
    document.title = movie?.title
      ? `${movie.title} — Book Tickets | IMovies`
      : 'Movie Details — IMovies';
  }, [movie?.title]);

  const { data: showsData, loading: showsLoading, error: showsError, refetch: refetchShows } =
    useFetch(() => movieApi.getMovieShows(id, { city: selectedCity || undefined }), [id, selectedCity]);

  const groupedTheatres = showsData?.data || [];
  const rating = movie?.averageRating ?? movie?.rating ?? 0;
  const votes  = movie?.totalRatings  ?? movie?.votes  ?? 0;

  if (movieLoading) return <DetailSkeleton />;

  if (movieError || !movie) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <ErrorState
          title="Movie Not Found"
          message={movieError || 'This movie does not exist or has been removed.'}
          onRetry={refetchMovie}
        />
        <div className="text-center mt-6">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden /> Back to movies
          </Link>
        </div>
      </div>
    );
  }

  const showFallback = imgError || !movie.poster;

  return (
    <div className="space-y-10 py-6 px-4 max-w-7xl mx-auto">

      {/* Back link */}
      <Link
        to="/movies"
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
        style={{ color: 'var(--color-muted)', '--tw-ring-color': 'var(--color-primary)' }}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        All Movies
      </Link>

      {/* ── Hero card ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Blurred poster backdrop */}
        {!showFallback && (
          <div
            className="absolute inset-0 scale-110 pointer-events-none"
            style={{
              backgroundImage: `url(${movie.poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(32px) brightness(0.25)',
            }}
            aria-hidden
          />
        )}
        {/* Gradient overlay to ensure readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          }}
          aria-hidden
        />

        {/* Content row */}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 p-6 sm:p-10 items-start">

          {/* Poster */}
          <div
            className="w-44 sm:w-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              aspectRatio: '2/3',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {showFallback ? (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                style={{ background: gradientFor(movie._id) }}
              >
                <Film className="w-10 h-10 text-white/40 mb-2" aria-hidden />
                <span className="text-sm font-semibold text-white/80 line-clamp-3">{movie.title}</span>
              </div>
            ) : (
              <img
                src={movie.poster}
                alt={movie.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-5">

            {/* Certificate + Genre chips */}
            <div className="flex flex-wrap items-center gap-2">
              {movie.certificate && (
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                  }}
                >
                  {movie.certificate}
                </span>
              )}
              {movie.genres?.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              {movie.title}
            </h1>

            {/* Rating row */}
            {rating > 0 && (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(245,166,35,0.15)',
                    border: '1px solid rgba(245,166,35,0.3)',
                  }}
                >
                  <Star className="w-4 h-4 fill-current" style={{ color: 'var(--color-star)' }} aria-hidden />
                  <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
                  {votes > 0 && (
                    <span className="text-xs text-white/50">
                      / {votes >= 1000 ? `${(votes / 1000).toFixed(1)}K` : votes} votes
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Specs row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden />
                {formatDuration(movie.duration)}
              </span>
              {movie.languages?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" style={{ color: 'var(--color-warning)' }} aria-hidden />
                  {movie.languages.join(', ')}
                </span>
              )}
              {movie.releaseDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--color-success)' }} aria-hidden />
                  {formatDate(movie.releaseDate, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            {/* Synopsis */}
            {movie.description && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 text-white/40">
                  About the Movie
                </h3>
                <p className="text-sm text-white/75 leading-relaxed max-w-2xl">
                  {movie.description}
                </p>
              </div>
            )}

            {/* Cast */}
            {movie.cast?.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 text-white/40 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" aria-hidden /> Starring
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.slice(0, 6).map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.75)',
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Book Tickets — anchor to showtimes */}
              <a
                href="#showtimes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
                  boxShadow: '0 8px 24px rgba(248,68,100,0.4)',
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                Book Tickets
              </a>

              {/* Watch Trailer */}
              {movie.trailerUrl && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                  }}
                >
                  <Play className="w-4 h-4 fill-current" style={{ color: 'var(--color-primary)' }} aria-hidden />
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Showtimes ──────────────────────────────────────────────────── */}
      <section id="showtimes" className="space-y-4 scroll-mt-24">
        {showsError ? (
          <ErrorState message={showsError} onRetry={refetchShows} />
        ) : (
          <ShowtimesSection groupedTheatres={groupedTheatres} loading={showsLoading} />
        )}
      </section>

      {/* Trailer modal */}
      {movie.trailerUrl && (
        <TrailerModal
          isOpen={trailerOpen}
          trailerUrl={movie.trailerUrl}
          movieTitle={movie.title}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </div>
  );
}
