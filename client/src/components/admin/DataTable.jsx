import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-4 rounded animate-pulse w-3/4"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function DataTable({ columns, data = [], loading = false, error = null, onRetry, emptyMessage = 'No records found.' }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
              }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8" style={{ color: 'var(--color-error)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{error}</p>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Retry
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm font-medium"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  className="transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3.5 ${col.className || ''}`}
                      style={{ color: 'var(--color-text)' }}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
