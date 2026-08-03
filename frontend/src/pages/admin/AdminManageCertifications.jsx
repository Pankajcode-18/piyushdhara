import { useState, useEffect } from 'react';
import { 
  fetchCertificationsApi, 
  adminCreateCertificationApi, 
  adminGetFullCertificationForEditApi,
  adminUpdateCertificationApi,
  adminDeleteCertificationApi,
  adminCreateModuleApi, 
  adminDeleteModuleApi,
  adminCreateLessonApi, 
  adminUpdateLessonApi,
  adminDeleteLessonApi,
  adminGradeAssignmentApi,
  adminGetSubmissionsApi,
  fetchCertificationAnalyticsApi
} from '../../utils/api';
import { 
  Award, 
  Plus, 
  Layers, 
  BookOpen, 
  FileCheck, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Sparkles,
  Send,
  Eye,
  Settings,
  HelpCircle,
  Code,
  Download,
  Check,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  Clock,
  ShieldCheck
} from 'lucide-react';

const AdminManageCertifications = () => {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'analytics' | 'create' | 'studio' | 'submissions'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [certifications, setCertifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Selected certification for Studio Editing
  const [selectedCertId, setSelectedCertId] = useState(null);
  const [studioCert, setStudioCert] = useState(null);
  const [studioModules, setStudioModules] = useState([]);

  // --- CREATE / EDIT CERTIFICATION FORM STATE ---
  const [certForm, setCertForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    difficulty: 'Beginner',
    estimatedDuration: '10 Hours',
    language: 'English & Nepali',
    instructorName: 'Pankaj Baduwal',
    instructorDesignation: 'Lead Educator & Engineer',
    instructorPhoto: '/pankaj-baduwal.jpg',
    instructorBio: 'Lead computer science educator and engineer at PiyushDhara Prep Portal.',
    passingPercentage: 70,
    learningOutcomes: ['Build standard web pages', 'Master core concepts'],
    skillsGained: ['HTML5', 'CSS3', 'Web Dev'],
    prerequisites: ['Basic computer operation knowledge'],
    studyInstructions: ['Complete all lessons in order', 'Pass checkpoint quizzes'],
    finalExamTitle: 'Final Certification Assessment Exam',
    finalExamInstructions: 'Answer all questions to earn your verified credential.',
    finalExamTimeLimit: 20
  });

  // New item draft helpers
  const [newOutcome, setNewOutcome] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newPrereq, setNewPrereq] = useState('');

  // --- MODULE BUILDER STATE ---
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [modTitle, setModTitle] = useState('');
  const [modDescription, setModDescription] = useState('');

  // --- LESSON BUILDER STATE ---
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    estimatedTimeMinutes: 20,
    contentHtml: '<h3>Lesson Overview</h3><p>Write your detailed lesson HTML content here...</p>',
    videoUrl: '',
    hasQuiz: false,
    quizTitle: 'Lesson Checkpoint Quiz',
    quizPassingPct: 70,
    quizQuestions: [],
    hasAssignment: false,
    assignmentTitle: 'Practical Exercise',
    assignmentInstructions: 'Write standard code based on lesson concepts.',
    assignmentMaxMarks: 20,
    sampleCodeTemplate: '<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>'
  });

  // Draft Quiz Question State
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('mcq'); // 'mcq' | 'multi' | 'tf'
  const [qOptions, setQOptions] = useState(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
  const [qCorrect, setQCorrect] = useState(['Option 1']);
  const [qExplanation, setQExplanation] = useState('');
  const [qPoints, setQPoints] = useState(10);

  // --- GRADING MODAL STATE ---
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeMarks, setGradeMarks] = useState(20);
  const [gradeStatus, setGradeStatus] = useState('graded');
  const [gradeFeedback, setGradeFeedback] = useState('Great practical code implementation!');

  // Load all initial admin data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const certRes = await fetchCertificationsApi();
      setCertifications(certRes.data || []);

      const analyticsRes = await fetchCertificationAnalyticsApi();
      setAnalytics(analyticsRes.analytics);

      const subRes = await adminGetSubmissionsApi();
      setSubmissions(subRes.submissions || []);
    } catch (err) {
      console.error('Admin LMS fetch error:', err);
      setError('Failed to load admin certification data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Open Studio for a specific Certification
  const handleOpenStudio = async (certId) => {
    try {
      setLoading(true);
      setError('');
      setSelectedCertId(certId);
      const res = await adminGetFullCertificationForEditApi(certId);
      setStudioCert(res.certification);
      setStudioModules(res.modules || []);

      // Populate certForm for editing overview
      const c = res.certification;
      setCertForm({
        title: c.title || '',
        subtitle: c.subtitle || '',
        description: c.description || '',
        thumbnail: c.thumbnail || '',
        banner: c.banner || '',
        category: c.category || 'Web Development',
        difficulty: c.difficulty || 'Beginner',
        estimatedDuration: c.estimatedDuration || '10 Hours',
        language: c.language || 'English & Nepali',
        instructorName: c.instructor?.name || 'Pankaj Baduwal',
        instructorDesignation: c.instructor?.designation || 'Lead Educator & Engineer',
        instructorPhoto: c.instructor?.photo || '/pankaj-baduwal.jpg',
        instructorBio: c.instructor?.bio || 'Lead computer science educator and engineer at PiyushDhara Prep Portal.',
        passingPercentage: c.assessmentRules?.passingPercentage || 70,
        learningOutcomes: c.learningOutcomes || [],
        skillsGained: c.skillsGained || [],
        prerequisites: c.prerequisites || [],
        studyInstructions: c.studyInstructions || [],
        finalExamTitle: c.finalExam?.title || 'Final Certification Exam',
        finalExamInstructions: c.finalExam?.instructions || 'Answer all questions to earn credential.',
        finalExamTimeLimit: c.finalExam?.timeLimitMinutes || 20
      });

      setActiveTab('studio');
    } catch (err) {
      setError(err.message || 'Failed to open course studio');
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Overview Form for a specific Certification directly
  const handleOpenEditOverview = async (certId) => {
    try {
      setLoading(true);
      setError('');
      setSelectedCertId(certId);
      const res = await adminGetFullCertificationForEditApi(certId);
      const c = res.certification;
      setCertForm({
        title: c.title || '',
        subtitle: c.subtitle || '',
        description: c.description || '',
        thumbnail: c.thumbnail || '',
        banner: c.banner || '',
        category: c.category || 'Web Development',
        difficulty: c.difficulty || 'Beginner',
        estimatedDuration: c.estimatedDuration || '10 Hours',
        language: c.language || 'English & Nepali',
        instructorName: c.instructor?.name || 'Pankaj Baduwal',
        instructorDesignation: c.instructor?.designation || 'Lead Educator & Engineer',
        instructorPhoto: c.instructor?.photo || '/pankaj-baduwal.jpg',
        instructorBio: c.instructor?.bio || 'Lead computer science educator and engineer at PiyushDhara Prep Portal.',
        passingPercentage: c.assessmentRules?.passingPercentage || 70,
        learningOutcomes: c.learningOutcomes || [],
        skillsGained: c.skillsGained || [],
        prerequisites: c.prerequisites || [],
        studyInstructions: c.studyInstructions || [],
        finalExamTitle: c.finalExam?.title || 'Final Certification Exam',
        finalExamInstructions: c.finalExam?.instructions || 'Answer all questions to earn credential.',
        finalExamTimeLimit: c.finalExam?.timeLimitMinutes || 20
      });
      setActiveTab('create');
    } catch (err) {
      setError(err.message || 'Failed to open course overview edit form');
    } finally {
      setLoading(false);
    }
  };

  // Create New Certification Overview
  const handleSaveCertificationOverview = async (e) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      
      const payload = {
        title: certForm.title.trim(),
        subtitle: certForm.subtitle.trim(),
        description: certForm.description.trim(),
        thumbnail: certForm.thumbnail,
        banner: certForm.banner,
        category: certForm.category,
        difficulty: certForm.difficulty,
        estimatedDuration: certForm.estimatedDuration,
        language: certForm.language,
        instructor: {
          name: certForm.instructorName || 'Pankaj Baduwal',
          designation: certForm.instructorDesignation || 'Lead Educator & Engineer',
          photo: certForm.instructorPhoto || '/pankaj-baduwal.jpg',
          bio: certForm.instructorBio || 'Lead computer science educator and engineer at PiyushDhara Prep Portal.'
        },
        learningOutcomes: certForm.learningOutcomes,
        skillsGained: certForm.skillsGained,
        prerequisites: certForm.prerequisites,
        studyInstructions: certForm.studyInstructions,
        assessmentRules: { passingPercentage: Number(certForm.passingPercentage) },
        finalExam: {
          title: certForm.finalExamTitle,
          instructions: certForm.finalExamInstructions,
          timeLimitMinutes: Number(certForm.finalExamTimeLimit)
        }
      };

      if (selectedCertId && activeTab === 'studio') {
        await adminUpdateCertificationApi(selectedCertId, payload);
        setSuccessMsg('✅ Certification Course overview updated successfully!');
      } else {
        const res = await adminCreateCertificationApi(payload);
        setSuccessMsg('✅ Certification Course created! Opening Studio...');
        handleOpenStudio(res.certification._id);
      }

      loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to save certification overview');
    } finally {
      setLoading(false);
    }
  };

  // Delete Certification Course
  const handleDeleteCertification = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" and all its modules/lessons?`)) return;
    try {
      setLoading(true);
      await adminDeleteCertificationApi(id);
      setSuccessMsg(`Deleted "${title}" successfully.`);
      if (selectedCertId === id) setActiveTab('courses');
      loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to delete course');
      setLoading(false);
    }
  };

  // --- MODULE ACTIONS ---
  const handleAddModuleSubmit = async (e) => {
    e.preventDefault();
    if (!modTitle.trim()) return;
    try {
      setLoading(true);
      await adminCreateModuleApi(selectedCertId, {
        title: modTitle.trim(),
        description: modDescription.trim()
      });
      setModTitle('');
      setModDescription('');
      setShowAddModuleModal(false);
      setSuccessMsg('✅ Module added successfully!');
      handleOpenStudio(selectedCertId);
    } catch (err) {
      setError(err.message || 'Failed to add module');
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId, title) => {
    if (!window.confirm(`Delete module "${title}" and all its lessons?`)) return;
    try {
      setLoading(true);
      await adminDeleteModuleApi(moduleId);
      setSuccessMsg('Module deleted!');
      handleOpenStudio(selectedCertId);
    } catch (err) {
      setError(err.message || 'Failed to delete module');
      setLoading(false);
    }
  };

  // --- LESSON ACTIONS ---
  const handleOpenAddLessonModal = (moduleId) => {
    setSelectedModuleIdForLesson(moduleId);
    setEditingLessonId(null);
    setLessonForm({
      title: '',
      description: '',
      estimatedTimeMinutes: 20,
      contentHtml: '<h3>Lesson Title</h3><p>Write lesson content here...</p>',
      videoUrl: '',
      hasQuiz: false,
      quizTitle: 'Lesson Checkpoint Quiz',
      quizPassingPct: 70,
      quizQuestions: [],
      hasAssignment: false,
      assignmentTitle: 'Practical Exercise',
      assignmentInstructions: 'Write standard code based on lesson concepts.',
      assignmentMaxMarks: 20,
      sampleCodeTemplate: '<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>'
    });
    setShowLessonModal(true);
  };

  const handleOpenEditLessonModal = (lesson) => {
    setSelectedModuleIdForLesson(lesson.moduleId);
    setEditingLessonId(lesson._id);
    setLessonForm({
      title: lesson.title || '',
      description: lesson.description || '',
      estimatedTimeMinutes: lesson.estimatedTimeMinutes || 20,
      contentHtml: lesson.contentHtml || '',
      videoUrl: lesson.videoUrl || '',
      hasQuiz: lesson.hasQuiz || false,
      quizTitle: lesson.quiz?.title || 'Lesson Checkpoint Quiz',
      quizPassingPct: lesson.quiz?.passingPercentage || 70,
      quizQuestions: lesson.quiz?.questions || [],
      hasAssignment: lesson.hasAssignment || false,
      assignmentTitle: lesson.assignment?.title || 'Practical Exercise',
      assignmentInstructions: lesson.assignment?.instructions || 'Write code...',
      assignmentMaxMarks: lesson.assignment?.maxMarks || 20,
      sampleCodeTemplate: lesson.assignment?.sampleCodeTemplate || ''
    });
    setShowLessonModal(true);
  };

  // Add question to draft quiz
  const handleAddQuestionToQuiz = () => {
    if (!qText.trim()) return;
    const newQ = {
      questionText: qText.trim(),
      type: qType,
      options: qOptions.filter(o => o.trim()),
      correctAnswers: qCorrect,
      explanation: qExplanation,
      points: Number(qPoints)
    };
    setLessonForm({
      ...lessonForm,
      quizQuestions: [...lessonForm.quizQuestions, newQ]
    });
    setQText('');
    setQExplanation('');
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      alert('Lesson Title is required');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim(),
        estimatedTimeMinutes: Number(lessonForm.estimatedTimeMinutes),
        contentHtml: lessonForm.contentHtml,
        videoUrl: lessonForm.videoUrl,
        hasQuiz: lessonForm.hasQuiz,
        quiz: lessonForm.hasQuiz ? {
          title: lessonForm.quizTitle,
          passingPercentage: Number(lessonForm.quizPassingPct),
          questions: lessonForm.quizQuestions
        } : null,
        hasAssignment: lessonForm.hasAssignment,
        assignment: lessonForm.hasAssignment ? {
          title: lessonForm.assignmentTitle,
          instructions: lessonForm.assignmentInstructions,
          maxMarks: Number(lessonForm.assignmentMaxMarks),
          sampleCodeTemplate: lessonForm.sampleCodeTemplate
        } : null
      };

      if (editingLessonId) {
        await adminUpdateLessonApi(editingLessonId, payload);
        setSuccessMsg('✅ Lesson updated!');
      } else {
        await adminCreateLessonApi(selectedModuleIdForLesson, payload);
        setSuccessMsg('✅ Lesson created!');
      }

      setShowLessonModal(false);
      handleOpenStudio(selectedCertId);
    } catch (err) {
      setError(err.message || 'Failed to save lesson');
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      setLoading(true);
      await adminDeleteLessonApi(lessonId);
      setSuccessMsg('Lesson deleted!');
      handleOpenStudio(selectedCertId);
    } catch (err) {
      setError(err.message || 'Failed to delete lesson');
      setLoading(false);
    }
  };

  // --- SUBMISSION GRADING ACTIONS ---
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    try {
      setLoading(true);
      await adminGradeAssignmentApi(selectedSubmission._id, {
        status: gradeStatus,
        marksObtained: Number(gradeMarks),
        feedback: gradeFeedback,
        gradedBy: 'Admin Teacher'
      });
      setSuccessMsg('✅ Student Assignment Graded Successfully!');
      setSelectedSubmission(null);
      loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to grade submission');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>

      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#FFFFFF', padding: '1.5rem 2rem', borderRadius: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award color="#2563EB" size={28} /> Certification LMS Studio
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
            Full Admin Studio: Build Certification Courses, Modules, Rich Lessons, Quizzes &amp; Assignments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('courses')}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '0.75rem',
              border: activeTab === 'courses' ? '1px solid #BFDBFE' : '1px solid #CBD5E1',
              background: activeTab === 'courses' ? '#EFF6FF' : '#FFFFFF',
              color: activeTab === 'courses' ? '#1D4ED8' : '#475569',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            All Certifications ({certifications.length})
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '0.75rem',
              border: activeTab === 'submissions' ? '1px solid #BFDBFE' : '1px solid #CBD5E1',
              background: activeTab === 'submissions' ? '#EFF6FF' : '#FFFFFF',
              color: activeTab === 'submissions' ? '#1D4ED8' : '#475569',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            Submissions &amp; Grading ({submissions.filter(s => s.status === 'pending').length} Pending)
          </button>

          <button
            onClick={() => {
              setSelectedCertId(null);
              setCertForm({
                title: '', subtitle: '', description: '', thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80', banner: '', category: 'Web Development', difficulty: 'Beginner', estimatedDuration: '10 Hours', language: 'English & Nepali', passingPercentage: 70, learningOutcomes: ['Build web pages'], skillsGained: ['HTML5'], prerequisites: ['Computer navigation'], studyInstructions: ['Complete lessons in order'], finalExamTitle: 'Final Certification Exam', finalExamInstructions: 'Answer questions to earn credential.', finalExamTimeLimit: 20
              });
              setActiveTab('create');
            }}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Plus size={16} /> New Certification
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '1rem 1.25rem', borderRadius: '0.85rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', color: '#166534', padding: '1rem 1.25rem', borderRadius: '0.85rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}

      {/* ── TAB 1: ALL CERTIFICATIONS LIST ──────────────────────── */}
      {activeTab === 'courses' && (
        <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1.25rem 0' }}>
            Published Certification Courses
          </h2>

          {certifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
              <Award size={48} color="#94A3B8" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.5rem 0' }}>No Certifications Found</h3>
              <p style={{ margin: 0 }}>Click "New Certification" above to create your first certification course!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {certifications.map((cert) => (
                <div key={cert._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <img src={cert.thumbnail} alt={cert.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '0.75rem' }} />
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>[{cert.category}]</span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.1rem 0 0.35rem 0' }}>{cert.title}</h3>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                        <span>Difficulty: <strong>{cert.difficulty}</strong></span>
                        <span>Duration: <strong>{cert.estimatedDuration}</strong></span>
                        <span>Enrolled: <strong>{cert.enrolledCount || 0} students</strong></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      onClick={() => handleOpenEditOverview(cert._id)}
                      style={{ padding: '0.6rem 0.95rem', borderRadius: '0.75rem', border: '1px solid #BFDBFE', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit3 size={15} /> Edit Info
                    </button>

                    <button
                      onClick={() => handleOpenStudio(cert._id)}
                      style={{ padding: '0.6rem 1.1rem', borderRadius: '0.75rem', border: 'none', background: '#2563EB', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
                    >
                      <Layers size={16} /> Manage Modules &amp; Lessons Studio
                    </button>

                    <a 
                      href={`/certifications/${cert.slug}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ padding: '0.6rem 0.9rem', borderRadius: '0.75rem', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Eye size={14} /> Preview
                    </a>

                    <button
                      onClick={() => handleDeleteCertification(cert._id, cert.title)}
                      style={{ padding: '0.6rem 0.85rem', borderRadius: '0.75rem', border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ── TAB 2: CERTIFICATION STUDIO WORKSPACE ───────────────── */}
      {activeTab === 'studio' && studioCert && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Studio Top Info Bar */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '2rem', borderRadius: '1.5rem', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span style={{ background: '#2563EB', color: 'white', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                {studioCert.category} &bull; {studioCert.difficulty}
              </span>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0.5rem 0 0.25rem 0' }}>{studioCert.title}</h1>
              <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.9rem' }}>{studioCert.subtitle || studioCert.description}</p>
            </div>

            <button
              onClick={() => setShowAddModuleModal(true)}
              style={{ background: '#059669', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.85rem', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(5,150,105,0.3)' }}
            >
              <Plus size={18} /> Add New Course Module
            </button>
          </div>

          {/* Modules & Lessons Hierarchy Tree */}
          <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1.5rem 0' }}>
              Course Modules &amp; Interactive Lessons ({studioModules.length} Modules)
            </h2>

            {studioModules.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
                <p style={{ fontWeight: 700 }}>No modules added yet. Click "+ Add New Course Module" above.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {studioModules.map((mod, mIdx) => (
                  <div key={mod._id} style={{ border: '1.5px solid #CBD5E1', borderRadius: '1.25rem', padding: '1.5rem', background: '#F8FAFC' }}>
                    
                    {/* Module Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                          Module {mIdx + 1}: {mod.title}
                        </h3>
                        {mod.description && <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>{mod.description}</p>}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenAddLessonModal(mod._id)}
                          style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.55rem 1rem', borderRadius: '0.65rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Plus size={15} /> Add Lesson to Module
                        </button>
                        <button
                          onClick={() => handleDeleteModule(mod._id, mod.title)}
                          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2', padding: '0.55rem 0.85rem', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Lessons List inside Module */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem' }}>
                      {mod.lessons && mod.lessons.length > 0 ? (
                        mod.lessons.map((les, lIdx) => (
                          <div key={les._id} style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '0.85rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
                                Lesson {lIdx + 1}: {les.title}
                              </h4>
                              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                                <span>Duration: {les.estimatedTimeMinutes} mins</span>
                                {les.hasQuiz && <span style={{ color: '#D97706', fontWeight: 800 }}>✓ Quiz Included</span>}
                                {les.hasAssignment && <span style={{ color: '#7C3AED', fontWeight: 800 }}>✓ Practical Assignment Included</span>}
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleOpenEditLessonModal(les)}
                                style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.45rem 0.85rem', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                              >
                                <Edit3 size={14} /> Edit Content &amp; Quiz
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(les._id, les.title)}
                                style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2', padding: '0.45rem 0.65rem', borderRadius: '0.65rem', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic', margin: 0 }}>No lessons added to this module yet.</p>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ── TAB 3: CREATE / EDIT OVERVIEW FORM ───────────────────── */}
      {activeTab === 'create' && (
        <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2.5rem', maxWidth: '900px' }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1.5rem 0' }}>
            Certification Overview &amp; Final Assessment Settings
          </h2>

          <form onSubmit={handleSaveCertificationOverview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Course Title *</label>
              <input type="text" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Subtitle Summary</label>
              <input type="text" value={certForm.subtitle} onChange={(e) => setCertForm({ ...certForm, subtitle: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Description *</label>
              <textarea rows={4} value={certForm.description} onChange={(e) => setCertForm({ ...certForm, description: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Thumbnail & Banner Image Selection Section */}
            <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🖼️ Certification Thumbnail &amp; Banner Cover Image
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.25rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '140px', height: '95px', borderRadius: '0.75rem', border: '2px solid #CBD5E1', overflow: 'hidden', background: '#E2E8F0', position: 'relative' }}>
                  <img
                    src={certForm.thumbnail || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80'}
                    alt="Thumbnail Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80'; }}
                  />
                  <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', fontWeight: 800 }}>PREVIEW</span>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', margin: 0 }}>Thumbnail Image</label>
                    <label
                      htmlFor="cert-thumbnail-upload"
                      style={{
                        padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: '#2563EB', color: '#FFF',
                        fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                      }}
                    >
                      📁 Upload Local Image File
                    </label>
                    <input
                      id="cert-thumbnail-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCertForm((prev) => ({ ...prev, thumbnail: reader.result, banner: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Or paste image URL (https://...)"
                    value={certForm.thumbnail}
                    onChange={(e) => setCertForm({ ...certForm, thumbnail: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', marginBottom: '0.5rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Upload from computer, paste image URL, or choose a topic preset below:</p>
                </div>
              </div>

              {/* Quick Image Presets */}
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>Quick Topic Presets (1-Click Selection):</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {[
                    { label: 'HTML5', url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80' },
                    { label: 'CSS3', url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80' },
                    { label: 'JavaScript', url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80' },
                    { label: 'React.js', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Node.js', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Python', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Cyber Security', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setCertForm({ ...certForm, thumbnail: p.url, banner: p.url })}
                      style={{
                        padding: '0.3rem 0.65rem', borderRadius: '0.375rem',
                        border: certForm.thumbnail === p.url ? '1px solid #2563EB' : '1px solid #CBD5E1',
                        background: certForm.thumbnail === p.url ? '#EFF6FF' : '#FFFFFF',
                        color: certForm.thumbnail === p.url ? '#1D4ED8' : '#334155',
                        fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Category</label>
                <select value={certForm.category} onChange={(e) => setCertForm({ ...certForm, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1' }}>
                  <option value="Web Development">Web Development</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="IOE Preparation">IOE Preparation</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Difficulty</label>
                <select value={certForm.difficulty} onChange={(e) => setCertForm({ ...certForm, difficulty: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1' }}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Passing Benchmark %</label>
                <input type="number" value={certForm.passingPercentage} onChange={(e) => setCertForm({ ...certForm, passingPercentage: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Estimated Duration (e.g. 10 Hours)</label>
                <input type="text" value={certForm.estimatedDuration} onChange={(e) => setCertForm({ ...certForm, estimatedDuration: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Language (e.g. English & Nepali)</label>
                <input type="text" value={certForm.language} onChange={(e) => setCertForm({ ...certForm, language: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1' }} />
              </div>
            </div>

            {/* Instructor Details Section */}
            <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                👨‍🏫 Course Instructor &amp; Certificate Signature
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem', alignItems: 'center', marginBottom: '1rem' }}>
                {/* Live Teacher Photo Preview */}
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #2563EB', overflow: 'hidden', background: '#E2E8F0' }}>
                  <img
                    src={certForm.instructorPhoto || '/pankaj-baduwal.jpg'}
                    alt={certForm.instructorName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                    onError={(e) => { e.target.src = '/pankaj-baduwal.jpg'; }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Select Platform Teacher / Instructor Preset:</label>
                  <select
                    value={
                      certForm.instructorName.includes('Gaurav') ? 'Gaurav' :
                      certForm.instructorName.includes('Pankaj') ? 'Pankaj' : 'Custom'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Pankaj') {
                        setCertForm({
                          ...certForm,
                          instructorName: 'Pankaj Baduwal',
                          instructorDesignation: 'Lead Educator & Engineer',
                          instructorPhoto: '/pankaj-baduwal.jpg',
                          instructorBio: 'Lead computer science educator and engineer at PiyushDhara Prep Portal.'
                        });
                      } else if (val === 'Gaurav') {
                        setCertForm({
                          ...certForm,
                          instructorName: 'Er. Gaurav Sir',
                          instructorDesignation: 'Senior Educator & Mathematics Specialist',
                          instructorPhoto: '/gaurov.jpeg',
                          instructorBio: 'Senior Educator and Founder at PiyushDhara, specializing in Mathematics & Entrance Prep.'
                        });
                      }
                    }}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
                  >
                    <option value="Pankaj">Pankaj Baduwal (Lead Educator & Engineer)</option>
                    <option value="Gaurav">Er. Gaurav Sir (Senior Educator & Math Specialist)</option>
                    <option value="Custom">Custom Teacher Profile...</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Instructor Name</label>
                  <input type="text" value={certForm.instructorName} onChange={(e) => setCertForm({ ...certForm, instructorName: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Designation Title</label>
                  <input type="text" value={certForm.instructorDesignation} onChange={(e) => setCertForm({ ...certForm, instructorDesignation: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', margin: 0 }}>Teacher Photo URL / Upload</label>
                  <label
                    htmlFor="teacher-photo-upload"
                    style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D4ED8', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.2rem 0.5rem', borderRadius: '0.35rem', cursor: 'pointer' }}
                  >
                    📁 Upload Teacher Photo
                  </label>
                  <input
                    id="teacher-photo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCertForm((prev) => ({ ...prev, instructorPhoto: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="/pankaj-baduwal.jpg or image URL..."
                  value={certForm.instructorPhoto}
                  onChange={(e) => setCertForm({ ...certForm, instructorPhoto: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Skills Gained List Manager */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Skills &amp; Outcomes You'll Gain</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. CSS Flexbox"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSkill.trim()) {
                      setCertForm({ ...certForm, skillsGained: [...certForm.skillsGained, newSkill.trim()] });
                      setNewSkill('');
                    }
                  }}
                  style={{ padding: '0.65rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  + Add Skill
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {certForm.skillsGained.map((sk, idx) => (
                  <span key={idx} style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '0.3rem 0.65rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    ✓ {sk}
                    <button type="button" onClick={() => setCertForm({ ...certForm, skillsGained: certForm.skillsGained.filter((_, i) => i !== idx) })} style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer', fontWeight: 900 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '0.85rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              Save Certification Course
            </button>

          </form>
        </div>
      )}

      {/* ── TAB 4: SUBMISSIONS & GRADING HUB ────────────────────── */}
      {activeTab === 'submissions' && (
        <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1.25rem 0' }}>
            Student Practical Code Submissions
          </h2>

          {submissions.length === 0 ? (
            <p style={{ color: '#64748B' }}>No student assignment submissions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map((sub) => (
                <div key={sub._id} style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: sub.status === 'graded' ? '#059669' : '#D97706', textTransform: 'uppercase' }}>
                      [{sub.status}]
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0.2rem 0' }}>{sub.studentName} ({sub.studentEmail})</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Submitted at: {new Date(sub.submittedAt).toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setGradeMarks(sub.marksObtained || 20);
                      setGradeFeedback(sub.feedback || 'Good work!');
                    }}
                    style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Review Code &amp; Grade
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL 1: ADD MODULE ────────────────────────────────── */}
      {showAddModuleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1.25rem 0' }}>Add Module to Course</h3>
            <form onSubmit={handleAddModuleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Module Title *</label>
                <input type="text" value={modTitle} onChange={(e) => setModTitle(e.target.value)} required placeholder="e.g. Module 3: Advanced HTML5 APIs" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Module Description</label>
                <textarea rows={3} value={modDescription} onChange={(e) => setModDescription(e.target.value)} placeholder="Overview of topics covered..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModuleModal(false)} style={{ background: '#F1F5F9', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#059669', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>Create Module</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ADD / EDIT LESSON WITH QUIZ & ASSIGNMENT BUILDER ─ */}
      {showLessonModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '1.75rem', padding: '2.25rem', maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {editingLessonId ? 'Edit Lesson & Interactive Quizzes' : 'Create New Lesson in Module'}
              </h2>
              <button onClick={() => setShowLessonModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>

            <form onSubmit={handleLessonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Lesson Title *</label>
                <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Rich Lesson Content (HTML Format) *</label>
                <textarea rows={6} value={lessonForm.contentHtml} onChange={(e) => setLessonForm({ ...lessonForm, contentHtml: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', fontFamily: 'monospace', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Video Embed URL</label>
                  <input type="text" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Estimated Time (Minutes)</label>
                  <input type="number" value={lessonForm.estimatedTimeMinutes} onChange={(e) => setLessonForm({ ...lessonForm, estimatedTimeMinutes: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Checkpoint Quiz Builder Section */}
              <div style={{ border: '1.5px solid #FEF3C7', background: '#FFFBEB', borderRadius: '1rem', padding: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 800, color: '#92400E', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input type="checkbox" checked={lessonForm.hasQuiz} onChange={(e) => setLessonForm({ ...lessonForm, hasQuiz: e.target.checked })} />
                  <span>Attach Checkpoint Quiz to this Lesson</span>
                </label>

                {lessonForm.hasQuiz && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #FDE68A' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#78350F' }}>Questions in Quiz ({lessonForm.quizQuestions.length})</h4>
                      {lessonForm.quizQuestions.map((q, idx) => (
                        <div key={idx} style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.3rem' }}>
                          <strong>Q{idx + 1}:</strong> {q.questionText} ({q.options.length} options)
                        </div>
                      ))}

                      {/* Add Question Sub-form */}
                      <div style={{ borderTop: '1px dashed #FDE68A', paddingTop: '0.85rem', marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <input type="text" placeholder="Enter Question text..." value={qText} onChange={(e) => setQText(e.target.value)} style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                        
                        {/* 4 Options & Correct Answer Selector */}
                        <div style={{ background: '#FFF', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #FDE68A', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#78350F' }}>Answer Choices &amp; Correct Option Radio:</span>
                          {qOptions.map((opt, oIdx) => (
                            <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <input
                                type="radio"
                                name="lesQCorrectRadio"
                                checked={qCorrect.includes(opt)}
                                onChange={() => setQCorrect([opt])}
                                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: qCorrect.includes(opt) ? '#059669' : '#64748B', minWidth: '65px' }}>
                                {qCorrect.includes(opt) ? '✓ Correct:' : `Opt ${oIdx + 1}:`}
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...qOptions];
                                  updated[oIdx] = e.target.value;
                                  if (qCorrect.includes(opt)) setQCorrect([e.target.value]);
                                  setQOptions(updated);
                                }}
                                placeholder={`Choice ${oIdx + 1}`}
                                style={{ flex: 1, padding: '0.45rem', borderRadius: '0.375rem', border: qCorrect.includes(opt) ? '2px solid #10B981' : '1px solid #CBD5E1', fontSize: '0.82rem' }}
                              />
                            </div>
                          ))}
                        </div>

                        <input type="text" placeholder="Explanation (optional)..." value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} style={{ padding: '0.55rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.82rem' }} />

                        <button type="button" onClick={handleAddQuestionToQuiz} style={{ background: '#D97706', color: 'white', border: 'none', padding: '0.55rem 1rem', borderRadius: '0.5rem', fontWeight: 800, alignSelf: 'flex-start', cursor: 'pointer' }}>+ Add Question to Quiz</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Practical Assignment Builder Section */}
              <div style={{ border: '1.5px solid #F3E8FF', background: '#FAF5FF', borderRadius: '1rem', padding: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 800, color: '#6B21A8', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input type="checkbox" checked={lessonForm.hasAssignment} onChange={(e) => setLessonForm({ ...lessonForm, hasAssignment: e.target.checked })} />
                  <span>Attach Practical Code Assignment to this Lesson</span>
                </label>

                {lessonForm.hasAssignment && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input type="text" placeholder="Assignment Title" value={lessonForm.assignmentTitle} onChange={(e) => setLessonForm({ ...lessonForm, assignmentTitle: e.target.value })} style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                    <textarea rows={3} placeholder="Assignment Instructions..." value={lessonForm.assignmentInstructions} onChange={(e) => setLessonForm({ ...lessonForm, assignmentInstructions: e.target.value })} style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowLessonModal(false)} style={{ background: '#F1F5F9', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>Save Lesson</button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ── MODAL 3: GRADE STUDENT ASSIGNMENT SUBMISSION ────────── */}
      {selectedSubmission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '1.75rem', padding: '2rem', maxWidth: '650px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1rem 0' }}>
              Grade Submission for {selectedSubmission.studentName}
            </h3>

            <div style={{ background: '#0F172A', color: '#38BDF8', padding: '1rem', borderRadius: '0.85rem', fontFamily: 'monospace', fontSize: '0.85rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              <pre style={{ margin: 0 }}><code>{selectedSubmission.codeContent || 'Text submission content...'}</code></pre>
            </div>

            <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Marks Awarded (Out of 20)</label>
                <input type="number" value={gradeMarks} onChange={(e) => setGradeMarks(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Teacher Feedback Comment</label>
                <textarea rows={3} value={gradeFeedback} onChange={(e) => setGradeFeedback(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSelectedSubmission(null)} style={{ background: '#F1F5F9', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#059669', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>Submit Grade</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminManageCertifications;
