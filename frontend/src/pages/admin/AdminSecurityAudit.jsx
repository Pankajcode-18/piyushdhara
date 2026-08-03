import { useState, useEffect } from 'react';
import { fetchSecurityAuditLogsApi } from '../../utils/api';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText, 
  Eye, 
  Search, 
  Filter, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';

const AdminSecurityAudit = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('All');
  const [selectedLogModal, setSelectedLogModal] = useState(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchSecurityAuditLogsApi();
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Error loading security audit logs:', err);
      setError(err.message || 'Failed to fetch security audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (log.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
                          (log.studentEmail || '').toLowerCase().includes(search.toLowerCase()) ||
                          (log.examTitle || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'Violations') return log.totalViolations > 0;
    if (filterMode === 'AutoSubmitted') return log.submissionReason === 'Security Violation' || log.submissionReason === 'Time Expired';
    if (filterMode === 'Strict') return log.securityPolicyMode === 'Strict';
    return true;
  });

  const totalLogsCount = logs.length;
  const violationLogsCount = logs.filter(l => l.totalViolations > 0).length;
  const autoSubmittedCount = logs.filter(l => l.submissionReason === 'Security Violation').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ── HEADER TITLE ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <ShieldAlert size={28} color="#2563EB" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Exam Security &amp; Anti-Cheating Audit Dashboard
            </h1>
          </div>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>
            Real-time security event logs, tab-switch violations, full-screen compliance, and submission audit trail.
          </p>
        </div>

        <button
          onClick={loadLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.65rem 1.1rem',
            borderRadius: '0.75rem',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#334155',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Audit Logs
        </button>
      </div>

      {/* ── STATS SUMMARY CARDS ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TOTAL EXAM SESSIONS</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: '0.3rem 0 0 0' }}>{totalLogsCount}</h2>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>FLAGGED VIOLATIONS</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D97706', margin: '0.3rem 0 0 0' }}>{violationLogsCount}</h2>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>AUTO-SUBMITTED (BREACH)</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#DC2626', margin: '0.3rem 0 0 0' }}>{autoSubmittedCount}</h2>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>CLEAN SUBMISSIONS</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', margin: '0.3rem 0 0 0' }}>{totalLogsCount - violationLogsCount}</h2>
        </div>

      </div>

      {/* ── FILTER & SEARCH BAR ─────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '0.6rem 1rem', borderRadius: '0.75rem', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="#64748B" />
          <input 
            type="text" 
            placeholder="Search by student name, email, or exam title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.88rem', fontWeight: 600 }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {['All', 'Violations', 'AutoSubmitted', 'Strict'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '0.65rem',
                border: filterMode === mode ? '1px solid #2563EB' : '1px solid #E2E8F0',
                background: filterMode === mode ? '#EFF6FF' : '#FFFFFF',
                color: filterMode === mode ? '#1D4ED8' : '#475569',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {mode}
            </button>
          ))}
        </div>

      </div>

      {/* ── AUDIT LOGS TABLE ────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '1.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
            <Sparkles className="animate-spin" size={32} style={{ marginBottom: '0.75rem', color: '#2563EB' }} />
            <p style={{ fontWeight: 700 }}>Fetching Real-Time Security Audit Logs...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#DC2626' }}>
            <p style={{ fontWeight: 800 }}>{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
            <ShieldCheck size={48} color="#94A3B8" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', margin: '0 0 0.25rem 0' }}>No Security Audit Logs Found</h3>
            <p style={{ fontSize: '0.85rem' }}>No exam security events match your current search filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Student Details</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Exam Name &amp; Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Policy Mode</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Violations</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Submission Reason</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Events Count</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Audit Timeline</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const isViolation = log.totalViolations > 0;
                  const isBreach = log.submissionReason === 'Security Violation';

                  return (
                    <tr key={log._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{log.studentName || 'Student'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{log.studentEmail}</div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{log.examTitle}</div>
                        <span style={{ fontSize: '0.72rem', background: '#F1F5F9', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', fontWeight: 700 }}>
                          {log.examType || 'Quiz'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '0.4rem',
                          background: log.securityPolicyMode === 'Strict' ? '#FEF2F2' : '#F0FDF4',
                          color: log.securityPolicyMode === 'Strict' ? '#DC2626' : '#166534',
                          border: `1px solid ${log.securityPolicyMode === 'Strict' ? '#FEE2E2' : '#DCFCE7'}`
                        }}>
                          {log.securityPolicyMode || 'Standard'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          fontWeight: 900,
                          color: isViolation ? '#DC2626' : '#059669',
                          background: isViolation ? '#FEF2F2' : '#ECFDF5',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '0.4rem'
                        }}>
                          {log.totalViolations || 0} Violations
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: isBreach ? '#DC2626' : (log.submissionReason === 'Time Expired' ? '#D97706' : '#0F172A')
                        }}>
                          {log.submissionReason || 'Normal'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#64748B' }}>
                        {log.events ? log.events.length : 0} Events Logged
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedLogModal(log)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '0.65rem',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#2563EB',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Eye size={14} /> View Timeline
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ── SECURITY EVENT TIMELINE MODAL ───────────────────────── */}
      {selectedLogModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '1.75rem',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>SECURITY AUDIT TIMELINE</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0 0 0' }}>{selectedLogModal.studentName}</h2>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>{selectedLogModal.examTitle} ({selectedLogModal.examType})</p>
              </div>

              <button
                onClick={() => setSelectedLogModal(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900, color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {/* Event Timeline List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {selectedLogModal.events && selectedLogModal.events.length > 0 ? (
                selectedLogModal.events.map((evt, idx) => (
                  <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '0.85rem', padding: '0.85rem 1.1rem', background: evt.eventType.includes('Exited') || evt.eventType.includes('Tab') ? '#FEF2F2' : '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, color: evt.eventType.includes('Exited') || evt.eventType.includes('Tab') ? '#DC2626' : '#0F172A', fontSize: '0.88rem' }}>
                        {evt.eventType}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {evt.reason && <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.25rem 0' }}>{evt.reason}</p>}
                    {evt.durationAwaySeconds > 0 && <p style={{ fontSize: '0.75rem', color: '#D97706', margin: 0, fontWeight: 700 }}>Away duration: {evt.durationAwaySeconds} seconds</p>}
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem 0' }}>No detailed events recorded for this attempt.</p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSecurityAudit;
