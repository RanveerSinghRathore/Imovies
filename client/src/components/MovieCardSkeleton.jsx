import React from 'react';

/* Shimmer animation keyframes injected once via a style tag */
const shimmerStyle = `
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-surface-2) 25%,
    var(--color-border)    50%,
    var(--color-surface-2) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
`;

let shimmerInjected = false;
function injectShimmer() {
  if (shimmerInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = shimmerStyle;
  document.head.appendChild(el);
  shimmerInjected = true;
}

export default function MovieCardSkeleton() {
  injectShimmer();

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        borderRadius: '16px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      aria-busy="true"
      aria-label="Loading movie"
    >
      {/* Poster placeholder */}
      <div
        className="skeleton-shimmer w-full"
        style={{ aspectRatio: '2/3' }}
      />

      {/* Info placeholder */}
      <div className="px-3 py-3 flex flex-col gap-2">
        {/* Title bar */}
        <div
          className="skeleton-shimmer h-4 rounded-full w-4/5"
        />
        {/* Genre chips */}
        <div className="flex gap-1.5">
          <div className="skeleton-shimmer h-3.5 rounded-full w-14" />
          <div className="skeleton-shimmer h-3.5 rounded-full w-10" />
        </div>
        {/* Language tags */}
        <div className="flex gap-1.5 mt-0.5">
          <div className="skeleton-shimmer h-3 rounded w-10" />
          <div className="skeleton-shimmer h-3 rounded w-8"  />
        </div>
      </div>
    </div>
  );
}
