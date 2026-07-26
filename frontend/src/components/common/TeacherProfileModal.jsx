import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  CheckCircle2, 
  Star, 
  Users, 
  Award, 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import teacherImg from '../../assets/gaurov.jpeg';

const TeacherProfileModal = ({ teacher, onClose }) => {
  const navigate = useNavigate();

  if (!teacher) return null;

  // Resolve photo URL with fallback
  const getTeacherPhoto = (t) => {
    if (t.photo && t.photo !== '/teacher.png' && !t.photo.includes('default')) {
      return t.photo;
    }
    return teacherImg;
  };

  const photoUrl = getTeacherPhoto(teacher);

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      <div 
        className="card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#FFFFFF',
          borderRadius: '1.75rem',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Close Profile"
        >
          <X size={20} />
        </button>

        {/* ── 1. PROFILE HERO HEADER ───────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            padding: '2.25rem 2rem 2rem 2rem',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Avatar Ring */}
          <div style={{ position: 'relative', width: '108px', height: '108px', margin: '0 auto 1.25rem auto' }}>
            <img
              src={photoUrl}
              alt={teacher.name}
              onError={(e) => { e.target.src = teacherImg; }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #2563EB',
                boxShadow: '0 10px 25px rgba(37,99,235,0.4)'
              }}
            />
            {/* Verified Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#10B981',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: '0.25rem',
                border: '2.5px solid #0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Verified Lead Instructor"
            >
              <CheckCircle2 size={16} />
            </div>
          </div>

          <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {teacher.name}
          </h3>

          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.85rem' }}>
            {teacher.designation || 'Senior Lead Educator & Entrance Specialist'}
          </div>

          {/* Qualification & Experience Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.75rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.15)', color: '#F1F5F9', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <GraduationCap size={13} color="#60A5FA" /> {teacher.qualification || 'M.Sc. Mathematics & Physics'}
            </span>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.75rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.15)', color: '#F1F5F9', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Award size={13} color="#FBBF24" /> {teacher.experience || '10+ Years Exp'}
            </span>
          </div>
        </div>

        {/* ── 2. QUICK STATS ROW ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '1rem 0' }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              {teacher.rating || 4.9} <Star size={16} fill="#F59E0B" color="#F59E0B" />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Rating</div>
          </div>

          <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Users size={16} /> {teacher.studentsMentored || '15,000+'}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Students</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <BookOpen size={16} /> Active
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Preparation Lead</div>
          </div>
        </div>

        {/* ── 3. BODY DETAILS & SPECIALIZATIONS ────────────────────── */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            About the Instructor
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
            {teacher.bio || 'Passionate educator dedicated to simplifying complex Mathematics, Physics, and Entrance concepts for students across Nepal.'}
          </p>

          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Specialization & Lead Subjects
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {(teacher.specializations && teacher.specializations.length > 0
              ? teacher.specializations 
              : ['Mahabharath Math', 'NEB Physics', 'IOE Entrance', 'Loksewa Tayari']
            ).map((spec, sIdx) => (
              <span 
                key={sIdx}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  border: '1px solid #DBEAFE',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '0.6rem'
                }}
              >
                ⚡ {spec}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                onClose();
                navigate('/courses');
              }}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.88rem', justifyContent: 'center' }}
            >
              <BookOpen size={16} /> Browse Instructor's Batches
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/support');
              }}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', justifyContent: 'center' }}
            >
              <MessageSquare size={16} /> Contact Help Desk
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherProfileModal;
