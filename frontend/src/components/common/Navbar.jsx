import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, LogOut, LayoutDashboard, UserCheck, GraduationCap, LogIn, UserPlus, Flame } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;
  const streakCount = userObj?.streakCount || Number(localStorage.getItem('study_streak_count') || 1);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`navbar glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex-between" style={{ height: '100%' }}>
        
        {/* Logo & Daily Streak Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="navbar-brand">
            <BookOpen className="brand-icon" size={28} />
            <span className="brand-text" style={{ background: 'linear-gradient(to right, #0f172a, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>PiyushDhara</span>
          </Link>

          {/* Daily Study Streak Badge (Always Visible) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.85rem',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#D97706',
            border: '1.5px solid #FCD34D',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
            cursor: 'default'
          }} title="Daily Study Streak! Watch at least 1 lecture daily to keep your streak active 🔥">
            <Flame size={18} fill="#F59E0B" color="#D97706" />
            <span>{streakCount} Day Streak 🔥</span>
          </div>
        </div>

        {/* Links */}
        <div className="navbar-links desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/courses" className={`nav-link ${isActive('/courses')}`}>Explore Batches</Link>
          <Link to="/notes" className={`nav-link ${isActive('/notes')}`}>PDF Notes</Link>

          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/my-courses" className={`nav-link ${isActive('/my-courses')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#2563EB' }}>
                <GraduationCap size={18} /> My Enrolled Batches
              </Link>

              {userObj?.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', gap: '0.25rem' }}>
                  <LayoutDashboard size={14} /> Teacher Portal
                </Link>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', background: '#EFF6FF', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 700, color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                <UserCheck size={14} /> {userObj?.name || 'Student'}
              </div>

              <button onClick={handleLogout} className="btn" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', gap: '0.25rem', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger-color)', border: 'none', borderRadius: '0.5rem' }} title="Log out of account">
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem', gap: '0.4rem', borderColor: '#CBD5E1', color: '#0F172A' }}>
                <LogIn size={15} /> Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1.25rem', fontSize: '0.88rem', gap: '0.4rem' }}>
                <UserPlus size={15} /> Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="navbar-actions mobile-only">
          <button className="mobile-menu-btn" style={{ background: 'none', border: 'none' }}>
            <Menu size={24} />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
