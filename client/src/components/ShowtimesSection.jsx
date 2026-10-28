import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building2, MapPin, CalendarDays } from 'lucide-react';
import DateTabs from './DateTabs.jsx';
import ShowtimeButton from './ShowtimeButton.jsx';
import EmptyState from './EmptyState.jsx';
import { useCity } from '../context/CityContext.jsx';
import { formatToYYYYMMDD } from '../utils/format.js';

function ShowtimesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Date tabs placeholder */}
      <div className="flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-16 h-16 rounded-2xl"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
        ))}
      </div>
      {/* Theatre rows placeholder */}
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <div className="h-5 w-48 rounded-lg mb-3" style={{ backgroundColor: 'var(--color-surface-2)' }} />
          <div className="flex gap-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-14 w-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface-2)' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShowtimesSection({ groupedTheatres = [], loading = false }) {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { selectedCity } = useCity();

  const availableDates = useMemo(() => {
    const set = new Set();
    groupedTheatres.forEach((g) =>
      g.shows?.forEach((s) => {
        const d = new Date(s.startTime);
        if (d >= new Date()) set.add(formatToYYYYMMDD(d));
      })
    );
    return Array.from(set).sort();
  }, [groupedTheatres]);

  const [selectedDate, setSelectedDate] = useState(() => availableDates[0] || '');

  React.useEffect(() => {
    if (availableDates.length > 0 && (!selectedDate || !availableDates.includes(selectedDate))) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const handleShowtimeSelect = (showId) => {
    if (user) {
      navigate(`/shows/${showId}/seats`);
    } else {
      navigate('/login', { state: { from: `/shows/${showId}/seats` } });
    }
  };

  if (loading) return <ShowtimesSkeleton />;

  if (groupedTheatres.length === 0 || availableDates.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No showtimes available"
        description={
          selectedCity
            ? `No shows scheduled in ${selectedCity}. Try selecting another city.`
            : 'No upcoming shows are currently scheduled for this movie.'
        }
      />
    );
  }

  const theatresForDate = groupedTheatres
    .map((g) => ({
      ...g,
      shows: (g.shows || []).filter((s) => formatToYYYYMMDD(s.startTime) === selectedDate),
    }))
    .filter((g) => g.shows.length > 0);

  return (
    <div className="space-y-6">
      {/* Section header + date tabs */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Select Showtimes
        </h2>
        <DateTabs
          dates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {theatresForDate.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No shows on this date"
          description="Please choose another date or city."
        />
      ) : (
        <div className="space-y-3">
          {theatresForDate.map((group) => (
            <div
              key={group.theatre._id}
              className="p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-shadow hover:shadow-md"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Theatre info */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} aria-hidden />
                  <h3 className="font-semibold text-base truncate" style={{ color: 'var(--color-text)' }}>
                    {group.theatre.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 pl-6 text-xs" style={{ color: 'var(--color-muted)' }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span className="truncate">
                    {group.theatre.address}, {group.theatre.city}
                  </span>
                </div>
              </div>

              {/* Showtime pills */}
              <div className="flex flex-wrap gap-2.5 shrink-0">
                {group.shows.map((show) => (
                  <ShowtimeButton key={show._id} show={show} onSelect={handleShowtimeSelect} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
