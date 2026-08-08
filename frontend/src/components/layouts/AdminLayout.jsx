import { useState } from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, FolderPlus, ShieldCheck, Home, Award, HelpCircle, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/admin',                label: 'Dashboard',            Icon: LayoutDashboard, exact: true  },
  { to: '/admin/courses',        label: 'Manage Courses',       Icon: FolderPlus,      exact: false },
  { to: '/admin/certifications', label: 'Certifications LMS',   Icon: Award,           exact: false },
  { to: '/admin/quizzes',        label: 'Quiz & Exams Studio',  Icon: HelpCircle,      exact: false },
  { to: '/admin/security-audit', label: 'Security & Audit Logs',Icon: ShieldCheck,     exact: false },
];

const AdminLayout = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem('token');
  const userStr   = localStorage.getItem('user');
  const user      = userStr ? JSON.parse(userStr) : null;
  const [open, setOpen] = useState(false);

  if (!token || !user || (user.role !== 'admin' && user.role !== 'teacher')) {
    return <Navigate to="/teacher-login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const closeSidebar = () => setOpen(false);

  const isActive = ({ to, exact }) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  /* ── Shared sidebar panel ────────────────────────────── */
  const SidebarPanel = ({ onClose }) => (
    <div
      style={{
        width: 260,
        minWidth: 260,
        background: '#fff',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.25rem 1rem',
        boxSizing: 'border-box',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Branding row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: '0.85rem', borderBottom: '1px solid #F1F5F9', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: '#EFF6FF', border: '1px solid #DBEAFE',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <img
              src="/Logo1.png"
              onError={e => { e.target.src = '/logo.jpeg'; }}
              alt="Logo"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Piyush<span style={{ color: '#2563EB' }}>Dhara</span>
            </h4>
            <span style={{
              fontSize: '0.6rem', fontWeight: 800, color: '#2563EB',
              background: '#EFF6FF', padding: '0.08rem 0.35rem', borderRadius: '0.25rem',
            }}>
              TEACHER PORTAL
            </span>
          </div>
        </div>

        {/* Close btn — only rendered when onClose provided (mobile) */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              background: '#F1F5F9', border: 'none', borderRadius: '0.5rem',
              color: '#475569', cursor: 'pointer', padding: '0.3rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 32, minHeight: 32,
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, overflowY: 'auto' }}>
        {NAV_LINKS.map(link => {
          const active = isActive(link);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 0.85rem', borderRadius: '0.75rem',
                textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700,
                background: active ? '#EFF6FF' : 'transparent',
                color:      active ? '#1D4ED8' : '#475569',
                border:     active ? '1px solid #BFDBFE' : '1px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              <link.Icon size={18} color={active ? '#2563EB' : '#64748B'} />
              {link.label}
            </Link>
          );
        })}

        <Link
          to="/"
          onClick={closeSidebar}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.7rem 0.85rem', borderRadius: '0.75rem',
            textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600,
            color: '#64748B', marginTop: 'auto', border: '1px solid transparent',
          }}
        >
          <Home size={18} color="#64748B" /> View Student Portal
        </Link>
      </nav>

      {/* User info + logout */}
      <div style={{
        paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9',
        display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0,
      }}>
        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
          Logged in as:
          <strong style={{
            color: '#0F172A', display: 'block',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.email || 'Teacher'}
          </strong>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.55rem 0.85rem', borderRadius: '0.65rem',
            border: '1px solid #FEE2E2', background: '#FEF2F2',
            color: '#DC2626', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          <LogOut size={15} /> Logout Teacher
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>

      {/* ════ DESKTOP layout (≥ 768px) ═══════════════════════ */}
      <div className="admin-desktop-layout" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sticky sidebar */}
        <aside style={{
          width: 260, minWidth: 260, flexShrink: 0,
          position: 'sticky', top: 0, height: '100vh', maxHeight: '100vh',
          boxShadow: '2px 0 10px rgba(0,0,0,0.04)',
        }}>
          <SidebarPanel onClose={null} />
        </aside>

        <main style={{ flex: 1, minWidth: 0, padding: '2rem 2.5rem', overflowY: 'auto', background: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>

      {/* ════ MOBILE layout (< 768px) ════════════════════════ */}
      <div className="admin-mobile-layout" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

        {/* Top bar */}
        <div style={{
          background: '#0F172A', color: '#fff',
          padding: '0 1rem', height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
          borderBottom: '1px solid #1E293B',
        }}>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            style={{
              background: 'none', border: 'none', color: '#fff',
              cursor: 'pointer', padding: '0.35rem',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Menu size={22} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src="/Logo1.png"
              onError={e => { e.target.src = '/logo.jpeg'; }}
              alt="Logo"
              style={{ width: 28, height: 28, borderRadius: '50%' }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              PiyushDhara <span style={{ color: '#38BDF8', fontSize: '0.65rem' }}>ADMIN</span>
            </span>
          </div>

          {/* spacer */}
          <div style={{ width: 30 }} />
        </div>

        {/* Drawer overlay — full screen, click outside closes */}
        {open && (
          <div
            onClick={closeSidebar}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(15,23,42,0.5)',
              display: 'flex', alignItems: 'stretch',
            }}
          >
            {/* Sidebar panel — stop propagation so clicks inside don't close */}
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: 260, height: '100%',
                boxShadow: '8px 0 32px rgba(0,0,0,0.25)',
                animation: 'slideInLeft 0.25s ease',
              }}
            >
              <SidebarPanel onClose={closeSidebar} />
            </div>

            {/* Right area: tap to dismiss */}
            <div style={{ flex: 1 }} />
          </div>
        )}

        <main className="admin-main-content" style={{ flex: 1, padding: '1rem 0.85rem', overflowY: 'auto', background: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }

        /* Show only desktop layout on ≥ 768px */
        @media (min-width: 768px) {
          .admin-desktop-layout { display: flex !important; }
          .admin-mobile-layout  { display: none  !important; }
        }

        /* Show only mobile layout on < 768px */
        @media (max-width: 767px) {
          .admin-desktop-layout { display: none  !important; }
          .admin-mobile-layout  { display: flex  !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
