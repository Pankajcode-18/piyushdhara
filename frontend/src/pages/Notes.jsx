import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPublishedNotesApi, getFileUrl } from '../utils/api';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  BookOpen, 
  Sparkles, 
  GraduationCap,
  Layers,
  FileCheck,
  ShieldAlert,
  Lock
} from 'lucide-react';

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const token = localStorage.getItem('token');

  const categories = [
    { id: 'ALL', label: 'All Resources', icon: Layers },
    { id: 'MATH', label: 'Mathematics', icon: GraduationCap },
    { id: 'SCIENCE', label: 'Science & Physics', icon: BookOpen },
    { id: 'SEE', label: 'Class 10 (SEE)', icon: Sparkles },
    { id: 'NEB', label: 'NEB Grade 11-12', icon: FileCheck },
  ];

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    setSearchQuery(queryParam || '');
  }, [queryParam]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, notes]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await fetchPublishedNotesApi();
      setNotes(data);
      setFilteredNotes(data);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  };

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

  const applyFilters = () => {
    let result = [...notes];

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => {
        const titleMatch = n.title?.toLowerCase().includes(q);
        const descMatch = n.description && n.description.toLowerCase().includes(q);
        const chapterMatch = n.chapter?.title?.toLowerCase().includes(q);
        const subjectMatch = n.chapter?.subject?.title?.toLowerCase().includes(q);
        const courseMatch = n.chapter?.subject?.course?.title?.toLowerCase().includes(q);
        return titleMatch || descMatch || chapterMatch || subjectMatch || courseMatch;
      });
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'MATH') {
        result = result.filter(n => 
          n.title?.toUpperCase().includes('MATH') || 
          n.chapter?.subject?.title?.toUpperCase().includes('MATH') ||
          n.chapter?.subject?.course?.title?.toUpperCase().includes('MATH')
        );
      } else if (selectedCategory === 'SCIENCE') {
        result = result.filter(n => 
          n.title?.toUpperCase().includes('SCIENCE') || 
          n.title?.toUpperCase().includes('PHYSICS') ||
          n.title?.toUpperCase().includes('GRAVITATION') ||
          n.chapter?.subject?.title?.toUpperCase().includes('SCIENCE')
        );
      } else if (selectedCategory === 'SEE') {
        result = result.filter(n => 
          n.title?.toUpperCase().includes('SEE') || 
          n.chapter?.subject?.course?.title?.toUpperCase().includes('SEE') ||
          n.chapter?.subject?.course?.title?.includes('10')
        );
      } else if (selectedCategory === 'NEB') {
        result = result.filter(n => 
          n.title?.toUpperCase().includes('NEB') || 
          n.chapter?.subject?.course?.title?.includes('11') ||
          n.chapter?.subject?.course?.title?.includes('12')
        );
      }
    }

    setFilteredNotes(result);
  };

  const handlePdfAction = (e) => {
    if (!token) {
      e.preventDefault();
      navigate('/login?redirect=/notes');
    }
  };

  return (
    <div className="notes-page bg-mesh animate-fade-in" style={{ minHeight: '92vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* 1. Hero Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-banner-responsive notes-hero-banner"
          style={{ 
            borderRadius: '1.75rem', 
            padding: '3.5rem 3rem', 
            marginBottom: '2.5rem', 
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 50%, #F8FAFC 100%)', 
            color: '#0F172A',
            boxShadow: '0 20px 40px -15px rgba(239,68,68,0.08)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #FEE2E2'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="notes-banner-content" style={{ flex: '1 1 500px' }}>
              <div className="notes-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: '#FEE2E2', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#DC2626', marginBottom: '1.25rem' }}>
                <Sparkles size={14} /> CDC CURRICULUM HANDOUTS
              </div>

              <h1 className="notes-hero-title" style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-0.02em', color: '#0F172A' }}>
                Handwritten <span style={{ color: '#DC2626' }}>PDF Notes</span>
              </h1>

              <p className="notes-hero-desc" style={{ color: '#475569', fontSize: '1.05rem', margin: 0, maxWidth: '680px', lineHeight: '1.7' }}>
                Download high-yield handwritten chapter handouts, formula cheat-sheets, and numerical problem step-by-step solutions compiled by Gaurav Sir & Team.
              </p>
            </div>

            {/* Quick Stat Counter */}
            <div className="notes-stat-box" style={{ background: '#FFFFFF', padding: '1.25rem 2rem', borderRadius: '1.25rem', border: '1px solid #FEE2E2', boxShadow: '0 10px 25px rgba(239,68,68,0.06)', textAlign: 'center' }}>
              <div className="notes-stat-num" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#DC2626' }}>{filteredNotes.length}</div>
              <div className="notes-stat-label" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PDF Resources
              </div>
            </div>
          </div>
        </motion.div>

        {/* Non-Logged In Warning Banner */}
        {!token && (
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FEE2E2', padding: '1.25rem 1.75rem', borderRadius: '1.25rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <ShieldAlert size={24} color="#DC2626" />
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', color: '#991B1B', fontSize: '1rem', fontWeight: 800 }}>Login Required to Access PDF Handouts</h4>
                <p style={{ margin: 0, color: '#B91C1C', fontSize: '0.88rem' }}>Please log in or register to view handwritten notes online and download PDFs.</p>
              </div>
            </div>
            <Link to="/login?redirect=/notes" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem', background: '#DC2626' }}>
              Login / Register Now →
            </Link>
          </div>
        )}

        {/* 2. Controls & Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input 
              type="text" 
              placeholder="Search PDF notes by topic, subject, or chapter name..." 
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                width: '100%',
                height: '52px',
                paddingLeft: '3.25rem',
                paddingRight: '1rem',
                borderRadius: '1rem',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.95rem',
                outline: 'none',
                background: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
            />
          </div>

          {/* Category Tabs */}
            <div className="tab-strip-scroll" style={{ gap: '0.75rem', paddingBottom: '0.5rem' }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '0.75rem',
                    border: isSelected ? '2px solid #DC2626' : '1.5px solid #E2E8F0',
                    background: isSelected ? '#FEF2F2' : '#FFFFFF',
                    color: isSelected ? '#DC2626' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* 3. Notes Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <FileText size={44} color="#DC2626" className="animate-spin" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#475569', fontSize: '1.1rem' }}>Loading PDF handouts...</h3>
          </div>
        ) : (
          <div className="notes-grid">
            <AnimatePresence>
              {filteredNotes.map((note, idx) => {
                const fileUrl = getFileUrl(note.fileUrl);
                const chapterTitle = note.chapter?.title;
                const subjectTitle = note.chapter?.subject?.title;
                const courseTitle = note.chapter?.subject?.course?.title;

                return (
                  <motion.div
                    key={note._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="card notes-card"
                    style={{ 
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      borderRadius: '1.25rem',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>
                      {/* Course / Subject Tag */}
                      <div className="notes-card-tags" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                        {courseTitle && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '0.35rem', background: '#EFF6FF', color: '#2563EB' }}>
                            {courseTitle}
                          </span>
                        )}
                        {subjectTitle && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '0.35rem', background: '#F1F5F9', color: '#475569' }}>
                            • {subjectTitle}
                          </span>
                        )}
                      </div>

                      {/* PDF Icon & Title Header */}
                      <div className="notes-card-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem' }}>
                        <div className="notes-card-icon" style={{ 
                          width: '42px', 
                          height: '42px', 
                          borderRadius: '0.75rem', 
                          background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.06) 100%)', 
                          color: '#DC2626', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(239,68,68,0.2)',
                          boxShadow: '0 4px 10px rgba(239,68,68,0.1)'
                        }}>
                          <FileText size={22} />
                        </div>
                        <div>
                          <h3 className="notes-card-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem', lineHeight: '1.3' }}>
                            {note.title}
                          </h3>
                          {chapterTitle && (
                            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, fontWeight: 600 }}>
                              Chapter: {chapterTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {note.description && (
                        <p style={{ 
                          color: '#64748B', 
                          fontSize: '0.9rem', 
                          lineHeight: '1.55',
                          marginBottom: '1.5rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {note.description}
                        </p>
                      )}
                    </div>

                    {/* Actions Footer */}
                    <div className="notes-card-actions" style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                      <a
                        href={token ? fileUrl : '#'}
                        onClick={handlePdfAction}
                        target={token ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ 
                          flex: 1, 
                          padding: '0.55rem 0.85rem', 
                          fontSize: '0.82rem', 
                          gap: '0.35rem', 
                          justifyContent: 'center',
                          borderRadius: '0.65rem',
                          background: token ? '#2563EB' : '#DC2626',
                          boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                        }}
                      >
                        {token ? <><Eye size={14} /> View PDF</> : <><Lock size={14} /> Login to View</>}
                      </a>
                      
                      <a
                        href={token ? fileUrl : '#'}
                        onClick={handlePdfAction}
                        target={token ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        download={token ? true : undefined}
                        className="btn btn-outline"
                        style={{ 
                          flex: 1,
                          padding: '0.55rem 0.85rem', 
                          fontSize: '0.82rem', 
                          gap: '0.35rem', 
                          justifyContent: 'center', 
                          color: '#475569',
                          borderRadius: '0.65rem'
                        }}
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredNotes.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 1rem', color: '#64748B' }}>
                <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.4rem' }}>
                  No PDF Notes Found
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '450px', margin: '0 auto' }}>
                  Try clearing your search query or selecting a different subject filter above.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notes;
