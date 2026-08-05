import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchQuizResultApi } from '../utils/api';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trophy, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

const QuizResults = () => {
  const { id, submissionId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchQuizResultApi(id, submissionId);
        setResultData(res);
      } catch (err) {
        console.error('Error fetching quiz result:', err);
        setError(err.message || 'Failed to load examination result');
      } finally {
        setLoading(false);
      }
    };
    loadResult();
  }, [id, submissionId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748B' }}>
        <Sparkles className="animate-spin" size={36} style={{ marginBottom: '1rem', color: '#2563EB' }} />
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Calculating Final Scores &amp; Performance Breakdown...</p>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '1.5rem', textAlign: 'center' }}>
        <XCircle size={48} color="#DC2626" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Results Unavailable</h2>
        <p style={{ color: '#7F1D1D', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/quizzes" className="btn btn-primary">Back to Quizzes</Link>
      </div>
    );
  }

  const { submission, quizTitle, quizSettings } = resultData;
  const {
    scoreObtained,
    totalMarks,
    percentage,
    grade,
    passed,
    correctCount,
    incorrectCount,
    unansweredCount,
    timeTakenSeconds,
    rank,
    answers,
    evaluationStatus,
    teacherFeedback
  } = submission;

  const minutesTaken = Math.floor(timeTakenSeconds / 60);
  const secondsTaken = timeTakenSeconds % 60;

  return (
    <div className="quiz-results-container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1050px', margin: '0 auto' }}>

      {/* Top Action Back Bar */}
      <div className="quiz-results-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <Link to="/quizzes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Quizzes Arena
        </Link>

        <div className="quiz-results-top-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <Link 
            to={`/quizzes/${id}/leaderboard`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#D97706', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}
          >
            <Trophy size={16} /> View Leaderboard
          </Link>

          <Link 
            to={`/quizzes/${id}/take`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', border: 'none', background: '#2563EB', color: 'white', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
          >
            <RotateCcw size={16} /> Retake Examination
          </Link>
        </div>
      </div>

      {/* ── SCORE SUMMARY CARD ──────────────────────────────────── */}
      <div 
        className="quiz-results-hero-card"
        style={{
          background: passed ? 'linear-gradient(135deg, #065F46 0%, #047857 100%)' : 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)',
          borderRadius: '1.75rem',
          padding: '3rem 2.5rem',
          color: 'white',
          marginBottom: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '2rem',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {passed ? '🎉 PASSED' : '❌ NEEDS IMPROVEMENT'}
          </span>

          <h1 className="quiz-results-title" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.75rem 0 0.25rem 0' }}>
            {quizTitle}
          </h1>

          <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: '0 0 1.5rem 0' }}>
            Official Examination Result Summary
          </p>

          <div className="quiz-results-stats-grid" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', fontWeight: 700 }}>GRADE SCORE</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900 }}>{scoreObtained} / {totalMarks} ({percentage}%)</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', fontWeight: 700 }}>LETTER GRADE</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900 }}>{grade}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', fontWeight: 700 }}>TIME TAKEN</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900 }}>{minutesTaken}m {secondsTaken}s</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', fontWeight: 700 }}>LEADERBOARD RANK</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900 }}>#{rank}</span>
            </div>
          </div>
        </div>

        {/* Circular Metric */}
        <div className="quiz-results-percentage-box" style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '1.5rem', padding: '1.75rem', textAlign: 'center', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{percentage}%</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', opacity: 0.9 }}>{passed ? 'Qualification Achieved' : 'Below Passing Benchmark'}</div>
        </div>
      </div>

      {/* Manual Evaluation Feedback Banner (if applicable) */}
      {evaluationStatus === 'manually_graded' && teacherFeedback && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', padding: '1.25rem', borderRadius: '1rem', marginBottom: '2rem' }}>
          <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileCheck size={18} /> Teacher Feedback &amp; Evaluation Comments:
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{teacherFeedback}</p>
        </div>
      )}

      {/* ── QUESTION-BY-QUESTION BREAKDOWN ─────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          Question Performance &amp; Answer Review
        </h2>

        {answers.map((q, idx) => (
          <div 
            key={idx}
            className="quiz-results-question-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '1.5rem',
              border: `1.5px solid ${q.isCorrect ? '#A7F3D0' : '#E2E8F0'}`,
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Header */}
            <div className="quiz-results-qheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '0.25rem 0.65rem', borderRadius: '0.5rem' }}>
                Question {idx + 1}
              </span>

              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: q.isCorrect ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {q.isCorrect ? <><CheckCircle2 size={16} /> +{q.marksObtained} Marks</> : <><XCircle size={16} /> 0 Marks</>}
              </span>
            </div>

            {/* Question Text */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.4 }}>
              {q.questionText}
            </h4>

            {q.codeSnippet && (
              <pre style={{ background: '#0F172A', color: '#38BDF8', padding: '1rem', borderRadius: '0.85rem', margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
                <code>{q.codeSnippet}</code>
              </pre>
            )}

            {/* Options Review */}
            {q.options && q.options.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options.map((opt, oIdx) => {
                  const isUserSel = q.selectedOptions.includes(opt);
                  const isCorr = q.correctAnswers.includes(opt);

                  let bg = '#F8FAFC';
                  let border = '#E2E8F0';
                  let color = '#475569';

                  if (isCorr) {
                    bg = '#ECFDF5';
                    border = '#A7F3D0';
                    color = '#065F46';
                  } else if (isUserSel && !isCorr) {
                    bg = '#FEF2F2';
                    border = '#FEE2E2';
                    color = '#991B1B';
                  }

                  return (
                    <div 
                      key={oIdx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        background: bg,
                        border: `1px solid ${border}`,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: isUserSel || isCorr ? 800 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{opt}</span>
                      <span>
                        {isCorr && <span style={{ fontSize: '0.72rem', background: '#059669', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', fontWeight: 800 }}>CORRECT ANSWER</span>}
                        {isUserSel && !isCorr && <span style={{ fontSize: '0.72rem', background: '#DC2626', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', fontWeight: 800 }}>YOUR ANSWER</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Code / Text Answer Display */}
            {q.type === 'code' && q.codeAnswer && (
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.35rem' }}>YOUR SUBMITTED CODE:</span>
                <pre style={{ background: '#0F172A', color: '#38BDF8', padding: '1rem', borderRadius: '0.85rem', margin: 0, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  <code>{q.codeAnswer}</code>
                </pre>
              </div>
            )}

            {/* Teacher Explanation */}
            {q.explanation && (
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', padding: '0.85rem 1.1rem', borderRadius: '0.85rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
                <strong>💡 Explanation:</strong> {q.explanation}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
};

export default QuizResults;
