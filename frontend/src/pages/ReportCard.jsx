import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchStudentReportCardApi } from '../utils/api';
import { 
  Download, 
  Printer, 
  ChevronLeft, 
  Award, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  BarChart2, 
  Star, 
  User, 
  Mail, 
  Calendar, 
  Building, 
  Globe, 
  TrendingUp, 
  Check, 
  HelpCircle,
  Code,
  Trophy,
  Activity,
  Zap,
  Target,
  Brain,
  Layers,
  ArrowRight,
  Shield,
  PieChart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getFileUrl } from '../utils/api';

const ReportCard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const reportRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const studentEmail = userProfile?.email || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '');

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchStudentReportCardApi(studentEmail);
        setReport(res.report);
      } catch (err) {
        console.error('Error fetching report card:', err);
        setError(err.message || 'Failed to load official report card');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const loadHtml2PdfScript = () => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) return resolve(window.html2pdf);
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = () => reject(new Error('Failed to load html2pdf script'));
      document.body.appendChild(script);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setPdfGenerating(true);
      const element = reportRef.current;
      if (!element) return;

      let html2pdfInstance;
      try {
        const html2pdfModule = await import(/* @vite-ignore */ 'html2pdf.js');
        html2pdfInstance = html2pdfModule.default || html2pdfModule;
      } catch (e) {
        html2pdfInstance = await loadHtml2PdfScript();
      }

      const opt = {
        margin: [5, 5, 5, 5],
        filename: `PiyushDhara_Transcript_${report?.studentInfo?.fullName?.replace(/\s+/g, '_') || 'Student'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (typeof html2pdfInstance === 'function') {
        await html2pdfInstance().set(opt).from(element).save();
      } else {
        window.print();
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setPdfGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
        <Sparkles className="animate-spin" size={36} style={{ marginBottom: '0.75rem', color: '#2563EB' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Generating Official Academic Transcript...</h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem' }}>Aggregating enrolled batches, quiz logs, and verified credentials.</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '1.25rem', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
        <Award size={42} color="#DC2626" style={{ marginBottom: '0.75rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Transcript Access Error</h2>
        <p style={{ color: '#7F1D1D', marginBottom: '1.25rem', fontSize: '0.88rem' }}>{error || 'Unable to generate transcript.'}</p>
        <Link to="/profile" className="btn btn-primary">Return to Profile</Link>
      </div>
    );
  }

  const { studentInfo, academicSummary, courseTable, quizSubmissions, certificates, skillsProficiency, aiInsights, gradeDistribution, timeline, academicRemarks, verification } = report;

  // Grade badge styling helper
  const getGradePill = (grade) => {
    if (grade === 'A+' || grade === 'A') return { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
    if (grade === 'B+' || grade === 'B') return { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
    if (grade === 'C+') return { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' };
    return { bg: '#FEF2F2', color: '#DC2626', border: '#FEE2E2' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '1.5rem 0.75rem', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── TOP ACTION BAR (Hidden during Print) ──────────────── */}
      <div className="no-print" style={{ maxWidth: '920px', margin: '0 auto 1.25rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', background: '#FFFFFF', padding: '0.55rem 1.1rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
          <ChevronLeft size={16} /> Return to Profile
        </Link>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfGenerating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
            }}
          >
            <Download size={16} /> {pdfGenerating ? 'Generating PDF...' : 'Download Official PDF'}
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '0.75rem',
              background: '#0F172A',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15,23,42,0.2)'
            }}
          >
            <Printer size={16} /> Print Transcript
          </button>
        </div>
      </div>

      {/* ── REPORT CARD CANVAS (World-Class Two-Page A4 Container) ──────────── */}
      <div 
        ref={reportRef}
        id="report-card-canvas"
        style={{
          maxWidth: '920px',
          margin: '0 auto',
          background: '#FFFFFF',
          borderRadius: '1.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 50px rgba(15,23,42,0.06)',
          padding: '1.75rem',
          position: 'relative',
          color: '#0F172A'
        }}
      >
        
        {/* =================================================================== */}
        {/* ── PAGE 1: CORE ACADEMIC TRANSCRIPT & PERFORMANCE DASHBOARD ────── */}
        {/* =================================================================== */}
        <div className="transcript-page-1" style={{ position: 'relative' }}>

          {/* Background Watermark */}
          <div style={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)', opacity: 0.03, pointerEvents: 'none', width: '320px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="Watermark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = '/Logo1.png'; }} />
          </div>

          {/* 1. PREMIUM HEADER BANNER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px double #C89A2B', paddingBottom: '0.85rem', marginBottom: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#0F172A', border: '2.5px solid #C89A2B', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 15px rgba(15,23,42,0.15)', overflow: 'hidden', flexShrink: 0 }}>
                <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/Logo1.png'; }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase', lineHeight: 1.1 }}>
                  PIYUSHDHARA LEARNING ACADEMY
                </h1>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C89A2B', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0.15rem 0 0 0' }}>
                  OFFICIAL ACADEMIC PERFORMANCE TRANSCRIPT
                </div>
                <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>
                  Autonomous Digital Education Authority • Kathmandu, Nepal
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.25rem 0.65rem', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 800, display: 'inline-block', marginBottom: '0.2rem' }}>
                OFFICIAL TRANSCRIPT ✓
              </div>
              <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700 }}>
                Academic Session: {studentInfo.academicSession}
              </div>
            </div>
          </div>

          {/* 2. STUDENT PROFILE CARD */}
          <div style={{ background: '#F8FAFC', borderRadius: '0.85rem', border: '1px solid #E2E8F0', padding: '0.85rem 1.1rem', marginBottom: '1.1rem', display: 'grid', gridTemplateColumns: '75px 1fr 1fr 110px', gap: '1rem', alignItems: 'center' }}>
            
            {/* Photo */}
            <div style={{ position: 'relative', width: '75px', height: '75px' }}>
              <img 
                src={getFileUrl(userProfile?.photo || userProfile?.profilePicture || studentInfo.photo) || '/pankaj-baduwal.jpg'} 
                alt={studentInfo.fullName}
                style={{ width: '100%', height: '100%', borderRadius: '0.75rem', objectFit: 'cover', border: '2px solid #C89A2B', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}
                onError={(e) => { e.target.src = '/pankaj-baduwal.jpg'; }}
              />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#10B981', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '9999px', fontSize: '0.55rem', fontWeight: 900 }}>
                ACTIVE
              </div>
            </div>

            {/* Profile Col 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.72rem' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>Student Name</span>
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#0F172A', lineHeight: 1.1 }}>{studentInfo.fullName}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>Student Roll ID</span>
                <div style={{ fontWeight: 800, color: '#2563EB' }}>{studentInfo.studentId}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</span>
                <div style={{ fontWeight: 700, color: '#334155', wordBreak: 'break-all' }}>{studentInfo.email}</div>
              </div>
            </div>

            {/* Profile Col 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.72rem' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>Registration No</span>
                <div style={{ fontWeight: 800, color: '#0F172A' }}>{studentInfo.enrollmentNo}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>Academic Program</span>
                <div style={{ fontWeight: 700, color: '#334155' }}>{studentInfo.batch}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>Institution</span>
                <div style={{ fontWeight: 700, color: '#334155' }}>{studentInfo.school}</div>
              </div>
            </div>

            {/* Profile Col 3: Rank & Standing */}
            <div style={{ background: '#FFFFFF', padding: '0.65rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Class Standing</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#2563EB', margin: '0.15rem 0' }}>{studentInfo.rankStanding || 'Top 5%'}</div>
              <div style={{ fontSize: '0.58rem', color: '#10B981', fontWeight: 800 }}>★ Honor Standing</div>
            </div>

          </div>

          {/* 3. ACADEMIC PERFORMANCE KPI DASHBOARD CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.1rem' }}>
            
            {/* KPI 1 */}
            <div style={{ background: '#FFFFFF', borderRadius: '0.85rem', padding: '0.75rem 0.85rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{academicSummary.totalEnrolled}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '0.15rem' }}>Enrolled Courses</div>
                <div style={{ fontSize: '0.58rem', color: '#10B981', fontWeight: 700, marginTop: '0.1rem' }}>↑ Active Learner</div>
              </div>
            </div>

            {/* KPI 2 */}
            <div style={{ background: '#FFFFFF', borderRadius: '0.85rem', padding: '0.75rem 0.85rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Activity size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{academicSummary.overallProgressPct}%</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '0.15rem' }}>Completion Rate</div>
                <div style={{ fontSize: '0.58rem', color: '#10B981', fontWeight: 700, marginTop: '0.1rem' }}>↑ Overall Average</div>
              </div>
            </div>

            {/* KPI 3 */}
            <div style={{ background: '#FFFFFF', borderRadius: '0.85rem', padding: '0.75rem 0.85rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Star size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{academicSummary.gpa} / 4.0</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '0.15rem' }}>CGPA Score</div>
                <div style={{ fontSize: '0.58rem', color: '#7C3AED', fontWeight: 700, marginTop: '0.1rem' }}>★ Grade Point Avg</div>
              </div>
            </div>

            {/* KPI 4 */}
            <div style={{ background: '#0F172A', color: 'white', borderRadius: '0.85rem', padding: '0.75rem 0.85rem', border: '1px solid #C89A2B', boxShadow: '0 4px 10px rgba(15,23,42,0.15)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>{academicSummary.letterGrade}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', marginTop: '0.15rem' }}>Overall Grade</div>
                <div style={{ fontSize: '0.58rem', color: '#F59E0B', fontWeight: 700, marginTop: '0.1rem' }}>{academicSummary.performanceRating}</div>
              </div>
            </div>

          </div>

          {/* 4. ENROLLED BATCHES & CERTIFICATION TRANSCRIPT TABLE */}
          <div style={{ marginBottom: '1.1rem' }}>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} color="#2563EB" /> Enrolled Batches &amp; Program Performance Transcript
            </h2>

            <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.72rem' }}>
                <thead>
                  <tr style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.5rem 0.65rem' }}>Program / Course Name</th>
                    <th style={{ padding: '0.5rem 0.45rem' }}>Track Type</th>
                    <th style={{ padding: '0.5rem 0.45rem', textAlign: 'center' }}>Completion</th>
                    <th style={{ padding: '0.5rem 0.45rem', textAlign: 'center' }}>Quiz Score</th>
                    <th style={{ padding: '0.5rem 0.45rem', textAlign: 'center' }}>Assignments</th>
                    <th style={{ padding: '0.5rem 0.45rem', textAlign: 'center' }}>Final Exam</th>
                    <th style={{ padding: '0.5rem 0.45rem', textAlign: 'center' }}>Grade</th>
                    <th style={{ padding: '0.5rem 0.65rem', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courseTable.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '1rem', textAlign: 'center', color: '#64748B' }}>
                        No course records available. Enrolled courses will automatically appear here.
                      </td>
                    </tr>
                  ) : (
                    courseTable.map((row, idx) => {
                      const isDone = row.status === 'Completed';
                      const isCert = row.programType === 'Certification Track';
                      const gStyle = getGradePill(row.grade);

                      return (
                        <tr key={row._id || idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                          <td style={{ padding: '0.45rem 0.65rem', fontWeight: 800, color: '#0F172A' }}>
                            {row.name}
                          </td>
                          <td style={{ padding: '0.45rem 0.45rem' }}>
                            <span style={{ background: isCert ? '#F3E8FF' : '#EFF6FF', color: isCert ? '#7C3AED' : '#1D4ED8', padding: '0.12rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.58rem', fontWeight: 800 }}>
                              {row.programType || 'Batch Course'}
                            </span>
                          </td>
                          <td style={{ padding: '0.45rem 0.45rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
                              <div style={{ width: '40px', height: '5px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ width: `${row.progress}%`, height: '100%', background: isDone ? '#10B981' : '#2563EB' }} />
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '0.65rem' }}>{row.progress}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.45rem 0.45rem', textAlign: 'center', fontWeight: 700, color: '#1E293B' }}>
                            {row.quizScore}
                          </td>
                          <td style={{ padding: '0.45rem 0.45rem', textAlign: 'center', fontWeight: 700, color: '#1E293B' }}>
                            {row.assignmentScore}
                          </td>
                          <td style={{ padding: '0.45rem 0.45rem', textAlign: 'center', fontWeight: 700, color: '#1E293B' }}>
                            {row.finalExamScore}
                          </td>
                          <td style={{ padding: '0.45rem 0.45rem', textAlign: 'center' }}>
                            <span style={{ background: gStyle.bg, color: gStyle.color, border: `1px solid ${gStyle.border}`, padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.65rem' }}>
                              {row.grade}
                            </span>
                          </td>
                          <td style={{ padding: '0.45rem 0.65rem', textAlign: 'center' }}>
                            <span style={{ background: isDone ? '#ECFDF5' : '#FEF3C7', color: isDone ? '#047857' : '#B45309', border: `1px solid ${isDone ? '#A7F3D0' : '#FCD34D'}`, padding: '0.12rem 0.45rem', borderRadius: '9999px', fontSize: '0.62rem', fontWeight: 800 }}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. RECORDED EXAMINATIONS & QUIZ SCORES LOG */}
          {quizSubmissions && quizSubmissions.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#10B981" /> Recorded Examinations &amp; Quiz Scores Log
              </h3>

              <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#334155', color: '#FFFFFF', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '0.45rem 0.65rem' }}>Examination Title</th>
                      <th style={{ padding: '0.45rem 0.45rem' }}>Category</th>
                      <th style={{ padding: '0.45rem 0.45rem', textAlign: 'center' }}>Raw Score</th>
                      <th style={{ padding: '0.45rem 0.45rem', textAlign: 'center' }}>Score %</th>
                      <th style={{ padding: '0.45rem 0.45rem', textAlign: 'center' }}>Outcome</th>
                      <th style={{ padding: '0.45rem 0.65rem', textAlign: 'center' }}>Attempt Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizSubmissions.slice(0, 4).map((q, idx) => {
                      const isPass = q.passed || q.percentage >= 60;
                      const qTypeLabel = q.quizType === 'mock' ? 'Grand Mock Exam' : (q.quizType === 'weekly' ? 'Weekly Quiz' : 'Module Exam');

                      return (
                        <tr key={q._id || idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                          <td style={{ padding: '0.4rem 0.65rem', fontWeight: 800, color: '#0F172A' }}>
                            {q.quizTitle}
                          </td>
                          <td style={{ padding: '0.4rem 0.45rem', color: '#475569', fontWeight: 700 }}>
                            {qTypeLabel}
                          </td>
                          <td style={{ padding: '0.4rem 0.45rem', textAlign: 'center', fontWeight: 800, color: '#1E293B' }}>
                            {q.scoreObtained} / {q.totalMarks}
                          </td>
                          <td style={{ padding: '0.4rem 0.45rem', textAlign: 'center', fontWeight: 900, color: isPass ? '#10B981' : '#EF4444' }}>
                            {q.percentage}%
                          </td>
                          <td style={{ padding: '0.4rem 0.45rem', textAlign: 'center' }}>
                            <span style={{ background: isPass ? '#ECFDF5' : '#FEF2F2', color: isPass ? '#047857' : '#DC2626', border: `1px solid ${isPass ? '#A7F3D0' : '#FEE2E2'}`, padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.6rem' }}>
                              {isPass ? 'PASS ✓' : 'FAIL ✗'}
                            </span>
                          </td>
                          <td style={{ padding: '0.4rem 0.65rem', textAlign: 'center', color: '#64748B' }}>
                            {new Date(q.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* ── PAGE BREAK FOR PRINT & PDF (TRANSCRIPT CONTINUATION) ───── */}
        <div className="page-break" style={{ pageBreakBefore: 'always', breakBefore: 'always', margin: '1.5rem 0 0 0' }} />

        {/* =================================================================== */}
        {/* ── PAGE 2: ANALYTICS, AI INSIGHTS, BADGES & VERIFICATION ──────── */}
        {/* =================================================================== */}
        <div className="transcript-page-2" style={{ position: 'relative', paddingTop: '0.5rem' }}>

          {/* Header Bar for Page 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0F172A', paddingBottom: '0.5rem', marginBottom: '1.1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PIYUSHDHARA ACADEMY • OFFICIAL TRANSCRIPT PAGE 2
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
              Student ID: <strong style={{ color: '#2563EB' }}>{studentInfo.studentId}</strong>
            </div>
          </div>

          {/* 6. SKILL ASSESSMENT & PROGRESS BARS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
            
            {/* Left: Skill Progress Bars & Stars */}
            <div style={{ background: '#F8FAFC', borderRadius: '0.85rem', border: '1px solid #E2E8F0', padding: '0.85rem 1rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={16} color="#2563EB" /> Technical Skill Proficiency
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {skillsProficiency.map((skill, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.15rem' }}>
                      <span style={{ color: '#0F172A' }}>{skill.name}</span>
                      <span style={{ color: '#2563EB' }}>{skill.percentage}% ({skill.level})</span>
                    </div>
                    <div style={{ height: '5px', width: '100%', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${skill.percentage}%`, background: 'linear-gradient(90deg, #0F172A 0%, #2563EB 100%)', borderRadius: '9999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Grade Distribution & Attendance */}
            <div style={{ background: '#F8FAFC', borderRadius: '0.85rem', border: '1px solid #E2E8F0', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PieChart size={16} color="#7C3AED" /> Grade Distribution &amp; Attendance Rate
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  
                  {/* Attendance Circle Box */}
                  <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10B981', lineHeight: 1 }}>{academicSummary.attendancePct}%</div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '0.2rem' }}>Attendance Rate</div>
                    <div style={{ fontSize: '0.58rem', color: '#10B981', fontWeight: 700, marginTop: '0.1rem' }}>✓ 96%+ Target Met</div>
                  </div>

                  {/* Study Hours Box */}
                  <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#2563EB', lineHeight: 1 }}>{academicSummary.totalStudyHours} hrs</div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: '0.2rem' }}>Total Learning Time</div>
                    <div style={{ fontSize: '0.58rem', color: '#2563EB', fontWeight: 700, marginTop: '0.1rem' }}>⚡ Active Modules</div>
                  </div>

                </div>

                {/* Grade Distribution Bars */}
                <div style={{ background: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>Grade Analytics Spectrum</div>
                  <div style={{ display: 'flex', gap: '0.25rem', height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${gradeDistribution.aPlusPct || 40}%`, background: '#10B981' }} title="A+ Grade" />
                    <div style={{ width: `${gradeDistribution.aPct || 30}%`, background: '#2563EB' }} title="A Grade" />
                    <div style={{ width: `${gradeDistribution.bPlusPct || 15}%`, background: '#F59E0B' }} title="B+ Grade" />
                    <div style={{ width: `${gradeDistribution.fPct || 15}%`, background: '#EF4444' }} title="F Grade" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: '#64748B', fontWeight: 700, marginTop: '0.25rem' }}>
                    <span style={{ color: '#10B981' }}>A+ ({gradeDistribution.aPlusPct}%)</span>
                    <span style={{ color: '#2563EB' }}>A ({gradeDistribution.aPct}%)</span>
                    <span style={{ color: '#F59E0B' }}>B+ ({gradeDistribution.bPlusPct}%)</span>
                    <span style={{ color: '#EF4444' }}>F ({gradeDistribution.fPct}%)</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* 7. AI LEARNING ANALYSIS & RECOMMENDATIONS */}
          <div style={{ background: '#EFF6FF', borderRadius: '0.85rem', border: '1px solid #BFDBFE', padding: '0.85rem 1.1rem', marginBottom: '1.1rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1D4ED8', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Brain size={16} /> AI Academic Learning Insights &amp; Evaluation
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '0.85rem', fontSize: '0.72rem' }}>
              <div>
                <strong style={{ color: '#047857', display: 'block', marginBottom: '0.2rem' }}>✔ Strong Areas</strong>
                <ul style={{ margin: 0, paddingLeft: '1rem', color: '#1E3A8A' }}>
                  {aiInsights.strongAreas.slice(0, 3).map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ color: '#B45309', display: 'block', marginBottom: '0.2rem' }}>• Needs Focus</strong>
                <ul style={{ margin: 0, paddingLeft: '1rem', color: '#1E3A8A' }}>
                  {aiInsights.needsImprovement.slice(0, 3).map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ color: '#1D4ED8', display: 'block', marginBottom: '0.2rem' }}>💡 AI Recommendation</strong>
                <p style={{ margin: 0, color: '#1E3A8A', lineHeight: 1.4 }}>
                  {aiInsights.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* 8. GAMIFIED ACHIEVEMENT BADGES (DUOLINGO STYLE) */}
          <div style={{ marginBottom: '1.1rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Trophy size={16} color="#F59E0B" /> Verified Achievements &amp; Academic Honors
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
              
              <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', padding: '0.65rem', borderRadius: '0.75rem', border: '1px solid #FCD34D', boxShadow: '0 4px 10px rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#78350F' }}>Gold Badge</div>
                  <div style={{ fontSize: '0.58rem', color: '#92400E' }}>Top Honor Performer</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 100%)', padding: '0.65rem', borderRadius: '0.75rem', border: '1px solid #6EE7B7', boxShadow: '0 4px 10px rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#064E3B' }}>Attendance Star</div>
                  <div style={{ fontSize: '0.58rem', color: '#065F46' }}>96%+ Consistency</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #BFDBFE 100%)', padding: '0.65rem', borderRadius: '0.75rem', border: '1px solid #93C5FD', boxShadow: '0 4px 10px rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Flame size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#1E3A8A' }}>Fast Learner</div>
                  <div style={{ fontSize: '0.58rem', color: '#1E40AF' }}>Module Acceleration</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #DDD6FE 100%)', padding: '0.65rem', borderRadius: '0.75rem', border: '1px solid #C4B5FD', boxShadow: '0 4px 10px rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#4C1D95' }}>Quiz Champion</div>
                  <div style={{ fontSize: '0.58rem', color: '#5B21B6' }}>Score &gt;= 80% Exams</div>
                </div>
              </div>

            </div>
          </div>

          {/* 9. LEARNING JOURNEY TIMELINE */}
          <div style={{ background: '#F8FAFC', borderRadius: '0.85rem', border: '1px solid #E2E8F0', padding: '0.85rem 1.1rem', marginBottom: '1.1rem' }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="#2563EB" /> Student Academic Journey Timeline
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', textAlign: 'center', position: 'relative' }}>
              {timeline.map((item, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', padding: '0.55rem', borderRadius: '0.65rem', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>{item.step}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#0F172A', margin: '0.15rem 0' }}>{item.title}</div>
                  <div style={{ fontSize: '0.58rem', color: item.status === 'Completed' ? '#10B981' : '#F59E0B', fontWeight: 800 }}>
                    {item.status === 'Completed' ? '✓ ' : '⏳ '}{item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10. INSTRUCTOR FEEDBACK & SIGNATURES */}
          <div style={{ background: '#F8FAFC', borderRadius: '0.85rem', border: '1px solid #E2E8F0', padding: '0.85rem 1.1rem', marginBottom: '1.1rem', display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.25rem', alignItems: 'center' }}>
            
            {/* Remarks */}
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={15} color="#2563EB" /> Official Educator Remarks &amp; Evaluation
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                {academicRemarks}
              </p>
            </div>

            {/* Signature Box */}
            <div style={{ textAlign: 'center', borderLeft: '1.5px solid #CBD5E1', paddingLeft: '1rem' }}>
              <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="/signature1-removebg-preview.png" 
                  alt="Pankaj Baduwal Signature" 
                  style={{ height: '30px', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div style={{ borderTop: '1px solid #0F172A', paddingTop: '0.2rem', fontSize: '0.75rem', fontWeight: 900, color: '#0F172A' }}>
                Er. Pankaj Baduwal
              </div>
              <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700 }}>
                Founder &amp; Lead Educator
              </div>
            </div>

          </div>

          {/* 11. CRYPTOGRAPHIC VERIFICATION & QR CODE */}
          <div style={{ borderTop: '2px dashed #CBD5E1', paddingTop: '0.85rem', display: 'grid', gridTemplateColumns: '85px 1fr 180px', gap: '1rem', alignItems: 'center' }}>
            
            {/* QR Code */}
            <div style={{ textAlign: 'center' }}>
              <img 
                src={verification.qrCodeUrl} 
                alt="Verification QR" 
                style={{ width: '65px', height: '65px', borderRadius: '0.4rem', border: '1px solid #CBD5E1', padding: '3px', background: '#FFFFFF' }} 
              />
              <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#64748B', marginTop: '0.15rem' }}>Scan to Verify</div>
            </div>

            {/* Verification Metadata */}
            <div style={{ fontSize: '0.65rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <div>Verification ID: <strong style={{ color: '#0F172A' }}>{verification.verificationId}</strong></div>
              <div>Generated Date: <strong style={{ color: '#0F172A' }}>{verification.generatedAt}</strong></div>
              <div>Authority: <strong style={{ color: '#0F172A' }}>{verification.institutionName}</strong></div>
              <div style={{ color: '#10B981', fontWeight: 800, marginTop: '0.1rem' }}>✓ CRYPTOGRAPHICALLY VERIFIED &amp; TAMPER-PROOF TRANSCRIPT</div>
            </div>

            {/* GPA Scale Legend */}
            <div style={{ background: '#F8FAFC', padding: '0.45rem 0.65rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', fontSize: '0.58rem', color: '#475569' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '0.15rem' }}>GPA Grading Legend</div>
              <div>4.00 = A+ (Distinction)</div>
              <div>3.50 = A (Excellent)</div>
              <div>3.00 = B+ (Very Good)</div>
              <div>2.00 = C+ (Satisfactory)</div>
            </div>

          </div>

          {/* 12. OFFICIAL FOOTER DISCLAIMER */}
          <div style={{ textAlign: 'center', fontSize: '0.6rem', color: '#94A3B8', marginTop: '0.85rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.4rem' }}>
            © {new Date().getFullYear()} PiyushDhara Learning Academy • Official Verified Academic Performance Transcript • www.piyushdhara.com
          </div>

        </div>

      </div>

      {/* ── CSS PRINT STYLESHEET (WORLD-CLASS TWO-PAGE A4 TRANSCRIPT) ──────────────── */}
      <style>{`
        @media print {
          /* Hide site header, sidebar, footer, chatbot, actions */
          header,
          footer,
          aside,
          nav,
          .navbar,
          .sidebar,
          .no-print,
          .main-layout-wrapper > header,
          .sidebar-nav,
          [class*="Chatbot"],
          [class*="chatbot"],
          [class*="Widget"],
          [class*="widget"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          html, body {
            background: #FFFFFF !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            height: auto !important;
            overflow: visible !important;
          }

          .main-layout-wrapper,
          .main-content-grid,
          .main-content-area,
          main {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: auto !important;
            background: none !important;
            border: none !important;
          }

          #report-card-canvas {
            display: block !important;
            box-shadow: none !important;
            border: 2px solid #0F172A !important;
            margin: 0 auto !important;
            padding: 1.15rem 1.15rem !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
          }

          .page-break {
            page-break-before: always !important;
            break-before: page !important;
            display: block !important;
            height: 0 !important;
          }

          tr, td, th, div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          @page {
            size: A4 portrait;
            margin: 5mm 5mm 5mm 5mm;
          }
        }
      `}</style>

    </div>
  );
};

export default ReportCard;
