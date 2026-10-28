import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown.js';

export default function HoldTimer({ expiresAt, serverOffsetMs, onExpire }) {
  const { secondsLeft, formatted, isExpiringSoon } = useCountdown(expiresAt, serverOffsetMs, onExpire);
  const [announcement, setAnnouncement] = useState('');

  // Announce only at milestones (60s, 30s, 10s) instead of every second
  useEffect(() => {
    if (secondsLeft === 60) {
      setAnnouncement('Notice: Seat hold expires in 1 minute.');
    } else if (secondsLeft === 30) {
      setAnnouncement('Warning: Seat hold expires in 30 seconds.');
    } else if (secondsLeft === 10) {
      setAnnouncement('Urgent: Seat hold expires in 10 seconds.');
    }
  }, [secondsLeft]);

  return (
    <>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider transition-colors shadow-sm"
        style={{
          backgroundColor: isExpiringSoon ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          borderColor: isExpiringSoon ? 'var(--color-error)' : 'var(--color-success)',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          color: isExpiringSoon ? 'var(--color-error)' : 'var(--color-success)',
        }}
        aria-label={`Seat hold timer: ${formatted} remaining`}
      >
        <Timer className={`w-3.5 h-3.5 ${isExpiringSoon ? 'animate-spin' : ''}`} aria-hidden="true" />
        <span aria-hidden="true">{formatted}</span>
      </div>

      {/* Screen-reader aria-live announcement region */}
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
