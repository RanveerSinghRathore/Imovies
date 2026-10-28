import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils/format.js';

export default function TrailerModal({ isOpen, trailerUrl, movieTitle, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(trailerUrl);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity animate-fadeIn"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`${movieTitle} Trailer`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <h3
              className="text-sm sm:text-base font-bold truncate max-w-md sm:max-w-xl"
              style={{ color: 'var(--color-text)' }}
            >
              {movieTitle} — Official Trailer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              '--tw-ring-color': 'var(--color-primary)',
            }}
            aria-label="Close trailer"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=1&rel=0`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              <p>Trailer video preview is currently unavailable or invalid link provided.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
