import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCourseDetails, fetchChapterContent, enrollUserCourseApi, getFileUrl } from '../utils/api';
import { PlayCircle, FileText, ChevronDown, ChevronRight, Lock, BookOpen, Rocket, Clock, Bell, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import TeacherProfileModal from '../components/common/TeacherProfileModal';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState({ videos: [], notes: [] });
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user') || localStorage.getItem('studentUser');
  const userObj = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await fetchCourseDetails(id);
        setCourse(data);
        if (data.subjects && data.subjects.length > 0) {
          setActiveSubject(data.subjects[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  const rawEnrolled = userObj?.enrolledCourses || [];
  const enrolledCourseIds = rawEnrolled.map(item => (typeof item === 'object' ? item._id : item)?.toString());
  const isAlreadyEnrolled = Boolean(token) && course?._id && enrolledCourseIds.includes(course._id.toString());

  const handleChapterClick = async (chapterId) => {
    if (!token) {
      navigate(`/login?redirect=/courses/${id}`);
      return;
    }

    if (activeChapter === chapterId) {
      setActiveChapter(null);
      return;
    }
    setActiveChapter(chapterId);
    try {
      const data = await fetchChapterContent(chapterId);
      setChapterContent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnrollClick = async () => {
    if (!token) {
      navigate(`/login?redirect=/courses/${id}`);
      return;
    }

    // If logged in, seamlessly store in database under user account
    if (token && userObj) {
      try {
        await enrollUserCourseApi(token, course._id);
        const currentEnrolled = userObj.enrolledCourses || [];
        userObj.enrolledCourses = Array.from(new Set([...currentEnrolled, course._id]));
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('studentUser', JSON.stringify(userObj));
      } catch (err) {
        console.warn('Enrollment API note:', err.message);
      }
    }

    // Navigate to first available video for studying
    if (course.subjects && course.subjects.length > 0) {
      for (const subj of course.subjects) {
        if (subj.chapters && subj.chapters.length > 0) {
          for (const chap of subj.chapters) {
            try {
              const content = await fetchChapterContent(chap._id);
              if (content.videos && content.videos.length > 0) {
                navigate(`/lecture/${content.videos[0]._id}`);
                return;
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }

    alert(`Opening ${course.title}...`);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading course content...</div>;
  }

  if (!course) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Course not found.</div>;
  }

  const selectedSubject = course.subjects?.find((s) => s._id === activeSubject);

  return (
    <div className="course-details-page bg-mesh animate-fade-in" style={{ minHeight: '90vh', padding: '3rem 0' }}>
      <div className="container">
        
        {/* Banner Header Card */}
        <div style={{ 
          borderRadius: '1.5rem', 
          padding: '3.5rem', 
          marginBottom: '2.5rem', 
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0F9FF 100%)', 
          color: '#0F172A',
          boxShadow: '0 20px 40px -15px rgba(37,99,235,0.08)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #DBEAFE'
        }}>
          {/* Subtle glowing ring decoration */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 75%)', filter: 'blur(30px)' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px', minWidth: '280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: '#DBEAFE', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#1D4ED8', marginBottom: '1.25rem' }}>
                <BookOpen size={12} /> BATCH PREPARATION
              </div>
              <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#0F172A' }}>{course.title}</h1>
              <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '750px', marginBottom: '2rem', lineHeight: '1.7' }}>{course.description}</p>
              
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid #CBD5E1', paddingTop: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>PRICE TIER</span>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB', margin: 0 }}>
                      {course.price === 0 ? 'Free Access' : `Rs. ${course.price}`}
                    </p>
                  </div>
                  <div 
                    onClick={() => setSelectedTeacher({
                      name: course.instructorName || 'Gaurav Sir & Team',
                      photo: course.teacherImageUrl || '/teacher.png'
                    })}
                    style={{ borderLeft: '1px solid #CBD5E1', paddingLeft: '2rem', cursor: 'pointer' }}
                    title="Click to view Teacher Profile"
                  >
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>INSTRUCTOR</span>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2563EB', margin: 0, textDecoration: 'underline' }}>
                      {course.instructorName || 'Gaurav Sir & Team'} 🛈
                    </p>
                  </div>
                </div>
                
                <button onClick={handleEnrollClick} className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                  {isAlreadyEnrolled ? 'Enrolled ✓ (Access Batch)' : (!token ? 'Login to Enroll in Batch' : 'Enroll in Batch')}
                </button>
              </div>
            </div>

            {/* Teacher Photo on Right - Clickable */}
            <div 
              onClick={() => setSelectedTeacher({
                name: course.instructorName || 'Gaurav Sir & Team',
                photo: course.teacherImageUrl || '/teacher.png'
              })}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              title="Click to view Teacher Profile"
            >
              <div style={{
                position: 'relative',
                borderRadius: '1.5rem',
                padding: '6px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <img 
                  src={course.teacherImageUrl || '/teacher.png'} 
                  alt={course.instructorName || 'Instructor'} 
                  style={{
                    width: '210px',
                    height: '210px',
                    objectFit: 'cover',
                    borderRadius: '1.25rem',
                    display: 'block'
                  }}
                  onError={(e) => { e.target.src = '/teacher.png'; }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Enrolled Status Banner */}
        {isAlreadyEnrolled && (
          <div style={{ background: '#F0FDF4', border: '1.5px solid #DCFCE7', padding: '1.25rem 1.75rem', borderRadius: '1.25rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <CheckCircle2 size={24} color="#10B981" />
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', color: '#166534', fontSize: '1rem', fontWeight: 800 }}>✅ You are Enrolled in this Batch</h4>
                <p style={{ margin: 0, color: '#15803D', fontSize: '0.88rem' }}>You have full unlimited access to all HD video lectures, chapter handouts, and numerical solutions.</p>
              </div>
            </div>
            <button onClick={handleEnrollClick} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem', background: '#10B981' }}>
              ▶ Access Lectures Now
            </button>
          </div>
        )}

        {/* Non-Logged In Warning Banner */}
        {!token && (
          <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', padding: '1.25rem 1.75rem', borderRadius: '1.25rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <ShieldAlert size={24} color="#D97706" />
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', color: '#92400E', fontSize: '1rem', fontWeight: 800 }}>Login or Register Required</h4>
                <p style={{ margin: 0, color: '#B45309', fontSize: '0.88rem' }}>You can browse batch topics below, but you must log in or register to open lectures and enroll.</p>
              </div>
            </div>
            <Link to={`/login?redirect=/courses/${id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}>
              Login / Register Now →
            </Link>
          </div>
        )}

        {/* Subjects Tabs Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>Batch Curriculum &amp; Subjects</h2>
          
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {course.subjects?.map((subj) => {
              const isSelected = subj._id === activeSubject;
              return (
                <button
                  key={subj._id}
                  onClick={() => { setActiveSubject(subj._id); setActiveChapter(null); }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.85rem',
                    border: isSelected ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                    color: isSelected ? '#2563EB' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {subj.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chapters Accordion / List */}
        {selectedSubject ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedSubject.chapters?.map((chap, idx) => {
              const isOpen = activeChapter === chap._id;
              return (
                <div 
                  key={chap._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '1rem',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  <div 
                    onClick={() => handleChapterClick(chap._id)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isOpen ? '#F8FAFC' : '#FFFFFF',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {idx + 1}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {chap.title}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {!token && <Lock size={16} color="#94A3B8" />}
                      {isOpen ? <ChevronDown size={20} color="#64748B" /> : <ChevronRight size={20} color="#64748B" />}
                    </div>
                  </div>

                  {/* Chapter Content Dropdown */}
                  {isOpen && (
                    <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                      {!token ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#FFFFFF', borderRadius: '0.85rem', border: '1px dashed #CBD5E1' }}>
                          <Lock size={28} color="#94A3B8" style={{ marginBottom: '0.5rem' }} />
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#1E293B', fontSize: '0.95rem' }}>Lectures Locked</h4>
                          <p style={{ margin: '0 0 1rem 0', color: '#64748B', fontSize: '0.85rem' }}>Please log in or register to view video lectures and handwritten PDF handouts.</p>
                          <Link to={`/login?redirect=/courses/${id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.82rem' }}>
                            Login to Unlock
                          </Link>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {chapterContent.videos?.map((vid) => (
                            <Link
                              key={vid._id}
                              to={`/lecture/${vid._id}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.85rem 1rem',
                                background: '#FFFFFF',
                                borderRadius: '0.75rem',
                                border: '1px solid #E2E8F0',
                                textDecoration: 'none',
                                color: '#0F172A',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <PlayCircle size={20} color="#2563EB" />
                                <span>{vid.title}</span>
                              </div>
                              <span style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>Watch Lecture →</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
            No subjects uploaded for this batch yet.
          </div>
        )}

      </div>

      {/* Teacher Profile Modal Popup */}
      <TeacherProfileModal 
        teacher={selectedTeacher} 
        onClose={() => setSelectedTeacher(null)} 
      />
    </div>
  );
};

export default CourseDetails;
