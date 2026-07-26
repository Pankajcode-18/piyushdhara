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
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', padding: '4px', boxShadow: '0 10px 25px rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={38} color="#DC2626" />
            </div>
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#DC2626', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={13} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
            Teacher <span style={{ color: '#DC2626' }}>Registration</span>
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#991B1B', marginTop: '0.25rem' }}>
            👨‍🏫 Apply as Educator / Instructor
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem 1rem', borderRadius: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Full Name */}
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
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                placeholder="e.g. Gaurav Bhandari"
              />
            </div>
          </div>

          {/* Email */}
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
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                placeholder="teacher@piyushdhara.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                placeholder="e.g. 9800000000"
              />
            </div>
          </div>

          {/* Qualification & Experience */}
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Qualification
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.5rem', paddingRight: '0.75rem', fontSize: '0.85rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                  placeholder="M.Sc / B.Tech"
                />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Experience
              </label>
              <div style={{ position: 'relative' }}>
                <Award size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.5rem', paddingRight: '0.75rem', fontSize: '0.85rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                  placeholder="5+ Years"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Password * (8+ chars, upper, lower, number, symbol)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                placeholder="e.g. Teacher@123"
              />
            </div>
          </div>

          {/* Confirm Password */}
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
                style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.9rem', border: '1.5px solid #CBD5E1', outline: 'none' }}
                placeholder="Re-enter password"
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
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              boxShadow: '0 8px 25px rgba(220,38,38,0.3)',
              gap: '0.5rem',
              border: 'none',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Submitting Application...' : <>Register as Teacher <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748B' }}>
          Already registered? <Link to="/teacher-login" style={{ color: '#DC2626', fontWeight: 700 }}>Teacher Login</Link>
        </p>

      </div>
    </div>
  );
};

export default TeacherRegister;
