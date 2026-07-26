import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUserApi } from '../utils/api';
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/courses';
  
  const { signinStudent, signinWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Try Firebase Student Sign In first
      try {
        await signinStudent(identifier.trim(), password);
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;

        if (userObj?.role === 'teacher' || userObj?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectUrl);
        }
        return;
      } catch (firebaseErr) {
        console.warn('Firebase student signin fallback:', firebaseErr.message);
      }

      // Fallback to direct MongoDB login API
      const data = await loginUserApi(identifier.trim(), password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, phone: data.phone, email: data.email, role: data.role }));

      if (data.role === 'admin' || data.role === 'teacher') {
        navigate('/admin');
      } else {
        navigate(redirectUrl);
      }

    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your email/phone and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await signinWithGoogle();
      navigate(redirectUrl);
    } catch (err) {
      setError(err.message || 'Google Login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '88vh', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>

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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '4px', boxShadow: '0 10px 25px rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/Logo1.png" 
                onError={(e) => { e.target.src = '/logo.jpeg'; }} 
                alt="PiyushDhara Logo" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#2563EB', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={13} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
            Student <span style={{ color: '#2563EB' }}>Login</span>
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: '#F1F5F9', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginTop: '0.25rem' }}>
            <Sparkles size={13} color="#2563EB" /> Access Courses &amp; Lectures
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem 1rem', borderRadius: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '0.85rem',
            border: '1.5px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#0F172A',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '0.75rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
            marginBottom: '1.25rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {googleLoading ? 'Connecting Google...' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>OR EMAIL / PHONE</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Email / Identifier */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Email Address or Phone
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  height: '48px', 
                  borderRadius: '0.85rem', 
                  paddingLeft: '2.85rem', 
                  paddingRight: '1rem',
                  fontSize: '0.92rem',
                  border: '1.5px solid #CBD5E1',
                  outline: 'none'
                }}
                placeholder="you@example.com or 9800000000"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  height: '48px', 
                  borderRadius: '0.85rem', 
                  paddingLeft: '2.85rem', 
                  paddingRight: '2.85rem',
                  fontSize: '0.92rem',
                  border: '1.5px solid #CBD5E1',
                  outline: 'none'
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

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ 
              height: '50px', 
              fontSize: '1rem', 
              borderRadius: '0.85rem', 
              marginTop: '0.35rem',
              boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
              gap: '0.5rem'
            }}
          >
            {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748B' }}>
          Don't have a student account? <Link to="/register" style={{ color: '#2563EB', fontWeight: 700 }}>Register Now</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
