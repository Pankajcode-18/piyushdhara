import { useState } from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, FolderPlus, ShieldCheck, Home, Award, HelpCircle, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Strict Auth Protection: Redirect unauthenticated users immediately to /login
  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @media (max-width: 767px) {
          .mobile-sidebar-open {
            position: fixed !important;
            top: 52px !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 100 !important;
            width: 260px !important;
            box-shadow: 10px 0 30px rgba(0,0,0,0.18) !important;
            display: flex !important;
          }
        }
      `}</style>
      
      {/* Mobile Top Navbar for Admin Portal */}
      <div 
        className="hide-tablet"
        style={{
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          borderBottom: '1px solid #1E293B'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img src="/Logo1.png" onError={(e) => { e.target.src = '/logo.jpeg'; }} alt="Logo" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>PiyushDhara <span style={{ color: '#38BDF8', fontSize: '0.72rem' }}>ADMIN</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '0.25rem' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        
        {/* Admin Sidebar */}
        <aside 
          className={mobileOpen ? 'mobile-sidebar-open' : 'hide-mobile'}
          style={{ 
            width: '260px',
            minWidth: '260px',
            maxWidth: '260px',
            flexShrink: 0,
            background: '#FFFFFF', 
            borderRight: '1px solid #E2E8F0', 
            padding: '1.25rem 1rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxShadow: '2px 0 10px rgba(0,0,0,0.02)',
            boxSizing: 'border-box'
          }}
        >
        
        {/* Branding Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingBottom: '0.85rem', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#EFF6FF', border: '1px solid #DBEAFE', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src="/Logo1.png" onError={(e) => { e.target.src = '/logo.jpeg'; }} alt="PiyushDhara Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Piyush<span style={{ color: '#2563EB' }}>Dhara</span></h4>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '0.08rem 0.35rem', borderRadius: '0.25rem' }}>TEACHER PORTAL</span>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, overflowY: 'auto' }}>
          <Link 
            to="/admin" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.7rem 0.85rem', borderRadius: '0.75rem', 
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700,
              background: location.pathname === '/admin' ? '#EFF6FF' : 'transparent',
              color: location.pathname === '/admin' ? '#1D4ED8' : '#475569',
              border: location.pathname === '/admin' ? '1px solid #BFDBFE' : '1px solid transparent'
            }}
          >
            <LayoutDashboard size={18} color={location.pathname === '/admin' ? '#2563EB' : '#64748B'} /> Dashboard
          </Link>

          <Link 
            to="/admin/courses" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.7rem 0.85rem', borderRadius: '0.75rem', 
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700,
              background: location.pathname.startsWith('/admin/courses') ? '#EFF6FF' : 'transparent',
              color: location.pathname.startsWith('/admin/courses') ? '#1D4ED8' : '#475569',
              border: location.pathname.startsWith('/admin/courses') ? '1px solid #BFDBFE' : '1px solid transparent'
            }}
          >
            <FolderPlus size={18} color={location.pathname.startsWith('/admin/courses') ? '#2563EB' : '#64748B'} /> Manage Courses
          </Link>

          <Link 
            to="/admin/certifications" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.7rem 0.85rem', borderRadius: '0.75rem', 
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700,
              background: location.pathname.startsWith('/admin/certifications') ? '#EFF6FF' : 'transparent',
              color: location.pathname.startsWith('/admin/certifications') ? '#1D4ED8' : '#475569',
              border: location.pathname.startsWith('/admin/certifications') ? '1px solid #BFDBFE' : '1px solid transparent'
            }}
          >
            <Award size={18} color={location.pathname.startsWith('/admin/certifications') ? '#2563EB' : '#64748B'} /> Certifications LMS
          </Link>

          <Link 
            to="/admin/quizzes" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.7rem 0.85rem', borderRadius: '0.75rem', 
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700,
              background: location.pathname.startsWith('/admin/quizzes') ? '#EFF6FF' : 'transparent',
              color: location.pathname.startsWith('/admin/quizzes') ? '#1D4ED8' : '#475569',
              border: location.pathname.startsWith('/admin/quizzes') ? '1px solid #BFDBFE' : '1px solid transparent'
            }}
          >
            <HelpCircle size={18} color={location.pathname.startsWith('/admin/quizzes') ? '#2563EB' : '#64748B'} /> Quiz &amp; Exams Studio
          </Link>

          <Link 
            to="/admin/security-audit" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.7rem 0.85rem', borderRadius: '0.75rem', 
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700,
              background: location.pathname.startsWith('/admin/security-audit') ? '#EFF6FF' : 'transparent',
              color: location.pathname.startsWith('/admin/security-audit') ? '#1D4ED8' : '#475569',
              border: location.pathname.startsWith('/admin/security-audit') ? '1px solid #BFDBFE' : '1px solid transparent'
            }}
          >
            <ShieldCheck size={18} color={location.pathname.startsWith('/admin/security-audit') ? '#2563EB' : '#64748B'} /> Security &amp; Audit Logs
          </Link>

          <Link 
            to="/" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.7rem 0.85rem', borderRadius: '0.75rem', 
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
              color: '#64748B', marginTop: 'auto'
            }}
          >
            <Home size={18} color="#64748B" /> View Student Portal
          </Link>
        </div>

        {/* User Info & Logout */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
            Logged in as: <strong style={{ color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'Teacher'}</strong>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.55rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #FEE2E2',
              background: '#FEF2F2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} /> Logout Teacher
          </button>
        </div>

      </aside>

      {/* Main Admin Workspace */}
      <main style={{ flex: 1, minWidth: 0, padding: '2rem 2.5rem', overflowY: 'auto', background: '#F8FAFC' }}>
        <Outlet />
      </main>

      </div>
    </div>
  );
};

export default AdminLayout;
