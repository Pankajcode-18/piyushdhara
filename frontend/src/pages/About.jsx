import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  Video, 
  FileText, 
  Sparkles, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import teacherImg from '../assets/gaurov.jpeg';

const About = () => {
  const stats = [
    { label: 'Active Students', value: '10,000+', icon: Users, color: '#38BDF8' },
    { label: 'Video Lectures', value: '500+', icon: Video, color: '#6366F1' },
    { label: 'Handwritten PDFs', value: '250+', icon: FileText, color: '#22C55E' },
    { label: 'Pass Success Rate', value: '98%', icon: Award, color: '#EAB308' },
  ];

  const pillars = [
    {
      title: 'SEE & NEB Curriculum Aligned',
      description: 'Every video lecture and handout strictly follows the latest Curriculum Development Centre (CDC) Nepal syllabus for Class 8, 10 (SEE), 11, and 12.',
      icon: GraduationCap,
    },
    {
      title: 'Handwritten Notes & Resources',
      description: 'Instant access to chapter-wise handwritten PDF handouts and formula cheat-sheets prepared by top educators for exam night revision.',
      icon: BookOpen,
    },
    {
      title: 'Step-by-Step Problem Solving',
      description: 'Breakdown of past board exam questions and entrance-level numerical problem sets with easy-to-understand shortcuts.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="about-page bg-mesh animate-fade-in" style={{ minHeight: '90vh', padding: '3rem 0' }}>
      <div className="container">
        
        {/* 1. Hero Banner Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-banner-responsive"
          style={{ 
            borderRadius: '2rem', 
            padding: '4rem 3.5rem', 
            marginBottom: '3.5rem', 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0F9FF 100%)', 
            color: '#0F172A',
            boxShadow: '0 20px 40px -15px rgba(37,99,235,0.08)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #DBEAFE'
          }}
        >
          {/* Background Glow Ring */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 75%)', filter: 'blur(40px)' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: '#DBEAFE', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#1D4ED8', marginBottom: '1.25rem' }}>
                <Sparkles size={14} /> ABOUT PIYUSHDHARA PLATFORM
              </div>
              <h1 className="page-title-responsive" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: '1.2', color: '#0F172A' }}>
                Empowering Nepal&apos;s Students with Top-Tier Education
              </h1>
              <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: '1.75', marginBottom: '2.5rem' }}>
                PiyushDhara is Nepal&apos;s premier digital preparation platform, designed to simplify SEE, NEB Science &amp; Commerce, and entrance exam preparation with structured video series and handwritten study materials.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/courses" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem', gap: '0.5rem' }}>
                  Explore Batches <ArrowRight size={16} />
                </Link>
                <Link 
                  to="/support" 
                  className="btn" 
                  style={{ color: '#0F172A', border: '1.5px solid #CBD5E1', background: '#FFFFFF', padding: '0.9rem 1.75rem', fontSize: '0.95rem', gap: '0.5rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  <PhoneCall size={16} color="#2563EB" /> Contact Support
                </Link>
              </div>
            </div>

            {/* Founder / Chief Educator Photo Card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                position: 'relative',
                borderRadius: '1.5rem',
                padding: '8px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <img 
                  src={teacherImg} 
                  onError={(e) => { e.target.src = '/gaurov.jpeg'; }}
                  alt="Gaurav Sir - Lead Educator" 
                  style={{
                    width: '230px',
                    height: '230px',
                    objectFit: 'cover',
                    borderRadius: '1.25rem',
                    display: 'block'
                  }} 
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Gaurav Sir & Team</h4>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>Lead Educator & Platform Founder</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Platform Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className="card glass"
                whileHover={{ y: -5 }}
                style={{
                  padding: '1.75rem',
                  borderRadius: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{
                  padding: '0.85rem',
                  borderRadius: '0.85rem',
                  background: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{item.value}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>{item.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Core Pillars / Features Section */}
        <div style={{ marginBottom: '4.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Why Students Choose PiyushDhara
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Built specifically for Nepali students preparing for SEE, NEB, and competitive college entrance exams.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div 
                  key={p.title} 
                  className="card glass hover-lift"
                  style={{
                    padding: '2.25rem',
                    borderRadius: '1.25rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '0.75rem',
                    background: 'rgba(37,99,235,0.08)',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Faculty & Leadership Team Section */}
        <div style={{ marginBottom: '4.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: 'rgba(37,99,235,0.08)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, color: '#2563EB', marginBottom: '1rem' }}>
              <Users size={14} /> OUR EXPERT FACULTY & LEADERSHIP
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Meet the Educators Behind Your Success
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Guided by Gaurav Sir & Team, our experienced faculty members bring years of teaching excellence in SEE, NEB Science/Commerce, and Entrance Preparations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* 1. Main Founder & Lead Educator: Gaurav Sir */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="card glass" 
              style={{ 
                gridColumn: '1 / -1',
                padding: '2.5rem', 
                borderRadius: '1.5rem', 
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
                color: 'white',
                border: '2px solid rgba(37,99,235,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                flexWrap: 'wrap',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ padding: '6px', borderRadius: '1.25rem', background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}>
                  <img 
                    src={teacherImg} 
                    onError={(e) => { e.target.src = '/gaurov.jpeg'; }}
                    alt="Gaurav Sir" 
                    style={{ width: '160px', height: '160px', borderRadius: '1rem', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <span style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#2563EB', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.75rem', borderRadius: '9999px', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(37,99,235,0.4)' }}>
                  ★ FOUNDER & LEAD
                </span>
              </div>

              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'inline-block', fontSize: '0.8rem', fontWeight: 700, color: '#38BDF8', background: 'rgba(56,189,248,0.1)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                  PLATFORM FOUNDER & CHIEF EDUCATOR
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem', color: '#FFFFFF' }}>Gaurav Sir</h3>
                <p style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Lead Mathematics & Science Educator · 10+ Years Experience
                </p>
                <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                  Founder of PiyushDhara and creator of the Mahabharath Mathematics Series. Has personally mentored over 10,000+ students across Nepal for SEE (Class 10), NEB Class 11-12, and IOE entrance examinations.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#93C5FD', fontWeight: 600 }}>
                    📐 Mahabharath Math Series
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#93C5FD', fontWeight: 600 }}>
                    🎓 Class 10 (SEE) Board Prep
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#93C5FD', fontWeight: 600 }}>
                    🔬 NEB Science & IOE Prep
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Team Member 2: Er. Aayush Sharma */}
            <motion.div whileHover={{ y: -5 }} className="card glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, flexShrink: 0 }}>
                    AS
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Er. Aayush Sharma</h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366F1', background: 'rgba(99,102,241,0.1)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block', marginTop: '0.2rem' }}>
                      Physics Faculty
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Senior Physics faculty specializing in Mechanics, Thermodynamics & IOE Engineering Entrance numerical problem sets.
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                🎓 M.Sc. Physics (TU) · 8+ Yrs Exp.
              </div>
            </motion.div>

            {/* Team Member 3: Dr. Sunita Adhikari */}
            <motion.div whileHover={{ y: -5 }} className="card glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #EC4899, #DB2777)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, flexShrink: 0 }}>
                    SA
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Dr. Sunita Adhikari</h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EC4899', background: 'rgba(236,72,153,0.1)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block', marginTop: '0.2rem' }}>
                      Chemistry Faculty
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Expert in Organic Reaction Mechanisms & Physical Chemistry for Grade 11-12 and Medical entrance preparations.
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                🧪 Ph.D. Organic Chemistry · 7+ Yrs Exp.
              </div>
            </motion.div>

            {/* Team Member 4: Subash Thapa */}
            <motion.div whileHover={{ y: -5 }} className="card glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, flexShrink: 0 }}>
                    ST
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Subash Thapa</h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block', marginTop: '0.2rem' }}>
                      SEE Math Instructor
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Class 8 & SEE Mathematics specialist focusing on Geometry proofs, Trigonometric identities & Mensuration.
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                📐 M.Ed. Mathematics · 6+ Yrs Exp.
              </div>
            </motion.div>

            {/* Team Member 5: Pooja Karki */}
            <motion.div whileHover={{ y: -5 }} className="card glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, flexShrink: 0 }}>
                    PK
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Pooja Karki</h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', background: 'rgba(245,158,11,0.1)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block', marginTop: '0.2rem' }}>
                      Biology Faculty
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Life sciences and Botany educator delivering detailed handwritten anatomical diagrams & revision notes.
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                🌿 M.Sc. Botany · 5+ Yrs Exp.
              </div>
            </motion.div>

            {/* Team Member 6: Rohan Shrestha */}
            <motion.div whileHover={{ y: -5 }} className="card glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, flexShrink: 0 }}>
                    RS
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Rohan Shrestha</h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7C3AED', background: 'rgba(139,92,246,0.1)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block', marginTop: '0.2rem' }}>
                      Curriculum Director
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Oversees CDC Nepal curriculum alignment, chapter structuring, handwritten note validation, and student progress tracking.
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                📋 Educational Management · 6+ Yrs Exp.
              </div>
            </motion.div>

            {/* Team Member 7: Prashant Dahal */}
            <motion.div whileHover={{ y: -5 }} className="card glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, flexShrink: 0 }}>
                    PD
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Prashant Dahal</h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284C7', background: 'rgba(14,165,233,0.1)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block', marginTop: '0.2rem' }}>
                      Technical Lead
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Leads platform architecture, streaming infrastructure, PDF viewer services, and student portal security.
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                💻 B.E. Computer Software · 7+ Yrs Exp.
              </div>
            </motion.div>

          </div>
        </div>

        {/* 5. Mission Statement Banner */}
        <div 
          className="glass"
          style={{
            borderRadius: '1.5rem',
            padding: '3rem',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(99,102,241,0.08) 100%)',
            border: '1px solid rgba(37,99,235,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Ready to Master Your Board Exams?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
              Join thousands of Nepali students enrolled in Mahabharath Mathematics, SEE Prep, and NEB Science batches today.
            </p>
          </div>
          <Link to="/courses" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', gap: '0.5rem' }}>
            Start Learning Free <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
