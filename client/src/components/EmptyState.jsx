import React from 'react';
import { Film } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting your search or filters to discover more.',
  action,
  icon: Icon = Film,
}) {
  return (
    <div
      className="py-20 px-4 flex flex-col items-center justify-center text-center rounded-2xl"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Icon bubble */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: 'var(--color-primary-soft)' }}
      >
        <Icon className="w-7 h-7" style={{ color: 'var(--color-primary)' }} aria-hidden />
      </div>

      <h3
        className="text-base font-bold"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </h3>
      <p
        className="text-xs sm:text-sm max-w-sm mt-1.5 leading-relaxed"
        style={{ color: 'var(--color-muted)' }}
      >
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
