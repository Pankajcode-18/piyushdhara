import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCourses, searchCourses } from '../utils/api';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Users, 
  Layers, 
  Video, 
  FileText, 
  Star, 
  Filter, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import teacherImg from '../assets/gaurov.jpeg';

const FALLBACK_BATCHES = [
  {
    _id: 'mahabharath-math-series',
    title: 'Mahabharath Mathematics Series',
    description: 'Legendary mathematics speed trick series by Gaurav Sir. Learn L\'Hospital rule, trigonometry shortcuts, calculus tricks, and geometry proofs in seconds.',
    price: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Gaurav Sir & Team',
    category: 'FREE'
  },
  {
    _id: 'web-development-batch',
    title: 'Web Development (Full-Stack MERN)',
    description: 'Master HTML5, CSS3, JavaScript, React.js, Node.js, and MongoDB with hands-on real-world projects and full portfolio building.',
    price: 1999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    instructorName: 'PiyushDhara Tech Team',
    category: 'TECH'
  },
  {
    _id: 'ioe-engineering-entrance',
    title: 'IOE Entrance Preparation Course',
    description: 'High-yield MCQ practice, rapid-fire physics & math formula revisions, and mock test papers for IOE Pulchowk entrance exam.',
    price: 2500,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Gaurav Sir & IOE Scholars',
    category: 'ENTRANCE'
  },
  {
    _id: 'loksewa-tayari-batch',
    title: 'Loksewa Tayari (GK & IQ Preparation)',
    description: 'Comprehensive General Knowledge (GK) and IQ test preparation for Loksewa Aayog examinations in Nepal.',
    price: 1500,
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Gaurav Sir & Team',
    category: 'LOKSEWA'
  }
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterType = searchParams.get('filter');
  const queryParam = searchParams.get('q') || '';
  const isEnrolledFilter = filterType === 'enrolled';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'ALL', label: 'All Batches', icon: Layers },
    { id: 'FREE', label: 'Mahabharath Math', icon: Sparkles },
    { id: 'TECH', label: 'Web Development', icon: BookOpen },
    { id: 'ENTRANCE', label: 'IOE Entrance', icon: Star },
    { id: 'LOKSEWA', label: 'Loksewa Tayari', icon: GraduationCap },
  ];

  useEffect(() => {
    loadCourses();
  }, [filterType]);

  useEffect(() => {
    setSearchQuery(queryParam || '');
  }, [queryParam]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, courses]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams, { replace: true });
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses();
      const courseList = (data && data.length > 0) ? data : FALLBACK_BATCHES;
      
      if (isEnrolledFilter) {
        const savedStudent = JSON.parse(localStorage.getItem('studentUser') || '{}');
        const enrolledIds = savedStudent.enrolledCourses || [];
        const filtered = courseList.filter(course => enrolledIds.includes(course._id));
        setCourses(filtered);
        setFilteredCourses(filtered);
      } else {
        setCourses(courseList);
        setFilteredCourses(courseList);
      }
    } catch (err) {
      console.error('API load error, using fallback batches:', err);
      if (isEnrolledFilter) {
        const savedStudent = JSON.parse(localStorage.getItem('studentUser') || '{}');
        const enrolledIds = savedStudent.enrolledCourses || [];
        const filtered = FALLBACK_BATCHES.filter(course => enrolledIds.includes(course._id));
        setCourses(filtered);
        setFilteredCourses(filtered);
      } else {
        setCourses(FALLBACK_BATCHES);
        setFilteredCourses(FALLBACK_BATCHES);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...courses];

    // Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title?.toLowerCase().includes(q) || 
        c.description?.toLowerCase().includes(q) ||
        c.instructorName?.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'FREE') {
        result = result.filter(c => c.price === 0);
      } else if (selectedCategory === 'SEE') {
        result = result.filter(c => c.title?.toUpperCase().includes('SEE') || c.title?.includes('10'));
      } else if (selectedCategory === 'NEB') {
        result = result.filter(c => c.title?.toUpperCase().includes('NEB') || c.title?.includes('11') || c.title?.includes('12'));
      } else if (selectedCategory === 'ENTRANCE') {
        result = result.filter(c => c.title?.toUpperCase().includes('IOE') || c.title?.toUpperCase().includes('LOKSEWA') || c.title?.toUpperCase().includes('ENTRANCE'));
      }
    }

    setFilteredCourses(result);
  };

  return (
    <div className="courses-page bg-mesh animate-fade-in" style={{ minHeight: '92vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
               {/* 1. Hero Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-banner-responsive"
          style={{ 
            borderRadius: '1.75rem', 
            padding: '3.5rem 3rem', 
            marginBottom: '2.5rem', 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0F9FF 100%)', 
            color: '#0F172A',
            boxShadow: '0 20px 40px -15px rgba(37,99,235,0.08)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #DBEAFE'
          }}
        >
          {/* Ambient Glowing Orbs */}
          <div style={{ position: 'absolute', top: '-25%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', filter: 'blur(35px)' }}></div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: '#DBEAFE', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#1D4ED8', marginBottom: '1.25rem' }}>
                <BookOpen size={14} /> {isEnrolledFilter ? 'MY ENROLLED PREPARATIONS' : 'ACADEMIC BATCH CATALOGUE'}
              </div>

              <h1 className="page-title-responsive" style={{ fontSize: '2.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.85rem', lineHeight: '1.2' }}>
                {isEnrolledFilter ? 'My Enrolled Batches' : 'Explore Preparation Batches'}
              </h1>

              <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '620px', lineHeight: '1.7', margin: 0 }}>
                {isEnrolledFilter 
                  ? 'Your active SEE, NEB, and entrance exam preparation courses. Learn daily with Gaurav Sir & Team.'
                  : 'Empowering Nepal’s students with top-tier video lectures, handwritten PDF handouts, and past question breakdowns for SEE, NEB Science & Commerce, and Entrance Exams.'}
              </p>
            </div>

            {/* Search Input Box */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search className="search-icon" size={20} style={{ left: '1.25rem', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search by title, subject, keyword..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ 
                  paddingLeft: '3rem', 
                  paddingRight: '1.5rem', 
                  height: '52px', 
                  fontSize: '0.95rem',
                  borderRadius: '1rem',
                  background: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  color: '#0F172A',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* 2. Category Filter Pills */}
        {!isEnrolledFilter && (
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem' }}>
              <Filter size={16} /> Filter Batches:
            </span>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                    background: isSelected ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' : 'var(--bg-card)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    boxShadow: isSelected ? 'var(--shadow-primary)' : 'var(--shadow-xs)'
                  }}
                >
                  <Icon size={15} color={isSelected ? '#FFFFFF' : 'var(--text-muted)'} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Batch Grid Listing */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="card" style={{ height: '360px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeleton" style={{ height: '180px', borderRadius: '0.85rem' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '70%', borderRadius: '0.3rem' }}></div>
                <div className="skeleton" style={{ height: '15px', width: '90%', borderRadius: '0.3rem' }}></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', marginTop: '1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <BookOpen size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {isEnrolledFilter ? 'No Enrolled Batches Found' : 'No Batches Found'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.75rem auto', lineHeight: '1.6' }}>
              {isEnrolledFilter 
                ? "You haven't enrolled in any preparation batch yet. Explore our SEE, NEB, and entrance batches to start your preparation with Gaurav Sir & Team."
                : "No course matches your search query or selected category. Try selecting another filter."
              }
            </p>
            {isEnrolledFilter && (
              <Link to="/courses" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
                Explore All Batches <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '2rem' }}>
            <AnimatePresence>
              {filteredCourses.map((course, idx) => {
                const isFree = course.price === 0;
                const hasCustomThumb = course.thumbnailUrl && course.thumbnailUrl !== 'no-photo.jpg';

                return (
                  <motion.div
                    key={course._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="card"
                    style={{ 
                      overflow: 'hidden', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      padding: 0,
                    }}
                  >
                    {/* Thumbnail Image Header */}
                    <div style={{ 
                      height: '195px', 
                      position: 'relative', 
                      backgroundColor: '#0F172A',
                      backgroundImage: `url(${hasCustomThumb ? course.thumbnailUrl : 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'})`,
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center'
                    }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)' }}></div>

                      {/* Top Badges */}
                      <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', right: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 800, 
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          padding: '0.25rem 0.65rem', 
                          borderRadius: '0.4rem', 
                          background: isFree ? '#10B981' : '#2563EB', 
                          color: '#FFFFFF',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                        }}>
                          {isFree ? 'FREE ACCESS' : 'PREMIUM BATCH'}
                        </span>

                        <span style={{ fontSize: '0.72rem', fontWeight: 700, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', color: '#F1F5F9', padding: '0.25rem 0.6rem', borderRadius: '0.4rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                          NEPA BOARD
                        </span>
                      </div>

                      {/* Instructor Avatar Badge */}
                      <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img 
                          src={course.teacherImageUrl || teacherImg} 
                          onError={(e) => { e.target.src = teacherImg; }}
                          alt={course.instructorName || 'Gaurav Sir'} 
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38BDF8', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
                        />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                          {course.instructorName || 'Gaurav Sir & Team'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.35' }}>
                        {course.title}
                      </h3>

                      <p style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '0.88rem', 
                        lineHeight: '1.55',
                        marginBottom: '1.5rem', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden', 
                        flex: 1 
                      }}>
                        {course.description}
                      </p>

                      {/* Key Features Badges */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Video size={13} color="var(--primary)" /> HD Lectures
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FileText size={13} color="var(--success)" /> Handwritten PDFs
                        </span>
                      </div>

                      {/* Card Footer Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-placeholder)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Tuition Fee</span>
                          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: isFree ? 'var(--success)' : 'var(--primary)' }}>
                            {isFree ? 'Free Access' : `Rs. ${course.price}`}
                          </span>
                        </div>

                        <Link 
                          to={`/courses/${course._id}`} 
                          className="btn btn-primary" 
                          style={{ 
                            padding: '0.65rem 1.25rem', 
                            fontSize: '0.85rem', 
                            borderRadius: '0.65rem',
                            gap: '0.4rem',
                          }}
                        >
                          View Batch <ArrowRight size={14} />
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredCourses.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
                <GraduationCap size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.4rem' }}>
                  {isEnrolledFilter ? 'No Enrolled Batches Found' : 'No Preparation Batches Found'}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '450px', margin: '0 auto' }}>
                  {isEnrolledFilter 
                    ? 'You are not enrolled in any preparation batches yet. Click "Explore Batches" in the menu to browse our course catalogue!'
                    : 'Try clearing your search query or selecting a different category filter above.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Courses;
