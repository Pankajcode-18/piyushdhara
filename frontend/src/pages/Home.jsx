import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlayCircle,
  BookOpen,
  Award,
  TrendingUp,
  Users,
  Video,
  FileText,
  Zap,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Star,
  ShieldCheck,
  Clock,
  ChevronLeft,
  Flame,
  ArrowUpRight,
  Headphones,
  FileCheck,
  Lock,
  Layers,
  Bell,
  Target,
  HelpCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import TeacherProfileModal from '../components/common/TeacherProfileModal';
import HeroAnimatedLogo from '../components/common/HeroAnimatedLogo';
import teacherImg from '../assets/gaurov.jpeg';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/api';

const Home = () => {
  const { t } = useLanguage();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const testimonials = [
    {
      name: "Saurav Bhandari",
      grade: "Class 10 SEE Student · Kathmandu",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
      quote: "The Mahabharath series by Gaurav Sir completely changed my perspective on math. The shortcut tricks are incredibly helpful for SEE numerical preparation!"
    },
    {
      name: "Aarati Pokharel",
      grade: "NEB Class 12 Science · Pokhara",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      quote: "Downloading handwritten handouts for Physics and Chemistry right after watching the lectures is so convenient. This website is premium!"
    },
    {
      name: "Prabhat Adhikari",
      grade: "IOE Entrance Aspirant · Chitwan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      quote: "The L'Hospital Rule past questions shortcuts enabled me to solve complex limits questions under 10 seconds. Best prep portal in Nepal."
    }
  ];

  const quickCategories = [
    {
      title: 'Mahabharath Math',
      desc: 'Gaurav Sir Math Series & CDC Formulas',
      icon: Sparkles,
      color: '#8B5CF6',
      bg: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(124,58,237,0.04) 100%)',
      border: 'rgba(139,92,246,0.25)',
      badge: 'POPULAR',
      link: '/courses'
    },
    {
      title: 'Web Development',
      desc: 'Full-Stack MERN & Practical Projects',
      icon: BookOpen,
      color: '#3B82F6',
      bg: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.04) 100%)',
      border: 'rgba(59,130,246,0.25)',
      badge: 'TECH',
      link: '/courses'
    },
    {
      title: 'IOE Entrance',
      desc: 'Pulchowk & Engineering Past Questions',
      icon: Star,
      color: '#10B981',
      bg: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.04) 100%)',
      border: 'rgba(16,185,129,0.25)',
      badge: 'ENTRANCE',
      link: '/courses'
    },
    {
      title: 'Loksewa Tayari',
      desc: 'General Knowledge & IQ Shortcuts',
      icon: GraduationCap,
      color: '#F43F5E',
      bg: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(225,29,72,0.04) 100%)',
      border: 'rgba(244,63,94,0.25)',
      badge: 'COMPETITIVE',
      link: '/courses'
    },
  ];

  const [platformConfig, setPlatformConfig] = useState(null);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const res = await fetch(`${API_BASE}/public/courses`);
        const data = await res.json();
        setFeaturedCourses(data.length > 0 ? data.slice(0, 3) : []);
        
        try {
          const configRes = await fetch(`${API_BASE}/public/platform-config`);
          const configData = await configRes.json();
          if (configData?.config) setPlatformConfig(configData.config);
        } catch (cErr) {
          console.log('Platform config fallback to default');
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setLoading(false);
      }
    };
    fetchCoursesData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page bg-mesh animate-fade-in" style={{ position: 'relative', overflowX: 'hidden' }}>

      {/* ── 1. Hero Section ─────────────────────────────────────────── */}
      <section style={{ padding: '1.5rem 0 3rem 0', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>

          <div className="hero-responsive-card" style={{
            borderRadius: '1.75rem',
            padding: '2.5rem 2.5rem',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F7FF 45%, #E0F2FE 100%)',
            color: '#0F172A',
            boxShadow: '0 20px 50px -15px rgba(37, 99, 235, 0.14), 0 0 35px rgba(56, 189, 248, 0.12)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(37, 99, 235, 0.16)'
          }}>

            {/* Ambient Glowing Glass Mesh Backdrops */}
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', top: '40%', left: '45%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)', filter: 'blur(45px)', pointerEvents: 'none' }}></div>

            {/* 2-Column Responsive Layout Grid */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>

              {/* Left Column: Headlines + CTAs + Stats */}
              <div style={{ flex: '1 1 500px', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

                {/* Top Pill Badges + Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="hero-badges-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.35rem 0.9rem',
                      background: 'rgba(37, 99, 235, 0.08)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                      borderRadius: '9999px',
                      fontSize: '0.78rem', fontWeight: 800,
                      color: '#2563EB',
                      letterSpacing: '0.02em',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.06)'
                    }}>
                      <Zap size={14} color="#2563EB" className="animate-pulse" /> {t('heroBadge')}
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                      border: '1.5px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#059669',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)'
                    }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#10B981',
                        display: 'inline-block',
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)',
                        animation: 'livePulse 2s infinite'
                      }} />
                      2081/2082 Live Batches Active
                    </div>
                  </div>

                  <h1 className="hero-title-responsive" style={{
                    fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)',
                    fontWeight: 900,
                    lineHeight: '1.15',
                    letterSpacing: '-0.025em',
                    color: '#0F172A',
                    margin: 0,
                    fontFamily: 'var(--font-main)'
                  }}>
                    Education is the most <span style={{
                      background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 30px rgba(37, 99, 235, 0.15)'
                    }}>powerful weapon</span> which you can use to <span style={{
                      background: 'linear-gradient(135deg, #059669 0%, #0284C7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>change the world.</span>
                  </h1>
                </motion.div>

                {/* Subtitle */}
                <p className="hero-subtitle-responsive" style={{ fontSize: '1rem', color: '#475569', margin: 0, maxWidth: '600px', lineHeight: '1.55', fontWeight: 500 }}>
                  Nepal&apos;s most trusted digital learning portal. Stream chapter-wise HD video series, download handwritten PDF handouts, and master exam shortcuts with <strong style={{ color: '#0F172A', fontWeight: 700 }}>Gaurav Sir &amp; Team</strong>.
                </p>

                {/* CTA Buttons */}
                <div className="hero-cta-responsive" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    to="/courses"
                    className="btn"
                    style={{
                      padding: '0.8rem 1.75rem',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      borderRadius: '0.85rem',
                      gap: '0.55rem',
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 8px 22px rgba(37, 99, 235, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {t('exploreBatchesBtn')} <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/notes"
                    className="btn"
                    style={{
                      padding: '0.8rem 1.6rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderRadius: '0.85rem',
                      color: '#0F172A',
                      border: '1.5px solid #CBD5E1',
                      gap: '0.55rem',
                      background: '#FFFFFF',
                      boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText size={18} color="#2563EB" /> {t('freeNotesBtn')}
                  </Link>
                </div>

                {/* Trust Stats Bar */}
                <div className="hero-stats-responsive" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  borderTop: '1px solid rgba(226, 232, 240, 0.9)',
                  paddingTop: '1.15rem',
                  marginTop: '0.25rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Users size={14} /> Students
                    </div>
                    <h4 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>15,000+</h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.15rem 0 0 0', fontWeight: 600 }}>Enrolled Learners</p>
                  </div>

                  <div style={{ borderLeft: '1px solid rgba(226, 232, 240, 0.9)', paddingLeft: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Award size={14} /> Success Rate
                    </div>
                    <h4 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>98.4%</h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.15rem 0 0 0', fontWeight: 600 }}>Board Exam Pass</p>
                  </div>

                  <div style={{ borderLeft: '1px solid rgba(226, 232, 240, 0.9)', paddingLeft: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7C3AED', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Video size={14} /> Video Lessons
                    </div>
                    <h4 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>500+</h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.15rem 0 0 0', fontWeight: 600 }}>HD Lectures</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Premium Animated Rotating Logo Centerpiece */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-logo-centerpiece-responsive"
                style={{
                  flex: '1 1 420px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '460px'
                }}
              >
                <HeroAnimatedLogo />
              </motion.div>

            </div>
          </div>
        </div>
      </section>



      {/* ── 2. Quick Track Cards Grid ────────────────────────────── */}
      <section style={{ padding: '1rem 0 4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: 'var(--primary-light)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <Layers size={14} /> EXPLORE PREPARATION TRACKS
            </div>
            <h2 className="section-title-responsive" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Tailored Batches for Every Academic Goal
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.35rem' }}>
            {quickCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={i} whileHover={{ y: -6, transition: { duration: 0.2 } }}>
                  <Link
                    to={cat.link}
                    className="card quick-tracks-card-responsive"
                    style={{
                      padding: '1.75rem',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      height: '100%',
                      background: 'var(--bg-card)',
                      border: `1.5px solid ${cat.border}`,
                      borderRadius: '1.35rem',
                      boxShadow: 'var(--shadow-card)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="quick-tracks-icon-box" style={{
                        width: '52px', height: '52px',
                        borderRadius: '1rem',
                        background: cat.bg,
                        color: cat.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={26} />
                      </div>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 900,
                        padding: '0.2rem 0.6rem', borderRadius: '0.4rem',
                        background: cat.bg, color: cat.color,
                        letterSpacing: '0.05em'
                      }}>
                        {cat.badge}
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                        {cat.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                        {cat.desc}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 800, color: cat.color, marginTop: '0.5rem' }}>
                      Explore Track <ArrowUpRight size={16} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Features Section ───────────────────────────────────────── */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>

          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              background: 'rgba(37,99,235,0.08)',
              borderRadius: '9999px',
              fontSize: '0.82rem', fontWeight: 800,
              color: '#2563EB',
              marginBottom: '1rem',
              letterSpacing: '0.04em'
            }}>
              <ShieldCheck size={16} /> THE PIYUSHDHARA ADVANTAGE
            </div>
            <h2 className="section-title-responsive" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.85rem', letterSpacing: '-0.025em' }}>
              Designed for Ultimate Board Exam Excellence
            </h2>
            <p className="section-subtitle-responsive" style={{ color: 'var(--text-muted)', fontSize: '1.08rem', lineHeight: '1.7', margin: 0 }}>
              Everything you need to score top grades in SEE and NEB exams organized into one powerful digital workspace.
            </p>
          </div>

          <div className="features-responsive-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem'
          }}>

            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -7 }}
              className="card glass feature-card-responsive"
              style={{
                padding: '2.25rem',
                borderRadius: '1.6rem',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                boxShadow: '0 12px 30px -5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={28} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', letterSpacing: '0.05em' }}>
                    VIDEO SERIES
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                  HD Video Lectures
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Stream chapter-wise video lectures led by Gaurav Sir &amp; team with clear numerical step-by-step problem breakdowns.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -7 }}
              className="card glass"
              style={{
                padding: '2.25rem',
                borderRadius: '1.6rem',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                boxShadow: '0 12px 30px -5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={28} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', letterSpacing: '0.05em' }}>
                    HANDOUTS &amp; NOTES
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                  Handwritten PDF Notes
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Download high-resolution handwritten PDF handouts and formula cheat-sheets mapping directly to CDC marking schemes.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -7 }}
              className="card glass"
              style={{
                padding: '2.25rem',
                borderRadius: '1.6rem',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                boxShadow: '0 12px 30px -5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={28} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(16, 185, 129, 0.08)', color: '#10B981', letterSpacing: '0.05em' }}>
                    EXAM SHORTCUTS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                  Shortcut Exam Tricks
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Learn quick calculation techniques for L&apos;Hospital rule, geometry proofs, and physics formulas for competitive entrance tests.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -7 }}
              className="card glass"
              style={{
                padding: '2.25rem',
                borderRadius: '1.6rem',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                boxShadow: '0 12px 30px -5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Headphones size={28} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(139, 92, 246, 0.08)', color: '#8B5CF6', letterSpacing: '0.05em' }}>
                    HELPLINE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                  24/7 Academic Support
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Get direct doubt clarification and study guidance from Gaurav Sir &amp; Team whenever you get stuck during revision.
                </p>
              </div>
            </motion.div>

            {/* Feature 5 (NEW) */}
            <motion.div
              whileHover={{ y: -7 }}
              className="card glass"
              style={{
                padding: '2.25rem',
                borderRadius: '1.6rem',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                boxShadow: '0 12px 30px -5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileCheck size={28} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(14, 165, 233, 0.08)', color: '#0EA5E9', letterSpacing: '0.05em' }}>
                    QUESTION BANK
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                  CDC Model Sets &amp; Past Papers
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Access 10+ years of SEE and NEB board exam past papers with authentic step-by-step CDC marking scheme solutions.
                </p>
              </div>
            </motion.div>

            {/* Feature 6 (NEW) */}
            <motion.div
              whileHover={{ y: -7 }}
              className="card glass"
              style={{
                padding: '2.25rem',
                borderRadius: '1.6rem',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                boxShadow: '0 12px 30px -5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={28} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(245, 158, 11, 0.08)', color: '#F59E0B', letterSpacing: '0.05em' }}>
                    PROGRESS TRACKER
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                  Smart Syllabus Progress Tracker
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Visually monitor your chapter progress, watched video lectures, and syllabus completion in real-time as you study.
                </p>
              </div>
            </motion.div>

            {/* Feature 7 (NEW - Span Full Width or Feature Accent) */}
            <motion.div
              whileHover={{ y: -7 }}
              className="card glass"
              style={{
                padding: '2.25rem',
                borderRadius: '1.6rem',
                border: '1.5px solid rgba(236, 72, 153, 0.3)',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.04) 0%, rgba(244, 114, 182, 0.01) 100%)',
                boxShadow: '0 12px 30px -5px rgba(236, 72, 153, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={28} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', letterSpacing: '0.05em' }}>
                    REAL-TIME ALERTS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                  Live Class &amp; Exam Alerts
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Receive instant notifications for CDC curriculum updates, exam routines, routine changes, and live revision sessions.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 4. Featured Batches Showcase ──────────────────────────── */}
      <section className="featured-batches-section" style={{ padding: '5.5rem 0', background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>

          <div className="featured-batches-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: 'rgba(37,99,235,0.08)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.75rem' }}>
                <TrendingUp size={14} /> POPULAR PREPARATION COURSES
              </div>
              <h2 className="featured-batches-h2" style={{ fontSize: '2.3rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Featured Batches
              </h2>
            </div>
            <Link to="/courses" className="btn btn-outline featured-batches-view-all" style={{ gap: '0.4rem', fontSize: '0.9rem', padding: '0.6rem 1.25rem', borderRadius: '0.85rem', fontWeight: 700 }}>
              View All Batches <ChevronRight size={16} />
            </Link>
          </div>

          <div className="featured-batches-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem' }}>
            {loading ? (
              <p style={{ color: '#64748B' }}>Loading preparation batches...</p>
            ) : (
              featuredCourses.map((course) => {
                const isFree = course.price === 0;
                const hasCustomThumb = course.thumbnailUrl && course.thumbnailUrl !== 'no-photo.jpg';

                return (
                  <motion.div
                    key={course._id}
                    whileHover={{ y: -8 }}
                    className="card glass batch-card-responsive"
                    style={{
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      boxShadow: '0 15px 35px -5px rgba(0,0,0,0.06)'
                    }}
                  >
                    <div className="batch-card-thumb" style={{
                      height: '200px',
                      position: 'relative',
                      backgroundColor: '#0F172A',
                      backgroundImage: `url(${hasCustomThumb ? course.thumbnailUrl : 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)' }}></div>

                      <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 900,
                          padding: '0.3rem 0.75rem', borderRadius: '0.5rem',
                          background: isFree ? '#10B981' : '#2563EB',
                          color: '#FFFFFF',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                          {isFree ? 'FREE ACCESS' : 'PREMIUM BATCH'}
                        </span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <img
                          src={course.teacherImageUrl || teacherImg}
                          onError={(e) => { e.target.src = teacherImg; }}
                          alt={course.instructorName || 'Gaurav Sir'}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38BDF8' }}
                        />
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>
                          {course.instructorName || 'Gaurav Sir & Team'}
                        </span>
                      </div>
                    </div>

                    <div className="batch-card-body" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 className="batch-card-title" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                        {course.title}
                      </h3>
                      <p className="batch-card-desc" style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                        {course.description}
                      </p>

                      <div className="batch-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1.15rem', marginTop: 'auto' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: isFree ? '#10B981' : '#2563EB' }}>
                          {isFree ? 'Free Access' : `Rs. ${course.price}`}
                        </span>
                        <Link to={`/courses/${course._id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0.75rem', fontWeight: 800 }}>
                          View Batch &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials Section ─────────────────────────────────── */}
      <section className="testimonials-section-responsive" style={{ padding: '5.5rem 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: 'rgba(37,99,235,0.08)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#2563EB', marginBottom: '1rem' }}>
            <Award size={15} /> STUDENT SUCCESS STORIES
          </div>

          <h2 className="section-title-responsive" style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Loved by Students Across Nepal
          </h2>
          <p className="section-subtitle-responsive" style={{ color: '#64748B', fontSize: '1.05rem', marginBottom: '3.5rem' }}>
            Real feedback from students preparing for board exams with PiyushDhara.
          </p>

          <div className="glass testimonial-card-responsive" style={{
            padding: '3.5rem 3rem',
            borderRadius: '2rem',
            border: '1.5px solid #E2E8F0',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.07)',
            position: 'relative'
          }}>
            <span className="testimonial-quote-icon" style={{ position: 'absolute', top: '1.5rem', left: '2.5rem', fontSize: '6rem', color: 'rgba(37,99,235,0.12)', fontFamily: 'serif', lineHeight: 1 }}>“</span>

            <p className="testimonial-quote-text" style={{ fontSize: '1.25rem', fontStyle: 'italic', lineHeight: '1.8', color: '#1E293B', marginBottom: '2.25rem', position: 'relative', zIndex: 1, fontWeight: 500 }}>
              &quot;{testimonials[activeTestimonial].quote}&quot;
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563EB' }}
              />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontWeight: 900, color: '#0F172A', margin: 0, fontSize: '1.1rem' }}>{testimonials[activeTestimonial].name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#2563EB', margin: '0.2rem 0 0 0', fontWeight: 700 }}>{testimonials[activeTestimonial].grade}</p>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '2rem' }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: activeTestimonial === i ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '9999px',
                  background: activeTestimonial === i ? '#2563EB' : '#CBD5E1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. Bottom CTA Banner ───────────────────────────────────── */}
      <section style={{ padding: '0 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div className="cta-responsive-banner" style={{
            borderRadius: '2.25rem',
            padding: '4rem 3.5rem',
            background: 'linear-gradient(135deg, #1E1B4B 0%, #2563EB 50%, #1D4ED8 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 25px 50px rgba(37,99,235,0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
                <Sparkles size={14} /> JOIN NEPAL&apos;S BEST LEARNING PORTAL
              </div>
              <h3 className="page-title-responsive" style={{ fontSize: '2.3rem', fontWeight: 900, marginBottom: '0.85rem', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Ready to Excel in Your SEE &amp; NEB Exams?
              </h3>
              <p style={{ color: '#DBEAFE', fontSize: '1.05rem', margin: 0, lineHeight: '1.7' }}>
                Join thousands of Nepali students studying with Gaurav Sir &amp; Team. Get instant access to video series and handwritten PDF handouts.
              </p>
            </div>

            <Link
              to="/courses"
              className="btn"
              style={{
                background: '#FFFFFF',
                color: '#1D4ED8',
                padding: '1.1rem 2.5rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '1rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Get Started Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Teacher Profile Modal Popup */}
      <TeacherProfileModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
    </div>
  );
};

export default Home;

