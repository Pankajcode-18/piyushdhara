import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCourseDetails, fetchChapterContent, enrollStudentApi } from '../utils/api';
import { PlayCircle, FileText, ChevronDown, ChevronRight, Lock, BookOpen, Rocket, Clock, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState({ videos: [], notes: [] });

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

  const handleChapterClick = async (chapterId) => {
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading course content...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Course Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          The requested course batch might have been updated or is currently unavailable.
        </p>
        <Link to="/courses" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>
          Browse All Preparation Courses
        </Link>
      </div>
    );
  }

  const selectedSubject = course.subjects?.find((s) => s._id === activeSubject) || course.subjects?.[0];

  const savedStudentStr = localStorage.getItem('studentUser');
  const studentObj = savedStudentStr ? JSON.parse(savedStudentStr) : null;
  const isAlreadyEnrolled = studentObj?.enrolledCourses?.includes(course?._id);

  const handleEnrollClick = async () => {
    if (studentObj) {
      if (isAlreadyEnrolled) {
        alert('You are already enrolled in this batch! Click any chapter below to start studying.');
        return;
      }
      try {
        await enrollStudentApi({
          name: studentObj.name || 'Student',
          school: studentObj.school || 'N/A',
          phone: studentObj.phone || 'N/A',
          email: studentObj.email || 'N/A',
          courseId: course._id
        });
        const currentEnrolled = studentObj.enrolledCourses || [];
        studentObj.enrolledCourses = Array.from(new Set([...currentEnrolled, course._id]));
        localStorage.setItem('studentUser', JSON.stringify(studentObj));
        alert(`Congratulations! You have successfully enrolled in ${course.title}.`);
      } catch (err) {
        const currentEnrolled = studentObj.enrolledCourses || [];
        studentObj.enrolledCourses = Array.from(new Set([...currentEnrolled, course._id]));
        localStorage.setItem('studentUser', JSON.stringify(studentObj));
        alert(`Successfully enrolled in ${course.title}!`);
      }
    } else {
      const event = new CustomEvent('trigger-student-enroll', { detail: { courseId: course._id } });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="course-details-page bg-mesh animate-fade-in" style={{ minHeight: '90vh', padding: '3rem 0' }}>
      <div className="container">
        
        {/* Banner Header Card */}
        <div style={{ 
          borderRadius: '1.5rem', 
          padding: '3.5rem', 
          marginBottom: '3rem', 
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
                  <div style={{ borderLeft: '1px solid #CBD5E1', paddingLeft: '2rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>INSTRUCTOR</span>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{course.instructorName || 'Gaurav Sir & Team'}</p>
                  </div>
                </div>
                
                <button onClick={handleEnrollClick} className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                  {isAlreadyEnrolled ? 'Enrolled ✓ (Access Batch)' : (course.price === 0 ? 'Start Learning Now' : 'Enroll in Batch')}
                </button>
              </div>
            </div>

            {/* Teacher Photo on Right */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                />
              </div>
            </div>

          </div>
        </div>        {/* Main Content Area */}
        {!course.subjects || course.subjects.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2.5rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #DBEAFE', boxShadow: '0 20px 40px -15px rgba(37,99,235,0.08)', marginTop: '2rem' }}>
            
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: '0 10px 25px rgba(37,99,235,0.15)' }}>
              <Rocket size={36} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: '#FEF3C7', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#D97706', marginBottom: '1.25rem' }}>
              <Clock size={14} /> CONTENT COMING SOON
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Batch Lectures &amp; Notes Coming Soon!
            </h2>

            <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto 2rem auto', lineHeight: '1.7' }}>
              Gaurav Sir &amp; Team are currently preparing and uploading structured HD video series and handwritten PDF handouts for <strong style={{ color: '#0F172A' }}>{course.title}</strong>. Content will be live here very soon!
            </p>

            {/* Upcoming Features Checklist */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                <CheckCircle2 size={16} color="#2563EB" /> HD Video Lectures
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                <CheckCircle2 size={16} color="#2563EB" /> Handwritten PDF Handouts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                <CheckCircle2 size={16} color="#2563EB" /> Past Exam Breakdowns
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => alert(`You will be notified as soon as new lectures are uploaded to ${course.title}!`)}
                className="btn btn-primary" 
                style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', gap: '0.5rem' }}
              >
                <Bell size={16} /> Notify Me When Released
              </button>

              <Link to="/courses" className="btn btn-outline" style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', gap: '0.5rem', color: '#0F172A', borderColor: '#CBD5E1' }}>
                Explore Available Batches <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        ) : (
          <div className="main-content-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
            
            {/* Left Column: Subjects Selection Menu */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Subjects</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {course.subjects.map((subj) => {
                  const isSelected = activeSubject === subj._id;
                  return (
                    <button
                      key={subj._id}
                      onClick={() => {
                        setActiveSubject(subj._id);
                        setActiveChapter(null);
                      }}
                      className="btn"
                      style={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        background: isSelected ? 'var(--primary-color)' : 'transparent',
                        color: isSelected ? 'white' : 'var(--text-main)',
                        border: isSelected ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                        padding: '0.8rem 1.25rem'
                      }}
                    >
                      {subj.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Chapters & Lectures Accordion */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Chapters</h3>
              {selectedSubject && selectedSubject.chapters ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedSubject.chapters.map((chap) => {
                    const isOpen = activeChapter === chap._id;
                    return (
                      <div key={chap._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <button
                          onClick={() => handleChapterClick(chap._id)}
                          style={{
                            width: '100%',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontWeight: 700,
                            fontSize: '1.15rem'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {isOpen ? <ChevronDown size={20} color="var(--primary-color)" /> : <ChevronRight size={20} color="var(--text-muted)" />}
                            {chap.title}
                          </span>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid var(--border-color)' }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginTop: '1.25rem' }}>
                                
                                {/* Video Lectures */}
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Video Lectures</h4>
                                  {chapterContent.videos.length === 0 ? (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No lectures uploaded yet.</p>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                       {chapterContent.videos.map((vid) => (
                                        <div key={vid._id} className="flex-between" style={{ padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <PlayCircle size={22} color="var(--primary)" />
                                            <div>
                                              <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: 'var(--text-primary)' }}>{vid.title}</p>
                                              {vid.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{vid.description}</p>}
                                            </div>
                                          </div>
                                          {vid.isFree || course.price === 0 ? (
                                            <Link to={`/watch/${vid._id}`} className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
                                              Watch
                                            </Link>
                                          ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                              <Lock size={14} /> Locked
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* PDF Handouts (Simplified List View) */}
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>PDF Handouts</h4>
                                  {chapterContent.notes.length === 0 ? (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No notes uploaded yet.</p>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                      {chapterContent.notes.map((note) => {
                                        const noteLink = note.fileUrl.startsWith('http') ? note.fileUrl : `http://localhost:5000/${note.fileUrl}`;
                                        return (
                                          <a
                                            key={note._id}
                                            href={noteLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '0.75rem',
                                              padding: '0.75rem 1rem',
                                              background: 'var(--bg-input)',
                                              border: '1px solid var(--border)',
                                              borderRadius: '0.5rem',
                                              color: 'var(--text-primary)',
                                              textDecoration: 'none',
                                              fontSize: '0.95rem',
                                              fontWeight: 500
                                            }}
                                            className="hover-lift"
                                          >
                                            <FileText size={18} color="var(--accent)" />
                                            <span style={{ flex: 1 }}>{note.title}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Open PDF &rarr;</span>
                                          </a>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>Select a subject on the left to browse chapters.</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
