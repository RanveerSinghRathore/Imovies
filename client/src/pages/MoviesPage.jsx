import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieApi } from '../api/movieApi.js';
import { useFetch } from '../hooks/useFetch.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useCity } from '../context/CityContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import Pagination from '../components/Pagination.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity } = useCity();

  useEffect(() => { document.title = 'Explore Movies — IMovies'; }, []);

  const querySearch   = searchParams.get('search')   || '';
  const queryGenre    = searchParams.get('genre')    || '';
  const queryLanguage = searchParams.get('language') || '';
  const queryPage     = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(querySearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== querySearch) {
      updateUrlParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        updated.set(key, String(val));
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  const { data: filtersData } = useFetch(() => movieApi.getFilters(), []);
  const availableGenres    = filtersData?.data?.genres    || [];
  const availableLanguages = filtersData?.data?.languages || [];

  const { data: moviesData, loading, error, refetch } = useFetch(
    () =>
      movieApi.getMovies({
        search:   querySearch   || undefined,
        genre:    queryGenre    || undefined,
        language: queryLanguage || undefined,
        city:     selectedCity  || undefined,
        page:     queryPage,
        limit:    10,
        sort:     'newest',
      }),
    [querySearch, queryGenre, queryLanguage, selectedCity, queryPage]
  );

  const movies     = moviesData?.data       || [];
  const pagination = moviesData?.pagination || {};

  const handleGenreChange    = (v) => updateUrlParams({ genre: v,    page: 1 });
  const handleLanguageChange = (v) => updateUrlParams({ language: v, page: 1 });
  const handleResetFilters   = () => { setSearchInput(''); setSearchParams({}); };
  const handlePageChange     = (n) => { updateUrlParams({ page: n }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="space-y-6 py-6 px-4 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Explore All Movies
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {selectedCity
              ? `Showing movies scheduled in ${selectedCity}`
              : 'Discover top releases and upcoming cinema showtimes'}
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by title…"
          />
        </div>
      </div>

      {/* Filter toolbar — FilterBar is now self-contained */}
      <FilterBar
        genres={availableGenres}
        languages={availableLanguages}
        selectedGenre={queryGenre}
        selectedLanguage={queryLanguage}
        onGenreChange={handleGenreChange}
        onLanguageChange={handleLanguageChange}
        onReset={handleResetFilters}
      />

      {/* Grid / states */}
      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !loading && movies.length === 0 ? (
        <EmptyState
          title="No movies found"
          description="We couldn't find any movie matching your current search or filters."
          action={
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                '--tw-ring-color': 'var(--color-primary)',
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="space-y-8">
          <MovieGrid movies={movies} loading={loading} skeletonCount={10} />
          <Pagination
            page={pagination.page || queryPage}
            totalPages={pagination.totalPages || 1}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
