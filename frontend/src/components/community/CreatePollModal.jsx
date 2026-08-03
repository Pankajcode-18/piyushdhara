import { useState } from 'react';
import { X, BarChart2, Plus, Trash2, Shield, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { createCommunityPostApi } from '../../utils/api';

const CreatePollModal = ({ isOpen, onClose, onSuccess }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [durationDays, setDurationDays] = useState(7);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState('General Discussion');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanQuestion = question.trim();
    const cleanOptions = options.map(o => o.trim()).filter(Boolean);

    if (!cleanQuestion) {
      setError('Please provide a poll question title.');
      return;
    }

    if (cleanOptions.length < 2) {
      setError('Please provide at least 2 valid poll choices.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const postPayload = {
        postType: 'poll',
        title: cleanQuestion,
        content: `Poll Question: ${cleanQuestion}`,
        category,
        subject: 'General',
        pollOptions: cleanOptions,
        pollDurationDays: Number(durationDays),
        pollAllowMultiple: allowMultiple,
        pollIsAnonymous: isAnonymous,
        isAnonymous
      };

      const res = await createCommunityPostApi(postPayload);
      if (res.success) {
        onSuccess && onSuccess(res.post);
        onClose();
      }
    } catch (err) {
      console.error('CreatePollModal error:', err);
      setError(err.message || 'Failed to create interactive poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem', fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: '#FFFFFF', width: '100%', maxWidth: '600px',
        maxHeight: '90vh', overflowY: 'auto', borderRadius: '1.25rem',
        border: '1px solid #CBD5E1', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '1.75rem', position: 'relative'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Create Community Poll</h2>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Gather opinions &amp; live votes from fellow students</span>
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

          {/* Poll Question */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
              Poll Question *
            </label>
            <input 
              type="text" 
              placeholder="e.g. Which web framework are you using for your final year project?" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none' }}
              required
            />
          </div>

          {/* Options (2-6) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Poll Choices (2 – 6 options) *
              </label>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Plus size={14} /> Add Option
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {options.map((opt, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', width: '22px' }}>{index + 1}.</span>
                  <input 
                    type="text" 
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.82rem', outline: 'none' }}
                    required
                  />
                  {options.length > 2 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Poll Duration */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
              Poll Duration
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[
                { label: '1 Day', days: 1 },
                { label: '3 Days', days: 3 },
                { label: '7 Days', days: 7 },
                { label: '14 Days', days: 14 }
              ].map(d => {
                const isSel = Number(durationDays) === d.days;
                return (
                  <button
                    type="button"
                    key={d.days}
                    onClick={() => setDurationDays(d.days)}
                    style={{
                      padding: '0.5rem', borderRadius: '0.5rem',
                      border: `1.5px solid ${isSel ? '#7C3AED' : '#CBD5E1'}`,
                      background: isSel ? '#F3E8FF' : '#FFFFFF',
                      color: isSel ? '#7C3AED' : '#475569',
                      fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer'
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles: Multi-Choice & Anonymous */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}>Allow voters to select multiple choices</span>
              <input 
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}>Post Poll Anonymously</span>
              <input 
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
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
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(124,58,237,0.25)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
              }}
            >
              <Sparkles size={16} /> {loading ? 'Publishing Poll...' : 'Launch Poll'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreatePollModal;
