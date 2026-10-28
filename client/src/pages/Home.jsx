import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight,
  Zap, ShieldCheck, Ticket, Star, Film,
} from 'lucide-react';
import { movieApi } from '../api/movieApi.js';
import { useFetch } from '../hooks/useFetch.js';
import MovieCard from '../components/MovieCard.jsx';
import MovieCardSkeleton from '../components/MovieCardSkeleton.jsx';
import ErrorState from '../components/ErrorState.jsx';

/* ─── Hero banner data (static slides; replace posters with API if needed) */
const HERO_SLIDES = [
  {
    id: 1,
    headline: 'Book Blockbusters,\nChoose Your Seats',
    sub: 'Live seat layouts · Secure payments · Zero friction',
    gradient: 'linear-gradient(135deg,#1a0a2e 0%,#3d0030 50%,#0a0a1a 100%)',
    cta: { label: 'Explore Movies', to: '/movies' },
  },
  {
    id: 2,
    headline: 'Instant Seat Holds,\nInstant Confirmation',
    sub: '5-minute seat lock · Razorpay verified · E-tickets in seconds',
    gradient: 'linear-gradient(135deg,#0a1628 0%,#1a3a5c 50%,#0a0a1a 100%)',
    cta: { label: 'Now Showing', to: '/movies' },
  },
  {
    id: 3,
    headline: 'Your City,\nYour Cinema',
    sub: 'Pick your city · Browse theatres · Book in 60 seconds',
    gradient: 'linear-gradient(135deg,#1a1a0a 0%,#3d2200 50%,#0a0a1a 100%)',
    cta: { label: 'Browse Events', to: '/movies?format=event' },
  },
];

/* ─── Hero Carousel ───────────────────────────────────────────────────── */
function HeroBanner() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => setActive((p) => (p + 1) % HERO_SLIDES.length), []);
  const prev = useCallback(() => setActive((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  /* Auto-advance every 5 s */
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const resetTimer = (fn) => { clearInterval(timerRef.current); fn(); timerRef.current = setInterval(next, 5000); };

  const slide = HERO_SLIDES[active];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ borderRadius: '24px', minHeight: '340px' }}
      aria-label="Featured banner"
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: slide.gradient }}
      />

      {/* Noise/grain overlay for richness */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundSize: '200px',
        }}
      />

      {/* Gradient accent — primary glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(248,68,100,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 flex flex-col items-start justify-center min-h-[340px]">
        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Instant Booking', 'Live Seat Map', 'Secure Payments'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
              style={{
                backgroundColor: 'rgba(248,68,100,0.15)',
                border: '1px solid rgba(248,68,100,0.3)',
                color: '#ff8fa3',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1
          className="text-3xl sm:text-5xl font-extrabold text-white leading-tight max-w-xl whitespace-pre-line"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
        >
          {slide.headline}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-white/60 max-w-md">
          {slide.sub}
        </p>

        <Link
          to={slide.cta.to}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
            boxShadow: '0 8px 24px rgba(248,68,100,0.4)',
          }}
        >
          {slide.cta.label}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={() => resetTimer(prev)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 text-white" aria-hidden />
      </button>
      <button
        onClick={() => resetTimer(next)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 text-white" aria-hidden />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Slide indicators">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => resetTimer(() => setActive(i))}
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{
              width:  i === active ? '24px' : '8px',
              height: '8px',
              backgroundColor: i === active ? 'var(--color-primary)' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Horizontal movie row carousel ───────────────────────────────────── */
function MovieRow({ title, subtitle, movies = [], loading = false, seeAllTo }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir * (w * 0.75), behavior: 'smooth' });
  };

  const SKELETON_COUNT = 5;

  return (
    <section className="space-y-4">
      {/* Row header */}
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold tracking-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {seeAllTo && (
          <Link
            to={seeAllTo}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
            style={{ color: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
          >
            See All <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        )}
      </div>

      {/* Scroll container + arrow buttons */}
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus-visible:outline-none focus-visible:opacity-100"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
          aria-label={`Scroll ${title} left`}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden />
        </button>

        {/* Cards row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0"
                  style={{ width: 'clamp(140px, 18vw, 200px)', scrollSnapAlign: 'start' }}
                >
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie._id}
                  className="shrink-0"
                  style={{ width: 'clamp(140px, 18vw, 200px)', scrollSnapAlign: 'start' }}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus-visible:outline-none focus-visible:opacity-100"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
          aria-label={`Scroll ${title} right`}
        >
          <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}

/* ─── Feature badges strip ─────────────────────────────────────────────── */
const FEATURES = [
  { icon: Zap,         label: 'Instant Seat Holds',   sub: '5-minute lock while you pay',     color: 'var(--color-warning)' },
  { icon: ShieldCheck, label: 'Verified Razorpay',     sub: 'Cryptographic signature check',   color: 'var(--color-success)' },
  { icon: Ticket,      label: 'Instant E-Ticket',      sub: 'Mobile-first show confirmation',  color: 'var(--color-primary)' },
  { icon: Star,        label: 'Ratings & Reviews',     sub: 'Trusted community scores',        color: 'var(--color-star)'    },
];

function FeatureStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {FEATURES.map(({ icon: Icon, label, sub, color }) => (
        <div
          key={label}
          className="flex items-start gap-3 p-4 rounded-2xl transition-shadow hover:shadow-md"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
          >
            <Icon className="w-4 h-4" style={{ color }} aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{label}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function Home() {
  useEffect(() => { document.title = 'IMovies — Book Movie Tickets Online'; }, []);

  /* Recommended / newest */
  const { data: newestData, loading: newestLoading, error: newestError, refetch: refetchNewest } = useFetch(
    () => movieApi.getMovies({ limit: 12, sort: 'newest' }),
    []
  );

  /* Top rated */
  const { data: topData, loading: topLoading } = useFetch(
    () => movieApi.getMovies({ limit: 12, sort: 'rating' }),
    []
  );

  const newest = newestData?.data || [];
  const top    = topData?.data    || [];

  return (
    <div className="space-y-10 py-6 px-4 max-w-7xl mx-auto">

      {/* Hero carousel */}
      <HeroBanner />

      {/* Feature strip */}
      <FeatureStrip />

      {/* Recommended Movies */}
      {newestError ? (
        <ErrorState message={newestError} onRetry={refetchNewest} />
      ) : (
        <MovieRow
          title="Recommended Movies"
          subtitle="Fresh releases you'll love"
          movies={newest}
          loading={newestLoading}
          seeAllTo="/movies"
        />
      )}

      {/* Now Showing / Top Rated */}
      <MovieRow
        title="Now Showing"
        subtitle="Top-rated movies in cinemas right now"
        movies={top}
        loading={topLoading}
        seeAllTo="/movies?sort=rating"
      />

      {/* Coming Soon teaser banner */}
      <section
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-6"
        style={{
          background: 'linear-gradient(135deg, var(--color-header) 0%, var(--color-header-strip) 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(ellipse 50% 80% at 80% 50%, var(--color-primary) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
            Coming Soon
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            Never Miss a Premiere
          </h2>
          <p className="mt-2 text-sm text-white/60 max-w-sm">
            Explore upcoming blockbusters and set reminders before tickets sell out.
          </p>
        </div>
        <Link
          to="/movies"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
            boxShadow: '0 8px 24px rgba(248,68,100,0.35)',
          }}
        >
          <Film className="w-4 h-4" aria-hidden />
          Explore All
        </Link>
      </section>

    </div>
  );
}
