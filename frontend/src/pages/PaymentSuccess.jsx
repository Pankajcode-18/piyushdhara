import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, AlertTriangle, FileText } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setVerifying(true);
        setErrorMsg('');

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // 1. Check if eSewa Callback (contains `data` query parameter)
        const esewaData = searchParams.get('data');
        if (esewaData) {
          const res = await fetch(`${API_BASE}/payments/esewa/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: esewaData })
          });
          const resJson = await res.json();
          if (!res.ok) throw new Error(resJson.message || 'eSewa verification failed');

          setTransaction(resJson.transaction);
          setSuccess(true);
          return;
        }

        // 2. Check if Khalti Callback (contains `pidx` query parameter)
        const pidx = searchParams.get('pidx');
        const purchase_order_id = searchParams.get('purchase_order_id');
        if (pidx) {
          const res = await fetch(`${API_BASE}/payments/khalti/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pidx, purchase_order_id })
          });
          const resJson = await res.json();
          if (!res.ok) throw new Error(resJson.message || 'Khalti verification failed');

          setTransaction(resJson.transaction);
          setSuccess(true);
          return;
        }

        throw new Error('No payment gateway callback parameters found in URL');
      } catch (err) {
        console.error('PaymentSuccess verification error:', err);
        setErrorMsg(err.message || 'Payment verification failed');
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '85vh', padding: '2.5rem 1rem' }}>
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '3rem 2.5rem',
          borderRadius: '2rem',
          background: 'var(--surface)',
          boxShadow: '0 25px 50px -12px rgba(40,116,198,0.18)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}
      >
        {verifying ? (
          <div>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}
            >
              <RefreshCw size={36} className="animate-spin" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Verifying Payment...
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Securing transaction signature with eSewa / Khalti servers. Please hold on.
            </p>
          </div>
        ) : success && transaction ? (
          <div>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 10px 25px rgba(22,163,74,0.2)'
              }}
            >
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              Payment Verified! 🎉
            </h2>
            <p style={{ color: '#16A34A', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.75rem' }}>
              Official Certificate Access Unlocked
            </p>

            {/* Receipt Summary Card */}
            <div
              style={{
                background: 'var(--background-secondary)',
                borderRadius: '1.25rem',
                padding: '1.35rem',
                border: '1px solid var(--border)',
                marginBottom: '1.75rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.88rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Program</span>
                <strong style={{ color: 'var(--text-primary)', textAlign: 'right', maxWidth: '240px' }}>{transaction.itemTitle}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Paid Amount</span>
                <strong style={{ color: 'var(--primary-700)' }}>Rs. {transaction.amount?.toLocaleString()} NPR</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Gateway</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 800, color: transaction.gateway === 'esewa' ? '#15803D' : '#5C2D91' }}>
                  {transaction.gateway === 'esewa' ? '🟢 eSewa (ePay v2)' : '🟣 Khalti (ePayment)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {transaction.transactionCode || transaction.transactionUuid}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Link
                to="/certifications"
                className="btn btn-primary"
                style={{
                  height: '52px',
                  borderRadius: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                Start Certification Course Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: '#FEF2F2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}
            >
              <AlertTriangle size={38} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Verification Failed
            </h2>
            <p style={{ color: '#DC2626', fontSize: '0.92rem', marginBottom: '1.75rem', fontWeight: 600 }}>
              {errorMsg || 'Unable to confirm payment response signature.'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/certifications')}
                className="btn btn-outline"
                style={{ borderRadius: '0.85rem', padding: '0.75rem 1.5rem' }}
              >
                Back to Certifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
