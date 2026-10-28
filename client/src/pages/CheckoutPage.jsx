import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  XCircle,
  AlertCircle,
  Film,
  RotateCcw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { bookingApi } from '../api/bookingApi.js';
import { paymentApi } from '../api/paymentApi.js';
import { loadRazorpay } from '../utils/loadRazorpay.js';
import { formatPrice, formatDate, formatTime } from '../utils/format.js';
import HoldTimer from '../components/HoldTimer.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverOffsetMs] = useState(0);

  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [confirmingModal, setConfirmingModal] = useState(false);
  const [verifyRetryState, setVerifyRetryState] = useState(null);
  const [holdExpired, setHoldExpired] = useState(false);

  const isPayingRef = useRef(false);
  isPayingRef.current = paymentInProgress || confirmingModal;

  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(bookingId || '');

  // 1. Fetch Booking Details
  const fetchBooking = useCallback(async () => {
    if (!isValidObjectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await bookingApi.getBooking(bookingId);
      const b = res?.data;

      if (!b) {
        setError('Booking not found');
        return;
      }

      if (b.status === 'confirmed') {
        navigate(`/booking/${b._id}/confirmation`, { replace: true });
        return;
      }

      if (b.status === 'cancelled') {
        setError('This booking was cancelled.');
        return;
      }

      if (b.status === 'expired') {
        setHoldExpired(true);
        return;
      }

      if (new Date(b.holdExpiresAt) <= new Date()) {
        setHoldExpired(true);
        return;
      }

      setBooking(b);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Not authorised to access this booking');
      } else if (err.response?.status === 404) {
        setError('Booking not found');
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [bookingId, isValidObjectId, navigate]);

  useEffect(() => {
    document.title = 'Checkout & Payment — IMovies';
    if (isValidObjectId) {
      fetchBooking();
    }
  }, [isValidObjectId, fetchBooking]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPayingRef.current) {
        e.preventDefault();
        e.returnValue = 'Payment is in progress. Closing this page may cause transaction failure.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleTimerExpire = useCallback(() => {
    setHoldExpired(true);
    toast.warn('Your seat hold has expired. Please reselect your seats.');
  }, []);

  const verifyWithRetries = async (verifyPayload, attemptsLeft = 3) => {
    try {
      const verifyRes = await paymentApi.verifyPayment(verifyPayload);

      if (verifyRes.data?.success === false || verifyRes.data?.status === 'failed') {
        navigate('/payment/failed', {
          replace: true,
          state: {
            reason:
              verifyRes.data?.message ||
              'Booking confirmation failed due to seat conflict. A full refund has been initiated.',
            refundInitiated: true,
          },
        });
        return;
      }

      navigate(`/booking/${booking._id}/confirmation`, { replace: true });
    } catch (err) {
      const status = err.response?.status;

      if (status === 400) {
        setConfirmingModal(false);
        setPaymentInProgress(false);
        toast.error('Payment verification failed.');
        return;
      }

      if (attemptsLeft > 1) {
        setTimeout(() => {
          verifyWithRetries(verifyPayload, attemptsLeft - 1);
        }, 2000);
      } else {
        setConfirmingModal(false);
        setPaymentInProgress(false);
        setVerifyRetryState(verifyPayload);
      }
    }
  };

  const handlePayClick = async () => {
    if (!booking || paymentInProgress || holdExpired) return;

    setPaymentInProgress(true);
    setVerifyRetryState(null);

    try {
      const orderRes = await paymentApi.createOrder(booking._id);
      const { orderId, amount, currency, keyId } = orderRes.data;

      try {
        const fresh = await bookingApi.getBooking(booking._id);
        if (fresh?.data) {
          setBooking(fresh.data);
        }
      } catch {
        // ignore
      }

      const RazorpaySDK = await loadRazorpay();

      const options = {
        key: keyId,
        order_id: orderId,
        amount: amount,
        currency: currency || 'INR',
        name: 'IMovies Cinema',
        description: `${booking.show?.movie?.title || 'Movie'} • Seats: ${booking.seats.join(', ')}`,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#F84464',
        },
        handler: async function (response) {
          setConfirmingModal(true);
          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          await verifyWithRetries(payload, 3);
        },
        modal: {
          ondismiss: function () {
            setPaymentInProgress(false);
            toast.info('Payment cancelled. You can try again before your hold expires.');
          },
        },
      };

      const rzp = new RazorpaySDK(options);

      rzp.on('payment.failed', async function (response) {
        setPaymentInProgress(false);
        const description = response.error?.description || 'Payment failed';
        toast.error(`Payment failed: ${description}`);
        try {
          await paymentApi.reportFailure(orderId, description);
        } catch {
          // ignore
        }
      });

      rzp.open();
    } catch (err) {
      setPaymentInProgress(false);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleReleaseAndBack = async () => {
    if (!window.confirm('Are you sure you want to release these seats and return?')) {
      return;
    }

    try {
      await bookingApi.releaseHold(booking._id);
      toast.info('Seats released.');
      navigate(`/shows/${booking.show?._id || ''}/seats`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (!isValidObjectId) {
    return (
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <ErrorState
          title="Invalid Booking ID"
          message="The booking reference format is invalid."
        />
        <div className="text-center mt-6">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to movies
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-xs animate-pulse" style={{ color: 'var(--color-muted)' }}>
        Loading booking checkout summary…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <ErrorState title="Checkout Error" message={error} />
        <div className="text-center mt-6">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to movies
          </Link>
        </div>
      </div>
    );
  }

  if (holdExpired) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto text-center space-y-6">
        <div
          className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border"
          style={{
            backgroundColor: 'rgba(245, 166, 35, 0.15)',
            borderColor: 'rgba(245, 166, 35, 0.35)',
            color: 'var(--color-warning)',
          }}
        >
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
          Your Seat Hold Has Expired
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Seats are held temporarily while payment is completed. The time limit for this booking has elapsed and the seats have been released.
        </p>
        <div>
          <Link
            to={`/shows/${booking?.show?._id || ''}/seats`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white transition-all shadow-lg hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
              boxShadow: '0 8px 24px rgba(248, 68, 100, 0.35)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Select Available Seats
          </Link>
        </div>
      </div>
    );
  }

  const show = booking?.show;
  const movie = show?.movie;
  const theatre = show?.theatre;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Full-screen confirmation loading overlay */}
      {confirmingModal && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div
            className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }}
          />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Confirming your payment…
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-sm">
            Please do not close or refresh this window while we verify your transaction and generate your cinema ticket.
          </p>
        </div>
      )}

      {/* Top Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Checkout & Payment
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
            Booking ID: <code className="font-mono font-semibold" style={{ color: 'var(--color-text)' }}>{booking._id}</code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: 'var(--color-muted)' }}>Time remaining:</span>
          <HoldTimer
            expiresAt={booking.holdExpiresAt}
            serverOffsetMs={serverOffsetMs}
            onExpire={handleTimerExpire}
          />
        </div>
      </div>

      {/* Unconfirmed verification retry notice */}
      {verifyRetryState && (
        <div
          className="p-4 rounded-2xl border text-xs space-y-2"
          style={{
            backgroundColor: 'rgba(245, 166, 35, 0.12)',
            borderColor: 'rgba(245, 166, 35, 0.35)',
            color: 'var(--color-text)',
          }}
        >
          <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-warning)' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            Network verification delayed.
          </div>
          <p style={{ color: 'var(--color-muted)' }}>
            Your transaction is safe. If the confirmation doesn't finalize, any deducted amount will be automatically reversed.
          </p>
          <button
            onClick={() => {
              setConfirmingModal(true);
              verifyWithRetries(verifyRetryState, 3);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-warning)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Check again
          </button>
        </div>
      )}

      {/* Order Summary Card */}
      <div
        className="p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Poster */}
          <div
            className="w-24 sm:w-32 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden border shadow-md"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
            }}
          >
            {movie?.poster ? (
              <img src={movie.poster} alt={movie.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-8 h-8 opacity-40" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--color-text)' }}>
                {movie?.title}
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                {theatre?.name} • {theatre?.city} • {show?.screenName}
              </p>
              <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                {formatDate(show?.startTime)} at {formatTime(show?.startTime)}
              </p>
            </div>

            <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-muted)' }}>
                Reserved Seats ({booking.seats.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats.map((seatLabel) => (
                  <span
                    key={seatLabel}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
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
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t space-y-2.5 text-xs" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between" style={{ color: 'var(--color-muted)' }}>
            <span>Ticket Base Price ({booking.seats.length} seats)</span>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {formatPrice(booking.amount)}
            </span>
          </div>
          <div className="flex justify-between" style={{ color: 'var(--color-muted)' }}>
            <span>Convenience & Booking Fee</span>
            <span className="font-bold" style={{ color: 'var(--color-success)' }}>FREE</span>
          </div>

          <div
            className="flex justify-between items-center text-lg font-extrabold pt-3 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span style={{ color: 'var(--color-text)' }}>Grand Total</span>
            <span className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>
              {formatPrice(booking.amount)}
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <div
          className="flex items-center gap-2.5 p-3.5 rounded-2xl border text-xs"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-muted)',
          }}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: 'var(--color-success)' }} />
          <span>
            256-bit SSL encrypted. Payment cryptographically verified through Razorpay official gateway.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          <button
            type="button"
            disabled={paymentInProgress || holdExpired}
            onClick={handlePayClick}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 active:scale-98 cursor-pointer focus-visible:outline-none focus-visible:ring-2"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
              boxShadow: '0 8px 24px rgba(248, 68, 100, 0.4)',
              '--tw-ring-color': 'var(--color-primary)',
            }}
          >
            <CreditCard className="w-4 h-4" />
            <span>{paymentInProgress ? 'Opening Gateway…' : `Pay ${formatPrice(booking.amount)}`}</span>
          </button>

          <button
            type="button"
            disabled={paymentInProgress}
            onClick={handleReleaseAndBack}
            className="w-full py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 hover:opacity-80 cursor-pointer focus-visible:outline-none"
            style={{ color: 'var(--color-muted)' }}
          >
            <XCircle className="w-3.5 h-3.5" style={{ color: 'var(--color-error)' }} />
            <span>Release seats and choose another show</span>
          </button>
        </div>
      </div>
    </div>
  );
}
