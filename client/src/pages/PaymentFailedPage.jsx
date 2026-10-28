import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { XCircle, RotateCcw, Home, ShieldAlert } from 'lucide-react';

export default function PaymentFailedPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = 'Payment Status — IMovies';
  }, []);

  const stateReason = location.state?.reason;
  const refundInitiated = location.state?.refundInitiated;

  const defaultReason =
    'The transaction could not be completed or the payment was cancelled. Your selected seats may have been released.';

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      {/* Icon bubble */}
      <div
        className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border shadow-lg"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: 'var(--color-error)',
        }}
      >
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
          Payment Unsuccessful
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {stateReason || defaultReason}
        </p>
      </div>

      {/* Refund Assurance Banner */}
      <div
        className="p-4 sm:p-5 rounded-2xl border text-left flex items-start gap-3.5"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-warning)' }} />
        <div className="text-xs space-y-1">
          <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
            Your Money is Safe
          </span>
          <p style={{ color: 'var(--color-muted)' }}>
            {refundInitiated
              ? 'A full refund has already been triggered by Razorpay. Any deducted amount will reflect in your original payment method in 3–5 working days.'
              : 'If any amount was deducted from your account, Razorpay will automatically reverse and refund it to your original payment method.'}
          </p>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/movies"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-white transition-all shadow-lg hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
            boxShadow: '0 8px 24px rgba(248, 68, 100, 0.35)',
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Another Show</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border font-bold text-xs transition-colors hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
