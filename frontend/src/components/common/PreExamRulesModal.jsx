import { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  FileText, 
  Award, 
  AlertTriangle, 
  Maximize2, 
  CheckCircle2, 
  XSquare,
  Sparkles
} from 'lucide-react';

const PreExamRulesModal = ({
  isOpen,
  title,
  durationMinutes,
  totalQuestions,
  totalMarks,
  passingPercentage = 70,
  enableNegativeMarking = false,
  securityPolicyMode = 'Standard',
  maxViolations = 3,
  onAcceptAndStart,
  onCancel
}) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '1.75rem',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        border: '1px solid #E2E8F0',
        padding: '2rem',
        position: 'relative'
      }}>
        
        {/* Top Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '2px solid #2563EB',
            color: '#2563EB',
            marginBottom: '0.85rem'
          }}>
            <ShieldCheck size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
            Secure Examination Mode
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0, fontWeight: 600 }}>
            {title || 'Official Assessment'}
          </p>
        </div>

        {/* Exam Specifications Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.85rem',
          marginBottom: '1.5rem',
          background: '#F8FAFC',
          padding: '1rem',
          borderRadius: '1.1rem',
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}>
          <div>
            <Clock size={18} color="#2563EB" style={{ margin: '0 auto 0.2rem auto' }} />
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>DURATION</p>
            <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>{durationMinutes} Min</p>
          </div>

          <div>
            <FileText size={18} color="#059669" style={{ margin: '0 auto 0.2rem auto' }} />
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>QUESTIONS</p>
            <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>{totalQuestions}</p>
          </div>

          <div>
            <Award size={18} color="#D97706" style={{ margin: '0 auto 0.2rem auto' }} />
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>PASS SCORE</p>
            <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>{passingPercentage}%</p>
          </div>

          <div>
            <Sparkles size={18} color="#7C3AED" style={{ margin: '0 auto 0.2rem auto' }} />
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>MARKS</p>
            <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>{totalMarks}</p>
          </div>
        </div>

        {/* Security Rules Box */}
        <div style={{
          background: securityPolicyMode === 'Strict' ? '#FEF2F2' : '#FFFBEB',
          border: `1px solid ${securityPolicyMode === 'Strict' ? '#FEE2E2' : '#FDE68A'}`,
          borderRadius: '1.1rem',
          padding: '1.1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '0.98rem',
            fontWeight: 800,
            color: securityPolicyMode === 'Strict' ? '#991B1B' : '#92400E',
            margin: '0 0 0.65rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={20} color={securityPolicyMode === 'Strict' ? '#DC2626' : '#D97706'} />
            Anti-Cheating Examination Rules ({securityPolicyMode} Mode)
          </h3>

          <ul style={{
            margin: 0,
            paddingLeft: '1.25rem',
            fontSize: '0.85rem',
            color: securityPolicyMode === 'Strict' ? '#7F1D1D' : '#78350F',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <li><strong>Full-Screen Required:</strong> The examination will run strictly in browser full-screen mode.</li>
            <li><strong>Tab &amp; Window Monitoring:</strong> Switching browser tabs, minimizing the window, or opening other applications will be flagged immediately.</li>
            <li><strong>Automatic Submission Policy:</strong> {securityPolicyMode === 'Strict' ? 'First security violation will immediately auto-submit your exam.' : `Up to ${maxViolations - 1} warnings will be issued. The ${maxViolations}rd violation will automatically submit your exam.`}</li>
            <li><strong>Page Reload &amp; Navigation Lock:</strong> Reloading or navigating away will log a security violation.</li>
            {enableNegativeMarking && <li style={{ color: '#DC2626', fontWeight: 700 }}>⚠️ Negative Marking applies for incorrect answers.</li>}
          </ul>
        </div>

        {/* Agreement Checkbox */}
        <label style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          fontSize: '0.88rem',
          color: '#334155',
          cursor: 'pointer',
          fontWeight: 700,
          marginBottom: '1.5rem',
          background: '#F1F5F9',
          padding: '0.85rem 1rem',
          borderRadius: '0.85rem',
          border: '1px solid #CBD5E1'
        }}>
          <input 
            type="checkbox" 
            checked={accepted} 
            onChange={(e) => setAccepted(e.target.checked)}
            style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#2563EB' }}
          />
          <span>
            I have read and agree to all examination rules. I consent to full-screen security monitoring and understand that security violations will auto-submit my exam.
          </span>
        </label>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: '0.85rem',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#64748B',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              Cancel &amp; Exit
            </button>
          )}

          <button
            onClick={onAcceptAndStart}
            disabled={!accepted}
            style={{
              flex: 2,
              padding: '0.85rem',
              borderRadius: '0.85rem',
              border: 'none',
              background: accepted ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#94A3B8',
              color: 'white',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: accepted ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: accepted ? '0 8px 20px rgba(37,99,235,0.25)' : 'none'
            }}
          >
            <Maximize2 size={18} /> Accept &amp; Enter Full-Screen Exam
          </button>
        </div>

      </div>
    </div>
  );
};

export default PreExamRulesModal;
