import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailure = () => {
  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '85vh', padding: '2.5rem 1rem' }}>
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '3rem 2.5rem',
          borderRadius: '2rem',
          background: 'var(--surface)',
          boxShadow: '0 25px 50px -12px rgba(220,38,38,0.15)',
          border: '1px solid #FEE2E2',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 10px 25px rgba(220,38,38,0.2)'
          }}
        >
          <XCircle size={44} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Payment Cancelled
        </h2>

        <p style={{ color: '#DC2626', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
          Transaction was not completed
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          You either cancelled the payment request on eSewa / Khalti or your session timed out. No funds were debited from your digital wallet.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Link
            to="/certifications"
            className="btn btn-primary"
            style={{
              height: '50px',
              borderRadius: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <RefreshCw size={16} /> Try Enrolling Again
          </Link>

          <Link
            to="/"
            className="btn btn-outline"
            style={{
              height: '48px',
              borderRadius: '0.85rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
