import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, PlayCircle, BookOpen, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fetchEnrolledCoursesApi } from '../utils/api';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/my-courses');
      return;
    }

    const loadEnrolled = async () => {
      try {
        setLoading(true);
        const data = await fetchEnrolledCoursesApi(token);
        setCourses(data);
      } catch (err) {
        console.error('Failed to load enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEnrolled();
  }, [token, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <GraduationCap size={48} color="#2563EB" className="animate-spin" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#475569' }}>Loading your enrolled batches...</h3>
      </div>
    );
  }

  return (
    <div className="my-courses-page bg-mesh animate-fade-in" style={{ minHeight: '90vh', padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Page Banner Header */}
        <div 
          className="card" 
          style={{ 
            padding: '3rem', 
            borderRadius: '2rem', 
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', 
            color: '#FFFFFF', 
            marginBottom: '3rem',
            boxShadow: '0 20px 40px -15px rgba(15,23,42,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: 'rgba(56,189,248,0.15)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8', marginBottom: '1rem' }}>
                <ShieldCheck size={14} /> VERIFIED ENROLLMENT DASHBOARD
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                My Enrolled <span style={{ color: '#38BDF8' }}>Batches</span>
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', margin: 0 }}>
                Welcome back, <strong>{userObj?.name || 'Student'}</strong>! Here are all your active courses and preparation modules.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', padding: '1.25rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38BDF8' }}>{courses.length}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Batches</div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Grid */}
        {courses.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #DBEAFE', boxShadow: '0 15px 30px rgba(37,99,235,0.05)' }}>
            <BookOpen size={56} color="#94A3B8" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>No Active Batches Enrolled</h2>
            <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
              You haven't enrolled in any preparation batches yet. Explore our board exam and entrance preparation series to get started!
            </p>
            <Link to="/courses" className="btn btn-primary" style={{ padding: '0.85rem 2rem', gap: '0.5rem' }}>
              Browse Available Batches <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {courses.map((course) => {
              // Find first video ID for instant resume
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
                      src={course.thumbnailUrl?.startsWith('http') ? course.thumbnailUrl : `http://localhost:5000/${course.thumbnailUrl}`} 
                      onError={(e) => { e.target.src = '/logo.jpeg'; }}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#10B981', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={12} /> Enrolled
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                        {course.title}
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                      {firstVideoId ? (
                        <Link 
                          to={`/lecture/${firstVideoId}`} 
                          className="btn btn-primary" 
                          style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', gap: '0.5rem', justifyContent: 'center' }}
                        >
                          <PlayCircle size={18} /> Resume Learning
                        </Link>
                      ) : (
                        <Link 
                          to={`/courses/${course._id}`} 
                          className="btn btn-outline" 
                          style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', gap: '0.5rem', justifyContent: 'center' }}
                        >
                          View Batch Syllabus
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyCourses;
