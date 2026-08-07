import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, CheckCircle2, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';

const VerifyEmailScreen = () => {
  const navigate = useNavigate();
  const { currentUser, resendVerificationEmail, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox & spam folder.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (currentUser) {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        navigate('/courses');
      } else {
        setError('Email is not verified yet. Please click the verification link in your inbox.');
      }
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '85vh', padding: '2rem 1rem' }}>
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          padding: '3rem 2.5rem', 
          borderRadius: '2rem', 
          background: '#FFFFFF', 
          boxShadow: '0 25px 50px -12px rgba(37,99,235,0.15)',
          border: '1px solid #DBEAFE',
          textAlign: 'center'
        }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary-600)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={40} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Verify Your <span style={{ color: 'var(--primary-600)' }}>Email</span>
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
          We sent a verification link to <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.email || 'your email'}</strong>.  
          Please verify your email before accessing course materials.
        </p>

        {message && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', color: '#166534', padding: '0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <button 
            onClick={handleCheckVerification} 
            className="btn btn-primary"
            style={{ height: '50px', fontSize: '0.95rem', borderRadius: '0.85rem', gap: '0.5rem' }}
          >
            <CheckCircle2 size={18} /> I Have Verified My Email
          </button>

          <button 
            onClick={handleResend} 
            disabled={loading}
            className="btn btn-outline"
            style={{ height: '48px', fontSize: '0.9rem', borderRadius: '0.85rem', gap: '0.5rem' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Resend Verification Email
          </button>

          <button 
            onClick={logout}
            style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <LogOut size={14} /> Log Out &amp; Try Another Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailScreen;
