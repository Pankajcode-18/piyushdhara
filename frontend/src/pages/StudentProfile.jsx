import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  getStudentProfileApi, 
  updateStudentProfileApi, 
  getFileUrl, 
  getCourseThumbnail, 
  fetchStudentCertificationsApi,
  fetchStudentQuizAttemptsApi 
} from '../utils/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Flame, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ShieldCheck, 
  Edit3, 
  Save, 
  KeyRound, 
  LogOut, 
  ArrowRight, 
  Compass, 
  PlayCircle,
  Briefcase,
  Target,
  Heart,
  Calendar,
  Building,
  Globe,
  FileText,
  HelpCircle,
  Trophy
} from 'lucide-react';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, triggerPasswordReset, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'certifications', 'quizzes', 'edit', 'settings'
  const [editSection, setEditSection] = useState('personal'); // 'personal', 'academic', 'goals'
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    country: 'Nepal',
    postalCode: '',
    school: '',
    grade: '',
    board: '',
    stream: '',
    graduationYear: '',
    interests: '',
    skills: '',
    favoriteSubjects: '',
    learningGoals: '',
    careerPlan: '',
    dreamCollege: '',
    dreamJob: '',
    bio: ''
  });

  const [myCertRecords, setMyCertRecords] = useState([]);
  const [myCertificates, setMyCertificates] = useState([]);
  const [myQuizAttempts, setMyQuizAttempts] = useState([]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getStudentProfileApi();
      if (data && data.user) {
        setUserProfile(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        const u = data.user;
        setFormData({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          gender: u.gender || '',
          dob: u.dob || '',
          address: u.address || '',
          city: u.city || '',
          state: u.state || '',
          country: u.country || 'Nepal',
          postalCode: u.postalCode || '',
          school: u.school || '',
          grade: u.grade || '',
          board: u.board || '',
          stream: u.stream || '',
          graduationYear: u.graduationYear || '',
          interests: Array.isArray(u.interests) ? u.interests.join(', ') : u.interests || '',
          skills: Array.isArray(u.skills) ? u.skills.join(', ') : u.skills || '',
          favoriteSubjects: Array.isArray(u.favoriteSubjects) ? u.favoriteSubjects.join(', ') : u.favoriteSubjects || '',
          learningGoals: u.learningGoals || '',
          careerPlan: u.careerPlan || '',
          dreamCollege: u.dreamCollege || '',
          dreamJob: u.dreamJob || '',
          bio: u.bio || ''
        });

        // Load student certifications & quiz attempts
        if (u.email) {
          try {
            const certRes = await fetchStudentCertificationsApi(u.email);
            setMyCertRecords(certRes.progressRecords || []);
            setMyCertificates(certRes.certificates || []);
          } catch (cErr) {
            console.error('Certifications load error:', cErr);
          }

          try {
            const quizRes = await fetchStudentQuizAttemptsApi(u.email);
            setMyQuizAttempts(quizRes.submissions || []);
          } catch (qErr) {
            console.error('Quiz attempts load error:', qErr);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      setMsg({ type: '', text: '' });
      const photoData = new FormData();
      photoData.append('photo', file);

      const res = await updateStudentProfileApi(photoData);
      if (res && res.user) {
        setUserProfile(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        setMsg({ type: 'success', text: 'Profile photo updated successfully!' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to upload profile photo' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg({ type: '', text: '' });

      const res = await updateStudentProfileApi(formData);
      if (res && res.user) {
        setUserProfile(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        setMsg({ type: 'success', text: 'Profile information updated successfully!' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setMsg({ type: '', text: '' });
      await triggerPasswordReset(formData.email || userProfile?.email);
      setMsg({ type: 'success', text: `Password reset email sent to ${formData.email || userProfile?.email}!` });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to send password reset email' });
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <GraduationCap size={48} color="#2563EB" className="animate-spin" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#475569' }}>Loading your personalized profile...</h3>
      </div>
    );
  }

  const u = userProfile || {};
  const completion = u.completionStats || { percentage: 30, badge: 'New Student', checklist: [] };
  const enrolledBatches = u.enrolledCourses || [];

  // Member Since date
  const memberSince = u.createdAt 
    ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'July 2026';

  return (
    <div className="student-profile-page bg-mesh animate-fade-in" style={{ minHeight: '92vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1150px' }}>
        
        {/* Alerts */}
        {msg.text && (
          <div 
            style={{ 
              padding: '1rem 1.25rem', 
              borderRadius: '1rem', 
              marginBottom: '1.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 700,
              background: msg.type === 'success' ? '#F0FDF4' : '#FEF2F2',
              color: msg.type === 'success' ? '#166534' : '#DC2626',
              border: msg.type === 'success' ? '1px solid #DCFCE7' : '1px solid #FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}
          >
            <span>{msg.type === 'success' ? '✅' : '⚠️'} {msg.text}</span>
            <button onClick={() => setMsg({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
          </div>
        )}

        {/* ── 1. HEADER PROFILE HERO CARD (DARK THEME) ──────────────── */}
        <div 
          className="card profile-hero-card" 
          style={{ 
            borderRadius: '2rem', 
            padding: '2.5rem', 
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0B132B 100%)', 
            color: '#FFFFFF', 
            marginBottom: '2.5rem',
            border: '1.5px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.7)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Ambient Glow decoration */}
          <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', bottom: '-40%', left: '-10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>

          <div className="profile-hero-grid" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* Profile Avatar with Photo Upload Button */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', 
                  padding: '4px',
                  boxShadow: '0 0 25px rgba(56,189,248,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  overflow: 'hidden',
                  border: '3px solid #38BDF8'
                }}
              >
                {u.photo ? (
                  <img 
                    src={getFileUrl(u.photo)} 
                    alt={u.name} 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <span style={{ fontSize: '2.75rem', fontWeight: 900, color: '#FFFFFF' }}>
                    {u.name ? u.name.charAt(0).toUpperCase() : 'S'}
                  </span>
                )}
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Update Profile Photo"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: 'white',
                  border: '2px solid #0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Camera size={16} />
              </button>

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
              />
            </div>

            {/* Main Student Info */}
            <div className="profile-hero-info" style={{ flex: '1 1 auto', minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>{u.name || 'Student'}</h1>
                
                {/* Gamification Badge */}
                <span 
                  style={{ 
                    padding: '0.35rem 0.9rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.78rem', 
                    fontWeight: 800,
                    background: completion.badge === 'Dedicated Learner' ? 'linear-gradient(135deg, #10B981, #059669)' : (completion.badge === 'Active Learner' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'rgba(255,255,255,0.15)'),
                    color: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Sparkles size={13} /> {completion.badge}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', color: '#94A3B8', fontSize: '0.88rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#CBD5E1' }}><Mail size={14} color="#38BDF8" /> {u.email}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#38BDF8', fontWeight: 700 }}><ShieldCheck size={14} color="#38BDF8" /> ID: {u.studentId || 'PD-STUDENT-1001'}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#94A3B8' }}><Calendar size={14} /> Member since {memberSince}</span>
              </div>

              {/* Profile Completion Progress Bar */}
              <div style={{ maxWidth: '520px', background: 'rgba(15, 23, 42, 0.75)', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '0.03em' }}>
                    PROFILE COMPLETION ({completion.percentage}%)
                  </span>
                  {completion.percentage < 100 && (
                    <button 
                      onClick={() => setShowChecklistModal(!showChecklistModal)}
                      style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                    >
                      Complete Your Profile →
                    </button>
                  )}
                </div>

                <div style={{ height: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${completion.percentage}%`, 
                      background: 'linear-gradient(90deg, #38BDF8 0%, #2563EB 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.6s ease',
                      boxShadow: '0 0 10px rgba(56,189,248,0.5)'
                    }} 
                  />
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
              <Link 
                to="/student/report-card" 
                className="btn" 
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  fontSize: '0.9rem', 
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #C89A2B 0%, #B45309 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  textDecoration: 'none',
                  borderRadius: '0.85rem',
                  boxShadow: '0 6px 18px rgba(200,154,43,0.35)',
                  border: '1px solid rgba(253, 230, 138, 0.3)'
                }}
              >
                <Award size={18} /> Official Report Card
              </Link>
              <button 
                onClick={() => { setActiveTab('edit'); setEditSection('personal'); }} 
                className="btn btn-primary" 
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', gap: '0.5rem', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 6px 18px rgba(37,99,235,0.35)' }}
              >
                <Edit3 size={16} /> Edit Profile
              </button>
              <button 
                onClick={() => setActiveTab('settings')} 
                style={{ 
                  background: 'rgba(255,255,255,0.08)', 
                  color: '#FFFFFF', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.85rem', 
                  fontSize: '0.88rem', 
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ⚙️ Account Settings
              </button>
            </div>

          </div>
        </div>

        {/* ── 2. QUICK STATISTICS GRID ────────────────────────────── */}
        <div className="profile-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{enrolledBatches.length}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Enrolled Batches</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{u.completedCourses ? u.completedCourses.length : 0}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Completed Batches</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{u.certificates ? u.certificates.length : 0}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Certificates Earned</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Flame size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{u.streakCount || 1} Days</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Learning Streak</div>
            </div>
          </div>

        </div>

        {/* ── 3. MAIN DASHBOARD TABS ───────────────────────────────── */}
        <div className="profile-tabs-strip" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.75rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.85rem',
              border: 'none',
              background: activeTab === 'overview' ? '#2563EB' : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : '#64748B',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            🎓 My Enrolled Batches
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.85rem',
              border: 'none',
              background: activeTab === 'certifications' ? '#2563EB' : 'transparent',
              color: activeTab === 'certifications' ? '#FFFFFF' : '#64748B',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            📜 My Certifications ({myCertificates.length})
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.85rem',
              border: 'none',
              background: activeTab === 'quizzes' ? '#2563EB' : 'transparent',
              color: activeTab === 'quizzes' ? '#FFFFFF' : '#64748B',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            ⚡ Quiz &amp; Exam Scores ({myQuizAttempts.length})
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.85rem',
              border: 'none',
              background: activeTab === 'edit' ? '#2563EB' : 'transparent',
              color: activeTab === 'edit' ? '#FFFFFF' : '#64748B',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            ✏️ Complete &amp; Edit Profile
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.85rem',
              border: 'none',
              background: activeTab === 'settings' ? '#2563EB' : 'transparent',
              color: activeTab === 'settings' ? '#FFFFFF' : '#64748B',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            ⚙️ Account Settings
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & ENROLLED BATCHES ───────────────────── */}
        {activeTab === 'overview' && (
          <div>
            {enrolledBatches.length === 0 ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #DBEAFE', boxShadow: '0 15px 30px rgba(37,99,235,0.05)' }}>
                <BookOpen size={56} color="#94A3B8" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>No Enrolled Courses Found</h2>
                <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
                  You haven't enrolled in any preparation batches yet. Explore our SEE, NEB, and entrance preparation series to start your learning journey with Gaurav Sir &amp; Team!
                </p>
                <Link to="/courses" className="btn btn-primary" style={{ padding: '0.85rem 2rem', gap: '0.5rem' }}>
                  Browse Courses <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="profile-batches-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {enrolledBatches.map((course) => {
                  let firstVideoId = null;
                  if (course.subjects && course.subjects.length > 0) {
                    for (const subj of course.subjects) {
                      if (subj.chapters && subj.chapters.length > 0) {
                        for (const chap of subj.chapters) {
                          if (chap.videos && chap.videos.length > 0) {
                            firstVideoId = chap.videos[0]._id;
                            break;
                          }
                        }
                      }
                      if (firstVideoId) break;
                    }
                  }

                  return (
                    <div 
                      key={course._id} 
                      className="card animate-fade-in" 
                      style={{ 
                        borderRadius: '1.5rem', 
                        overflow: 'hidden', 
                        background: '#FFFFFF', 
                        border: '1px solid #E2E8F0', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#F1F5F9' }}>
                        <img 
                          src={getCourseThumbnail(course)} 
                          alt={course.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#10B981', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={12} /> Enrolled Batch
                        </div>
                      </div>

                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', lineHeight: '1.3' }}>
                            {course.title}
                          </h3>
                          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 600 }}>
                            Instructor: {course.instructorName || 'Gaurav Sir & Team'}
                          </p>
                          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {course.description}
                          </p>
                        </div>

                        <div className="profile-batch-actions" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                          {firstVideoId ? (
                            <Link 
                              to={`/lecture/${firstVideoId}`} 
                              className="btn btn-primary" 
                              style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem', gap: '0.4rem', justifyContent: 'center' }}
                            >
                              <PlayCircle size={16} /> Continue Learning
                            </Link>
                          ) : (
                            <Link 
                              to={`/courses/${course._id}`} 
                              className="btn btn-primary" 
                              style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem', gap: '0.4rem', justifyContent: 'center' }}
                            >
                              <BookOpen size={16} /> View Course
                            </Link>
                          )}
                          <Link 
                            to={`/courses/${course._id}`} 
                            className="btn btn-outline" 
                            style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', color: '#475569' }}
                          >
                            Syllabus
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: MY CERTIFICATIONS & VERIFIED CREDENTIALS ─────── */}
        {activeTab === 'certifications' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>My Certified Credentials</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>Track in-progress certifications, exam scores, and verified certificate downloads.</p>
              </div>

              <Link to="/certifications" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 800 }}>
                Explore More Certifications
              </Link>
            </div>

            {myCertRecords.length === 0 ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #DBEAFE' }}>
                <Award size={56} color="#94A3B8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>No Active Certifications</h3>
                <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.75rem auto' }}>
                  You haven't enrolled in any professional certification courses yet. Complete courses to earn verified credentials!
                </p>
                <Link to="/certifications" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                  Browse Professional Certifications
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {myCertRecords.map((rec) => {
                  const cert = rec.certificationId;
                  if (!cert) return null;
                  const isDone = rec.status === 'completed';
                  const pct = rec.overallPercentage || 0;

                  return (
                    <div 
                      key={rec._id} 
                      style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '1.25rem', 
                        border: '1px solid #E2E8F0', 
                        padding: '1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        flexWrap: 'wrap', 
                        gap: '1.25rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                        <img src={cert.thumbnail} alt={cert.title} style={{ width: '90px', height: '65px', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isDone ? '#059669' : '#2563EB', textTransform: 'uppercase', background: isDone ? '#ECFDF5' : '#EFF6FF', padding: '0.25rem 0.65rem', borderRadius: '9999px', border: isDone ? '1px solid #A7F3D0' : '1px solid #BFDBFE' }}>
                              {isDone ? '✓ Certification Completed' : 'Enrolled & In Progress'}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.15rem 0 0.35rem 0' }}>{cert.title}</h3>
                          
                          {/* Visual Progress Bar */}
                          <div style={{ maxWidth: '360px', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                              <span>Course Completion</span>
                              <span style={{ color: isDone ? '#059669' : '#2563EB' }}>{pct}% Finished</span>
                            </div>
                            <div style={{ height: '7px', width: '100%', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: isDone ? '#059669' : 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isDone && rec.certificateId ? (
                          <Link 
                            to={`/certificates/${rec.certificateId}`} 
                            className="btn" 
                            style={{ background: '#059669', color: 'white', fontWeight: 800, padding: '0.65rem 1.25rem', borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.85rem' }}
                          >
                            View &amp; Print Certificate 📜
                          </Link>
                        ) : (
                          <Link 
                            to={`/certifications/${cert._id}/learn`} 
                            className="btn btn-primary" 
                            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                          >
                            Continue Learning →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: MY QUIZZES & EXAM ATTEMPTS ───────────────────── */}
        {activeTab === 'quizzes' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>My Examination &amp; Quiz Scores</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>Review your score reports, percentage marks, and detailed answer breakdown.</p>
              </div>

              <Link to="/quizzes" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 800 }}>
                Explore More Examinations &amp; Quizzes
              </Link>
            </div>

            {myQuizAttempts.length === 0 ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #DBEAFE' }}>
                <FileText size={56} color="#94A3B8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>No Exam Attempts Recorded</h3>
                <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.75rem auto' }}>
                  You haven't attempted any live examinations, grand mock tests, or practice quizzes yet.
                </p>
                <Link to="/quizzes" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                  Start Practice Quiz Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {myQuizAttempts.map((sub) => {
                  const isPassed = sub.passed;
                  const pct = sub.percentage || 0;
                  const quizId = sub.quizId?._id || sub.quizId;

                  return (
                    <div 
                      key={sub._id || sub.submissionId}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '1.25rem',
                        border: '1px solid #E2E8F0',
                        padding: '1.35rem 1.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '1rem', background: isPassed ? '#ECFDF5' : '#FEF2F2', color: isPassed ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isPassed ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isPassed ? '#059669' : '#DC2626', background: isPassed ? '#ECFDF5' : '#FEF2F2', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: `1px solid ${isPassed ? '#A7F3D0' : '#FEE2E2'}` }}>
                              {isPassed ? '✓ PASSED' : 'FAILED'} ({pct}%)
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
                              {sub.quizType ? sub.quizType.toUpperCase() : 'EXAM'}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>{sub.quizTitle || 'Practice Quiz'}</h3>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                            <span>Marks: <strong>{sub.scoreObtained} / {sub.totalMarks}</strong></span>
                            <span>Correct: <strong>{sub.correctCount} / {sub.totalQuestions}</strong></span>
                            <span>Time Spent: <strong>{Math.ceil((sub.timeTakenSeconds || 0) / 60)} mins</strong></span>
                            <span>Date: <strong>{new Date(sub.createdAt).toLocaleDateString()}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Link 
                          to={`/quizzes/${quizId}/results/${sub.submissionId}`}
                          className="btn btn-outline"
                          style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 800, color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}
                        >
                          View Answer Report 📊
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: EDIT PROFILE ───────────────────────────────────── */}
        {activeTab === 'edit' && (
          <div className="card" style={{ padding: '2.5rem', borderRadius: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            
            {/* Sub-section Navigation Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setEditSection('personal')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: editSection === 'personal' ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                  background: editSection === 'personal' ? '#EFF6FF' : '#FFFFFF',
                  color: editSection === 'personal' ? '#2563EB' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                👤 Personal Information
              </button>

              <button
                onClick={() => setEditSection('academic')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: editSection === 'academic' ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                  background: editSection === 'academic' ? '#EFF6FF' : '#FFFFFF',
                  color: editSection === 'academic' ? '#2563EB' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                🎓 Academic Information
              </button>

              <button
                onClick={() => setEditSection('goals')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: editSection === 'goals' ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                  background: editSection === 'goals' ? '#EFF6FF' : '#FFFFFF',
                  color: editSection === 'goals' ? '#2563EB' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                🎯 Learning &amp; Career Goals
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* ── SUB-SECTION: PERSONAL INFORMATION ── */}
              {editSection === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>Personal Information</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Email Address (Read Only)</label>
                      <input type="email" value={formData.email} disabled style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #E2E8F0', background: '#F8FAFC', color: '#64748B' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Phone Number</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9800000000" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Address / Locality</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="e.g. New Baneshwor" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Kathmandu" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>State / Province</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Bagmati Province" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Nepal" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Postal Code</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="e.g. 44600" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUB-SECTION: ACADEMIC INFORMATION ── */}
              {editSection === 'academic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>Academic Information</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>School / College Name</label>
                      <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="e.g. St. Xavier's School" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Current Class / Grade</label>
                      <select name="grade" value={formData.grade} onChange={handleChange} style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select Grade</option>
                        <option value="Class 10 (SEE)">Class 10 (SEE)</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12 (NEB)">Class 12 (NEB)</option>
                        <option value="Bachelor Degree">Bachelor Degree</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Education Board</label>
                      <select name="board" value={formData.board} onChange={handleChange} style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select Board</option>
                        <option value="SEE (Nepal)">SEE (Nepal)</option>
                        <option value="NEB (Nepal)">NEB (Nepal)</option>
                        <option value="Cambridge A-Levels">Cambridge A-Levels</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Stream / Field</label>
                      <select name="stream" value={formData.stream} onChange={handleChange} style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select Stream</option>
                        <option value="Science">Science (Physics/Chemistry/Biology/Math)</option>
                        <option value="Management">Management / Business Studies</option>
                        <option value="Humanities">Humanities &amp; Social Sciences</option>
                        <option value="Technology & Computer">Technology &amp; Computer Science</option>
                        <option value="General">General / All Subjects</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Graduation / Exam Year</label>
                      <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="e.g. 2081 BS / 2026 AD" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUB-SECTION: LEARNING & CAREER GOALS ── */}
              {editSection === 'goals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>Learning &amp; Career Goals</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Areas of Interest (Comma separated)</label>
                      <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="Mathematics, Web Dev, Physics, Robotics" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Skills (Comma separated)</label>
                      <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Problem Solving, JavaScript, Geometry" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Favorite Subjects</label>
                      <input type="text" name="favoriteSubjects" value={formData.favoriteSubjects} onChange={handleChange} placeholder="Compulsory Math, Opt Math, Physics" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Dream College / University</label>
                      <input type="text" name="dreamCollege" value={formData.dreamCollege} onChange={handleChange} placeholder="Pulchowk Campus (IOE) / KU / MIT" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Dream Job / Target Profession</label>
                      <input type="text" name="dreamJob" value={formData.dreamJob} onChange={handleChange} placeholder="Software Engineer / Civil Engineer / Doctor" style={{ width: '100%', height: '46px', borderRadius: '0.75rem', padding: '0 1rem', border: '1.5px solid #CBD5E1', outline: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Learning Goals &amp; Objectives</label>
                    <textarea name="learningGoals" value={formData.learningGoals} onChange={handleChange} rows={3} placeholder="What do you hope to achieve through PiyushDhara courses?" style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem', border: '1.5px solid #CBD5E1', outline: 'none', fontFamily: 'inherit' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Short Bio / About Me</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Write a short summary about yourself..." style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem', border: '1.5px solid #CBD5E1', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={saving} 
                className="btn btn-primary" 
                style={{ 
                  padding: '0.85rem 2rem', 
                  fontSize: '0.95rem', 
                  borderRadius: '0.85rem', 
                  alignSelf: 'flex-start',
                  boxShadow: '0 8px 25px rgba(37,99,235,0.25)',
                  gap: '0.5rem'
                }}
              >
                <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>

            </form>
          </div>
        )}

        {/* ── TAB 3: ACCOUNT SETTINGS ─────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="card" style={{ padding: '2.5rem', borderRadius: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>Account Settings</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Photo Change Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#0F172A', fontWeight: 700 }}>Profile Photo</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>Upload or update your profile picture</p>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Update Photo
                </button>
              </div>

              {/* Password Reset Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#0F172A', fontWeight: 700 }}>Change / Reset Password</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>Send password reset link to your email ({formData.email})</p>
                </div>
                <button onClick={handlePasswordReset} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', gap: '0.4rem' }}>
                  <KeyRound size={15} /> Send Reset Link
                </button>
              </div>

              {/* Edit Details Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#0F172A', fontWeight: 700 }}>Edit Personal &amp; Academic Info</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>Modify your school, grade, and personal information</p>
                </div>
                <button onClick={() => { setActiveTab('edit'); setEditSection('personal'); }} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Edit Details
                </button>
              </div>

              {/* Logout Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: '#FEF2F2', borderRadius: '1rem', border: '1px solid #FEE2E2', marginTop: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#DC2626', fontWeight: 700 }}>Logout of Account</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#991B1B' }}>Sign out of your active student session</p>
                </div>
                <button onClick={handleLogoutClick} style={{ background: '#DC2626', color: 'white', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LogOut size={15} /> Logout
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── PROFILE COMPLETION CHECKLIST MODAL ────────────────── */}
        {showChecklistModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '1.75rem', padding: '2rem', maxWidth: '450px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Profile Completion Checklist</h3>
                <button onClick={() => setShowChecklistModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {completion.checklist?.map((item) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: item.isDone ? '#F0FDF4' : '#F8FAFC', border: item.isDone ? '1px solid #DCFCE7' : '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: item.isDone ? '#166534' : '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.isDone ? <CheckCircle2 size={18} color="#10B981" /> : <XCircle size={18} color="#94A3B8" />}
                      {item.label}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: item.isDone ? '#10B981' : '#94A3B8' }}>
                      +{item.weight}%
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { setShowChecklistModal(false); setActiveTab('edit'); }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem', justifyContent: 'center' }}
              >
                Complete Remaining Details →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentProfile;
