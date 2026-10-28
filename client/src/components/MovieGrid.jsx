import React from 'react';
import MovieCard from './MovieCard.jsx';
import MovieCardSkeleton from './MovieCardSkeleton.jsx';

const GRID_CLASSES =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5';

export default function MovieGrid({
  movies = [],
  loading = false,
  skeletonCount = 10,
}) {
  if (loading) {
    return (
      <div className={GRID_CLASSES}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={GRID_CLASSES}>
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
}
