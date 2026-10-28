import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, Printer, Home, AlertCircle, QrCode } from 'lucide-react';
import { bookingApi } from '../api/bookingApi.js';
import { formatPrice, formatDate, formatTime } from '../utils/format.js';
import ErrorState from '../components/ErrorState.jsx';
import { toast } from 'react-toastify';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isStillProcessing, setIsStillProcessing] = useState(false);

  const pollIntervalRef = useRef(null);
  const pollTimeoutRef = useRef(null);

  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id || '');

  useEffect(() => {
    document.title = 'Booking Confirmed — IMovies';
  }, []);

  useEffect(() => {
    if (!isValidObjectId) return;

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 10;

    const checkStatus = async () => {
      try {
        const res = await bookingApi.getBooking(id);
        const b = res?.data;

        if (!isMounted) return;

        if (b.status === 'confirmed') {
          setBooking(b);
          setLoading(false);
          clearInterval(pollIntervalRef.current);
          clearTimeout(pollTimeoutRef.current);
        } else if (b.status === 'expired' || b.status === 'cancelled') {
          setError(`This booking is ${b.status}.`);
          setLoading(false);
          clearInterval(pollIntervalRef.current);
          clearTimeout(pollTimeoutRef.current);
        } else {
          pollCount++;
          if (pollCount >= maxPolls) {
            setIsStillProcessing(true);
            setLoading(false);
            clearInterval(pollIntervalRef.current);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
          clearInterval(pollIntervalRef.current);
        }
      }
    };

    checkStatus();
    pollIntervalRef.current = setInterval(checkStatus, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollIntervalRef.current);
      clearTimeout(pollTimeoutRef.current);
    };
  }, [id, isValidObjectId]);

  const handleCopyCode = () => {
    if (booking?.bookingCode) {
      navigator.clipboard.writeText(booking.bookingCode);
      setCopied(true);
      toast.success('Booking code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isValidObjectId) {
    return (
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <ErrorState title="Invalid ID" message="The booking reference ID format is invalid." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }}
        />
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Confirming your booking…
        </h2>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Verifying transaction and assigning your cinema seats.
        </p>
      </div>
    );
  }

  if (isStillProcessing) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-6 px-4">
        <div
          className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border"
          style={{
            backgroundColor: 'rgba(245, 166, 35, 0.15)',
            borderColor: 'rgba(245, 166, 35, 0.35)',
            color: 'var(--color-warning)',
          }}
        >
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Payment Still Processing
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--color-muted)' }}>
          Your payment transaction is taking slightly longer to confirm. You will receive an in-app notification once the cinema records the confirmation.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/movies"
            className="px-5 py-2.5 rounded-xl border text-xs font-semibold"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <ErrorState title="Confirmation Unavailable" message={error || 'Booking record could not be loaded.'} />
        <div className="text-center mt-6">
          <Link to="/movies" className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
            &larr; Back to movies
          </Link>
        </div>
      </div>
    );
  }

  const show = booking.show;
  const movie = show?.movie;
  const theatre = show?.theatre;

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6 print:py-0 print:m-0 print:max-w-none">
      {/* ── Ticket Container ───────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl border shadow-2xl overflow-hidden print:border print:border-neutral-300 print:bg-white print:text-black"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Ticket Header Banner */}
        <div
          className="p-6 text-center text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Booking Confirmed</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{movie?.title}</h1>
          <p className="text-xs text-white/80 mt-1">
            {theatre?.name} • {show?.screenName} • {show?.language}
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b text-xs" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <span className="block text-[11px] font-medium" style={{ color: 'var(--color-muted)' }}>Date</span>
              <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                {formatDate(show?.startTime)}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-medium" style={{ color: 'var(--color-muted)' }}>Time</span>
              <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                {formatTime(show?.startTime)}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-medium" style={{ color: 'var(--color-muted)' }}>City</span>
              <span className="font-bold text-sm truncate block" style={{ color: 'var(--color-text)' }}>
                {theatre?.city}
              </span>
            </div>
          </div>

          {/* Reserved Seats List */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold block" style={{ color: 'var(--color-muted)' }}>
              Confirmed Seats ({booking.seats.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((seatLabel) => (
                <span
                  key={seatLabel}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold"
                  style={{
                    backgroundColor: 'var(--color-primary-soft)',
                    border: '1px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {seatLabel}
                </span>
              ))}
            </div>
          </div>

          {/* Location info */}
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Address: </span>
            {theatre?.address}, {theatre?.city}
          </div>
        </div>

        {/* ── Dashed Tear Line with Notches ────────────────────────────── */}
        <div className="relative flex items-center my-1">
          {/* Left Cutout Circle */}
          <div
            className="w-6 h-6 rounded-full -ml-3 z-10 border"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
            }}
          />
          {/* Dashed Tear Line */}
          <div
            className="flex-1 border-t-2 border-dashed mx-2"
            style={{ borderColor: 'var(--color-border)' }}
          />
          {/* Right Cutout Circle */}
          <div
            className="w-6 h-6 rounded-full -mr-3 z-10 border"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
            }}
          />
        </div>

        {/* ── Ticket Stub (QR & Booking Code) ─────────────────────────── */}
        <div
          className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          {/* Booking Code & Price */}
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--color-muted)' }}>
              Booking Code
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[var(--color-primary)]">
                {booking.bookingCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg border transition-colors hover:opacity-80 print:hidden"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                title="Copy code"
                aria-label="Copy booking code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs pt-1" style={{ color: 'var(--color-muted)' }}>
              Amount Paid: <span className="font-bold" style={{ color: 'var(--color-text)' }}>{formatPrice(booking.amount)}</span>
            </p>
          </div>

          {/* QR Placeholder */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className="w-24 h-24 p-2 rounded-2xl border flex flex-col items-center justify-center shadow-inner relative"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              {/* Stylized QR Visual */}
              <QrCode className="w-16 h-16" style={{ color: 'var(--color-text)' }} />
            </div>
            <span className="text-[10px] mt-1.5 font-medium tracking-wide uppercase" style={{ color: 'var(--color-muted)' }}>
              Scan at Entrance
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs border transition-colors hover:opacity-85"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <Printer className="w-4 h-4" />
          <span>Print Ticket</span>
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-white transition-all shadow-lg hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
            boxShadow: '0 8px 24px rgba(248, 68, 100, 0.35)',
          }}
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
