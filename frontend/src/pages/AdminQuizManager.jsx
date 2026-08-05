import { useState, useEffect } from 'react';
import { 
  fetchAdminQuizzesApi, 
  createAdminQuizApi, 
  updateAdminQuizApi, 
  deleteAdminQuizApi, 
  duplicateAdminQuizApi, 
  fetchAdminQuizSubmissionsApi, 
  gradeAdminQuizSubmissionApi 
} from '../utils/api';
import { 
  HelpCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Users, 
  BarChart, 
  X, 
  Save, 
  Eye, 
  Check, 
  ShieldAlert,
  Code,
  List
} from 'lucide-react';

const AdminQuizManager = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' or 'submissions'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingQuestionsQuiz, setEditingQuestionsQuiz] = useState(null);

  // Form State for New / Edit Quiz
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: 'Read each question carefully before submitting.',
    type: 'practice',
    category: 'Web Development',
    subject: 'Computer Science',
    difficulty: 'Beginner',
    durationMinutes: 30,
    startDate: '',
    endDate: '',
    attemptsAllowed: 'unlimited',
    maxAttempts: 1,
    passingPercentage: 70,
    status: 'published',
    settings: {
      randomizeQuestions: false,
      showTimer: true,
      showScoreImmediately: true,
      showAnswersPostQuiz: true,
      showLeaderboard: true,
      detectTabSwitch: true,
      maxTabSwitchesAllowed: 3,
      enableNegativeMarking: false
    }
  });

  // State for Question Editor Modal
  const [questionsList, setQuestionsList] = useState([]);
  const [newQText, setNewQText] = useState('');
  const [newQType, setNewQType] = useState('mcq_single');
  const [newQPoints, setNewQPoints] = useState(10);
  const [newQOptions, setNewQOptions] = useState(['Option A', 'Option B', 'Option C', 'Option D']);
  const [newQCorrect, setNewQCorrect] = useState('Option A');
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQCode, setNewQCode] = useState('');

  // Grading Modal State
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeMarks, setGradeMarks] = useState(100);
  const [gradeFeedback, setGradeFeedback] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const quizRes = await fetchAdminQuizzesApi();
      setQuizzes(quizRes.quizzes || []);

      const subRes = await fetchAdminQuizSubmissionsApi();
      setSubmissions(subRes.submissions || []);
    } catch (err) {
      console.error('Error loading admin quizzes:', err);
      setError(err.message || 'Failed to load quiz management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Create/Edit Quiz
  const handleOpenCreate = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      description: '',
      instructions: 'Read each question carefully before submitting.',
      type: 'practice',
      category: 'Web Development',
      subject: 'Computer Science',
      difficulty: 'Beginner',
      durationMinutes: 30,
      startDate: '',
      endDate: '',
      attemptsAllowed: 'unlimited',
      maxAttempts: 1,
      passingPercentage: 70,
      status: 'published',
      settings: {
        randomizeQuestions: false,
        showTimer: true,
        showScoreImmediately: true,
        showAnswersPostQuiz: true,
        showLeaderboard: true,
        detectTabSwitch: true,
        maxTabSwitchesAllowed: 3,
        enableNegativeMarking: false
      }
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      instructions: quiz.instructions,
      type: quiz.type,
      category: quiz.category,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      startDate: quiz.startDate ? new Date(quiz.startDate).toISOString().slice(0, 16) : '',
      endDate: quiz.endDate ? new Date(quiz.endDate).toISOString().slice(0, 16) : '',
      attemptsAllowed: quiz.attemptsAllowed,
      maxAttempts: quiz.maxAttempts,
      passingPercentage: quiz.passingPercentage,
      status: quiz.status,
      settings: quiz.settings || {}
    });
    setShowCreateModal(true);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await updateAdminQuizApi(editingQuiz._id, formData);
        alert('Quiz updated successfully!');
      } else {
        await createAdminQuizApi(formData);
        alert('Quiz created successfully!');
      }
      setShowCreateModal(false);
      loadData();
    } catch (err) {
      alert('Error saving quiz: ' + err.message);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await deleteAdminQuizApi(quizId);
      loadData();
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleDuplicateQuiz = async (quizId) => {
    try {
      await duplicateAdminQuizApi(quizId);
      loadData();
    } catch (err) {
      alert('Duplicate error: ' + err.message);
    }
  };

  // Question Studio Handlers
  const handleOpenQuestionsStudio = (quiz) => {
    setEditingQuestionsQuiz(quiz);
    setQuestionsList(quiz.questions || []);
  };

  const handleAddQuestion = () => {
    if (!newQText.trim()) return alert('Question text is required');

    const newQ = {
      questionText: newQText,
      type: newQType,
      points: Number(newQPoints) || 5,
      options: newQType.startsWith('mcq') ? newQOptions : newQType === 'true_false' ? ['True', 'False'] : [],
      correctAnswers: [newQCorrect],
      explanation: newQExplanation,
      codeSnippet: newQCode
    };

    const updatedList = [...questionsList, newQ];
    setQuestionsList(updatedList);

    // Reset Form
    setNewQText('');
    setNewQExplanation('');
    setNewQCode('');
  };

  const handleRemoveQuestion = (idx) => {
    setQuestionsList(questionsList.filter((_, i) => i !== idx));
  };

  const handleSaveQuestionsStudio = async () => {
    try {
      await updateAdminQuizApi(editingQuestionsQuiz._id, { questions: questionsList });
      alert('Questions saved successfully!');
      setEditingQuestionsQuiz(null);
      loadData();
    } catch (err) {
      alert('Error saving questions: ' + err.message);
    }
  };

  // Submission Grading Handler
  const handleOpenGrading = (sub) => {
    setGradingSubmission(sub);
    setGradeMarks(sub.scoreObtained);
    setGradeFeedback(sub.teacherFeedback || '');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    try {
      await gradeAdminQuizSubmissionApi({
        submissionId: gradingSubmission.submissionId,
        updatedMarks: Number(gradeMarks),
        teacherFeedback: gradeFeedback
      });
      alert('Submission graded successfully!');
      setGradingSubmission(null);
      loadData();
    } catch (err) {
      alert('Error grading submission: ' + err.message);
    }
  };

  // Stats Counters
  const totalSubmissionsCount = submissions.length;
  const avgScorePct = submissions.length > 0 ? Math.round(submissions.reduce((a, b) => a + b.percentage, 0) / submissions.length) : 0;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>

      {/* ── TOP HEADER & METRICS ───────────────────────────────── */}
      <div className="admin-quiz-header" style={{ background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #E2E8F0', padding: '2rem 2.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div>
          <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
            📜 TEACHER &amp; ADMIN PORTAL
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: '0.4rem 0 0.2rem 0' }}>
            Quiz &amp; Assessment Management Studio
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
            Create weekly quizzes, grand mock tests, practical assignments, manage question banks, and grade student submissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="admin-quiz-create-btn"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.85rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 6px 18px rgba(37,99,235,0.25)'
          }}
        >
          <Plus size={18} /> Create New Quiz / Test
        </button>
      </div>

      {/* ── METRICS SUMMARY CARDS ──────────────────────────────── */}
      <div className="admin-quiz-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.75rem', borderRadius: '0.85rem' }}><HelpCircle size={24} /></div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, display: 'block' }}>TOTAL QUIZZES</span>
            <strong style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 900 }}>{quizzes.length}</strong>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#ECFDF5', color: '#059669', padding: '0.75rem', borderRadius: '0.85rem' }}><Users size={24} /></div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, display: 'block' }}>STUDENT ATTEMPTS</span>
            <strong style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 900 }}>{totalSubmissionsCount}</strong>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#FEF3C7', color: '#D97706', padding: '0.75rem', borderRadius: '0.85rem' }}><BarChart size={24} /></div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, display: 'block' }}>AVERAGE SCORE</span>
            <strong style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 900 }}>{avgScorePct}%</strong>
          </div>
        </div>
      </div>

      {/* ── TABS (QUIZZES LIST vs SUBMISSIONS GRADING) ──────────── */}
      <div className="admin-quiz-tabs" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '2rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('quizzes')}
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: activeTab === 'quizzes' ? '3px solid #2563EB' : '3px solid transparent',
            color: activeTab === 'quizzes' ? '#2563EB' : '#64748B',
            fontWeight: 800,
            fontSize: '0.92rem',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer'
          }}
        >
          All Quizzes &amp; Assessments ({quizzes.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: activeTab === 'submissions' ? '3px solid #2563EB' : '3px solid transparent',
            color: activeTab === 'submissions' ? '#2563EB' : '#64748B',
            fontWeight: 800,
            fontSize: '0.92rem',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer'
          }}
        >
          Submissions &amp; Manual Grading ({submissions.length})
        </button>
      </div>

      {/* ── TAB 1: QUIZZES MANAGEMENT LIST ─────────────────────── */}
      {activeTab === 'quizzes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {quizzes.map((quiz) => (
            <div 
              key={quiz._id}
              className="admin-quiz-item-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '1.25rem',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}
            >
              <div className="admin-quiz-item-info">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '0.15rem 0.55rem', borderRadius: '0.4rem', fontSize: '0.72rem', fontWeight: 800 }}>
                    {quiz.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                    {quiz.category} • {quiz.difficulty}
                  </span>
                  {/* Live/Upcoming/Closed schedule badge */}
                  {(quiz.startDate || quiz.endDate) && (() => {
                    const now = new Date();
                    const hasStart = quiz.startDate ? new Date(quiz.startDate) : null;
                    const hasEnd = quiz.endDate ? new Date(quiz.endDate) : null;
                    const isUpcoming = hasStart && now < hasStart;
                    const isExpired = hasEnd && now > hasEnd;

                    if (isUpcoming) return <span style={{ background: '#FEF3C7', color: '#D97706', padding: '0.15rem 0.55rem', borderRadius: '0.4rem', fontSize: '0.72rem', fontWeight: 800 }}>⏳ Upcoming</span>;
                    if (isExpired) return <span style={{ background: '#FEF2F2', color: '#DC2626', padding: '0.15rem 0.55rem', borderRadius: '0.4rem', fontSize: '0.72rem', fontWeight: 800 }}>🔒 Expired</span>;
                    return <span style={{ background: '#ECFDF5', color: '#059669', padding: '0.15rem 0.55rem', borderRadius: '0.4rem', fontSize: '0.72rem', fontWeight: 800 }}>🟢 Live</span>;
                  })()}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  {quiz.title}
                </h3>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: '#64748B', flexWrap: 'wrap' }}>
                  <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {quiz.durationMinutes} mins</span>
                  <span><HelpCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {quiz.questionsCount || (quiz.questions ? quiz.questions.length : 0)} Questions</span>
                  <span><Users size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {quiz.stats ? quiz.stats.totalSubmissions : 0} Submissions</span>
                  {quiz.startDate && (
                    <span style={{ color: '#2563EB', fontWeight: 700 }}>
                      📅 Opens: {new Date(quiz.startDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  {quiz.endDate && (
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>
                      🔒 Closes: {new Date(quiz.endDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="admin-quiz-item-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleOpenQuestionsStudio(quiz)}
                  style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.55rem 0.95rem', borderRadius: '0.65rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <List size={15} /> Questions Studio ({quiz.questions ? quiz.questions.length : 0})
                </button>

                <button
                  onClick={() => handleOpenEdit(quiz)}
                  style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.55rem 0.85rem', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  <Edit3 size={15} /> Edit Settings
                </button>

                <button
                  onClick={() => handleDuplicateQuiz(quiz._id)}
                  style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.55rem 0.85rem', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                  title="Duplicate Quiz"
                >
                  <Copy size={15} />
                </button>

                <button
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2', padding: '0.55rem 0.85rem', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                  title="Delete Quiz"
                >
                  <Trash2 size={15} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: SUBMISSIONS & GRADING HUB ─────────────────────── */}
      {activeTab === 'submissions' && (
        <>
          {/* Desktop Table View (hidden on mobile) */}
          <div className="admin-table-responsive hidden-mobile" style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Submission ID</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Student</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Quiz Title</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Score &amp; Grade</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.submissionId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                      {sub.submissionId}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{sub.studentName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{sub.studentEmail}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#334155' }}>
                      {sub.quizTitle}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>
                      {sub.scoreObtained} / {sub.totalMarks} ({sub.percentage}%) [{sub.grade}]
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ background: sub.passed ? '#ECFDF5' : '#FEF2F2', color: sub.passed ? '#065F46' : '#991B1B', border: `1px solid ${sub.passed ? '#A7F3D0' : '#FEE2E2'}`, padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {sub.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button
                        onClick={() => handleOpenGrading(sub)}
                        style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.45rem 0.85rem', borderRadius: '0.65rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Evaluate / Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (visible only on screens < 768px) */}
          <div className="admin-submissions-mobile-cards hidden-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {submissions.map((sub) => (
              <div 
                key={sub.submissionId} 
                style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '1.25rem', 
                  border: '1px solid #E2E8F0', 
                  padding: '1.25rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                {/* Status & ID Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '0.35rem' }}>
                    {sub.submissionId}
                  </span>
                  <span style={{ background: sub.passed ? '#ECFDF5' : '#FEF2F2', color: sub.passed ? '#065F46' : '#991B1B', border: `1px solid ${sub.passed ? '#A7F3D0' : '#FEE2E2'}`, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                    {sub.passed ? '✓ PASSED' : '✕ FAILED'}
                  </span>
                </div>

                {/* Student Info */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.15rem 0' }}>{sub.studentName}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{sub.studentEmail}</span>
                </div>

                {/* Quiz Title */}
                <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Target Assessment:</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', display: 'block' }}>{sub.quizTitle}</span>
                </div>

                {/* Score & Grade pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', background: '#EFF6FF', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #BFDBFE' }}>
                  <span style={{ color: '#1E4ED8', fontWeight: 700 }}>Score Obtained:</span>
                  <strong style={{ color: '#1D4ED8', fontWeight: 900, fontSize: '0.92rem' }}>
                    {sub.scoreObtained} / {sub.totalMarks} ({sub.percentage}%) [{sub.grade}]
                  </strong>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleOpenGrading(sub)}
                  style={{ 
                    width: '100%', 
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.75rem', 
                    borderRadius: '0.75rem', 
                    fontWeight: 800, 
                    fontSize: '0.88rem', 
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                  }}
                >
                  Evaluate / Grade Submission
                </button>

              </div>
            ))}
          </div>
        </>
      )}

      {/* ── CREATE / EDIT QUIZ MODAL ────────────────────────────── */}
      {showCreateModal && (
        <div className="admin-modal-container" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="admin-modal-card" style={{ background: '#FFFFFF', borderRadius: '1.75rem', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748B' }}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1.25rem 0' }}>
              {editingQuiz ? 'Edit Quiz Settings' : 'Create New Quiz / Examination'}
            </h2>

            <form onSubmit={handleSaveQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Quiz Title:</label>
                <input 
                  type="text" 
                  required
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Weekly Quiz #1: Modern HTML5 & Web Fundamentals"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Assessment Type:</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  >
                    <option value="weekly">Weekly Quiz</option>
                    <option value="monthly">Monthly Quiz</option>
                    <option value="practice">Practice Test</option>
                    <option value="mock">Grand Mock Test</option>
                    <option value="assignment">Practical Assignment</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Duration (Minutes):</label>
                  <input 
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    📅 Schedule Start Date &amp; Time (Unlock):
                  </label>
                  <input 
                    type="datetime-local" 
                    value={formData.startDate} 
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    🔒 Schedule End Date &amp; Time (Lock):
                  </label>
                  <input 
                    type="datetime-local" 
                    value={formData.endDate} 
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Description:</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Quiz Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QUESTION BUILDER STUDIO MODAL ───────────────────────── */}
      {editingQuestionsQuiz && (
        <div className="admin-modal-container" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="admin-modal-card" style={{ background: '#FFFFFF', borderRadius: '1.75rem', maxWidth: '850px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            
            <button onClick={() => setEditingQuestionsQuiz(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748B' }}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
              Question Builder Studio: {editingQuestionsQuiz.title}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1.5rem 0' }}>Add questions, define choices, correct answers, code snippets, and explanations.</p>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {questionsList.map((q, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>Q{idx + 1} • [{q.type}] • {q.points} Points</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '0.15rem 0 0 0' }}>{q.questionText}</h4>
                  </div>

                  <button onClick={() => handleRemoveQuestion(idx)} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Question Form */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #2563EB', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1D4ED8', margin: '0 0 1rem 0' }}>+ Add New Question</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <input 
                  type="text" 
                  placeholder="Question text..." 
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>Question Type:</label>
                    <select 
                      value={newQType}
                      onChange={(e) => setNewQType(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="mcq_single">MCQ (Single Choice)</option>
                      <option value="mcq_multi">MCQ (Multiple Answers)</option>
                      <option value="true_false">True / False</option>
                      <option value="fill_blank">Fill in the Blank</option>
                      <option value="code">Practical Code Assignment</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>Question Points (Marks):</label>
                    <input 
                      type="number" 
                      value={newQPoints}
                      onChange={(e) => setNewQPoints(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Multiple Choice Options Builder & Correct Answer Selection */}
                {newQType.startsWith('mcq') && (
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>Answer Choices &amp; Correct Answer Selection:</span>
                      <button
                        type="button"
                        onClick={() => setNewQOptions([...newQOptions, `Option ${newQOptions.length + 1}`])}
                        style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.25rem 0.6rem', borderRadius: '0.35rem', cursor: 'pointer' }}
                      >
                        + Add Choice
                      </button>
                    </div>

                    {newQOptions.map((opt, oIdx) => (
                      <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={newQCorrect === opt}
                          onChange={() => setNewQCorrect(opt)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: newQCorrect === opt ? '#059669' : '#64748B', minWidth: '70px' }}>
                          {newQCorrect === opt ? '✓ Correct:' : `Option ${oIdx + 1}:`}
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newQOptions];
                            updated[oIdx] = e.target.value;
                            if (newQCorrect === opt) setNewQCorrect(e.target.value);
                            setNewQOptions(updated);
                          }}
                          placeholder={`Text for Option ${oIdx + 1}`}
                          style={{ flex: 1, padding: '0.55rem', borderRadius: '0.5rem', border: newQCorrect === opt ? '2px solid #10B981' : '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                        {newQOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setNewQOptions(newQOptions.filter((_, i) => i !== oIdx))}
                            style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* True / False Selection */}
                {newQType === 'true_false' && (
                  <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>Correct Answer:</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" name="tfRadio" checked={newQCorrect === 'True'} onChange={() => setNewQCorrect('True')} /> True
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" name="tfRadio" checked={newQCorrect === 'False'} onChange={() => setNewQCorrect('False')} /> False
                    </label>
                  </div>
                )}

                <input 
                  type="text" 
                  placeholder="Teacher explanation shown post-quiz (optional)..." 
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />

                <button 
                  type="button" 
                  onClick={handleAddQuestion}
                  style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '0.65rem', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', alignSelf: 'flex-start' }}
                >
                  + Append Question
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setEditingQuestionsQuiz(null)} className="btn btn-secondary">Close Studio</button>
              <button onClick={handleSaveQuestionsStudio} className="btn btn-primary">Save All Questions</button>
            </div>

          </div>
        </div>
      )}

      {/* ── MANUAL EVALUATION MODAL ─────────────────────────────── */}
      {gradingSubmission && (
        <div className="admin-modal-container" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="admin-modal-card" style={{ background: '#FFFFFF', borderRadius: '1.75rem', maxWidth: '550px', width: '100%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setGradingSubmission(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748B' }}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
              Evaluate Student Submission
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>
              Candidate: <strong>{gradingSubmission.studentName}</strong> ({gradingSubmission.studentEmail})
            </p>

            <form onSubmit={handleSaveGrade} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Awarded Score Marks (Out of {gradingSubmission.totalMarks}):
                </label>
                <input 
                  type="number"
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Teacher Feedback &amp; Comments:
                </label>
                <textarea 
                  rows={4}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Enter comments for the student..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setGradingSubmission(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Grade &amp; Comments</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminQuizManager;
