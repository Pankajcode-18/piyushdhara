import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  fetchCertificationLearnDataApi, 
  completeCertificationLessonApi,
  submitCertificationQuizApi,
  submitCertificationAssignmentApi,
  submitFinalAssessmentApi 
} from '../utils/api';
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  Code, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Copy, 
  Check, 
  FileCheck, 
  Clock, 
  Send,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const CertificationLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  const studentEmail = userProfile?.email || 
    (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '') || 
    (localStorage.getItem('studentUser') ? JSON.parse(localStorage.getItem('studentUser')).email : '');
    
  const studentName = userProfile?.name || 
    (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '') || 
    (localStorage.getItem('studentUser') ? JSON.parse(localStorage.getItem('studentUser')).name : '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const [learnData, setLearnData] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState('');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Assignment State
  const [assignmentCode, setAssignmentCode] = useState('');
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [assignmentMsg, setAssignmentMsg] = useState('');

  // Final Assessment State
  const [showFinalExamModal, setShowFinalExamModal] = useState(false);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitting, setExamSubmitting] = useState(false);
  const [examResult, setExamResult] = useState(null);

  const loadWorkspaceData = async (targetLessonId = '') => {
    if (!studentEmail) {
      setError('Please log in as a student to access the certification workspace.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await fetchCertificationLearnDataApi(id, studentEmail, targetLessonId);
      setLearnData(res.data);

      if (res.data.activeLesson) {
        setActiveLessonId(res.data.activeLesson._id);
        if (res.data.activeLesson.hasAssignment && res.data.activeLesson.assignment) {
          setAssignmentCode(res.data.activeLesson.assignmentSubmission?.codeContent || res.data.activeLesson.assignment.sampleCodeTemplate || '');
        }
      }
    } catch (err) {
      console.error('Learn workspace load error:', err);
      setError(err.message || 'Failed to load workspace.');
    } finally {
      setLoading(false);
    }
  };

  const lessonContainerRef = useRef(null);
  const mainRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      mainRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [id, studentEmail]);

  useEffect(() => {
    if (activeLessonId) {
      scrollToTop();
    }
  }, [activeLessonId]);

  // Enhance all raw HTML <pre> code blocks with Copy Code header button
  useEffect(() => {
    if (!lessonContainerRef.current) return;
    const preBlocks = lessonContainerRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      if (pre.dataset.enhanced === 'true') return;
      pre.dataset.enhanced = 'true';

      const wrapper = document.createElement('div');
      wrapper.className = 'custom-code-card';
      wrapper.style.background = '#0F172A';
      wrapper.style.borderRadius = '1rem';
      wrapper.style.overflow = 'hidden';
      wrapper.style.border = '1px solid #1E293B';
      wrapper.style.margin = '1.5rem 0';
      wrapper.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';

      const header = document.createElement('div');
      header.style.background = '#1E293B';
      header.style.padding = '0.65rem 1.25rem';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.color = '#94A3B8';
      header.style.fontSize = '0.8rem';
      header.style.fontWeight = '700';
      header.style.borderBottom = '1px solid #334155';

      const titleSpan = document.createElement('span');
      titleSpan.innerHTML = '💻 HTML Code Snippet';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.innerHTML = '📋 Copy Code';
      copyBtn.style.background = '#2563EB';
      copyBtn.style.color = '#FFFFFF';
      copyBtn.style.border = 'none';
      copyBtn.style.padding = '0.35rem 0.85rem';
      copyBtn.style.borderRadius = '0.5rem';
      copyBtn.style.cursor = 'pointer';
      copyBtn.style.fontSize = '0.78rem';
      copyBtn.style.fontWeight = '700';
      copyBtn.style.transition = 'all 0.2s ease';

      copyBtn.onclick = () => {
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText);
        copyBtn.innerHTML = '✓ Copied!';
        copyBtn.style.background = '#10B981';
        setTimeout(() => {
          copyBtn.innerHTML = '📋 Copy Code';
          copyBtn.style.background = '#2563EB';
        }, 2000);
      };

      header.appendChild(titleSpan);
      header.appendChild(copyBtn);

      pre.style.margin = '0';
      pre.style.padding = '1.25rem';
      pre.style.color = '#38BDF8';
      pre.style.background = 'transparent';
      pre.style.fontFamily = 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace';
      pre.style.fontSize = '0.92rem';
      pre.style.overflowX = 'auto';
      pre.style.lineHeight = '1.6';

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }, [activeLessonId, learnData]);

  const handleSelectLesson = (lesson) => {
    setActiveLessonId(lesson._id);
    setQuizResult(null);
    setQuizAnswers({});
    setAssignmentMsg('');
    scrollToTop();
    loadWorkspaceData(lesson._id);
  };

  const handleCopyCode = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Quiz submission handler
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!activeLessonId) return;
    try {
      setQuizSubmitting(true);
      const res = await submitCertificationQuizApi(id, activeLessonId, {
        studentEmail,
        answers: quizAnswers
      });
      setQuizResult(res);
      if (res.passed) {
        setActionMsg('✅ Checkpoint Quiz Passed! You can now mark this lesson as complete.');
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Quiz evaluation failed');
    } finally {
      setQuizSubmitting(false);
    }
  };

  // Assignment submission handler
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!activeLessonId) return;
    try {
      setAssignmentSubmitting(true);
      setAssignmentMsg('');
      const res = await submitCertificationAssignmentApi(id, activeLessonId, {
        studentEmail,
        studentName,
        submissionType: 'code',
        codeContent: assignmentCode
      });
      setAssignmentMsg('✅ Practical Assignment submitted successfully for grading!');
      loadWorkspaceData(activeLessonId);
    } catch (err) {
      alert(err.message || 'Assignment submission failed');
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  // Mark lesson complete & advance to next module/lesson smoothly
  const handleCompleteLesson = async () => {
    if (!activeLessonId) return;
    try {
      setLoading(true);
      await completeCertificationLessonApi(id, activeLessonId, {
        studentEmail,
        studentName
      });
      setActionMsg('🎉 Lesson Completed! Moving to next lesson...');
      setTimeout(() => setActionMsg(''), 4000);
      
      if (nextLesson) {
        setActiveLessonId(nextLesson._id);
        scrollToTop();
        await loadWorkspaceData(nextLesson._id);
      } else {
        scrollToTop();
        await loadWorkspaceData(activeLessonId);
      }
    } catch (err) {
      alert(err.message || 'Failed to complete lesson');
      setLoading(false);
    }
  };

  // Submit final assessment exam
  const handleFinalExamSubmit = async (e) => {
    e.preventDefault();
    try {
      setExamSubmitting(true);
      const res = await submitFinalAssessmentApi(id, {
        studentEmail,
        studentName,
        answers: examAnswers
      });
      setExamResult(res);
      await loadWorkspaceData(activeLessonId);
    } catch (err) {
      alert(err.message || 'Final assessment evaluation failed');
    } finally {
      setExamSubmitting(false);
    }
  };

  if (loading && !learnData) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748B' }}>
        <Sparkles className="animate-spin" size={36} style={{ marginBottom: '1rem', color: '#2563EB' }} />
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Loading Interactive Certification Workspace...</p>
      </div>
    );
  }

  if (error || !learnData) {
    if (!studentEmail) {
      return (
        <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2.5rem', background: '#FFFFFF', border: '1px solid #DBEAFE', borderRadius: '1.75rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(37,99,235,0.06)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <Award size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>Student Login Required</h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 auto 1.75rem auto', lineHeight: 1.6, maxWidth: '440px' }}>
            You must be logged in to access the interactive certification workspace and track your progress.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={`/login?redirect=/certifications/${id}/learn`} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontWeight: 800 }}>
              Log In to Continue
            </Link>
            <Link to="/certifications" className="btn btn-outline" style={{ padding: '0.85rem 1.5rem', color: '#475569' }}>
              Browse Certifications
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: '700px', margin: '4rem auto', padding: '2rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '1.5rem', textAlign: 'center' }}>
        <AlertTriangle size={48} color="#DC2626" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Workspace Access Error</h2>
        <p style={{ color: '#7F1D1D', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/certifications" className="btn btn-primary">Return to Certifications</Link>
      </div>
    );
  }

  const { certification, progress, modules, totalLessons, activeLesson } = learnData;
  const progressPct = progress?.overallPercentage || 0;
  const completedCount = progress?.completedLessonIds?.length || 0;

  // Flatten lessons for prev / next navigation
  let allLessons = [];
  modules.forEach(m => {
    allLessons = allLessons.concat(m.lessons);
  });

  const currentIndex = allLessons.findIndex(l => l._id === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isCurrentCompleted = activeLesson && progress?.completedLessonIds?.some(id => id.toString() === activeLesson._id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8FAFC' }}>

      {/* ── TOP PROGRESS HEADER ───────────────────────────────── */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', sticky: 'top', top: 0, zIndex: 10 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to={`/certifications/${certification.slug}`} style={{ textDecoration: 'none', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700 }}>
            <ChevronLeft size={18} /> Overview
          </Link>
          <div style={{ height: '20px', width: '1px', background: '#CBD5E1' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award color="#2563EB" size={20} /> {certification.title}
          </h2>
        </div>

        {/* Center Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '320px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
              <span>Course Progress</span>
              <span>{completedCount} of {totalLessons} Lessons ({progressPct}%)</span>
            </div>
            <div style={{ height: '8px', width: '100%', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {progressPct >= 100 && (
            <button
              onClick={() => setShowFinalExamModal(true)}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
              }}
            >
              <Award size={15} /> Final Exam &amp; Certificate
            </button>
          )}
        </div>

      </header>

      {/* ── MAIN WORKSPACE (SIDEBAR + CONTENT) ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, minHeight: 'calc(100vh - 70px)' }}>

        {/* ── LEFT SIDEBAR: MODULE LIST TREE ────────────────────── */}
        <aside style={{ background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
          
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Course Modules ({modules.length})
          </div>

          {modules.map((mod, modIdx) => (
            <div key={mod._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', padding: '0.35rem 0.5rem', background: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #F1F5F9' }}>
                {mod.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.5rem' }}>
                {mod.lessons.map((les) => {
                  const isActive = les._id === activeLessonId;

                  return (
                    <button
                      key={les._id}
                      onClick={() => handleSelectLesson(les)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '0.65rem',
                        border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                        background: isActive ? '#EFF6FF' : 'transparent',
                        color: isActive ? '#1D4ED8' : les.isCompleted ? '#059669' : les.isUnlocked ? '#334155' : '#94A3B8',
                        fontSize: '0.82rem',
                        fontWeight: isActive ? 800 : 600,
                        textAlign: 'left',
                        cursor: les.isUnlocked || les.isCompleted ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
                        {les.isCompleted ? (
                          <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                        ) : les.isUnlocked ? (
                          <PlayCircle size={16} color={isActive ? '#2563EB' : '#64748B'} style={{ flexShrink: 0 }} />
                        ) : (
                          <Lock size={15} color="#CBD5E1" style={{ flexShrink: 0 }} />
                        )}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{les.title}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                        {les.hasQuiz && <HelpCircle size={13} color="#D97706" title="Lesson Quiz" />}
                        {les.hasAssignment && <Code size={13} color="#7C3AED" title="Practical Assignment" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        </aside>

        {/* ── RIGHT MAIN WORKSPACE: LESSON CONTENT ───────────────── */}
        <main ref={mainRef} style={{ padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {actionMsg && (
            <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', color: '#166534', padding: '0.85rem 1.25rem', borderRadius: '1rem', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {actionMsg}
            </div>
          )}

          {activeLesson ? (
            <>
              {/* Lesson Title & Completion Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 800, textTransform: 'uppercase' }}>Lesson Content</span>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0 0 0' }}>{activeLesson.title}</h1>
                </div>

                <div>
                  {isCurrentCompleted ? (
                    <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #A7F3D0', padding: '0.45rem 0.95rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={16} /> Completed ✓
                    </span>
                  ) : (
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.45rem 0.95rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.82rem' }}>
                      In Progress 📖
                    </span>
                  )}
                </div>
              </div>

              {/* Rich Lesson Body Content */}
              <div 
                ref={lessonContainerRef}
                style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '1.5rem', 
                  border: '1px solid #E2E8F0', 
                  padding: '2.25rem', 
                  lineHeight: 1.7, 
                  color: '#334155',
                  fontSize: '0.98rem'
                }}
                dangerouslySetInnerHTML={{ __html: activeLesson.contentHtml }}
              />

              {/* Embedded Video (if present) */}
              {activeLesson.videoUrl && (
                <div style={{ background: '#0F172A', borderRadius: '1.5rem', padding: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '1rem' }}>
                    <iframe
                      src={activeLesson.videoUrl}
                      title="Lesson Video"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Code Snippets */}
              {activeLesson.codeSnippets && activeLesson.codeSnippets.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {activeLesson.codeSnippets.map((snippet, idx) => (
                    <div key={idx} style={{ background: '#0F172A', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid #1E293B' }}>
                      <div style={{ background: '#1E293B', padding: '0.65rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700 }}>
                        <span>💻 {snippet.title || 'Code Example'} ({snippet.language})</span>
                        <button
                          onClick={() => handleCopyCode(snippet.code, idx)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                        >
                          {copiedCodeIdx === idx ? <><Check size={14} color="#34D399" /> Copied!</> : <><Copy size={14} /> Copy Code</>}
                        </button>
                      </div>
                      <pre style={{ margin: 0, padding: '1.25rem', color: '#38BDF8', fontFamily: 'monospace', fontSize: '0.9rem', overflowX: 'auto' }}>
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Callouts (Tips/Notes) */}
              {activeLesson.callouts && activeLesson.callouts.map((call, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '1rem', 
                    background: call.type === 'warning' ? '#FEF2F2' : call.type === 'tip' ? '#ECFDF5' : '#EFF6FF',
                    border: `1px solid ${call.type === 'warning' ? '#FEE2E2' : call.type === 'tip' ? '#A7F3D0' : '#BFDBFE'}`,
                    color: call.type === 'warning' ? '#991B1B' : call.type === 'tip' ? '#065F46' : '#1E40AF',
                    display: 'flex',
                    gap: '0.85rem'
                  }}
                >
                  <Sparkles size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 800, fontSize: '0.95rem' }}>{call.title || 'Important Note'}</h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>{call.content}</p>
                  </div>
                </div>
              ))}

              {/* Downloadable Resources */}
              {activeLesson.downloadableAssets && activeLesson.downloadableAssets.length > 0 && (
                <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Download size={18} color="#2563EB" /> Downloadable Lesson Resources
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {activeLesson.downloadableAssets.map((asset, idx) => (
                      <a 
                        key={idx} 
                        href={asset.url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0', textDecoration: 'none', color: '#0F172A', fontWeight: 700, fontSize: '0.88rem' }}
                      >
                        <span>📄 {asset.name} ({asset.size})</span>
                        <Download size={16} color="#2563EB" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ── LESSON QUIZ WIDGET ──────────────────────────── */}
              {activeLesson.hasQuiz && activeLesson.quiz && (
                <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HelpCircle color="#D97706" size={22} /> {activeLesson.quiz.title || 'Lesson Checkpoint Quiz'}
                  </h3>

                  <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {activeLesson.quiz.questions.map((q, idx) => (
                      <div key={idx} style={{ background: '#F8FAFC', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.85rem 0' }}>
                          Q{idx + 1}: {q.questionText}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {q.options.map((opt, oIdx) => (
                            <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0.65rem', cursor: 'pointer', fontSize: '0.88rem', color: '#334155' }}>
                              <input 
                                type="radio" 
                                name={`q_${idx}`} 
                                value={opt} 
                                onChange={() => setQuizAnswers({ ...quizAnswers, [idx]: [opt] })} 
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>

                        {/* Quiz result feedback */}
                        {quizResult && quizResult.feedback && (
                          <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', borderRadius: '0.65rem', background: quizResult.feedback[idx]?.isCorrect ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${quizResult.feedback[idx]?.isCorrect ? '#A7F3D0' : '#FEE2E2'}`, color: quizResult.feedback[idx]?.isCorrect ? '#065F46' : '#991B1B', fontSize: '0.82rem', fontWeight: 600 }}>
                            {quizResult.feedback[idx]?.isCorrect ? '✅ Correct Answer!' : `❌ Incorrect. Correct answer: ${quizResult.feedback[idx]?.correctAnswers.join(', ')}`}
                            {quizResult.feedback[idx]?.explanation && <p style={{ margin: '0.25rem 0 0 0', fontStyle: 'italic' }}>{quizResult.feedback[idx].explanation}</p>}
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={quizSubmitting}
                      style={{ background: '#D97706', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.85rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {quizSubmitting ? 'Evaluating Answers...' : <>Submit Quiz Answers <Send size={16} /></>}
                    </button>
                  </form>
                </div>
              )}

              {/* ── LESSON PRACTICAL ASSIGNMENT WIDGET ──────────── */}
              {activeLesson.hasAssignment && activeLesson.assignment && (
                <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code color="#7C3AED" size={22} /> {activeLesson.assignment.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>
                    {activeLesson.assignment.instructions}
                  </p>

                  <form onSubmit={handleAssignmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                        Write Your HTML Code Submission:
                      </label>
                      <textarea
                        rows={8}
                        value={assignmentCode}
                        onChange={(e) => setAssignmentCode(e.target.value)}
                        placeholder="Write your code submission here..."
                        style={{ width: '100%', padding: '1rem', borderRadius: '0.85rem', border: '1.5px solid #CBD5E1', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', background: '#0F172A', color: '#38BDF8', boxSizing: 'border-box' }}
                      />
                    </div>

                    {assignmentMsg && (
                      <div style={{ background: '#F0FDF4', color: '#166534', padding: '0.75rem 1rem', borderRadius: '0.65rem', fontSize: '0.85rem', fontWeight: 700 }}>
                        {assignmentMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={assignmentSubmitting}
                      style={{ background: '#7C3AED', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.85rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', alignSelf: 'flex-start' }}
                    >
                      {assignmentSubmitting ? 'Submitting Code...' : 'Submit Practical Assignment'}
                    </button>
                  </form>
                </div>
              )}

              {/* Bottom Lesson Completion Card */}
              <div style={{ background: isCurrentCompleted ? '#F0FDF4' : '#FFFFFF', border: `1.5px solid ${isCurrentCompleted ? '#A7F3D0' : '#E2E8F0'}`, borderRadius: '1.5rem', padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
                    {isCurrentCompleted ? '🎉 Lesson Completed!' : 'Done Reading This Lesson?'}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                    {isCurrentCompleted 
                      ? 'Great job! Your progress has been saved. Move on to the next lesson.' 
                      : 'Click below to mark this lesson as completed and unlock the next lesson.'}
                  </p>
                </div>

                <button
                  onClick={handleCompleteLesson}
                  disabled={isCurrentCompleted}
                  style={{
                    background: isCurrentCompleted ? '#DCFCE7' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: isCurrentCompleted ? '#15803D' : 'white',
                    border: 'none',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '0.85rem',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: isCurrentCompleted ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: isCurrentCompleted ? 'none' : '0 6px 18px rgba(5,150,105,0.25)'
                  }}
                >
                  <CheckCircle2 size={20} /> {isCurrentCompleted ? 'Lesson Completed ✓' : 'Mark Lesson as Complete ✓'}
                </button>
              </div>

              {/* Prev / Next Navigation Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                {prevLesson ? (
                  <button
                    onClick={() => handleSelectLesson(prevLesson)}
                    className="btn"
                    style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 700, borderRadius: '0.75rem', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={18} /> Previous: {prevLesson.title}
                  </button>
                ) : <div />}

                {nextLesson ? (
                  <button
                    onClick={() => handleSelectLesson(nextLesson)}
                    className="btn"
                    style={{ background: '#2563EB', color: 'white', border: 'none', fontWeight: 800, borderRadius: '0.75rem', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  >
                    Next: {nextLesson.title} <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowFinalExamModal(true)}
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', fontWeight: 800, borderRadius: '0.75rem', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  >
                    Take Final Certification Assessment <Award size={18} />
                  </button>
                )}
              </div>

            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
              <p style={{ fontWeight: 700 }}>Select a lesson from the left sidebar to start learning.</p>
            </div>
          )}

        </main>

      </div>

      {/* ── FINAL ASSESSMENT EXAM MODAL ───────────────────────── */}
      {showFinalExamModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '1.75rem', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award color="#059669" size={24} /> {certification.finalExam?.title || 'Final Assessment Exam'}
              </h2>
              <button onClick={() => setShowFinalExamModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>

            {examResult ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                {examResult.passed ? (
                  <>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#DCFCE7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <Award size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#065F46', margin: '0 0 0.5rem 0' }}>Congratulations! You Passed! 🎉</h3>
                    <p style={{ fontSize: '1rem', color: '#047857', marginBottom: '1.5rem' }}>
                      You scored <strong>{examResult.scorePercentage}%</strong> (Passing threshold: {examResult.passingPercentage}%).
                    </p>
                    
                    {examResult.certificate && (
                      <Link
                        to={`/certificates/${examResult.certificate.certificateId}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#059669', color: 'white', padding: '0.85rem 1.75rem', borderRadius: '0.85rem', fontWeight: 800, textDecoration: 'none', fontSize: '1rem' }}
                      >
                        View &amp; Download Verified Certificate <ExternalLink size={18} />
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <AlertTriangle size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Assessment Unsuccessful</h3>
                    <p style={{ fontSize: '0.95rem', color: '#7F1D1D', marginBottom: '1.5rem' }}>
                      Your score was <strong>{examResult.scorePercentage}%</strong>. Required passing benchmark is <strong>{examResult.passingPercentage}%</strong>.
                    </p>
                    <button
                      onClick={() => setExamResult(null)}
                      style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Retake Final Exam
                    </button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleFinalExamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                  {certification.finalExam?.instructions}
                </p>

                {certification.finalExam?.questions.map((q, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.85rem 0' }}>
                      Q{idx + 1}: {q.questionText} ({q.points || 10} pts)
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0.65rem', cursor: 'pointer', fontSize: '0.88rem', color: '#334155' }}>
                          <input 
                            type={q.type === 'multi' ? 'checkbox' : 'radio'} 
                            name={`exam_q_${idx}`} 
                            value={opt} 
                            onChange={(e) => {
                              if (q.type === 'multi') {
                                const current = examAnswers[idx] || [];
                                const updated = e.target.checked ? [...current, opt] : current.filter(v => v !== opt);
                                setExamAnswers({ ...examAnswers, [idx]: updated });
                              } else {
                                setExamAnswers({ ...examAnswers, [idx]: [opt] });
                              }
                            }} 
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={examSubmitting}
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '0.85rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', alignSelf: 'flex-end' }}
                >
                  {examSubmitting ? 'Evaluating Final Exam...' : 'Submit Final Exam for Evaluation'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default CertificationLearn;
