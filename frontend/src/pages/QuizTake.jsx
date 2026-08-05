import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { startQuizApi, submitQuizApi } from '../utils/api';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  X,
  Code,
  FileText
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSecureExam } from '../hooks/useSecureExam';
import PreExamRulesModal from '../components/common/PreExamRulesModal';
import ExamSecurityHUD from '../components/common/ExamSecurityHUD';
import SecurityWarningDialog from '../components/common/SecurityWarningDialog';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [showPreExamModal, setShowPreExamModal] = useState(true);

  const studentEmail = userProfile?.email || 
    (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '') || 
    (localStorage.getItem('studentUser') ? JSON.parse(localStorage.getItem('studentUser')).email : '');
    
  const studentName = userProfile?.name || 
    (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '') || 
    (localStorage.getItem('studentUser') ? JSON.parse(localStorage.getItem('studentUser')).name : '');

  // Ref to hold answers during auto-submit
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const submittingRef = useRef(submitting);
  submittingRef.current = submitting;

  // Final submit handler declaration
  const handleFinalSubmit = useCallback(async (isTimeout = false, reason = 'Normal') => {
    if (submittingRef.current) return;
    setSubmitting(true);

    try {
      const totalTime = (quiz ? quiz.durationMinutes * 60 : 0) - remainingSeconds;

      const res = await submitQuizApi(id, {
        studentEmail,
        studentName,
        answers: answersRef.current,
        timeTakenSeconds: totalTime,
        autoSubmittedOnTimeout: isTimeout || reason === 'Security Violation',
        submissionReason: reason
      });

      navigate(`/quizzes/${id}/results/${res.submissionId}`);
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Error submitting quiz: ' + (err.message || 'Server error'));
      setSubmitting(false);
    }
  }, [id, quiz, remainingSeconds, studentEmail, studentName, navigate]);

  const attemptIdRef = useRef(`ATT-${id}-${Date.now()}`);

  // Hook into Secure Exam Anti-Cheating Engine
  const {
    isFullScreen,
    requestFullScreen,
    violationsCount,
    maxAllowed,
    warningMessage,
    showWarningModal,
    setShowWarningModal,
    securityStatus,
    logEvent
  } = useSecureExam({
    examId: id,
    examTitle: quiz?.title || 'Quiz Assessment',
    examType: quiz?.type ? quiz.type.toUpperCase() : 'Quiz',
    attemptId: attemptIdRef.current,
    studentEmail,
    studentName,
    securityPolicy: quiz?.settings?.securityPolicy || {
      mode: 'Standard',
      enforceFullscreen: true,
      preventTabSwitch: true,
      preventReload: true,
      maxViolations: quiz?.settings?.maxTabSwitchesAllowed || 3
    },
    onAutoSubmit: (reason) => handleFinalSubmit(false, reason),
    isActive: examStarted && !submitting
  });

  // 1. Initialize Quiz Session (Resets state completely per quiz id)
  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError('');
    setQuiz(null);
    setExamStarted(false);
    setShowPreExamModal(true);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitting(false);

    const initQuiz = async () => {
      try {
        const emailToUse = userProfile?.email || 
          (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '') || 
          (localStorage.getItem('studentUser') ? JSON.parse(localStorage.getItem('studentUser')).email : '') || 
          'student@piyushdhara.com';
          
        const nameToUse = userProfile?.name || 
          (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '') || 
          (localStorage.getItem('studentUser') ? JSON.parse(localStorage.getItem('studentUser')).name : '') || 
          'PiyushDhara Student';

        const res = await startQuizApi(id, emailToUse, nameToUse);
        if (isMounted) {
          if (res && res.quiz) {
            setQuiz(res.quiz);
            setRemainingSeconds((res.quiz?.durationMinutes || 30) * 60);
          } else {
            setError('Unable to load quiz details');
          }
        }
      } catch (err) {
        console.error('Quiz start error:', err);
        if (isMounted) {
          setError(err.message || 'Unable to start quiz session');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initQuiz();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. Countdown Timer
  useEffect(() => {
    if (!remainingSeconds || submitting || !examStarted) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true, 'Time Expired'); // Auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, submitting, examStarted, handleFinalSubmit]);

  const handleAcceptRulesAndStart = async () => {
    setShowPreExamModal(false);
    setExamStarted(true);
    await requestFullScreen();
    logEvent('Exam Started', 'Student accepted pre-exam rules');
  };

  // Format Timer MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Answer Updating Handlers
  const handleSingleSelect = (qId, optionVal) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selectedOptions: [optionVal]
      }
    }));
  };

  const handleMultiSelect = (qId, optionVal) => {
    setAnswers(prev => {
      const currentOpts = prev[qId]?.selectedOptions || [];
      const updated = currentOpts.includes(optionVal) 
        ? currentOpts.filter(o => o !== optionVal)
        : [...currentOpts, optionVal];
      
      return {
        ...prev,
        [qId]: {
          ...prev[qId],
          selectedOptions: updated
        }
      };
    });
  };

  const handleTextAnswer = (qId, val) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        textAnswer: val
      }
    }));
  };

  const handleCodeAnswer = (qId, val) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        codeAnswer: val
      }
    }));
  };

  const toggleMarkForReview = (qId) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        isMarkedForReview: !prev[qId]?.isMarkedForReview
      }
    }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748B' }}>
        <Sparkles className="animate-spin" size={36} style={{ marginBottom: '1rem', color: '#2563EB' }} />
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Initializing High-Stakes Examination Mode...</p>
      </div>
    );
  }

  if (!studentEmail) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2.5rem', background: '#FFFFFF', border: '1px solid #DBEAFE', borderRadius: '1.75rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(37,99,235,0.06)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>Student Login Required</h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 auto 1.75rem auto', lineHeight: 1.6, maxWidth: '440px' }}>
          You must be logged in to take this examination or practice test to record your score in your student profile.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to={`/login?redirect=/quizzes/${id}/take`} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontWeight: 800 }}>
            Log In to Start Exam
          </Link>
          <Link to="/quizzes" className="btn btn-outline" style={{ padding: '0.85rem 1.5rem', color: '#475569' }}>
            Browse All Quizzes
          </Link>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    // Detect schedule-specific messages to show a custom friendly screen
    const isScheduleError = error && (error.includes('scheduled to open') || error.includes('deadline has expired'));

    return (
      <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '2.5rem', background: isScheduleError ? '#FFFBEB' : '#FEF2F2', border: `1px solid ${isScheduleError ? '#FCD34D' : '#FEE2E2'}`, borderRadius: '1.5rem', textAlign: 'center' }}>
        {isScheduleError
          ? <span style={{ fontSize: '3rem', lineHeight: 1, display: 'block', marginBottom: '1rem' }}>{error && error.includes('deadline') ? '🔒' : '⏳'}</span>
          : <AlertTriangle size={48} color="#DC2626" style={{ marginBottom: '1rem' }} />
        }
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: isScheduleError ? '#92400E' : '#991B1B', margin: '0 0 0.5rem 0' }}>
          {isScheduleError
            ? (error && error.includes('deadline') ? 'Examination Window Closed' : 'Examination Not Yet Open')
            : 'Examination Access Error'
          }
        </h2>
        <p style={{ color: isScheduleError ? '#78350F' : '#7F1D1D', marginBottom: '1.5rem', fontWeight: 600 }}>{error || 'Quiz not found or not published'}</p>
        <Link to="/quizzes" className="btn btn-primary">Return to Quizzes Arena</Link>
      </div>
    );
  }

  if (!quiz?.questions || quiz.questions.length === 0) {
    return (
      <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '2.5rem', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '1.5rem', textAlign: 'center' }}>
        <AlertTriangle size={48} color="#D97706" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400E', margin: '0 0 0.5rem 0' }}>No Questions in Assessment</h2>
        <p style={{ color: '#78350F', marginBottom: '1.5rem', fontWeight: 600 }}>This quiz does not have any questions added yet. Please contact your instructor.</p>
        <Link to="/quizzes" className="btn btn-primary">Return to Quizzes Arena</Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIdx] || quiz.questions[0];
  const qIdStr = currentQ?._id ? currentQ._id.toString() : String(currentIdx);
  const currentAns = answers[qIdStr] || {};
  const isMarked = Boolean(currentAns.isMarkedForReview);

  // Status counters for question palette
  const answeredCount = Object.keys(answers).filter(qId => {
    const a = answers[qId];
    return (a.selectedOptions && a.selectedOptions.length > 0) || a.textAnswer || a.codeAnswer;
  }).length;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>

      {/* ── TOP EXAMINATION HEADER ──────────────────────────────── */}
      <header className="quiz-header" style={{ background: '#0F172A', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="quiz-header-title">
          <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase' }}>{quiz.type.toUpperCase()} EXAMINATION MODE</span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.1rem 0 0 0' }}>{quiz.title}</h2>
        </div>

        {/* Real-Time Security HUD */}
        {examStarted && (
          <div className="quiz-header-security">
            <ExamSecurityHUD
              violationsCount={violationsCount}
              maxAllowed={maxAllowed}
              isFullScreen={isFullScreen}
              securityStatus={securityStatus}
              onRequestFullScreen={requestFullScreen}
            />
          </div>
        )}

        {/* Live Animated Timer */}
        <div className="quiz-header-timer" style={{ background: remainingSeconds < 180 ? '#7F1D1D' : '#1E293B', border: `1px solid ${remainingSeconds < 180 ? '#EF4444' : '#334155'}`, padding: '0.5rem 1.25rem', borderRadius: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem', transition: 'all 0.3s ease' }}>
          <Clock size={20} color={remainingSeconds < 180 ? '#FCA5A5' : '#38BDF8'} className={remainingSeconds < 180 ? 'animate-pulse' : ''} />
          <div>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', fontWeight: 700 }}>REMAINING TIME</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: remainingSeconds < 180 ? '#FCA5A5' : '#FFFFFF' }}>
              {formatTime(remainingSeconds)}
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN EXAM AREA (QUESTION + QUESTION PALETTE) ────────── */}
      <div 
        className="quiz-take-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          flex: 1, 
          padding: '1.25rem', 
          gap: '1.5rem', 
          maxWidth: '1400px', 
          margin: '0 auto', 
          width: '100%', 
          boxSizing: 'border-box' 
        }}
      >
        
        {/* LEFT WORKSPACE: QUESTION CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Question Box */}
          <div className="quiz-question-card" style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            
            {/* Header: Q Number & Points */}
            <div className="quiz-qheader-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>
                Question {currentIdx + 1} of {quiz.questions.length}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>
                  Marks: <strong style={{ color: '#0F172A' }}>+{currentQ.points || 5}</strong>
                </span>

                <button
                  onClick={() => toggleMarkForReview(qIdStr)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '0.65rem',
                    border: isMarked ? '1px solid #7C3AED' : '1px solid #CBD5E1',
                    background: isMarked ? '#F3E8FF' : '#FFFFFF',
                    color: isMarked ? '#7E22CE' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <Bookmark size={15} color={isMarked ? '#7E22CE' : '#64748B'} />
                  {isMarked ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="quiz-qtext" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              {currentQ.questionText}
            </h3>

            {/* Code Snippet (if present) */}
            {currentQ.codeSnippet && (
              <div style={{ background: '#0F172A', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem', color: '#38BDF8', fontFamily: 'monospace', fontSize: '0.9rem', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}><code>{currentQ.codeSnippet}</code></pre>
              </div>
            )}

            {/* ANSWER OPTIONS / INPUT CONTROLS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              {/* MCQ Single / True False / MCQ */}
              {(currentQ.type === 'mcq_single' || currentQ.type === 'mcq' || currentQ.type === 'true_false' || currentQ.type === 'tf') && (currentQ.options || []).map((opt, oIdx) => {
                const isSelected = (currentAns.selectedOptions || []).includes(opt);

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSingleSelect(qIdStr, opt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '1rem',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      color: isSelected ? '#1D4ED8' : '#334155',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.95rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '6px solid #2563EB' : '2px solid #CBD5E1', background: '#FFFFFF', flexShrink: 0 }} />
                    <span>{opt}</span>
                  </button>
                );
              })}

              {/* MCQ Multiple */}
              {currentQ.type === 'mcq_multi' && (currentQ.options || []).map((opt, oIdx) => {
                const isSelected = (currentAns.selectedOptions || []).includes(opt);

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleMultiSelect(qIdStr, opt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '1rem',
                      border: isSelected ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                      background: isSelected ? '#F3E8FF' : '#FFFFFF',
                      color: isSelected ? '#7E22CE' : '#334155',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.95rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: '20px', height: '20px', borderRadius: '0.35rem', border: isSelected ? '2px solid #7C3AED' : '2px solid #CBD5E1', background: isSelected ? '#7C3AED' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, flexShrink: 0 }}>
                      {isSelected ? '✓' : ''}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}

              {/* Fill in Blank / Short Answer */}
              {(currentQ.type === 'fill_blank' || currentQ.type === 'blank' || currentQ.type === 'short_answer') && (
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={currentAns.textAnswer || ''}
                  onChange={(e) => handleTextAnswer(qIdStr, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    borderRadius: '1rem',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              )}

              {/* Practical Coding Assignment Editor */}
              {currentQ.type === 'code' && (
                <textarea
                  rows={10}
                  placeholder="Write your code answer submission here..."
                  value={currentAns.codeAnswer || ''}
                  onChange={(e) => handleCodeAnswer(qIdStr, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    border: '1.5px solid #0F172A',
                    background: '#0F172A',
                    color: '#38BDF8',
                    fontFamily: 'monospace',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              )}

            </div>

          </div>

          {/* BOTTOM QUESTION NAVIGATION BAR */}
          <div className="quiz-bottom-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.85rem',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontWeight: 700,
                cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                opacity: currentIdx === 0 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={18} /> Previous Question
            </button>

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '0.85rem',
                  border: 'none',
                  background: '#2563EB',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Next Question <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => handleFinalSubmit(false)}
                disabled={submitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.85rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(5,150,105,0.3)'
                }}
              >
                <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Examination'}
              </button>
            )}
          </div>

        </div>

        {/* RIGHT WORKSPACE: QUESTION PALETTE & EXAM SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="quiz-palette-card" style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Question Palette ({quiz.questions.length})
            </h4>

            {/* Status Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }} /> Answered ({answeredCount})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E2E8F0' }} /> Unanswered ({quiz.questions.length - answeredCount})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7C3AED' }} /> Review
              </span>
            </div>

            {/* Grid Palette Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem' }}>
              {quiz.questions.map((q, qIdx) => {
                const qId = q._id.toString();
                const a = answers[qId];
                const isAns = a && ((a.selectedOptions && a.selectedOptions.length > 0) || a.textAnswer || a.codeAnswer);
                const isRev = a && a.isMarkedForReview;
                const isCurrent = qIdx === currentIdx;

                return (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentIdx(qIdx)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '0.65rem',
                      border: isCurrent ? '2px solid #2563EB' : '1px solid #CBD5E1',
                      background: isRev ? '#7C3AED' : isAns ? '#059669' : '#F8FAFC',
                      color: (isRev || isAns) ? 'white' : '#334155',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: isCurrent ? '0 0 0 3px rgba(37,99,235,0.25)' : 'none'
                    }}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Instant Final Submit Button */}
            <button
              onClick={() => handleFinalSubmit(false)}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '0.85rem',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                fontWeight: 900,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
              }}
            >
              Finish &amp; Submit Exam
            </button>

          </div>

        </div>

      </div>

      {/* PRE-EXAM RULES & FULLSCREEN ACCEPTANCE MODAL */}
      <PreExamRulesModal
        isOpen={showPreExamModal}
        title={quiz?.title}
        durationMinutes={quiz?.durationMinutes || 30}
        totalQuestions={quiz?.questions?.length || 0}
        totalMarks={quiz?.questions ? quiz.questions.reduce((acc, q) => acc + (q.points || 5), 0) : 100}
        passingPercentage={quiz?.passingPercentage || 70}
        enableNegativeMarking={quiz?.settings?.enableNegativeMarking || false}
        securityPolicyMode={quiz?.settings?.securityPolicy?.mode || 'Standard'}
        maxViolations={maxAllowed}
        onAcceptAndStart={handleAcceptRulesAndStart}
        onCancel={() => navigate('/quizzes')}
      />

      {/* SECURITY WARNING DIALOG */}
      <SecurityWarningDialog
        isOpen={showWarningModal}
        message={warningMessage}
        violationsCount={violationsCount}
        maxAllowed={maxAllowed}
        onReturnFullScreen={requestFullScreen}
        onClose={() => setShowWarningModal(false)}
      />

    </div>
  );
};

export default QuizTake;
