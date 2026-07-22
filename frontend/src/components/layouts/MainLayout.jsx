import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Menu,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingBag,
  LogOut,
  Monitor,
  X,
  CheckCircle,
  Compass,
  FileText,
  Info,
  Bell,
  Phone,
  Home as HomeIcon,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  GraduationCap,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Footer from '../common/Footer';
import { enrollStudentApi } from '../../utils/api';
import teacherImg from '../../assets/gaurov.jpeg';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const { studyMode, applyThemeForRoute } = useTheme();
  const { collapsed, toggleSidebar } = useSidebar();

  const [searchParams] = useSearchParams();
  const [headerSearch, setHeaderSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setHeaderSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    const q = headerSearch.trim();
    if (q) {
      navigate(`/courses?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/courses');
    }
  };

  useEffect(() => {
    applyThemeForRoute(location.pathname);
  }, [location.pathname, studyMode]);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [student, setStudent] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState(null);

  // Enrollment inputs
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  useEffect(() => {
    const savedStudent = localStorage.getItem('studentUser');
    if (savedStudent) setStudent(JSON.parse(savedStudent));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const handleTriggerEnroll = (e) => {
      setEnrollCourseId(e.detail?.courseId || null);
      setShowEnrollModal(true);
    };
    window.addEventListener('trigger-student-enroll', handleTriggerEnroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('trigger-student-enroll', handleTriggerEnroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.user-dropdown-wrapper')) setShowDropdown(false);
    };
    if (showDropdown) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDropdown]);

  const handleStudentLogout = () => {
    localStorage.removeItem('studentUser');
    setStudent(null);
    setShowDropdown(false);
    navigate('/');
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !schoolName.trim() || !phoneNumber.trim() || !emailAddress.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      await enrollStudentApi({
        name: fullName,
        school: schoolName,
        phone: phoneNumber,
        email: emailAddress,
        courseId: enrollCourseId || undefined,
      });

      const newStudent = {
        name: fullName,
        school: schoolName,
        phone: phoneNumber,
        email: emailAddress,
        enrolledCourses: enrollCourseId ? [enrollCourseId] : [],
      };

      localStorage.setItem('studentUser', JSON.stringify(newStudent));
      setStudent(newStudent);
      setShowEnrollModal(false);
      setFullName(''); setSchoolName(''); setPhoneNumber(''); setEmailAddress('');
      alert(`Congratulations! You have successfully enrolled.`);
      navigate(enrollCourseId ? `/courses/${enrollCourseId}` : '/courses');
    } catch (err) {
      alert(err.message || 'Enrollment failed. Please try again.');
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { section: t('academics'), items: [
      { to: '/', icon: HomeIcon, label: t('home'), exact: true },
      { to: '/courses', icon: Compass, label: t('exploreBatches') },
      { to: '/courses?filter=enrolled', icon: Monitor, label: t('myEnrolledBatches'), matchSearch: '?filter=enrolled' },
      { to: '/notes', icon: FileText, label: t('freeNotesPdfs'), badge: 'NEW' },
    ]},
    { section: t('studyCorner'), items: [
      { to: '/about', icon: Info, label: t('aboutPlatform') },
      { to: '/exam-alerts', icon: Bell, label: t('examAlerts') },
      { to: '/support', icon: Phone, label: t('academicSupport') },
    ]},
  ];

  const getLinkActive = (item) => {
    if (item.matchSearch) return location.search === item.matchSearch;
    if (item.exact) return location.pathname === '/' && !location.search;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="main-layout-wrapper">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ height: 'var(--navbar-height)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 1.5rem', gap: '1rem' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              className="mobile-only btn-icon"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="navbar-brand" style={{ textDecoration: 'none', gap: '0.25rem', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/Logo1.png" 
                onError={(e) => { e.target.src = '/logo.jpeg'; }}
                alt="PiyushDhara Logo" 
                style={{ height: '58px', width: '58px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Piyush</span>
                  <span style={{ color: 'var(--primary)' }}>Dhara</span>
                </span>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 800,
                  color: 'var(--primary)',
                  background: 'var(--primary-light)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '0.3rem',
                  marginTop: '0.2rem',
                  display: 'inline-block',
                  width: 'fit-content',
                }}>NEPAL PREP PORTAL</span>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="navbar-search desktop-only" style={{ flex: 1, maxWidth: '400px', margin: '0 1rem' }}>
            <form
              onSubmit={handleHeaderSearchSubmit}
              style={{ position: 'relative' }}
            >
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="search-input"
                aria-label="Search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-placeholder)',
                  background: 'var(--bg-card)', padding: '0.15rem 0.4rem',
                  borderRadius: '0.25rem', border: '1px solid var(--border)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Search"
              >
                ↵
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title="Switch Language"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all var(--transition-base)',
              }}
            >
              <Globe size={14} color="var(--primary)" />
              <span className="desktop-only">{lang === 'en' ? 'NP' : 'EN'}</span>
            </button>

            {/* Teacher Portal */}
            <Link
              to="/login"
              className="btn btn-outline desktop-only"
              style={{
                padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 700,
                borderRadius: 'var(--radius-lg)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              }}
            >
              <ShieldCheck size={14} />
              <span>{t('teacherPortal')}</span>
            </Link>

            {/* Student Profile or Enroll */}
            {student ? (
              <div className="user-dropdown-wrapper" style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.35rem 0.75rem 0.35rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-input)',
                    cursor: 'pointer', color: 'var(--text-primary)',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFF', fontWeight: 800, fontSize: '0.8rem',
                  }}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textAlign: 'left' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{student.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>Student</span>
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" className="desktop-only" />
                </button>

                {showDropdown && (
                  <div className="dropdown-menu animate-fade-in">
                    <div style={{ padding: '0.5rem 0.85rem 0.5rem', color: 'var(--text-primary)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.88rem', margin: 0 }}>{student.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{student.school}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/courses?filter=enrolled'); }}>
                      <ShoppingBag size={15} /> My Purchases
                    </button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/courses?filter=enrolled'); }}>
                      <Monitor size={15} /> My Batches
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleStudentLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowEnrollModal(true)}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-lg)', gap: '0.4rem' }}
              >
                <User size={14} />
                <span>{t('enrollLogin')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Body Grid ──────────────────────────────────────────── */}
      <div className="main-content-grid">

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside
          className={`sidebar desktop-only ${collapsed ? 'collapsed' : 'expanded'}`}
          aria-label="Sidebar navigation"
        >
          <nav className="sidebar-nav">
            {navItems.map((section) => (
              <div key={section.section}>
                <p className="sidebar-section-label">{section.section}</p>
                {section.items.map((item) => {
                  const active = getLinkActive(item);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`sidebar-link ${active ? 'active' : ''}`}
                      data-tooltip={collapsed ? item.label : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="link-icon"><Icon size={18} /></span>
                      <span className="link-label">{item.label}</span>
                      {item.badge && !collapsed && (
                        <span style={{
                          marginLeft: 'auto',
                          background: active ? '#FFFFFF' : 'var(--danger)',
                          color: active ? 'var(--danger)' : '#FFFFFF',
                          fontSize: '0.6rem', fontWeight: 800,
                          padding: '0.1rem 0.35rem', borderRadius: '0.25rem',
                          flexShrink: 0,
                        }}>{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Support Widget */}
          {!collapsed && (
            <div className="sidebar-support-widget" style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0', margin: '0.5rem 0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                <img
                  src={teacherImg}
                  onError={(e) => { e.target.src = '/gaurov.jpeg'; }}
                  alt="Gaurav Sir"
                  style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB', flexShrink: 0 }}
                />
                <div>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Gaurav Sir &amp; Team</h5>
                  <p style={{ fontSize: '0.68rem', color: '#1D4ED8', margin: 0, fontWeight: 700 }}>24/7 Academic Support</p>
                </div>
              </div>
              <Link
                to="/support"
                style={{
                  display: 'block', textAlign: 'center',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid #CBD5E1',
                  padding: '0.45rem',
                  borderRadius: '0.65rem', fontSize: '0.78rem',
                  fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                Contact Support →
              </Link>
            </div>
          )}

          {/* Collapse / Expand Button */}
          <button
            className="sidebar-collapse-btn"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : (
              <>
                <ChevronLeft size={18} />
                {!collapsed && <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Collapse</span>}
              </>
            )}
          </button>
        </aside>

        {/* ── Main Content ──────────────────────────────────────── */}
        <div className="main-content-area" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--navbar-height))' }}>
          <main style={{ flex: 1, position: 'relative' }}>
            <Outlet />
          </main>
          <Footer />
        </div>

      </div>

      {/* ── Mobile Drawer ─────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex' }}>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ flex: 1, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          />
          <div
            className="animate-slide-up"
            style={{
              width: '280px', background: 'var(--bg-sidebar)',
              height: '100%', display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-2xl)', borderLeft: '1px solid var(--border)',
              overflowY: 'auto',
              position: 'fixed', right: 0, top: 0,
            }}
          >
            <div style={{
              padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)' }}>
              <form
                onSubmit={(e) => {
                  handleHeaderSearchSubmit(e);
                  setMobileMenuOpen(false);
                }}
                style={{ position: 'relative' }}
              >
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="search-input"
                  aria-label="Search"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                />
              </form>
            </div>

            <nav style={{ flex: 1, padding: '1rem 0' }}>
              {navItems.map((section) => (
                <div key={section.section} style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 1rem 0.4rem' }}>
                    {section.section}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.85rem',
                          padding: '0.7rem 1rem', color: 'var(--text-secondary)',
                          fontSize: '0.92rem', fontWeight: 500,
                          transition: 'all var(--transition-base)',
                        }}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── Enrollment Modal ─────────────────────────────────── */}
      {showEnrollModal && (
        <div 
          className="modal-overlay" 
          onClick={(e) => { if (e.target === e.currentTarget) setShowEnrollModal(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div 
            className="modal-content animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '485px',
              padding: '2.5rem 2.25rem',
              borderRadius: '2rem',
              background: '#FFFFFF',
              boxShadow: '0 25px 60px -15px rgba(37,99,235,0.22)',
              border: '1px solid #DBEAFE',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowEnrollModal(false)}
              style={{ 
                position: 'absolute', 
                top: '1.25rem', 
                right: '1.25rem', 
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F1F5F9',
                border: 'none', 
                color: '#64748B', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header with Logo */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.85rem' }}>
                <div style={{ 
                  width: '68px', 
                  height: '68px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', 
                  padding: '3px', 
                  boxShadow: '0 10px 25px rgba(37,99,235,0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <img 
                    src="/Logo1.png" 
                    onError={(e) => { e.target.src = '/logo.jpeg'; }} 
                    alt="PiyushDhara Logo" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#2563EB', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                  <ShieldCheck size={13} />
                </div>
              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
                Student Enrollment &amp; Access
              </h3>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: '#EFF6FF', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#1D4ED8' }}>
                <Sparkles size={13} color="#2563EB" /> Free Handouts &amp; Video Lectures
              </div>
            </div>

            <form onSubmit={handleEnrollSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input 
                    type="text" 
                    required 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="e.g. Pankaj Baduwal" 
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '0.85rem',
                      paddingLeft: '2.85rem',
                      paddingRight: '1rem',
                      fontSize: '0.92rem',
                      border: '1.5px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#0F172A',
                      outline: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>
              </div>

              {/* School Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  School / College Name
                </label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input 
                    type="text" 
                    required 
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)} 
                    placeholder="e.g. Adarsha Secondary School" 
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '0.85rem',
                      paddingLeft: '2.85rem',
                      paddingRight: '1rem',
                      fontSize: '0.92rem',
                      border: '1.5px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#0F172A',
                      outline: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>
              </div>

              {/* Phone & Email side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input 
                      type="tel" 
                      required 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                      placeholder="98XXXXXXXX" 
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '0.85rem',
                        paddingLeft: '2.5rem',
                        paddingRight: '0.75rem',
                        fontSize: '0.88rem',
                        border: '1.5px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input 
                      type="email" 
                      required 
                      value={emailAddress} 
                      onChange={(e) => setEmailAddress(e.target.value)} 
                      placeholder="student@gmail.com" 
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '0.85rem',
                        paddingLeft: '2.5rem',
                        paddingRight: '0.75rem',
                        fontSize: '0.88rem',
                        border: '1.5px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  height: '50px', 
                  marginTop: '0.5rem', 
                  borderRadius: '0.85rem', 
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                Verify &amp; Start Learning <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Fill Button */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setFullName('Pankaj Baduwal');
                  setSchoolName('Adarsha Secondary School');
                  setPhoneNumber('9841234567');
                  setEmailAddress('pankaj@gmail.com');
                }}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <CheckCircle2 size={13} color="#2563EB" /> Auto-fill Sample Student
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MainLayout;
