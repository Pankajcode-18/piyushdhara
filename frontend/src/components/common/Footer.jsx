import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, ShieldCheck, Heart, ChevronRight, Users, Eye } from 'lucide-react';
import { fetchVisitorStatsApi, recordVisitorApi } from '../../utils/api';

const Footer = () => {
  const [visitorStats, setVisitorStats] = useState({ totalVisits: 1250, todayVisits: 1 });

  useEffect(() => {
    const loadStats = async () => {
      // Record visit once per session
      if (!sessionStorage.getItem('visited_session')) {
        sessionStorage.setItem('visited_session', 'true');
        const updated = await recordVisitorApi();
        if (updated) {
          setVisitorStats(updated);
          return;
        }
      }
      const data = await fetchVisitorStatsApi();
      if (data) setVisitorStats(data);
    };
    loadStats();
  }, []);
  return (
    <footer className="site-footer" style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      color: '#475569',
      padding: '4.5rem 0 2.5rem 0',
      borderTop: '1px solid #E2E8F0',
      marginTop: 'auto',
      position: 'relative'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* Footer Top Grid */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Column 1: Brand & Platform Summary */}
          <div className="footer-brand-col">
            <Link to="/" style={{ textDecoration: 'none', gap: '0.25rem', display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img 
                src="/Logo1.png" 
                onError={(e) => { e.target.src = '/logo.jpeg'; }}
                alt="PiyushDhara Logo" 
                style={{ height: '52px', width: '52px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  <span style={{ color: '#0F172A' }}>Piyush</span>
                  <span style={{ color: '#2563EB' }}>Dhara</span>
                </span>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 800,
                  color: '#2563EB',
                  background: '#EFF6FF',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '0.3rem',
                  marginTop: '0.2rem',
                  display: 'inline-block',
                  width: 'fit-content',
                }}>NEPAL PREP PORTAL</span>
              </div>
            </Link>

            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#64748B', marginBottom: '1.5rem' }}>
              Nepal's premier digital preparation platform for SEE, NEB, IOE Engineering, and Loksewa examinations with Gaurav Sir &amp; Academic Team.
            </p>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <ShieldCheck size={14} color="#2563EB" /> 100% Free Handouts
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <Sparkles size={14} color="#059669" /> HD Video Lectures
              </div>
            </div>
          </div>

          {/* Navigation Columns Group (2-column grid on mobile) */}
          <div className="footer-nav-group" style={{ display: 'contents' }}>
            {/* Column 2: Preparation Batches */}
            <div className="footer-nav-col">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                Preparation Batches
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/courses" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>Mahabharath Math Series</span>
                </Link>
                <Link to="/courses" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>Web Development (MERN)</span>
                </Link>
                <Link to="/courses" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>IOE Engineering Entrance</span>
                </Link>
                <Link to="/courses" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>Loksewa Tayari (GK &amp; IQ)</span>
                </Link>
              </div>
            </div>

            {/* Column 3: Student Corner */}
            <div className="footer-nav-col">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                Student Corner
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/courses" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>Explore All Batches</span>
                </Link>
                <Link to="/notes" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>Free Handwritten Notes</span>
                </Link>
                <Link to="/exam-alerts" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>SEE / NEB Exam Alerts</span>
                </Link>
                <Link to="/about" className="footer-link">
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>About Platform</span>
                </Link>
                <Link to="/login" className="footer-link" style={{ color: '#2563EB', fontWeight: 700 }}>
                  <ChevronRight size={14} className="link-arrow" color="#2563EB" />
                  <span>Teacher Portal Login →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 4: Academic Helpline & Support */}
          <div className="footer-support-col">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              24/7 Academic Support
            </h4>
            <div className="footer-contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#475569' }}>
              <div className="footer-contact-item">
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={16} color="#2563EB" />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Call / WhatsApp</span>
                  <strong style={{ color: '#0F172A', fontSize: '0.88rem' }}>+977-9812345678</strong>
                </div>
              </div>

              <div className="footer-contact-item">
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={16} color="#2563EB" />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Official Email</span>
                  <strong style={{ color: '#0F172A', fontSize: '0.88rem' }}>contact@piyushdhara.com</strong>
                </div>
              </div>

              <div className="footer-contact-item">
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} color="#2563EB" />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Location</span>
                  <strong style={{ color: '#0F172A', fontSize: '0.88rem' }}>Kathmandu, Nepal</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Attribution & Copyright */}
        <div className="footer-bottom-bar" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.88rem' }}>
          
          <div className="footer-copyright-box">
            <p style={{ margin: 0, color: '#64748B', fontWeight: 500 }}>
              &copy; {new Date().getFullYear()} <strong style={{ color: '#0F172A' }}>PiyushDhara</strong>. All rights reserved.
            </p>
            <p style={{ margin: '0.35rem 0 0 0', color: '#475569', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              Designed &amp; Developed with <Heart size={14} color="#EF4444" fill="#EF4444" /> by{' '}
              <a
                href="https://pankajbaduwal.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <span style={{ 
                  background: '#EFF6FF', 
                  color: '#1D4ED8', 
                  padding: '0.15rem 0.65rem', 
                  borderRadius: '9999px', 
                  border: '1px solid #BFDBFE', 
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  Pankaj Baduwal ↗
                </span>
              </a>
            </p>
          </div>

          <div className="footer-bottom-right" style={{ display: 'flex', gap: '1.5rem', fontWeight: 600, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Live Visitor Analytics Counter */}
            <div className="footer-visitor-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 1rem',
              background: '#F1F5F9',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#334155'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#2563EB' }}>
                <Users size={14} /> Total Visitors: <strong style={{ color: '#0F172A', fontWeight: 800 }}>{visitorStats.totalVisits.toLocaleString()}</strong>
              </span>
              <span style={{ color: '#CBD5E1' }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#059669' }}>
                <Eye size={14} /> Today: <strong style={{ color: '#059669', fontWeight: 800 }}>{visitorStats.todayVisits.toLocaleString()}</strong>
              </span>
            </div>

            <div className="footer-legal-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/about" className="footer-link">Privacy Policy</Link>
              <Link to="/about" className="footer-link">Terms of Service</Link>
              <Link to="/support" className="footer-link" style={{ color: '#2563EB' }}>Academic Helpline</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
