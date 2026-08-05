import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchQuizLeaderboardApi } from '../utils/api';
import { 
  Trophy, 
  Clock, 
  Award, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Medal,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const QuizLeaderboard = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboardData, setLeaderboardData] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchQuizLeaderboardApi(id);
        setLeaderboardData(res);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748B' }}>
        <Sparkles className="animate-spin" size={36} style={{ marginBottom: '1rem', color: '#2563EB' }} />
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Calculating Live Examination Standings &amp; Rankings...</p>
      </div>
    );
  }

  if (error || !leaderboardData) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '1.5rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="#DC2626" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991B1B', margin: '0 0 0.5rem 0' }}>Leaderboard Unavailable</h2>
        <p style={{ color: '#7F1D1D', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/quizzes" className="btn btn-primary">Return to Quizzes Arena</Link>
      </div>
    );
  }

  const { quizTitle, leaderboard } = leaderboardData;

  const getRankBadge = (rank) => {
    if (rank === 1) return <span style={{ fontSize: '1.4rem' }}>🥇</span>;
    if (rank === 2) return <span style={{ fontSize: '1.4rem' }}>🥈</span>;
    if (rank === 3) return <span style={{ fontSize: '1.4rem' }}>🥉</span>;
    return <span style={{ fontWeight: 800, color: '#64748B' }}>#{rank}</span>;
  };

  return (
    <div className="leaderboard-container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1050px', margin: '0 auto' }}>

      {/* Top Action Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/quizzes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Quizzes Arena
        </Link>
      </div>

      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="leaderboard-hero-banner" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', borderRadius: '1.75rem', padding: '2.5rem', color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', boxShadow: '0 15px 35px rgba(49,46,129,0.2)' }}>
        <div>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A5B4FC' }}>
            🏆 GLOBAL EXAMINATION LEADERBOARD
          </span>
          <h1 className="leaderboard-title" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.65rem 0 0.25rem 0' }}>{quizTitle}</h1>
          <p style={{ fontSize: '0.92rem', color: '#C7D2FE', margin: 0 }}>Ranked by highest score, shortest completion time, and earliest submission.</p>
        </div>

        <div className="leaderboard-participants-box" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.15)' }}>
          <Trophy size={36} color="#F59E0B" />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#A5B4FC', display: 'block', fontWeight: 700 }}>PARTICIPANTS</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900 }}>{leaderboard.length} Candidates</span>
          </div>
        </div>
      </div>

      {/* ── LEADERBOARD TABLE ───────────────────────────────────── */}
      {leaderboard.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '1.5rem', border: '1px dashed #CBD5E1' }}>
          <Trophy size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: '0 0 0.35rem 0' }}>No Submissions Yet</h3>
          <p style={{ color: '#64748B', margin: 0 }}>Be the first student to complete this assessment and claim Rank #1!</p>
        </div>
      ) : (
        <div className="leaderboard-table-card" style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <table className="leaderboard-table" style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Rank</th>
                <th style={{ padding: '1rem 1.5rem' }}>Candidate</th>
                <th style={{ padding: '1rem 1.5rem' }}>Score</th>
                <th style={{ padding: '1rem 1.5rem' }}>Percentage</th>
                <th style={{ padding: '1rem 1.5rem' }}>Time Taken</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr 
                  key={row.rank} 
                  style={{ 
                    borderBottom: '1px solid #F1F5F9',
                    background: row.rank === 1 ? '#FEFCE8' : row.rank === 2 ? '#F8FAFC' : row.rank === 3 ? '#FFF7ED' : '#FFFFFF'
                  }}
                >
                  <td style={{ padding: '1.1rem 1.5rem', fontWeight: 800 }}>
                    {getRankBadge(row.rank)}
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{row.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{row.studentEmail}</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem', fontWeight: 800, color: '#2563EB' }}>
                    {row.scoreObtained} / {row.totalMarks}
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem', fontWeight: 800, color: '#0F172A' }}>
                    {row.percentage}%
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>
                    {Math.floor(row.timeTakenSeconds / 60)}m {row.timeTakenSeconds % 60}s
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem' }}>
                    <span style={{ background: row.passed ? '#ECFDF5' : '#FEF2F2', color: row.passed ? '#065F46' : '#991B1B', border: `1px solid ${row.passed ? '#A7F3D0' : '#FEE2E2'}`, padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {row.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default QuizLeaderboard;
