import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');

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
    window.location.href = '/';
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`navbar glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex-between" style={{ height: '100%' }}>
        
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <BookOpen className="brand-icon" size={28} />
          <span className="brand-text" style={{ background: 'linear-gradient(to right, #0f172a, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>PiyushDhara</span>
        </Link>

        {/* Links */}
        <div className="navbar-links desktop-only">
          <Link to="/courses" className={`nav-link ${isActive('/courses')}`}>Explore Batches</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
          
          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link to="/admin" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.25rem' }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.25rem', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger-color)', border: 'none' }}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              Teacher Portal
            </Link>
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
