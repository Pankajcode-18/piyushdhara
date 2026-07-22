import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPublishedNotesApi } from '../utils/api';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  BookOpen, 
  Sparkles, 
  GraduationCap,
  Filter,
  Layers,
  FileCheck
} from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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

  const getFullFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/${url}`;
  };

  return (
    <div className="notes-page bg-mesh animate-fade-in" style={{ minHeight: '92vh', padding: '2.5rem 0 5rem 0' }}>
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
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 50%, #F8FAFC 100%)', 
            color: '#0F172A',
            boxShadow: '0 20px 40px -15px rgba(239,68,68,0.08)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #FEE2E2'
          }}
        >
          {/* Ambient Glowing Orbs */}
          <div style={{ position: 'absolute', top: '-25%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', filter: 'blur(35px)' }}></div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: '#FEE2E2', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#DC2626', marginBottom: '1.25rem' }}>
                <Sparkles size={14} /> FREE HANDWRITTEN RESOURCES
              </div>

              <h1 className="page-title-responsive" style={{ fontSize: '2.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.85rem', lineHeight: '1.2' }}>
                Free Notes &amp; PDF Handouts
              </h1>

              <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '620px', lineHeight: '1.7', margin: 0 }}>
                Download chapter-wise handwritten notes, formula cheat-sheets, and past board exam solutions prepared by Gaurav Sir &amp; Team for SEE, Class 11, and Class 12 Science/Commerce.
              </p>
            </div>

            {/* Search Input Box */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search className="search-icon" size={20} style={{ left: '1.25rem', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search notes, chapters, subjects..."
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
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem' }}>
            <Filter size={16} /> Subject Filter:
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
                  border: isSelected ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                  background: isSelected ? 'linear-gradient(135deg, var(--danger), #DC2626)' : 'var(--bg-card)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: isSelected ? '0 4px 12px rgba(239,68,68,0.3)' : 'var(--shadow-xs)'
                }}
              >
                <Icon size={15} color={isSelected ? '#FFFFFF' : 'var(--text-muted)'} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 3. Notes Card Grid Listing */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="card glass" style={{ height: '260px', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FFFFFF' }}>
                <div style={{ height: '40px', width: '60%', background: '#F1F5F9', borderRadius: '0.5rem' }}></div>
                <div style={{ height: '24px', width: '85%', background: '#F1F5F9', borderRadius: '0.3rem' }}></div>
                <div style={{ height: '18px', width: '95%', background: '#F1F5F9', borderRadius: '0.3rem' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '2rem' }}>
            <AnimatePresence>
              {filteredNotes.map((note, idx) => {
                const fileUrl = getFullFileUrl(note.fileUrl);
                const courseTitle = note.chapter?.subject?.course?.title || 'Nepal Board Prep';
                const subjectTitle = note.chapter?.subject?.title || 'General';
                const chapterTitle = note.chapter?.title;

                return (
                  <motion.div
                    key={note._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '2rem',
                    }}
                  >
                    <div>
                      {/* Top Header Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: 'var(--primary)', 
                          background: 'var(--primary-light)', 
                          padding: '0.25rem 0.65rem', 
                          borderRadius: '0.4rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <GraduationCap size={13} /> {courseTitle}
                        </span>
                        {subjectTitle && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            • {subjectTitle}
                          </span>
                        )}
                      </div>

                      {/* PDF Icon & Title Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.1rem', marginBottom: '1.25rem' }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '0.85rem', 
                          background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.06) 100%)', 
                          color: 'var(--danger)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(239,68,68,0.2)',
                          boxShadow: '0 4px 10px rgba(239,68,68,0.1)'
                        }}>
                          <FileText size={26} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem', lineHeight: '1.35' }}>
                            {note.title}
                          </h3>
                          {chapterTitle && (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
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
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ 
                          flex: 1, 
                          padding: '0.65rem 1rem', 
                          fontSize: '0.85rem', 
                          gap: '0.4rem', 
                          justifyContent: 'center',
                          borderRadius: '0.65rem',
                          boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                        }}
                      >
                        <Eye size={15} /> View PDF
                      </a>
                      
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-outline"
                        style={{ 
                          padding: '0.65rem 1rem', 
                          fontSize: '0.85rem', 
                          gap: '0.4rem', 
                          justifyContent: 'center', 
                          color: '#475569',
                          borderRadius: '0.65rem'
                        }}
                      >
                        <Download size={15} /> Download
                      </a>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredNotes.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
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
