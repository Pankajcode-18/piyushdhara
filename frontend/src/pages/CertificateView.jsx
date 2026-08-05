import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCertificateByIdApi } from '../utils/api';
import { 
  Award, 
  CheckCircle2, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  FileCheck,
  Globe
} from 'lucide-react';

const CertificateView = () => {
  const { certificateId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyCert = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchCertificateByIdApi(certificateId);
        setCertificate(res.certificate);
      } catch (err) {
        console.error('Certificate verification error:', err);
        setError(err.message || 'Certificate ID invalid or revoked.');
      } finally {
        setLoading(false);
      }
    };
    verifyCert();
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748B' }}>
        <Sparkles className="animate-spin" size={36} style={{ marginBottom: '1rem', color: '#2563EB' }} />
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Verifying Official Certificate Credentials...</p>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '2.5rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '1.5rem', textAlign: 'center' }}>
        <AlertTriangle size={52} color="#DC2626" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Verification Failed</h2>
        <p style={{ color: '#7F1D1D', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/certifications" className="btn btn-primary">Browse Official Certifications</Link>
      </div>
    );
  }

  const {
    studentName,
    certificationTitle,
    issueDate,
    scorePercentage,
    instructorName,
    platformName,
    status
  } = certificate;

  const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1050px', margin: '0 auto' }}>

      {/* Print Media Query Style Override */}
      <style>{`
        @media print {
          body {
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print, header, sidebar, nav, footer, .sidebar, .navbar {
            display: none !important;
          }
          #certificate-print-area {
            border: 12px solid #0F172A !important;
            box-shadow: none !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 3.5rem 3rem !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', gap: '1rem', flexWrap: 'wrap' }} className="no-print">
        <Link to="/certifications" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Certifications
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleShare}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
          >
            <Share2 size={16} /> {copied ? 'Link Copied!' : 'Share Credential'}
          </button>

          <button 
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', borderRadius: '0.75rem', border: 'none', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: 'white', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,0.25)' }}
          >
            <Download size={18} /> Download / Print PDF Certificate
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.85rem 1.5rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '0.92rem' }}>
          <ShieldCheck size={22} color="#059669" /> Official Verifiable Credential ({certificate.certificateId})
        </div>
        <span style={{ fontSize: '0.78rem', background: '#059669', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 900, letterSpacing: '0.05em' }}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* ── THE OFFICIAL CERTIFICATE CANVAS / DIPLOMA TEMPLATE ──── */}
      <div 
        id="certificate-print-area"
        className="cert-canvas-card"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFA 50%, #FFFFFF 100%)',
          borderRadius: '12px',
          border: '2px solid #C89A2B',
          padding: '4.5rem 3.5rem',
          position: 'relative',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          color: '#333333',
          overflow: 'hidden',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {/* Inner Light Gold Border with 25px Padding */}
        <div style={{ position: 'absolute', top: '18px', left: '18px', right: '18px', bottom: '18px', border: '1px solid #E6C46A', borderRadius: '8px', pointerEvents: 'none', zIndex: 1 }} />

        {/* Decorative Corner Cut Accents */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', width: '22px', height: '22px', borderTop: '2.5px solid #C89A2B', borderLeft: '2.5px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '22px', height: '22px', borderTop: '2.5px solid #C89A2B', borderRight: '2.5px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '22px', height: '22px', borderBottom: '2.5px solid #C89A2B', borderLeft: '2.5px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '22px', height: '22px', borderBottom: '2.5px solid #C89A2B', borderRight: '2.5px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />

        {/* Top-Left Folded Geometric Navy & Gold Ribbon */}
        <svg className="cert-ribbon-tl" style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 200 200" fill="none">
          <path d="M0 0 L200 0 L0 200 Z" fill="#0D2B5C" />
          <path d="M0 0 L155 0 L0 155 Z" fill="#154288" opacity="0.35" />
          <path d="M0 180 L180 0 L190 0 L0 190 Z" fill="#C89A2B" />
          <path d="M0 152 L152 0 L158 0 L0 158 Z" fill="#E6C46A" opacity="0.6" />
        </svg>

        {/* Bottom-Right Folded Geometric Navy & Gold Ribbon */}
        <svg className="cert-ribbon-br" style={{ position: 'absolute', bottom: 0, right: 0, width: '140px', height: '140px', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 140 140" fill="none">
          <path d="M140 140 L0 140 L140 0 Z" fill="#0D2B5C" />
          <path d="M140 140 L30 140 L140 30 Z" fill="#154288" opacity="0.35" />
          <path d="M140 14 L14 140 L6 140 L140 6 Z" fill="#C89A2B" />
          <path d="M140 34 L34 140 L28 140 L140 28 Z" fill="#E6C46A" opacity="0.6" />
        </svg>

        {/* Centered Background Watermark (280px-340px, 6% Opacity) */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.06, pointerEvents: 'none', zIndex: 0 }}>
          <img src="/Logo1.png" alt="Academy Watermark" style={{ width: '330px', height: '330px', objectFit: 'contain' }} />
        </div>

        {/* Top Academy Logo & Horizontal Gold Flourish */}
        <div className="cert-top-flourish" style={{ marginBottom: '1.75rem', position: 'relative', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
            <span style={{ color: '#C89A2B', fontSize: '1.1rem', letterSpacing: '2px' }}>────── ✦</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', borderRadius: '50%', background: '#0D2B5C', border: '3.5px solid #C89A2B', boxShadow: '0 4px 15px rgba(200, 154, 43, 0.35)', overflow: 'hidden' }}>
              <img src="/Logo1.png" alt="Academy Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', transform: 'scale(1.28)', display: 'block' }} />
            </div>
            <span style={{ color: '#C89A2B', fontSize: '1.1rem', letterSpacing: '2px' }}>✦ ──────</span>
          </div>

          <h1 className="cert-main-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '3.2rem', fontWeight: 800, letterSpacing: '8px', color: '#0D2B5C', margin: '0 0 0.15rem 0', lineHeight: 1.1 }}>
            CERTIFICATE
          </h1>

          <div className="cert-sub-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '4px', color: '#0D2B5C', marginBottom: '0.4rem' }}>
            OF COMPLETION
          </div>

          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 600, letterSpacing: '4px', color: '#C89A2B', textTransform: 'uppercase', margin: 0 }}>
            {platformName || 'PIYUSHDHARA PROFESSIONAL LEARNING ACADEMY'}
          </p>

          <div style={{ color: '#C89A2B', fontSize: '1rem', marginTop: '0.45rem' }}>──── ✦ ────</div>
        </div>

        {/* Certification Text & Recipient Name */}
        <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 3 }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem', color: '#666666', fontWeight: 400, margin: '0 0 0.3rem 0' }}>
            This certificate proudly certifies that
          </p>

          <h2 className="cert-recipient-name" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '4.8rem', fontWeight: 400, color: '#0D2B5C', margin: '0 0 0.2rem 0', lineHeight: 1.1 }}>
            {studentName}
          </h2>

          <div style={{ height: '1.5px', background: 'linear-gradient(90deg, transparent, #C89A2B, transparent)', width: '280px', margin: '0 auto 0.85rem auto' }} />

          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.02rem', color: '#333333', maxWidth: '740px', margin: '0 auto 1.35rem auto', lineHeight: 1.55 }}>
            has successfully completed all coursework, interactive modules, practical coding exercises, and passed the final assessment with <strong>{scorePercentage}%</strong> grade for:
          </p>

          {/* Course Name Banner */}
          <div className="cert-course-banner" style={{ 
            display: 'inline-block',
            background: '#0D2B5C',
            border: '2.5px solid #C89A2B',
            borderRadius: '9999px',
            padding: '0.8rem 3rem',
            boxShadow: '0 8px 25px rgba(13, 43, 92, 0.25)'
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: '1px' }}>
              ✦ &nbsp; {certificationTitle} &nbsp; ✦
            </h3>
          </div>
        </div>

        {/* Bottom Section: Three Columns */}
        <div className="cert-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', marginTop: '2.5rem', position: 'relative', zIndex: 3 }}>
          
          {/* Left Metadata Column */}
          <div className="cert-meta-col" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0D2B5C', border: '1.5px solid #C89A2B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📅</div>
              <span style={{ fontSize: '0.88rem', color: '#333333' }}><strong>Date Issued:</strong> {formattedDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0D2B5C', border: '1.5px solid #C89A2B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🎴</div>
              <span style={{ fontSize: '0.88rem', color: '#333333' }}><strong>Credential ID:</strong> <span style={{ fontFamily: 'monospace', color: '#0D2B5C', fontWeight: 700 }}>{certificate.certificateId}</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0D2B5C', border: '1.5px solid #C89A2B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📊</div>
              <span style={{ fontSize: '0.88rem', color: '#333333' }}><strong>Grade Score:</strong> <span style={{ color: '#10B981', fontWeight: 800 }}>{scorePercentage}% Passed</span></span>
            </div>
          </div>

          {/* Center Embossed Seal */}
          <div className="cert-seal-box" style={{ textAlign: 'center' }}>
            <div style={{ 
              position: 'relative', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '104px', 
              height: '104px', 
              borderRadius: '50%', 
              background: 'radial-gradient(circle, #E6C46A 0%, #C89A2B 70%, #99731A 100%)', 
              border: '3.5px solid #FFF8E7',
              boxShadow: '0 10px 28px rgba(200, 154, 43, 0.45)'
            }}>
              <div style={{ 
                width: '86px', 
                height: '86px', 
                borderRadius: '50%', 
                border: '1.5px dashed #FFEBAA', 
                background: '#0D2B5C', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#FFEBAA',
                padding: '0.2rem'
              }}>
                <ShieldCheck size={28} color="#E6C46A" />
                <span style={{ fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#FFFFFF', marginTop: '1px' }}>VERIFIED SEAL</span>
                <span style={{ fontSize: '0.52rem', color: '#E6C46A', letterSpacing: '2px' }}>★★★</span>
              </div>
            </div>
          </div>

          {/* Right Signature Column */}
          <div className="cert-signature-col" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto', paddingRight: '1.75rem' }}>
            <img 
              src="/signature1-removebg-preview.png" 
              alt="Pankaj Baduwal Signature" 
              style={{ 
                height: '80px', 
                width: '160px',
                objectFit: 'contain', 
                marginBottom: '-0.45rem'
              }} 
            />
            <div style={{ height: '1.5px', background: '#C89A2B', width: '160px', marginBottom: '0.4rem' }} />
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0D2B5C', whiteSpace: 'nowrap' }}>
              Pankaj Baduwal
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#666666', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Lead Educator &amp; Engineer
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CertificateView;
