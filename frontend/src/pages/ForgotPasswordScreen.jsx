import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';

const ForgotPasswordScreen = () => {
  const { triggerPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      await triggerPasswordReset(email.trim());
      setMessage('Password reset email sent! Check your inbox for instructions.');
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '85vh', padding: '2rem 1rem' }}>
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          padding: '3rem 2.5rem', 
          borderRadius: '2rem', 
          background: '#FFFFFF', 
          boxShadow: '0 25px 50px -12px rgba(37,99,235,0.12)',
          border: '1px solid #DBEAFE'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
            Reset <span style={{ color: '#2563EB' }}>Password</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        {message && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', color: '#166534', padding: '0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  height: '48px', 
                  borderRadius: '0.85rem', 
                  paddingLeft: '2.85rem', 
                  paddingRight: '1rem',
                  fontSize: '0.92rem',
                  border: '1.5px solid #CBD5E1',
                  outline: 'none'
                }}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ height: '50px', fontSize: '1rem', borderRadius: '0.85rem', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Sending Link...' : <>Send Reset Email <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: '#64748B' }}>
          Remember your password? <Link to="/login" style={{ color: '#2563EB', fontWeight: 700 }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
