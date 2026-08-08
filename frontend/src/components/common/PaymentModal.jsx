import { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, X, AlertCircle, FlaskConical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const IS_DEV = import.meta.env.DEV;

const PaymentModal = ({ isOpen, onClose, item, itemType = 'certification', onSuccess }) => {
  const { currentUser } = useAuth();

  // ALL hooks must be declared at the top — before any conditional returns
  const [gateway, setGateway] = useState('esewa');
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [error, setError] = useState('');
  const [simSuccess, setSimSuccess] = useState(null);

  // eSewa UAT Interactive Sandbox State
  const [showEsewaSandbox, setShowEsewaSandbox] = useState(false);
  const [sandboxStep, setSandboxStep] = useState('login');
  const [esewaId, setEsewaId] = useState('9711111111');
  const [esewaPass, setEsewaPass] = useState('Nepal@123');
  const [esewaOtp, setEsewaOtp] = useState('123456');
  const [sandboxError, setSandboxError] = useState('');
  const [activeTxUuid, setActiveTxUuid] = useState('');

  // Early return after all hooks
  if (!isOpen || !item) return null;

  const price = item.price || 0;
  const studentEmail = currentUser?.email || '';
  const studentName = currentUser?.displayName || 'Student';

  // ─── Initiate Payment ───
  const handleProcessPayment = async () => {
    try {
      setLoading(true);
      setError('');

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const redirectBaseUrl = window.location.origin;

      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ itemId: item._id, itemType, gateway, studentEmail, studentName, redirectBaseUrl })
      });

      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || 'Failed to initiate payment');

      // Free Course: enroll directly
      if (resData.isFree) {
        if (onSuccess) onSuccess();
        onClose();
        return;
      }

      // eSewa flow
      if (gateway === 'esewa' && resData.esewaData) {
        setActiveTxUuid(resData.transactionUuid);

        if (IS_DEV) {
          // Show built-in eSewa UAT sandbox — no external redirect needed
          setShowEsewaSandbox(true);
          setSandboxStep('login');
          setSandboxError('');
          return;
        }

        // Production: submit form directly to eSewa portal
        const { esewaUrl, ...fields } = resData.esewaData;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = esewaUrl;
        form.style.display = 'none';
        Object.keys(fields).forEach((key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }

      // Khalti flow
      if (gateway === 'khalti' && resData.paymentUrl) {
        window.location.href = resData.paymentUrl;
        return;
      }

      throw new Error('Invalid gateway configuration returned by server');
    } catch (err) {
      setError(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── eSewa UAT Sandbox: Validate Login Credentials ───
  const handleEsewaSandboxLogin = (e) => {
    e.preventDefault();
    setSandboxError('');
    const validIds = ['9711111111', '9711111112', '9711111113', '9711111114', '9806800001'];
    if (!validIds.includes(esewaId.trim())) {
      setSandboxError('Invalid eSewa ID. Use: 9711111111, 9711111112, 9711111113, or 9711111114');
      return;
    }
    if (esewaPass !== 'Nepal@123' && esewaPass !== '1122') {
      setSandboxError('Invalid password. Use UAT Test Password: Nepal@123  or MPIN: 1122');
      return;
    }
    setSandboxStep('otp');
  };

  // ─── eSewa UAT Sandbox: Verify OTP and Complete Payment ───
  const handleEsewaSandboxOtpSubmit = async (e) => {
    e.preventDefault();
    setSandboxError('');

    if (esewaOtp.trim() !== '123456' && esewaOtp.trim() !== '12345') {
      setSandboxError('Invalid OTP. Official UAT Token is 123456');
      return;
    }

    try {
      setSandboxStep('processing');
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const fakeRefCode = `REF-${Math.floor(Math.random() * 900000 + 100000)}`;
      const payload = {
        transaction_code: fakeRefCode,
        status: 'COMPLETE',
        total_amount: String(price),
        transaction_uuid: activeTxUuid,
        product_code: 'EPAYTEST',
        signed_field_names: 'transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names',
        signature: 'sandbox_verified'
      };

      const base64Data = btoa(JSON.stringify(payload));

      const res = await fetch(`${API_BASE}/payments/esewa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: base64Data })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      // Redirect to Payment Success page
      window.location.href = `${window.location.origin}/payment/esewa/success?data=${encodeURIComponent(base64Data)}`;
    } catch (err) {
      setSandboxError(err.message || 'Payment verification failed. Please try again.');
      setSandboxStep('otp');
    }
  };

  // ─── DEV: Simulate Payment Bypass ───
  const handleSimulatePayment = async () => {
    try {
      setSimLoading(true);
      setError('');
      setSimSuccess(null);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/payments/test/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item._id, itemType, studentEmail, studentName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Simulation failed');
      setSimSuccess(`✅ Test payment successful! Ref: ${data.refCode}`);
      setTimeout(() => { if (onSuccess) onSuccess(); onClose(); }, 2000);
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setSimLoading(false);
    }
  };

  // ─── Render ───
  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.25s ease'
    }}>

      {/* ══════════════════ eSEWA UAT SANDBOX PORTAL ══════════════════ */}
      {showEsewaSandbox ? (
        <div style={{
          background: '#F8FAFC', borderRadius: '1.75rem',
          maxWidth: '460px', width: '100%', padding: '2.25rem',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          border: '2px solid #60BB46', position: 'relative'
        }}>
          {/* Close */}
          <button onClick={() => setShowEsewaSandbox(false)} style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: '#E2E8F0', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B'
          }}><X size={16} /></button>

          {/* eSewa Logo + Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: '#60BB46', color: 'white',
              padding: '0.4rem 1.25rem', borderRadius: '0.65rem',
              fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.02em',
              boxShadow: '0 6px 16px rgba(96, 187, 70, 0.3)'
            }}>eSewa</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#16A34A', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Official UAT Developer Sandbox
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
              Merchant: <strong>EPAYTEST</strong> &nbsp;|&nbsp; Amount: <strong style={{ color: '#16A34A' }}>NPR {price}</strong>
            </div>
          </div>

          {/* Error */}
          {sandboxError && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C',
              padding: '0.75rem 1rem', borderRadius: '0.75rem',
              fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem'
            }}>⚠️ {sandboxError}</div>
          )}

          {/* STEP 1 — Login */}
          {sandboxStep === 'login' && (
            <form onSubmit={handleEsewaSandboxLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  eSewa ID (Mobile Number)
                </label>
                <input
                  type="text" value={esewaId}
                  onChange={(e) => setEsewaId(e.target.value)}
                  placeholder="9711111111" required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 600, outline: 'none', background: 'white', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Test IDs: 9711111111 / 9711111112 / 9711111113</span>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Password / MPIN
                </label>
                <input
                  type="password" value={esewaPass}
                  onChange={(e) => setEsewaPass(e.target.value)}
                  placeholder="Nepal@123" required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 600, outline: 'none', background: 'white', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>UAT Password: <strong>Nepal@123</strong> &nbsp; MPIN: <strong>1122</strong></span>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', fontSize: '0.78rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} /> reCAPTCHA Verification Bypassed (Sandbox Mode)
              </div>

              <button type="submit" style={{
                width: '100%', padding: '0.85rem', borderRadius: '0.75rem',
                background: '#60BB46', color: 'white', fontWeight: 800,
                fontSize: '1rem', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(96, 187, 70, 0.35)', marginTop: '0.25rem'
              }}>
                LOGIN &amp; CONTINUE TO OTP
              </button>
            </form>
          )}

          {/* STEP 2 — OTP */}
          {sandboxStep === 'otp' && (
            <form onSubmit={handleEsewaSandboxOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '0.82rem', color: '#92400E', fontWeight: 600 }}>
                📲 6-Digit verification token sent to <strong>{esewaId}</strong>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  OTP Token
                </label>
                <input
                  type="text" value={esewaOtp}
                  onChange={(e) => setEsewaOtp(e.target.value)}
                  placeholder="123456" required maxLength={6}
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.35em', textAlign: 'center', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                />
                <span style={{ display: 'block', textAlign: 'center', fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
                  UAT Token: <strong>123456</strong>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSandboxStep('login')} style={{
                  padding: '0.75rem', borderRadius: '0.75rem', background: '#E2E8F0',
                  color: '#475569', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer'
                }}>← Back</button>
                <button type="submit" style={{
                  padding: '0.75rem', borderRadius: '0.75rem', background: '#60BB46',
                  color: 'white', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(96, 187, 70, 0.35)'
                }}>CONFIRM PAYMENT</button>
              </div>
            </form>
          )}

          {/* STEP 3 — Processing */}
          {sandboxStep === 'processing' && (
            <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.5rem' }}>
                Verifying Payment...
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Validating HMAC-SHA256 signature &amp; enrolling student...
              </p>
            </div>
          )}
        </div>

      ) : (
        /* ══════════════════ STANDARD PAYMENT MODAL ══════════════════ */
        <div style={{
          background: 'var(--surface)', borderRadius: '1.75rem',
          maxWidth: '520px', width: '100%', padding: '2.25rem',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid var(--border)', position: 'relative'
        }}>
          {/* Close Button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'var(--surface-hover)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'
          }}><X size={18} /></button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
              color: 'var(--primary-600)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 0.85rem auto', boxShadow: '0 8px 20px rgba(40,116,198,0.15)'
            }}><ShieldCheck size={28} /></div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
              Checkout &amp; Verification
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              Official digital certification enrollment powered by eSewa &amp; Khalti
            </p>
          </div>

          {/* Course Summary */}
          <div style={{
            background: 'var(--background-secondary)', borderRadius: '1.25rem',
            padding: '1.25rem', border: '1px solid var(--border)', marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Program</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', background: '#DCFCE7', color: '#15803D', borderRadius: '9999px' }}>🔒 Verified Certificate</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.85rem 0', lineHeight: '1.35' }}>{item.title}</h3>
            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tuition &amp; Certification Fee</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Rs. {price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tax &amp; Service Charge</span>
                <span style={{ fontWeight: 700, color: '#16A34A' }}>Rs. 0 (Free)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-800)', borderTop: '1px solid var(--border)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                <span>Total Payable Amount</span>
                <span>Rs. {price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626',
              padding: '0.85rem 1rem', borderRadius: '0.85rem',
              fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {/* Gateway Tabs */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Choose Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {/* eSewa */}
              <div onClick={() => setGateway('esewa')} style={{
                borderRadius: '1.15rem',
                border: gateway === 'esewa' ? '2.5px solid #60BB46' : '1.5px solid var(--border)',
                background: gateway === 'esewa' ? 'rgba(96, 187, 70, 0.08)' : 'var(--surface)',
                padding: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                boxShadow: gateway === 'esewa' ? '0 8px 20px rgba(96, 187, 70, 0.2)' : 'none'
              }}>
                <div style={{ background: '#60BB46', color: 'white', fontWeight: 900, fontSize: '1rem', padding: '0.3rem 0.85rem', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(96, 187, 70, 0.3)' }}>eSewa</div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: gateway === 'esewa' ? '#41862D' : 'var(--text-secondary)' }}>ePay v2 Standard</span>
              </div>
              {/* Khalti */}
              <div onClick={() => setGateway('khalti')} style={{
                borderRadius: '1.15rem',
                border: gateway === 'khalti' ? '2.5px solid #5C2D91' : '1.5px solid var(--border)',
                background: gateway === 'khalti' ? 'rgba(92, 45, 145, 0.08)' : 'var(--surface)',
                padding: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                boxShadow: gateway === 'khalti' ? '0 8px 20px rgba(92, 45, 145, 0.2)' : 'none'
              }}>
                <div style={{ background: '#5C2D91', color: 'white', fontWeight: 900, fontSize: '1rem', padding: '0.3rem 0.85rem', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(92, 45, 145, 0.3)' }}>Khalti</div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: gateway === 'khalti' ? '#5C2D91' : 'var(--text-secondary)' }}>ePayment v2</span>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleProcessPayment}
            disabled={loading}
            className="btn"
            style={{
              width: '100%', height: '52px', borderRadius: '0.85rem',
              background: gateway === 'esewa'
                ? 'linear-gradient(135deg, #60BB46 0%, #41862D 100%)'
                : 'linear-gradient(135deg, #5C2D91 0%, #441A70 100%)',
              color: 'white', fontWeight: 800, fontSize: '1rem', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: gateway === 'esewa' ? '0 8px 25px rgba(96, 187, 70, 0.35)' : '0 8px 25px rgba(92, 45, 145, 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.25s ease'
            }}
          >
            {loading ? 'Redirecting to Secure Gateway...' : <><span>Pay Rs. {price.toLocaleString()} via {gateway === 'esewa' ? 'eSewa' : 'Khalti'}</span> <ArrowRight size={18} /></>}
          </button>

          {/* Security Note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Lock size={13} color="#16A34A" /> 256-Bit Encrypted Payment &amp; Instant Certificate Access
          </div>

          {/* DEV ONLY: Simulate Test Payment */}
          {IS_DEV && (
            <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
              {simSuccess ? (
                <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
                  {simSuccess}
                </div>
              ) : (
                <button onClick={handleSimulatePayment} disabled={simLoading} style={{
                  width: '100%', padding: '0.75rem', borderRadius: '0.75rem',
                  border: '1.5px dashed #F59E0B', background: 'rgba(245, 158, 11, 0.06)',
                  color: '#B45309', fontWeight: 800, fontSize: '0.88rem',
                  cursor: simLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}>
                  <FlaskConical size={16} />
                  {simLoading ? 'Simulating...' : '⚡ Simulate Test Payment (Dev Only)'}
                </button>
              )}
              <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
                Bypasses real gateway — for local development testing only
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentModal;
