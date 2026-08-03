import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCertificationsApi } from '../utils/api';
import { 
  Award, 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Users, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  FileCheck,
  Lock,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Certifications = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const studentEmail = userProfile?.email || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '');

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        studentEmail
      };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (search.trim()) params.search = search.trim();

      const res = await fetchCertificationsApi(params);
      setCertifications(res.data || []);
    } catch (err) {
      console.error('Certifications fetch error:', err);
      setError('Failed to load certification courses. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, [selectedCategory, selectedDifficulty, studentEmail]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCertifications();
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>Beginner</span>;
      case 'Intermediate':
        return <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>Intermediate</span>;
      case 'Advanced':
        return <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>Advanced</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div 
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
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#2563EB', marginBottom: '1rem' }}>
            <Award size={16} /> Professional Certification Portal
          </div>
          
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.85rem 0', lineHeight: 1.2 }}>
            Master Technical Skills. Earn <span style={{ color: '#2563EB' }}>Verified Credentials</span>.
          </h1>
          
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
            Industry-aligned certifications featuring structured lessons, interactive checkpoint quizzes, real-world practical code assignments, and automatic verifiable certificate generation upon completion.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={16} color="#059669" /> 100% Verifiable Credentials</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileCheck size={16} color="#2563EB" /> Instant PDF Downloads</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GraduationCap size={16} color="#D97706" /> Coursera &amp; Skillshop Standard</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input 
            type="text"
            placeholder="Search certifications by skill, title, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '46px',
              paddingLeft: '2.8rem',
              paddingRight: '1rem',
              borderRadius: '0.85rem',
              border: '1.5px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: '0.9rem',
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="#64748B" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                height: '46px',
                padding: '0 1rem',
                borderRadius: '0.85rem',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#334155',
                outline: 'none'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Computer Science">Computer Science</option>
              <option value="IOE Preparation">IOE Preparation</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              height: '46px',
              padding: '0 1rem',
              borderRadius: '0.85rem',
              border: '1.5px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#334155',
              outline: 'none'
            }}
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

      </div>

      {/* ── Certification Cards Grid ────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
          <Sparkles className="animate-spin" size={32} style={{ marginBottom: '1rem' }} />
          <p style={{ fontWeight: 700 }}>Loading Professional Certification Courses...</p>
        </div>
      ) : error ? (
        <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, margin: 0 }}>{error}</p>
        </div>
      ) : certifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#F8FAFC', borderRadius: '1.5rem', border: '1px dashed #CBD5E1' }}>
          <Award size={48} color="#94A3B8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.5rem 0' }}>No Certification Courses Found</h3>
          <p style={{ color: '#64748B', margin: 0 }}>Try clearing search or changing category/difficulty filters.</p>
        </div>
      ) : (
        <div className="grid-responsive-3" style={{ gap: '1.75rem' }}>
          {certifications.map((cert) => {
            const userProg = cert.userProgress;
            const isCompleted = userProg && userProg.status === 'completed';
            const isEnrolled = Boolean(userProg);

            return (
              <div 
                key={cert._id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '1.5rem',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative'
                }}
                className="hover-card"
              >
                {/* Course Image */}
                <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={cert.thumbnail} 
                    alt={cert.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'; }}
                  />
                  
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem' }}>
                    {getDifficultyBadge(cert.difficulty)}
                    <span style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {cert.category}
                    </span>
                  </div>

                  {isCompleted && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#059669', color: 'white', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      <CheckCircle2 size={13} /> Certified
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.85rem' }}>
                  
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0', lineHeight: 1.3 }}>
                      {cert.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      {cert.subtitle || cert.description}
                    </p>
                  </div>

                  {/* Skills tags */}
                  {cert.skillsGained && cert.skillsGained.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {cert.skillsGained.slice(0, 3).map((skill, idx) => (
                        <span key={idx} style={{ background: '#F1F5F9', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', fontSize: '0.72rem', fontWeight: 600 }}>
                          {skill}
                        </span>
                      ))}
                      {cert.skillsGained.length > 3 && (
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', alignSelf: 'center', fontWeight: 600 }}>+{cert.skillsGained.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Metrics Bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', padding: '0.75rem 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', fontSize: '0.78rem', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} color="#2563EB" /> {cert.estimatedDuration}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <BookOpen size={14} color="#059669" /> {cert.totalLessons || 8} Lessons
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <HelpCircle size={14} color="#D97706" /> {cert.totalQuizzes || 3} Quizzes
                    </div>
                  </div>

                  {/* Instructor & Enrolled Count */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <img src={cert.instructor?.photo || '/pankaj-baduwal.jpg'} alt="Pankaj Baduwal" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>Pankaj Baduwal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#D97706', fontWeight: 700 }}>
                      <Star size={13} fill="#D97706" /> {cert.rating || 4.9} ({cert.enrolledCount || 1200}+)
                    </div>
                  </div>

                  {/* Progress Bar (if enrolled) */}
                  {userProg && (
                    <div style={{ marginTop: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: isCompleted ? '#059669' : '#2563EB' }}>
                        <span>Progress</span>
                        <span>{userProg.percentage || 0}%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${userProg.percentage || 0}%`, background: isCompleted ? '#059669' : 'linear-gradient(90deg, #2563EB, #3B82F6)', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <Link
                      to={`/certifications/${cert.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.85rem',
                        background: isCompleted ? '#059669' : isEnrolled ? '#2563EB' : '#0F172A',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      {isCompleted ? (
                        <>View Verified Certificate <ShieldCheck size={16} /></>
                      ) : isEnrolled ? (
                        <>Continue Learning <ArrowRight size={16} /></>
                      ) : (
                        <>Explore Certification <ArrowRight size={16} /></>
                      )}
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Certifications;
