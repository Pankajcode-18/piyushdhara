import { useState, useEffect } from 'react';
import { fetchPlatformConfigApi, updatePlatformConfigApi, fetchCertificationsApi, fetchQuizzesApi } from '../../utils/api';
import { 
  Sparkles, Save, Image, Tag, Megaphone, BarChart2, Award, HelpCircle, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, Layout, Eye
} from 'lucide-react';

const AdminPlatformSettings = () => {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [hero, setHero] = useState({
    badge: '🎓 #1 LMS PLATFORM',
    title: 'Master In-Demand Tech Skills with Verified Certifications',
    subtitle: 'Interactive lessons, real-world coding projects, secure anti-cheat examinations, and instant industry certifications.',
    primaryCtaText: 'Explore Certifications',
    primaryCtaLink: '/certifications',
    secondaryCtaText: 'Take Practice Quiz',
    secondaryCtaLink: '/quizzes',
    heroImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
  });

  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    studentsEnrolled: 370,
    certificationsIssued: 120,
    passRatePct: 94,
    activeAssessments: 28
  });

  // Draft items
  const [newAnn, setNewAnn] = useState({ title: '', content: '', badgeText: 'ANNOUNCEMENT', badgeColor: '#2563EB', linkUrl: '' });
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', color: '#2563EB' });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchPlatformConfigApi();
      if (res?.config) {
        if (res.config.heroBanner) setHero(res.config.heroBanner);
        if (res.config.announcements) setAnnouncements(res.config.announcements);
        if (res.config.categories) setCategories(res.config.categories);
        if (res.config.stats) setStats(res.config.stats);
      }
    } catch (err) {
      console.error('Failed to load platform settings', err);
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');

      await updatePlatformConfigApi(token, {
        heroBanner: hero,
        announcements,
        categories,
        stats
      });

      setSuccessMsg('Platform configuration saved & published live to student portal!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save platform config', err);
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const addAnnouncement = () => {
    if (!newAnn.title.trim() || !newAnn.content.trim()) return;
    setAnnouncements([...announcements, { ...newAnn, createdAt: new Date() }]);
    setNewAnn({ title: '', content: '', badgeText: 'ANNOUNCEMENT', badgeColor: '#2563EB', linkUrl: '' });
  };

  const removeAnnouncement = (index) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    if (!newCat.name.trim()) return;
    const slug = newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setCategories([...categories, { ...newCat, slug }]);
    setNewCat({ name: '', slug: '', description: '', color: '#2563EB' });
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
        Loading platform customization settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> LIVE LMS PLATFORM CONTROL
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Platform Customization &amp; Homepage Manager
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '0.25rem 0 0 0' }}>
            Control hero banners, announcements, featured categories, and platform statistics without modifying code.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.4rem', borderRadius: '0.75rem', background: '#2563EB', color: '#FFFFFF',
            fontWeight: 800, fontSize: '0.92rem', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}
        >
          {saving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
          {saving ? 'Publishing Changes...' : 'Save & Publish Live'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ padding: '1rem 1.25rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '1rem 1.25rem', background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {/* Hero Banner Manager */}
      <div style={{ background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layout size={20} color="#2563EB" /> Homepage Hero Banner
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Hero Badge Text</label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Primary CTA Text &amp; Link</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                placeholder="Button Label"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
              <input
                type="text"
                value={hero.primaryCtaLink}
                onChange={(e) => setHero({ ...hero, primaryCtaLink: e.target.value })}
                placeholder="/link"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Main Headline Title</label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 600 }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Subtitle Description</label>
            <textarea
              rows={2}
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Hero Banner Image URL</label>
            <input
              type="text"
              value={hero.heroImageUrl}
              onChange={(e) => setHero({ ...hero, heroImageUrl: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      </div>

      {/* Announcements Manager */}
      <div style={{ background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={20} color="#7C3AED" /> Announcements &amp; Notice Board
        </h2>

        {/* Add Announcement Form */}
        <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Announcement Title"
              value={newAnn.title}
              onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
              style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
            <input
              type="text"
              placeholder="Badge Label (e.g. EXAM NOTICE)"
              value={newAnn.badgeText}
              onChange={(e) => setNewAnn({ ...newAnn, badgeText: e.target.value })}
              style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>
          <textarea
            rows={2}
            placeholder="Detailed announcement text for students..."
            value={newAnn.content}
            onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem', marginBottom: '0.75rem' }}
          />
          <button
            onClick={addAnnouncement}
            style={{ padding: '0.55rem 1.1rem', background: '#7C3AED', color: '#FFF', borderRadius: '0.5rem', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Announcement
          </button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {announcements.map((ann, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', background: ann.badgeColor || '#2563EB', color: '#FFF', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  {ann.badgeText}
                </span>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{ann.title}</h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569' }}>{ann.content}</p>
              </div>
              <button
                onClick={() => removeAnnouncement(idx)}
                style={{ padding: '0.4rem', color: '#EF4444', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Manager */}
      <div style={{ background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={20} color="#059669" /> Learning Categories Manager
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="Category Name"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
          />
          <input
            type="text"
            placeholder="Description"
            value={newCat.description}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
            style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
          />
          <button
            onClick={addCategory}
            style={{ padding: '0.6rem 1rem', background: '#059669', color: '#FFF', borderRadius: '0.5rem', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {categories.map((cat, idx) => (
            <div key={idx} style={{ padding: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{cat.name}</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>{cat.description || cat.slug}</p>
              </div>
              <button
                onClick={() => removeCategory(idx)}
                style={{ padding: '0.35rem', color: '#EF4444', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPlatformSettings;
