import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchQuizzesApi } from '../utils/api';
import { 
  FileText, 
  Clock, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Trophy, 
  ArrowRight, 
  AlertCircle,
  PlayCircle,
  BarChart,
  ShieldAlert,
  Code,
  LogIn
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const QuizzesList = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const studentEmail = userProfile?.email || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '');

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchQuizzesApi({
        type: selectedType,
        difficulty: selectedDifficulty,
        studentEmail
      });
      setQuizzes(res.quizzes || []);
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [selectedType, selectedDifficulty, studentEmail]);

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'weekly':
        return <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>⚡ Weekly Quiz</span>;
      case 'monthly':
      case 'mock':
        return <span style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>🏆 Grand Mock Test</span>;
      case 'assignment':
        return <span style={{ background: '#F3E8FF', color: '#7E22CE', border: '1px solid #E9D5FF', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>💻 Practical Assignment</span>;
      default:
        return <span style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>📝 Practice Test</span>;
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }} className="quizzes-page-container">

      {/* ── HERO BANNER ────────────────────────────────────────── */}
      <div 
        className="quizzes-hero-banner"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 50%, #F0F9FF 100%)',
          borderRadius: '1.75rem',
          padding: '3rem 2.5rem',
          color: '#0F172A',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(37, 99, 235, 0.16)',
          boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.12)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          <span className="quizzes-hero-badge" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563EB', padding: '0.35rem 0.95rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ⚡ Examination &amp; Practice Arena
          </span>

          <h1 className="quizzes-hero-title" style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0.85rem 0 0.5rem 0', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Quizzes, Mock Exams &amp; Assignments
          </h1>

          <p className="quizzes-hero-desc" style={{ fontSize: '1.02rem', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
            Test your knowledge with weekly quizzes, competitive grand mock exams, practical coding challenges, and track your global rank on the live leaderboard.
          </p>
        </div>

        <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.08, pointerEvents: 'none' }}>
          <Award size={340} color="#FFFFFF" />
        </div>
      </div>

      {/* ── CONTROLS & FILTER BAR ────────────────────────────── */}
      <div className="quizzes-controls-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="quizzes-filter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Search Box */}
          <div className="quizzes-search-box" style={{ position: 'relative', minWidth: '320px', flex: 1 }}>
            <Search size={18} color="#64748B" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search quizzes, mock tests, assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '0.85rem',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Difficulty Filter */}
          <div className="quizzes-difficulty-filter" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Difficulty:</span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.65rem',
                  border: selectedDifficulty === diff ? '1px solid #2563EB' : '1px solid #CBD5E1',
                  background: selectedDifficulty === diff ? '#2563EB' : '#FFFFFF',
                  color: selectedDifficulty === diff ? 'white' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {diff}
              </button>
            ))}
          </div>

        </div>

        {/* Category Tabs */}
        <div className="tab-strip-scroll" style={{ gap: '0.5rem', paddingBottom: '0.35rem' }}>
          {[
            { id: 'All', label: 'All Assessments' },
            { id: 'weekly', label: '⚡ Weekly Quizzes' },
            { id: 'mock', label: '🏆 Mock Tests' },
            { id: 'practice', label: '📝 Practice Tests' },
            { id: 'assignment', label: '💻 Coding Assignments' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '0.85rem',
                border: selectedType === tab.id ? '1px solid #2563EB' : '1px solid #E2E8F0',
                background: selectedType === tab.id ? '#EFF6FF' : '#FFFFFF',
                color: selectedType === tab.id ? '#1D4ED8' : '#475569',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── QUIZZES GRID ────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748B' }}>
          <Sparkles className="animate-spin" size={36} style={{ marginBottom: '1rem', color: '#2563EB' }} />
          <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>Loading Examinations &amp; Quizzes...</p>
        </div>
      ) : error ? (
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '1.25rem', textAlign: 'center' }}>
          <AlertCircle size={44} color="#DC2626" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Error Loading Quizzes</h3>
          <p style={{ color: '#7F1D1D', marginBottom: '1rem' }}>{error}</p>
          <button onClick={loadQuizzes} className="btn btn-primary">Retry Loading</button>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '1.5rem', border: '1px dashed #CBD5E1' }}>
          <HelpCircle size={48} color="#94A3B8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: '0 0 0.35rem 0' }}>No Quizzes Found</h3>
          <p style={{ color: '#64748B', margin: 0 }}>Try clearing your search query or changing filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {filteredQuizzes.map(quiz => {
            const stats = quiz.userStats;
            const isCompleted = stats && stats.isCompleted;

            return (
              <div 
                key={quiz._id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '1.5rem',
                  border: '1px solid #E2E8F0',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  {getTypeBadge(quiz.type)}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', background: '#F8FAFC', padding: '0.2rem 0.55rem', borderRadius: '0.4rem', border: '1px solid #E2E8F0' }}>
                    {quiz.difficulty}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.45rem 0', lineHeight: 1.35 }}>
                    {quiz.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {quiz.description}
                  </p>
                </div>

                {/* Metrics Details Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', padding: '0.75rem 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', fontSize: '0.78rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={15} color="#2563EB" /> {quiz.durationMinutes} Mins
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <HelpCircle size={15} color="#059669" /> {quiz.questionsCount || 5} Qs
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Award size={15} color="#D97706" /> {quiz.passingPercentage || 70}% Pass
                  </div>
                </div>

                {/* User Previous Attempt Badge */}
                {isCompleted && (
                  <div style={{ background: stats.passed ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${stats.passed ? '#A7F3D0' : '#FEE2E2'}`, borderRadius: '0.75rem', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: stats.passed ? '#065F46' : '#991B1B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={16} color={stats.passed ? '#059669' : '#DC2626'} />
                      Best: {stats.bestScore} Points ({stats.bestPercentage}%)
                    </span>
                    <span>{stats.passed ? 'PASSED' : 'FAILED'}</span>
                  </div>
                )}

                {/* Schedule Dates & Lock Status */}
                {(quiz.startDate || quiz.endDate) && (
                  <div style={{ background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {(() => {
                      const now = new Date();
                      const hasStart = quiz.startDate ? new Date(quiz.startDate) : null;
                      const hasEnd = quiz.endDate ? new Date(quiz.endDate) : null;

                      const isUpcoming = hasStart && now < hasStart;
                      const isExpired = hasEnd && now > hasEnd;

                      if (isUpcoming) {
                        return (
                          <div style={{ color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            ⏳ Unlocks: {hasStart.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        );
                      }

                      if (isExpired) {
                        return (
                          <div style={{ color: '#DC2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            🔒 Closed: {hasEnd.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        );
                      }

                      return (
                        <div style={{ color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          🟢 Live Open until: {hasEnd ? hasEnd.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No Expiry'}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Bottom Actions */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.65rem' }}>
                  {(() => {
                    const now = new Date();
                    const hasStart = quiz.startDate ? new Date(quiz.startDate) : null;
                    const hasEnd = quiz.endDate ? new Date(quiz.endDate) : null;

                    const isUpcoming = hasStart && now < hasStart;
                    const isExpired = hasEnd && now > hasEnd;
                    const isDisabled = isUpcoming || isExpired;

                    if (isDisabled) {
                      return (
                        <button
                          disabled
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            background: '#E2E8F0',
                            color: '#94A3B8',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            border: 'none',
                            cursor: 'not-allowed'
                          }}
                        >
                          <PlayCircle size={17} /> {isUpcoming ? 'Upcoming Exam' : 'Exam Closed'}
                        </button>
                      );
                    }

                    if (!studentEmail) {
                      return (
                        <button
                          onClick={() => navigate(`/login?redirect=/quizzes/${quiz._id}/take`)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                          }}
                        >
                          Log In to Take Exam <LogIn size={17} />
                        </button>
                      );
                    }

                    return (
                      <Link
                        to={`/quizzes/${quiz._id}/take`}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          padding: '0.75rem',
                          borderRadius: '0.75rem',
                          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                          color: 'white',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                        }}
                      >
                        <PlayCircle size={17} /> {isCompleted ? 'Retake Quiz' : 'Start Exam'}
                      </Link>
                    );
                  })()}

                  <Link
                    to={`/quizzes/${quiz._id}/leaderboard`}
                    title="View Leaderboard"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#D97706',
                      textDecoration: 'none'
                    }}
                  >
                    <Trophy size={18} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default QuizzesList;
