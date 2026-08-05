import { useState } from 'react';
import { X, HelpCircle, Upload, Shield, Tag, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { createCommunityPostApi } from '../../utils/api';

const AskDoubtModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic Doubts');
  const [subject, setSubject] = useState('Computer Science / Coding');
  const [difficulty, setDifficulty] = useState('Medium');
  const [tags, setTags] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    'Academic Doubts',
    'Entrance Preparation',
    'Coding & Projects',
    'Study Tips & Notes',
    'Career Advice',
    'General Discussion'
  ];

  const subjects = [
    'Computer Science / Coding',
    'Physics & Applied Mechanics',
    'Mathematics & Statistics',
    'Chemistry & Engineering',
    'IOE / Entrance Exam',
    'Loksewa & General Knowledge',
    'Web Architecture & React'
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide a doubt title and detailed question description.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('postType', 'doubt');
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('subject', subject);
      formData.append('difficulty', difficulty);
      formData.append('tags', tags);
      formData.append('isAnonymous', isAnonymous);

      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          formData.append('images', file);
        } else {
          formData.append('attachments', file);
        }
      });

      const res = await createCommunityPostApi(formData);
      if (res.success) {
        onSuccess && onSuccess(res.post);
        onClose();
      }
    } catch (err) {
      console.error('AskDoubtModal error:', err);
      setError(err.message || 'Failed to submit doubt question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: '0.5rem', fontFamily: "'Inter', sans-serif"
    }}>
      <div className="modal-card-container" style={{
        background: '#FFFFFF', width: '100%', maxWidth: '650px',
        maxHeight: '92vh', overflowY: 'auto', borderRadius: '1.25rem',
        border: '1px solid #CBD5E1', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '1.5rem', position: 'relative'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Ask an Academic Doubt</h2>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Get fast, detailed answers from educators &amp; top peers</span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Question Title */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
              Question Title *
            </label>
            <input 
              type="text" 
              placeholder="e.g., How does closure work in JavaScript async functions?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none' }}
              required
            />
          </div>

          {/* Subject & Category Grid */}
          <div className="modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
                Subject Domain
              </label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
              >
                {subjects.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
                Category
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
              >
                {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Difficulty Rating Pills */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
              Doubt Difficulty Rating
            </label>
            <div className="modal-difficulty-row" style={{ display: 'flex', gap: '0.5rem' }}>
              {['Easy', 'Medium', 'Hard'].map((lvl) => {
                const isSel = difficulty === lvl;
                const colors = {
                  Easy: { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' },
                  Medium: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
                  Hard: { bg: '#FEF2F2', border: '#FEE2E2', text: '#DC2626' }
                }[lvl];

                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    style={{
                      flex: 1, padding: '0.5rem', borderRadius: '0.5rem',
                      border: `1.5px solid ${isSel ? colors.text : '#CBD5E1'}`,
                      background: isSel ? colors.bg : '#FFFFFF',
                      color: isSel ? colors.text : '#475569',
                      fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer'
                    }}
                  >
                    {lvl} {isSel && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Detailed Content */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
              Detailed Explanation &amp; Code Snippets *
            </label>
            <textarea 
              rows={4}
              placeholder="Explain what you have tried, error tracebacks, or specific steps where you get stuck..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
              Tags (comma separated)
            </label>
            <input 
              type="text" 
              placeholder="e.g. javascript, react, closure, frontend" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.82rem', outline: 'none' }}
            />
          </div>

          {/* File Uploads */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
              Attach Diagrams, Screenshots, or Documents (PDF, Images)
            </label>
            <input 
              type="file" 
              multiple 
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileChange}
              style={{ fontSize: '0.8rem', color: '#475569' }}
            />
          </div>

          {/* Anonymous Toggle */}
          <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#7C3AED" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>Post as Anonymous Student</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Hide your name &amp; photo from peers in the feed</div>
              </div>
            </div>

            <input 
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          {/* Actions */}
          <div className="modal-action-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ padding: '0.6rem 1.1rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', background: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', color: '#475569' }}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '0.6rem 1.35rem', borderRadius: '0.65rem', border: 'none',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
              }}
            >
              <Sparkles size={16} /> {loading ? 'Posting Question...' : 'Post Question'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AskDoubtModal;
