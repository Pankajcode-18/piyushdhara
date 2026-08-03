import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCertificationDetailsApi, enrollCertificationApi } from '../utils/api';
import { 
  Award, 
  Clock, 
  Globe, 
  BarChart, 
  User, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  ExternalLink, 
  Download, 
  Share2, 
  AlertCircle, 
  ListOrdered, 
  PlayCircle,
  FileCheck,
  Eye,
  X,
  LogIn
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const CertificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certData, setCertData] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [showSampleCertModal, setShowSampleCertModal] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);

  const studentEmail = userProfile?.email || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '');
  const studentName = userProfile?.name || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '');

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchCertificationDetailsApi(id, studentEmail);
        setCertData(res.data);
      } catch (err) {
        console.error('Certification details error:', err);
        setError(err.message || 'Failed to load certification details');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id, studentEmail]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748B' }}>
        <Sparkles className="animate-spin" size={36} style={{ marginBottom: '1rem', color: '#2563EB' }} />
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Loading Certification Course Details...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '1.5rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="#DC2626" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Course Not Found</h2>
        <p style={{ color: '#7F1D1D', marginBottom: '1.5rem' }}>{error || 'Unable to retrieve course details.'}</p>
        <Link to="/certifications" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', textDecoration: 'none' }}>
          Back to Certifications
        </Link>
      </div>
    );
  }

  const {
    _id,
    title,
    subtitle,
    description,
    thumbnail,
    banner,
    category,
    difficulty,
    estimatedDuration,
    language,
    instructor,
    prerequisites,
    learningOutcomes,
    skillsGained,
    certificateInfo,
    assessmentRules,
    studyInstructions,
    references,
    modules,
    totalLessons,
    totalQuizzes,
    totalAssignments,
    userProgress,
    certificate
  } = certData;

  const isEnrolled = Boolean(userProgress);
  const isCompleted = userProgress && userProgress.status === 'completed';
  const progressPct = userProgress ? (userProgress.overallPercentage || 0) : 0;

  const handleEnrollOrStart = async () => {
    if (!studentEmail) {
      // Require Login
      navigate(`/login?redirect=/certifications/${_id}`);
      return;
    }

    if (isEnrolled) {
      // Already enrolled -> Continue Learning from saved/next module
      navigate(`/certifications/${_id}/learn`);
      return;
    }

    // Enroll Student in Certification
    try {
      setEnrolling(true);
      await enrollCertificationApi(_id, studentEmail, studentName);
      setCertData(prev => ({
        ...prev,
        userProgress: { overallPercentage: 0, status: 'in_progress', isEnrolled: true }
      }));
      navigate(`/certifications/${_id}/learn`);
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(err.message || 'Failed to enroll in certification');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Top Breadcrumb & Back ───────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/certifications" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to All Certifications
        </Link>
      </div>

      {/* ── Course Header Hero Card ─────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #E2E8F0', padding: '2.5rem', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
        
        {/* Left Header Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid #BFDBFE' }}>
              📜 {category}
            </span>
            <span style={{ background: '#F8FAFC', color: '#475569', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid #E2E8F0' }}>
              {difficulty} Level
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.25 }}>
            {title}
          </h1>

          <p style={{ fontSize: '1rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
            {subtitle || description}
          </p>

          {/* Quick Details Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.88rem', color: '#64748B', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} color="#2563EB" /> {estimatedDuration}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Globe size={16} color="#059669" /> {language}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><BookOpen size={16} color="#D97706" /> {totalLessons || 0} Lessons</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={16} color="#7C3AED" /> {totalQuizzes || 0} Quizzes</span>
          </div>

          {/* Instructor Badge & Sample Certificate Preview Trigger Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 1.1rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
              <img src={instructor?.photo || '/pankaj-baduwal.jpg'} alt={instructor?.name || 'Pankaj Baduwal'} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 20%', border: '2px solid #2563EB' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{instructor?.name || 'Pankaj Baduwal'}</h4>
                <span style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>{instructor?.designation || 'Lead Educator & Engineer'}</span>
              </div>
            </div>

            {/* Certificate & Signature Preview Button */}
            <button
              onClick={() => setShowSampleCertModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '1rem',
                border: '1px solid #BFDBFE',
                background: '#EFF6FF',
                color: '#1D4ED8',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
              }}
            >
              <Eye size={16} color="#2563EB" /> Preview Sample Certificate &amp; Signatures
            </button>
          </div>
        </div>

        {/* Right CTA / Action Card */}
        <div style={{ background: '#F8FAFC', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <img src={thumbnail} alt={title} style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '1rem' }} />

          {isCompleted ? (
            <div style={{ textAlign: 'center', padding: '1rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '1rem' }}>
              <ShieldCheck size={36} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#065F46', margin: '0 0 0.25rem 0' }}>Certification Completed!</h4>
              <p style={{ fontSize: '0.8rem', color: '#047857', margin: '0 0 0.85rem 0' }}>Verified certificate is available for view and download.</p>
              
              {certificate && (
                <Link to={`/certificates/${certificate.certificateId}`} className="btn" style={{ width: '100%', background: '#059669', color: 'white', fontWeight: 800, borderRadius: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.7rem' }}>
                  View Certificate <ExternalLink size={16} />
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!studentEmail ? (
                <button
                  onClick={handleEnrollOrStart}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '0.85rem',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(37,99,235,0.25)'
                  }}
                >
                  Log In to Enroll &amp; Start <LogIn size={18} />
                </button>
              ) : isEnrolled ? (
                <button
                  onClick={handleEnrollOrStart}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '0.85rem',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(5,150,105,0.25)'
                  }}
                >
                  Continue Learning ({progressPct}% Done) <PlayCircle size={18} />
                </button>
              ) : (
                <button
                  onClick={handleEnrollOrStart}
                  disabled={enrolling}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '0.85rem',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(37,99,235,0.25)'
                  }}
                >
                  {enrolling ? 'Enrolling...' : <>Enroll in Certification Course <Award size={18} /></>}
                </button>
              )}
            </div>
          )}

          <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.55rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><CheckCircle2 size={15} color="#059669" /> Free Access for PiyushDhara Students</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><CheckCircle2 size={15} color="#059669" /> Verified Digital Certificate</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><CheckCircle2 size={15} color="#059669" /> Signed by Pankaj Baduwal</span>
          </div>

        </div>

      </div>

      {/* ── Streamlined Minimal Content Container ───────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Key Highlights & Modules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Skills & Key Outcomes */}
          {skillsGained && skillsGained.length > 0 && (
            <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles color="#2563EB" size={20} /> Skills &amp; Outcomes You'll Gain
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skillsGained.map((skill, idx) => (
                  <span key={idx} style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 700 }}>
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Streamlined Modules List (Compact Preview + Expand Toggle) */}
          <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Course Modules ({modules ? modules.length : 0} Modules)
              </h2>
              {modules && modules.length > 5 && (
                <button
                  onClick={() => setShowAllModules(!showAllModules)}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {showAllModules ? 'Show Less ↑' : `Show All ${modules.length} Modules ↓`}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(showAllModules ? modules : (modules || []).slice(0, 5)).map((mod, idx) => (
                <div key={mod._id || idx} style={{ border: '1px solid #E2E8F0', borderRadius: '0.85rem', padding: '1rem 1.25rem', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                      Module {idx + 1}: {mod.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                      {mod.description || 'Structured video lessons & checkpoint quiz.'}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '0.25rem 0.6rem', borderRadius: '0.4rem', color: '#475569', flexShrink: 0 }}>
                    {mod.lessonsCount || 1} Lessons
                  </span>
                </div>
              ))}
            </div>

            {!showAllModules && modules && modules.length > 5 && (
              <button
                onClick={() => setShowAllModules(true)}
                style={{ width: '100%', marginTop: '1rem', padding: '0.65rem', borderRadius: '0.75rem', border: '1px dashed #BFDBFE', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                + Expand Remaining {modules.length - 5} Modules
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ── SAMPLE CERTIFICATE PREVIEW MODAL ───────────────────── */}
      {showSampleCertModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '2rem', maxWidth: '900px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }}>
            
            <button 
              onClick={() => setShowSampleCertModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontWeight: 800 }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid #BFDBFE' }}>
                👁️ SAMPLE CERTIFICATE PREVIEW
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '0.4rem 0 0.2rem 0' }}>
                Earned Upon Course Completion
              </h2>
            </div>

            {/* Certificate Template (16:9 Landscape Ratio, Luxury Corporate Design) */}
            <div 
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFA 50%, #FFFFFF 100%)',
                borderRadius: '12px',
                border: '2px solid #C89A2B',
                padding: '3rem 2.5rem',
                position: 'relative',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
                color: '#333333',
                overflow: 'hidden',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {/* Inner Light Gold Border with 25px Padding */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: '1px solid #E6C46A', borderRadius: '8px', pointerEvents: 'none', zIndex: 1 }} />

              {/* Decorative Corner Cut Accents */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '18px', height: '18px', borderTop: '2px solid #C89A2B', borderLeft: '2px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderTop: '2px solid #C89A2B', borderRight: '2px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '18px', height: '18px', borderBottom: '2px solid #C89A2B', borderLeft: '2px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '18px', height: '18px', borderBottom: '2px solid #C89A2B', borderRight: '2px solid #C89A2B', zIndex: 2, pointerEvents: 'none' }} />

              {/* Top-Left Folded Geometric Navy & Gold Ribbon */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '125px', height: '125px', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 125 125" fill="none">
                <path d="M0 0 L125 0 L0 125 Z" fill="#0D2B5C" />
                <path d="M0 0 L100 0 L0 100 Z" fill="#154288" opacity="0.35" />
                <path d="M0 113 L113 0 L121 0 L0 121 Z" fill="#C89A2B" />
                <path d="M0 96 L96 0 L101 0 L0 101 Z" fill="#E6C46A" opacity="0.6" />
              </svg>

              {/* Bottom-Right Folded Geometric Navy & Gold Ribbon */}
              <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '125px', height: '125px', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 125 125" fill="none">
                <path d="M125 125 L0 125 L125 0 Z" fill="#0D2B5C" />
                <path d="M125 125 L25 125 L125 25 Z" fill="#154288" opacity="0.35" />
                <path d="M125 12 L12 125 L4 125 L125 4 Z" fill="#C89A2B" />
                <path d="M125 30 L30 125 L24 125 L125 24 Z" fill="#E6C46A" opacity="0.6" />
              </svg>

              {/* Centered Background Watermark (280px-340px, 6% Opacity) */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.06, pointerEvents: 'none', zIndex: 0 }}>
                <img src="/Logo1.png" alt="Academy Watermark" style={{ width: '310px', height: '310px', objectFit: 'contain' }} />
              </div>

              {/* Top Academy Logo & Horizontal Gold Flourish */}
              <div style={{ marginBottom: '1.25rem', position: 'relative', zIndex: 3, paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', marginBottom: '0.65rem' }}>
                  <span style={{ color: '#C89A2B', fontSize: '1rem', letterSpacing: '2px' }}>────── ✦</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', borderRadius: '50%', background: '#0D2B5C', border: '3.5px solid #C89A2B', boxShadow: '0 4px 15px rgba(200, 154, 43, 0.35)', overflow: 'hidden' }}>
                    <img src="/Logo1.png" alt="Academy Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', transform: 'scale(1.28)', display: 'block' }} />
                  </div>
                  <span style={{ color: '#C89A2B', fontSize: '1rem', letterSpacing: '2px' }}>✦ ──────</span>
                </div>

                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.8rem', fontWeight: 800, letterSpacing: '8px', color: '#0D2B5C', margin: '0 0 0.15rem 0', lineHeight: 1.1 }}>
                  CERTIFICATE
                </h1>

                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '4px', color: '#0D2B5C', marginBottom: '0.35rem' }}>
                  OF COMPLETION
                </div>

                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.82rem', fontWeight: 600, letterSpacing: '4px', color: '#C89A2B', textTransform: 'uppercase', margin: 0 }}>
                  PIYUSHDHARA PROFESSIONAL LEARNING ACADEMY
                </p>

                <div style={{ color: '#C89A2B', fontSize: '0.9rem', marginTop: '0.4rem' }}>──── ✦ ────</div>
              </div>

              {/* Certification Text & Recipient Name */}
              <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 3 }}>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem', color: '#666666', fontWeight: 400, margin: '0 0 0.25rem 0' }}>
                  This certificate proudly certifies that
                </p>

                <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '4.2rem', fontWeight: 400, color: '#0D2B5C', margin: '0 0 0.2rem 0', lineHeight: 1.1 }}>
                  {studentName}
                </h2>

                <div style={{ height: '1.5px', background: 'linear-gradient(90deg, transparent, #C89A2B, transparent)', width: '240px', margin: '0 auto 0.75rem auto' }} />

                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.92rem', color: '#333333', maxWidth: '680px', margin: '0 auto 1.1rem auto', lineHeight: 1.5 }}>
                  has successfully completed all coursework, interactive modules, practical coding exercises, and passed the final assessment with <strong>95%</strong> grade for:
                </p>

                {/* Course Name Banner */}
                <div style={{ 
                  display: 'inline-block',
                  background: '#0D2B5C',
                  border: '2px solid #C89A2B',
                  borderRadius: '9999px',
                  padding: '0.65rem 2.5rem',
                  boxShadow: '0 6px 20px rgba(13, 43, 92, 0.25)'
                }}>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: '1px' }}>
                    ✦ &nbsp; {title} &nbsp; ✦
                  </h3>
                </div>
              </div>

              {/* Bottom Section: Three Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center', marginTop: '2rem', position: 'relative', zIndex: 3 }}>
                
                {/* Left Metadata Column */}
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0D2B5C', border: '1.5px solid #C89A2B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem' }}>📅</div>
                    <span style={{ fontSize: '0.82rem', color: '#333333' }}><strong>Date Issued:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0D2B5C', border: '1.5px solid #C89A2B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem' }}>🎴</div>
                    <span style={{ fontSize: '0.82rem', color: '#333333' }}><strong>Credential ID:</strong> <span style={{ fontFamily: 'monospace', color: '#0D2B5C', fontWeight: 700 }}>CERT-2026-SAMPLE-PREVIEW</span></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0D2B5C', border: '1.5px solid #C89A2B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem' }}>📊</div>
                    <span style={{ fontSize: '0.82rem', color: '#333333' }}><strong>Grade Score:</strong> <span style={{ color: '#10B981', fontWeight: 800 }}>95% Passed</span></span>
                  </div>
                </div>

                {/* Center Embossed Seal */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    position: 'relative', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '94px', 
                    height: '94px', 
                    borderRadius: '50%', 
                    background: 'radial-gradient(circle, #E6C46A 0%, #C89A2B 70%, #99731A 100%)', 
                    border: '3px solid #FFF8E7',
                    boxShadow: '0 8px 25px rgba(200, 154, 43, 0.45)'
                  }}>
                    <div style={{ 
                      width: '78px', 
                      height: '78px', 
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
                      <ShieldCheck size={26} color="#E6C46A" />
                      <span style={{ fontSize: '0.52rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#FFFFFF', marginTop: '1px' }}>VERIFIED SEAL</span>
                      <span style={{ fontSize: '0.48rem', color: '#E6C46A', letterSpacing: '2px' }}>★★★</span>
                    </div>
                  </div>
                </div>

                {/* Right Signature Column */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto', paddingRight: '1.5rem' }}>
                  <img 
                    src="/signature1-removebg-preview.png" 
                    alt="Pankaj Baduwal Signature" 
                    style={{ 
                      height: '70px', 
                      width: '140px',
                      objectFit: 'contain', 
                      marginBottom: '-0.4rem'
                    }} 
                  />
                  <div style={{ height: '1.5px', background: '#C89A2B', width: '150px', marginBottom: '0.35rem' }} />
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#0D2B5C', whiteSpace: 'nowrap' }}>Pankaj Baduwal</p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#666666', fontWeight: 500, whiteSpace: 'nowrap' }}>Lead Educator &amp; Engineer</p>
                </div>

              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link
                to={`/certifications/${_id}/learn`}
                onClick={() => setShowSampleCertModal(false)}
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '0.85rem', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 20px rgba(37,99,235,0.25)' }}
              >
                Start Learning Now to Earn This Certificate <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CertificationDetails;
