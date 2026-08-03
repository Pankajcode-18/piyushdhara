import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  FlaskConical,
  Calculator,
  Lightbulb,
  Microscope,
  BookOpen,
  Globe,
  GraduationCap
} from 'lucide-react';

const HeroAnimatedLogo = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle subtle mouse parallax movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16; // Max +/- 8px tilt
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // 8 Education subject orbiting icons — 45° apart
  const orbitingIcons = [
    { icon: Atom,          label: 'Physics',     color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.14)' },   // Blue
    { icon: FlaskConical,  label: 'Chemistry',   color: '#10B981', bg: 'rgba(16, 185, 129, 0.14)' },   // Emerald
    { icon: Calculator,    label: 'Mathematics', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.14)' },    // Rose
    { icon: Lightbulb,     label: 'Ideas',       color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)' },   // Amber
    { icon: Microscope,    label: 'Biology',     color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.14)' },   // Violet
    { icon: BookOpen,      label: 'Literature',  color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.14)' },   // Sky
    { icon: Globe,         label: 'Geography',   color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.14)' },   // Teal
    { icon: GraduationCap, label: 'Graduation',  color: '#6366F1', bg: 'rgba(99, 102, 241, 0.14)' },  // Indigo
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="hero-animated-logo-stage"
      style={{
        transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
      }}
    >
      {/* ── Background Effects: Grid pattern, radial glows & ambient lighting ── */}
      <div className="hero-bg-grid" />
      <div className={`hero-radial-glow ${isHovered ? 'hover-active' : ''}`} />
      <div className="hero-secondary-glow" />

      {/* Floating particles */}
      <div className="hero-particle particle-1" />
      <div className="hero-particle particle-2" />
      <div className="hero-particle particle-3" />
      <div className="hero-particle particle-4" />
      <div className="hero-particle particle-5" />

      {/* ── Outer Concentric Rotating Rings ── */}

      {/* Ring 3 (Outer): Clockwise 25s */}
      <div className="hero-ring hero-ring-outer">
        <div className="ring-pulse-node node-top-right" />
        <div className="ring-pulse-node node-bottom-left" />
      </div>

      {/* Ring 2 (Middle): Counterclockwise 18s */}
      <div className="hero-ring hero-ring-middle">
        <div className="ring-accent-dash dash-left" />
        <div className="ring-accent-dash dash-right" />
      </div>

      {/* Ring 1 (Inner): Clockwise 12s */}
      <div className="hero-ring hero-ring-inner">
        <div className="ring-dot-node" />
      </div>

      {/* ── Orbiting Tech & Education Icons Layer ── */}
      <div className="hero-orbit-track">
        {orbitingIcons.map((item, idx) => {
          const angleDeg = idx * 45; // 360 / 8 = 45 degrees apart
          const IconComp = item.icon;

          return (
            <div
              key={idx}
              className="hero-orbit-item"
              style={{
                transform: `rotate(${angleDeg}deg) translateY(-50%)`
              }}
            >
              {/* Counter-rotate the inner icon badge so it stays upright */}
              <div
                className="hero-orbit-icon-badge"
                style={{
                  transform: `rotate(-${angleDeg}deg)`,
                  backgroundColor: item.bg,
                  borderColor: `${item.color}40`
                }}
                title={item.label}
              >
                <IconComp size={19} color={item.color} />
                <span className="hero-orbit-tooltip">{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Central Fixed Logo — absolutely centered wrapper ── */}
      {/* Plain div handles centering; motion.div handles scale/glow only */}
      <div className="hero-center-logo-container">
        <motion.div
          animate={{
            scale: isHovered ? 1.06 : 1
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="hero-logo-glass-card">
            {!imageError ? (
              <img
                src="/Logo1.png"
                alt="PiyushDhara Logo"
                className="hero-center-logo-img"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="hero-logo-fallback">
                <BookOpen size={42} color="#2563EB" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroAnimatedLogo;
