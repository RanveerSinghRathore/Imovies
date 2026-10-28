import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 w-full px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
      style={{
        backgroundColor: 'var(--color-warning)',
        color: '#1F2533',
      }}
    >
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span>You are currently offline. Please check your internet connection.</span>
    </div>
  );
}
