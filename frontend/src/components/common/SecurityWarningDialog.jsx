import { AlertOctagon, Maximize2 } from 'lucide-react';

const SecurityWarningDialog = ({
  isOpen,
  message,
  violationsCount,
  maxAllowed,
  onReturnFullScreen,
  onClose
}) => {
  if (!isOpen) return null;

  const isFinalViolation = violationsCount >= maxAllowed;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '1.75rem',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(220,38,38,0.3)',
        border: `2px solid ${isFinalViolation ? '#DC2626' : '#F59E0B'}`,
        padding: '2rem',
        textAlign: 'center',
        position: 'relative'
      }}>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: isFinalViolation ? '#FEF2F2' : '#FFFBEB',
          border: `3px solid ${isFinalViolation ? '#DC2626' : '#F59E0B'}`,
          color: isFinalViolation ? '#DC2626' : '#D97706',
          marginBottom: '1.25rem'
        }}>
          <AlertOctagon size={42} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
          {isFinalViolation ? 'EXAM AUTO-SUBMITTED' : 'SECURITY WARNING'}
        </h2>

        <div style={{
          background: isFinalViolation ? '#FEF2F2' : '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '1rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: '#334155',
          lineHeight: 1.5,
          fontWeight: 600
        }}>
          {message}
        </div>

        {!isFinalViolation && (
          <div style={{
            fontSize: '0.82rem',
            color: '#64748B',
            fontWeight: 800,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Warnings Remaining: <span style={{ color: '#DC2626', fontSize: '1.1rem' }}>{Math.max(0, maxAllowed - violationsCount)}</span>
          </div>
        )}

        <button
          onClick={() => {
            if (onReturnFullScreen) onReturnFullScreen();
            if (onClose) onClose();
          }}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '0.85rem',
            border: 'none',
            background: isFinalViolation ? '#0F172A' : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            color: 'white',
            fontWeight: 900,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 20px rgba(220,38,38,0.3)'
          }}
        >
          <Maximize2 size={18} /> {isFinalViolation ? 'View Submission Results' : 'I Understand & Return to Full-Screen'}
        </button>

      </div>
    </div>
  );
};

export default SecurityWarningDialog;
