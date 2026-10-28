import React from 'react';
import { Armchair, ArrowRight, XCircle, ShieldCheck } from 'lucide-react';
import { formatPrice, formatTime, formatDate } from '../utils/format.js';
import HoldTimer from './HoldTimer.jsx';

export default function BookingSummary({
  show,
  selectedSeats = [],
  price = 0,
  isHeldMode = false,
  heldBooking = null,
  serverOffsetMs = 0,
  loadingHold = false,
  onHoldSeats,
  onReleaseHold,
  onProceedPayment,
  onTimerExpire,
}) {
  const count = isHeldMode ? heldBooking?.seats?.length || selectedSeats.length : selectedSeats.length;

  const displayAmount = isHeldMode && heldBooking?.amount !== undefined
    ? heldBooking.amount
    : count * price;

  const seatsList = isHeldMode ? heldBooking?.seats || selectedSeats : selectedSeats;

  return (
    <>
      {/* ── Desktop Card View ───────────────────────────────────────────── */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-xl space-y-6"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Show & Movie Header */}
        <div className="space-y-1.5 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-extrabold text-lg line-clamp-1" style={{ color: 'var(--color-text)' }}>
            {show?.movie?.title}
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {show?.theatre?.name} • {show?.screenName}
          </p>
          <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
            {formatDate(show?.startTime)} at {formatTime(show?.startTime)}
          </p>
        </div>

        {/* Selected Seats Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
            <span className="flex items-center gap-1.5">
              <Armchair className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              {isHeldMode ? 'Held Seats' : 'Selected Seats'} ({count})
            </span>
            {isHeldMode && heldBooking?.holdExpiresAt && (
              <HoldTimer
                expiresAt={heldBooking.holdExpiresAt}
                serverOffsetMs={serverOffsetMs}
                onExpire={onTimerExpire}
              />
            )}
          </div>

          {seatsList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {seatsList.map((label) => (
                <span
                  key={label}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: 'var(--color-primary-soft)',
                    border: '1px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs italic" style={{ color: 'var(--color-muted)' }}>
              No seats selected yet. Click any available seat on the grid.
            </p>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-2 border-t space-y-2 text-xs" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between" style={{ color: 'var(--color-muted)' }}>
            <span>Ticket Price ({count} × {formatPrice(price)})</span>
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
              {formatPrice(displayAmount)}
            </span>
          </div>

          <div
            className="flex justify-between text-base font-extrabold pt-2 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span style={{ color: 'var(--color-text)' }}>Total Amount</span>
            <span style={{ color: 'var(--color-primary)' }}>{formatPrice(displayAmount)}</span>
          </div>
          {isHeldMode && (
            <p className="text-[11px] flex items-center gap-1 font-medium" style={{ color: 'var(--color-success)' }}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Seats reserved. 5 minutes to complete payment.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {!isHeldMode ? (
            <button
              type="button"
              disabled={count === 0 || loadingHold}
              onClick={onHoldSeats}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 active:scale-98 focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
                boxShadow: count > 0 ? '0 8px 24px rgba(248, 68, 100, 0.35)' : 'none',
                '--tw-ring-color': 'var(--color-primary)',
              }}
            >
              {loadingHold ? (
                <span>Securing Seats…</span>
              ) : (
                <>
                  <span>Pay {formatPrice(displayAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onProceedPayment}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-success)',
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
                  '--tw-ring-color': 'var(--color-success)',
                }}
              >
                <span>Proceed to Pay {formatPrice(displayAmount)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onReleaseHold}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border hover:opacity-80 focus-visible:outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted)',
                }}
              >
                <XCircle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                <span>Release Seats</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Sticky Bottom Bar on Mobile/Tablet (< 1024px) ─────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3.5 px-4 border-t backdrop-blur-lg flex items-center justify-between gap-4 shadow-2xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold" style={{ color: 'var(--color-primary)' }}>
              {formatPrice(displayAmount)}
            </span>
            {isHeldMode && heldBooking?.holdExpiresAt && (
              <HoldTimer
                expiresAt={heldBooking.holdExpiresAt}
                serverOffsetMs={serverOffsetMs}
                onExpire={onTimerExpire}
              />
            )}
          </div>
          <p className="text-[11px] font-medium" style={{ color: 'var(--color-muted)' }}>
            {count > 0 ? `${count} seat${count > 1 ? 's' : ''} (${seatsList.join(', ')})` : 'Select seats above'}
          </p>
        </div>

        <div>
          {!isHeldMode ? (
            <button
              type="button"
              disabled={count === 0 || loadingHold}
              onClick={onHoldSeats}
              className="py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
                boxShadow: count > 0 ? '0 4px 16px rgba(248, 68, 100, 0.4)' : 'none',
              }}
            >
              {loadingHold ? (
                <span>Locking…</span>
              ) : (
                <>
                  <span>Pay {formatPrice(displayAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onProceedPayment}
              className="py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white transition-all flex items-center gap-2 hover:opacity-95"
              style={{
                backgroundColor: 'var(--color-success)',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
              }}
            >
              <span>Pay {formatPrice(displayAmount)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
