import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from '../utils/api';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const data = await loginUserApi(email, password);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/courses');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Check email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@piyushdhara.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '88vh', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Ambient Glow Orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>

      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          padding: '3rem 2.5rem', 
          borderRadius: '2rem', 
          background: '#FFFFFF', 
          boxShadow: '0 25px 50px -12px rgba(37,99,235,0.12)', 
          border: '1px solid #DBEAFE',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Top Logo & Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          
          {/* Logo Badge */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '4px', boxShadow: '0 10px 25px rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          {/* Platform Title */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
            Piyush<span style={{ color: '#2563EB' }}>Dhara</span> Teacher Portal
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: '#F1F5F9', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginTop: '0.25rem' }}>
            <Sparkles size={13} color="#2563EB" /> Verified Instructor Access
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem 1rem', borderRadius: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          
          {/* Email Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Instructor Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  height: '50px', 
                  borderRadius: '0.85rem', 
                  paddingLeft: '2.85rem', 
                  paddingRight: '1rem',
                  fontSize: '0.95rem',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                placeholder="admin@piyushdhara.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  height: '50px', 
                  borderRadius: '0.85rem', 
                  paddingLeft: '2.85rem', 
                  paddingRight: '2.85rem',
                  fontSize: '0.95rem',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.2rem' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ 
              height: '52px', 
              fontSize: '1rem', 
              borderRadius: '0.85rem', 
              marginTop: '0.5rem',
              boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              'Verifying Teacher Credentials...'
            ) : (
              <>Login as Teacher <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Demo Fill Helper Pill */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1D4ED8',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={14} /> Auto-fill Demo Credentials
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
