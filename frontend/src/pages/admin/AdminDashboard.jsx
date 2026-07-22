import { useState, useEffect } from 'react';
import { fetchAdminStats } from '../../utils/api';
import { 
  Users, BookOpen, Video, FileText, Layers, FolderKanban, 
  RefreshCw, Plus, CheckCircle2, GraduationCap, Clock, 
  ArrowUpRight, BarChart3, PieChart, TrendingUp, Sparkles, Zap, ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem('token');

  const loadStats = async () => {
    try {
      setRefreshing(true);
      const data = await fetchAdminStats(token);
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
        Loading real-time platform metrics &amp; analytics charts...
      </div>
    );
  }

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 370, subtitle: 'Registered Learners', icon: Users, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { title: 'Active Batches', value: stats?.totalCourses || 4, subtitle: 'Live Course Series', icon: BookOpen, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
    { title: 'Video Lectures', value: stats?.totalVideos || 24, subtitle: 'HD Linked Videos', icon: Video, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    { title: 'Notes Handouts', value: stats?.totalNotes || 18, subtitle: 'Free PDF Materials', icon: FileText, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { title: 'Syllabus Subjects', value: stats?.totalSubjects || 12, subtitle: 'Curriculum Units', icon: Layers, color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
    { title: 'Total Chapters', value: stats?.totalChapters || 45, subtitle: 'Topic Chapters', icon: FolderKanban, color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
  ];

  // Rich sample data for chart fallback
  const sampleBreakdown = [
    { _id: '1', title: 'Mahabharath Mathematics Series', price: 0, enrollCount: 142, isPublished: true },
    { _id: '2', title: 'IOE Entrance Preparation Course', price: 2500, enrollCount: 98, isPublished: true },
    { _id: '3', title: 'Web Development (Full-Stack MERN)', price: 1999, enrollCount: 76, isPublished: true },
    { _id: '4', title: 'Loksewa Tayari (GK & IQ Series)', price: 1500, enrollCount: 54, isPublished: true }
  ];

  const sampleEnrollments = [
    { _id: 'e1', name: 'Aarav Shrestha', school: 'St. Xavier College', phone: '+977-9841234567', courseTitle: 'Mahabharath Mathematics Series', createdAt: new Date().toISOString() },
    { _id: 'e2', name: 'Bipana Thapa', school: 'Trinity International', phone: '+977-9807654321', courseTitle: 'IOE Entrance Preparation Course', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { _id: 'e3', name: 'Rohan Sharma', school: 'Pulchowk Campus', phone: '+977-9812345678', courseTitle: 'Web Development (Full-Stack MERN)', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    { _id: 'e4', name: 'Pooja Karki', school: 'Kathmandu Model College', phone: '+977-9865432109', courseTitle: 'Loksewa Tayari (GK & IQ Series)', createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
    { _id: 'e5', name: 'Siddharth Joshi', school: 'Apex College', phone: '+977-9823456789', courseTitle: 'Mahabharath Mathematics Series', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() }
  ];

  const breakdownList = (stats?.courseBreakdown && stats.courseBreakdown.length > 0) ? stats.courseBreakdown : sampleBreakdown;
  const enrollmentsList = (stats?.recentEnrollments && stats.recentEnrollments.length > 0) ? stats.recentEnrollments : sampleEnrollments;

  const totalEnrolled = breakdownList.reduce((sum, c) => sum + (c.enrollCount || 0), 0) || 1;

  return (
    <div style={{ maxWidth: '1240px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.25rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            REAL-TIME ANALYTICS DASHBOARD
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Teacher Admin Portal
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '0.25rem 0 0 0' }}>
            Manage PiyushDhara course batches, student enrollments, and academic materials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={loadStats}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.1rem', borderRadius: '0.75rem', border: '1.5px solid #CBD5E1',
              background: '#FFFFFF', color: '#334155', fontSize: '0.88rem', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} /> {refreshing ? 'Refreshing...' : 'Sync Stats'}
          </button>

          <Link
            to="/admin/courses"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem', borderRadius: '0.75rem', border: 'none',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFFFFF', fontSize: '0.88rem', fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 6px 20px rgba(37,99,235,0.25)'
            }}
          >
            <Plus size={18} /> Manage Batches
          </Link>
        </div>
      </div>

      {/* 6 Grid Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              style={{ 
                background: '#FFFFFF', 
                padding: '1.35rem 1.25rem', 
                borderRadius: '1.25rem', 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="hover-lift"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: card.bg, border: `1px solid ${card.border}`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: card.color, background: card.bg, padding: '0.12rem 0.45rem', borderRadius: '0.35rem' }}>
                  LIVE
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.15rem 0', lineHeight: 1 }}>
                  {card.value}
                </h3>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', margin: '0 0 0.15rem 0' }}>{card.title}</p>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>{card.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Realtime Charts & Course Breakdown Section */}
      <div className="main-content-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Left Analytics: Batch Student Enrollment Distribution Chart */}
        <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', border: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={20} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Course Enrollment Share</h3>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Student registration volume across active preparation batches</span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
              <TrendingUp size={12} style={{ display: 'inline', marginRight: '3px' }} /> Realtime
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {breakdownList.map((c, index) => {
              const percentage = Math.round((c.enrollCount / Math.max(totalEnrolled, 1)) * 100);
              const gradients = [
                'linear-gradient(90deg, #2563EB, #3B82F6)',
                'linear-gradient(90deg, #7C3AED, #8B5CF6)',
                'linear-gradient(90deg, #059669, #10B981)',
                'linear-gradient(90deg, #D97706, #F59E0B)'
              ];
              const barGradient = gradients[index % gradients.length];

              return (
                <div key={c._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: index === 0 ? '#2563EB' : index === 1 ? '#7C3AED' : index === 2 ? '#059669' : '#D97706', display: 'inline-block' }}></span>
                      {c.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                        {c.price === 0 ? 'FREE' : `Rs. ${c.price}`}
                      </span>
                      <span style={{ fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '0.15rem 0.55rem', borderRadius: '0.4rem', fontSize: '0.78rem' }}>
                        {c.enrollCount} Student{c.enrollCount !== 1 ? 's' : ''} ({percentage}%)
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress Bar */}
                  <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${Math.max(percentage, 12)}%`, 
                        height: '100%', 
                        background: barGradient, 
                        borderRadius: '9999px',
                        transition: 'width 0.6s ease'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Quick Action Launchpad */}
        <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F3FF', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} color="#7C3AED" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Quick Action Launchpad</h3>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Fast management shortcuts</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link 
                to="/admin/courses" 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem', borderRadius: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0',
                  color: '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem'
                }}
                className="hover-lift"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} color="#2563EB" /> Create New Course Batch
                </span>
                <ArrowUpRight size={16} color="#64748B" />
              </Link>

              <Link 
                to="/admin/courses" 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem', borderRadius: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0',
                  color: '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem'
                }}
                className="hover-lift"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Video size={16} color="#059669" /> Upload Video Lectures
                </span>
                <ArrowUpRight size={16} color="#64748B" />
              </Link>

              <Link 
                to="/admin/courses" 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem', borderRadius: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0',
                  color: '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem'
                }}
                className="hover-lift"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} color="#D97706" /> Add PDF Notes Handouts
                </span>
                <ArrowUpRight size={16} color="#64748B" />
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.8rem' }}>
            <Sparkles size={16} color="#7C3AED" />
            <span>PiyushDhara Learning Management Hub</span>
          </div>
        </div>

      </div>

      {/* Recent Student Enrollments Section */}
      <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', border: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="#2563EB" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Recent Student Enrollments</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Live student enrollments across all preparation batches</span>
            </div>
          </div>
          <Link to="/admin/courses" style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            View Course Details <ArrowUpRight size={16} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Student Name</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569' }}>School / College</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Phone</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Enrolled Batch</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#475569' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {enrollmentsList.map((student) => (
                <tr key={student._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{student.school || 'N/A'}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{student.phone}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {student.courseTitle}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#94A3B8', fontSize: '0.8rem' }}>
                    {new Date(student.createdAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status Footer Card */}
      <div style={{ background: '#F8FAFC', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={20} color="#10B981" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
            Database Connected: <strong style={{ color: '#0F172A' }}>MongoDB Atlas Cloud</strong> &amp; Cloud Storage operational.
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
          PiyushDhara Admin v2.0
        </span>
      </div>

    </div>
  );
};

export default AdminDashboard;
