import { ShieldCheck, ShieldAlert, Maximize2, AlertOctagon } from 'lucide-react';

const ExamSecurityHUD = ({
  violationsCount = 0,
  maxAllowed = 3,
  isFullScreen = true,
  securityStatus = 'Clean',
  onRequestFullScreen
}) => {
  const warningsRemaining = Math.max(0, maxAllowed - violationsCount);

  let statusBg = '#10B981';
  let statusText = 'Clean / Secure';

  if (securityStatus === 'Warning' || violationsCount > 0) {
    statusBg = '#F59E0B';
    statusText = `Warning (${violationsCount} Violations)`;
  }
  if (securityStatus === 'Security Violation' || violationsCount >= maxAllowed) {
    statusBg = '#EF4444';
    statusText = 'Security Violation Risk';
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: '#0F172A',
      color: '#FFFFFF',
      padding: '0.5rem 1.25rem',
      borderRadius: '9999px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      fontSize: '0.8rem',
      fontWeight: 700,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      
      {/* Security Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: statusBg,
          boxShadow: `0 0 8px ${statusBg}`
        }} />
        <span style={{ color: '#94A3B8', fontSize: '0.72rem', textTransform: 'uppercase' }}>Security Status:</span>
        <span style={{ color: statusBg, fontWeight: 800 }}>{statusText}</span>
      </div>

      {/* Counter */}
      <div style={{ borderLeft: '1px solid #334155', paddingLeft: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ color: '#94A3B8' }}>Violations:</span>
        <span style={{
          background: violationsCount > 0 ? (violationsCount >= maxAllowed ? '#DC2626' : '#D97706') : '#334155',
          color: 'white',
          padding: '0.15rem 0.5rem',
          borderRadius: '0.4rem',
          fontSize: '0.75rem',
          fontWeight: 900
        }}>
          {violationsCount} / {maxAllowed}
        </span>
      </div>

      {/* Full Screen Warning Action */}
      {!isFullScreen && (
        <button
          onClick={onRequestFullScreen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: '#DC2626',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.65rem',
            borderRadius: '0.5rem',
            fontSize: '0.72rem',
            fontWeight: 900,
            cursor: 'pointer',
            animation: 'pulse 1.5s infinite'
          }}
        >
          <Maximize2 size={13} /> Return Fullscreen
        </button>
      )}

    </div>
  );
};

export default ExamSecurityHUD;
