import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Phone, GraduationCap, Award, Image, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TeacherRegister = () => {
  const navigate = useNavigate();
  const { signupTeacher } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    qualification: '',
    experience: '',
    photo: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Strong password validation regex: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const isStrongPassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    try {
      setLoading(true);
      await signupTeacher(formData);
      navigate('/verify-email');
    } catch (err) {
      setError(err.message || 'Teacher registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '90vh', padding: '2.5rem 1rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>

      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '520px', 
          padding: '3rem 2.5rem', 
          borderRadius: '2rem', 
          background: '#FFFFFF', 
          boxShadow: '0 25px 50px -12px rgba(15,23,42,0.15)', 
          border: '1px solid #E2E8F0',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '4px', boxShadow: '0 10px 25px rgba(40,116,198,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={38} color="var(--primary-600)" />
            </div>
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: 'var(--primary-600)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={13} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
            Teacher <span style={{ color: 'var(--primary-600)' }}>Registration</span>
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '0.25rem' }}>
            👨‍🏫 Apply as Educator / Instructor
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem 1rem', borderRadius: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Dr. Gaurav Sharma"
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="teacher@piyushdhara.com"
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Phone Number *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+977 9800000000"
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Subject / Specialization *
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Physics"
                  style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.5rem', paddingRight: '0.75rem', fontSize: '0.85rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Qualifications *
              </label>
              <div style={{ position: 'relative' }}>
                <Award size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  required
                  placeholder="M.Sc / Ph.D."
                  style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.5rem', paddingRight: '0.75rem', fontSize: '0.85rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 8 characters"
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
              />
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
              background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
              boxShadow: 'var(--shadow-primary)',
              gap: '0.5rem',
              border: 'none',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Submitting Application...' : <>Register as Teacher <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748B' }}>
          Already registered? <Link to="/teacher-login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>Teacher Login</Link>
        </p>

      </div>
    </div>
  );
};

export default TeacherRegister;
