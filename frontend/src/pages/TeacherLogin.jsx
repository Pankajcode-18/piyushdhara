import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sendTeacherOtpApi, verifyTeacherOtpApi } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Mail, KeyRound, ArrowRight, RefreshCw, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

const TeacherLogin = () => {
  const { setUserProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 1 = Email Input, Step 2 = OTP Entry
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(300);

  const inputRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null)
  ];

  // Resend cooldown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  // OTP expiry countdown
  useEffect(() => {
    if (step !== 2 || expiryTimer <= 0) return;
    const t = setInterval(() => setExpiryTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, expiryTimer]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Send OTP ──────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) { setError('Please enter your registered teacher email address.'); return; }

    try {
      setError('');
      setLoading(true);
      const res = await sendTeacherOtpApi(cleanEmail);
      setSuccessMsg(res.message || 'OTP sent to your email.');
      setStep(2);
      setResendTimer(30);
      setExpiryTimer(300);
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => { if (inputRefs[0].current) inputRefs[0].current.focus(); }, 100);
    } catch (err) {
      // If rate-limited (429), start a visible countdown timer so user knows when to retry
      if (err.waitSeconds && err.waitSeconds > 0) {
        setResendTimer(err.waitSeconds);
      }
      setError(err.message || 'Teacher account not found. Contact the administrator.');
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) { setError('Please enter all 6 digits of the OTP.'); return; }

    try {
      setError('');
      setLoading(true);
      const data = await verifyTeacherOtpApi(email.trim().toLowerCase(), otp);

      const userData = { _id: data._id, name: data.name, email: data.email, role: 'admin' };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (setUserProfile) setUserProfile(userData);

      setSuccessMsg('OTP Verified! Redirecting to Admin Dashboard...');
      setTimeout(() => { window.location.href = '/admin'; }, 500);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Digit helpers ─────────────────────────────────────────────
  const handleDigitChange = (idx, val) => {
    if (isNaN(val)) return;
    const next = [...digits];
    next[idx] = val.slice(-1);
    setDigits(next);
    if (val && idx < 5 && inputRefs[idx + 1].current) inputRefs[idx + 1].current.focus();
  };

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0 && inputRefs[idx - 1].current)
      inputRefs[idx - 1].current.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setDigits(pasted.split(''));
      if (inputRefs[5].current) inputRefs[5].current.focus();
    }
  };

  return (
    <div
      className="flex-center animate-fade-in"
      style={{ minHeight: '88vh', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div
        className="card"
        style={{
          width: '100%', maxWidth: '460px', padding: '2.75rem 2.25rem',
          borderRadius: '2rem', background: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(15,23,42,0.18)',
          border: '1px solid #E2E8F0', position: 'relative', zIndex: 1
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.85rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(40,116,198,0.18)' }}>
              <ShieldCheck size={36} color="var(--primary-600)" />
            </div>
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: 'var(--primary-600)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
              <Lock size={13} />
            </div>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
            Teacher <span style={{ color: 'var(--primary-600)' }}>Portal</span>
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-800)' }}>
            🔒 Secure Email OTP Authentication
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1.75rem' }}>
          {['Enter Email', 'Verify OTP'].map((label, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step > i ? 'var(--primary-600)' : step === i + 1 ? 'var(--primary-600)' : '#E2E8F0',
                  color: step >= i + 1 ? 'white' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800,
                  boxShadow: step === i + 1 ? '0 4px 12px rgba(40,116,198,0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: step >= i + 1 ? 'var(--primary-600)' : '#94A3B8', marginTop: '0.25rem', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < 1 && <div style={{ height: '2px', flex: 1, background: step > 1 ? 'var(--primary-600)' : '#E2E8F0', transition: 'all 0.3s ease', marginBottom: '1.1rem' }} />}
            </div>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem 1rem', borderRadius: '0.85rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}
        {successMsg && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', color: '#166534', padding: '0.85rem 1rem', borderRadius: '0.85rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <div>{successMsg}</div>
          </div>
        )}

        {/* ── STEP 1: Email Input ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Registered Teacher Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  id="teacher-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  autoFocus
                  style={{
                    width: '100%', height: '50px', borderRadius: '0.85rem',
                    paddingLeft: '2.85rem', paddingRight: '1rem',
                    fontSize: '0.95rem', border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF', color: '#0F172A', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="your-email@gmail.com"
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.4rem 0 0 0' }}>
                A 6-digit OTP will be sent to your registered teacher email.
              </p>
            </div>

            <button
              id="send-otp-btn"
              type="submit"
              disabled={loading || resendTimer > 0}
              className="btn btn-primary"
              style={{
                height: '52px', fontSize: '1rem', borderRadius: '0.85rem',
                background: resendTimer > 0
                  ? '#94A3B8'
                  : 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
                boxShadow: resendTimer > 0 ? 'none' : 'var(--shadow-primary)',
                gap: '0.5rem', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading
                ? 'Sending OTP...'
                : resendTimer > 0
                  ? <><RefreshCw size={18} /> Retry in {resendTimer}s...</>
                  : <><Mail size={18} /> Send 6-Digit Email OTP <ArrowRight size={18} /></>
              }
            </button>

            <button
              type="button"
              onClick={() => setEmail('baduwalpankaj@gmail.com')}
              style={{
                background: '#F8FAFC', border: '1px dashed #CBD5E1', color: '#475569',
                padding: '0.55rem', borderRadius: '0.75rem', fontSize: '0.8rem',
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              ✨ Auto-fill baduwalpankaj@gmail.com
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP Entry ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Enter 6-Digit Email OTP
                </label>
                <span style={{ fontSize: '0.78rem', color: expiryTimer > 60 ? 'var(--primary-600)' : '#DC2626', fontWeight: 700 }}>
                  ⏳ {formatTime(expiryTimer)}
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 0.85rem 0' }}>
                OTP sent to <strong style={{ color: '#0F172A' }}>{email}</strong>
              </p>

              <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center' }} onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    style={{
                      width: '46px', height: '54px', borderRadius: '0.75rem',
                      border: digit ? '2px solid var(--primary-600)' : '1.5px solid #CBD5E1',
                      background: digit ? '#EFF6FF' : '#FFFFFF',
                      fontSize: '1.35rem', fontWeight: 800, textAlign: 'center',
                      color: '#0F172A', outline: 'none',
                      boxShadow: digit ? '0 4px 12px rgba(40,116,198,0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              id="verify-otp-btn"
              type="submit"
              disabled={loading || expiryTimer === 0}
              className="btn btn-primary"
              style={{
                height: '52px', fontSize: '1rem', borderRadius: '0.85rem',
                background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
                boxShadow: 'var(--shadow-primary)', gap: '0.5rem', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {loading ? 'Verifying OTP...' : <><KeyRound size={18} /> Verify &amp; Enter Dashboard</>}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                ← Change Email
              </button>

              <button
                type="button"
                disabled={resendTimer > 0 || loading}
                onClick={handleSendOtp}
                style={{
                  background: 'none', border: 'none',
                  color: resendTimer > 0 ? '#94A3B8' : 'var(--primary-600)',
                  fontSize: '0.82rem', fontWeight: 700,
                  cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.35rem'
                }}
              >
                <RefreshCw size={13} />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
            Are you a student? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>Student Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
