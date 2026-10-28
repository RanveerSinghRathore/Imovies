import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function ConnectionBadge({ connected }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
      style={{
        backgroundColor: connected ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 166, 35, 0.15)',
        borderColor: connected ? 'rgba(34, 197, 94, 0.35)' : 'rgba(245, 166, 35, 0.4)',
        color: connected ? 'var(--color-success)' : 'var(--color-warning)',
      }}
    >
      {connected ? (
        <>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-success)' }}
          />
          <span>Live Seat Map</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span className="animate-pulse">Reconnecting…</span>
        </>
      )}
    </div>
  );
}
