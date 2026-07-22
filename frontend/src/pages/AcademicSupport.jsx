import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Users, BookOpen, Headphones, ExternalLink, Video, Globe } from 'lucide-react';

const AcademicSupport = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-banner-responsive"
        style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 50%, #F8FAFC 100%)',
          borderRadius: '1.5rem',
          padding: '3.5rem 3rem',
          color: '#0F172A',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #A7F3D0',
          boxShadow: '0 20px 40px -15px rgba(16,185,129,0.08)'
        }}
      >
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: '#D1FAE5', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#047857', marginBottom: '1.25rem' }}>
            <Headphones size={14} /> WE&apos;RE HERE TO HELP
          </div>
          <h1 className="page-title-responsive" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#0F172A' }}>
            Academic Support
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '650px', lineHeight: '1.7' }}>
            Need help with your studies or have questions about our courses? Our dedicated team led by 
            <strong style={{ color: '#0F172A' }}> Gaurav Sir &amp; Team </strong> 
            is always ready to assist you in your learning journey.
          </p>
        </div>
      </motion.div>

      {/* Contact Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card glass"
          style={{ padding: '1.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Phone size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Call Us</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem', lineHeight: '1.5' }}>
            Talk directly with our academic counselors for instant support.
          </p>
          <a href="tel:+9779876543210" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2563EB', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={16} /> +977-9876543210
          </a>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card glass"
          style={{ padding: '1.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Mail size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Email Us</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem', lineHeight: '1.5' }}>
            Send us your queries and we'll respond within 24 hours.
          </p>
          <a href="mailto:support@piyushdhara.com" style={{ fontSize: '1rem', fontWeight: 700, color: '#059669', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={16} /> support@piyushdhara.com
          </a>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card glass"
          style={{ padding: '1.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <MapPin size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Visit Us</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem', lineHeight: '1.5' }}>
            Come meet us in person for face-to-face academic guidance.
          </p>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#7C3AED' }}>
            Bhaktapur, Nepal
          </span>
        </motion.div>
      </div>

      {/* Support Hours & How We Help */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Support Hours */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="card glass"
          style={{ padding: '2rem', border: '1px solid var(--border-color)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Clock size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Support Hours</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { day: 'Sunday – Friday', time: '7:00 AM – 9:00 PM', active: true },
              { day: 'Saturday', time: '8:00 AM – 6:00 PM', active: true },
              { day: 'Public Holidays', time: '10:00 AM – 4:00 PM', active: false },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '0.65rem', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>{item.day}</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: item.active ? '#059669' : '#94A3B8', background: item.active ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)', padding: '0.2rem 0.6rem', borderRadius: '0.35rem' }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How We Help */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card glass"
          style={{ padding: '2rem', border: '1px solid var(--border-color)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Users size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>How We Help</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '📚', title: 'Course Guidance', desc: 'Help choosing the right batch & preparation plan' },
              { icon: '❓', title: 'Doubt Clearing', desc: 'Subject-wise doubt resolution with expert teachers' },
              { icon: '📝', title: 'Exam Strategy', desc: 'Personalized exam preparation tips & time management' },
              { icon: '💳', title: 'Enrollment Support', desc: 'Help with batch enrollment & payment queries' },
              { icon: '🎯', title: 'Career Counseling', desc: 'IOE, Medical, Loksewa path guidance after SEE/NEB' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '0.7rem 0.75rem', background: '#F8FAFC', borderRadius: '0.65rem', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: '0.05rem' }}>{item.icon}</span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Social Links & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <MessageCircle size={20} color="#2563EB" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Connect With Us</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <a href="https://wa.me/9779876543210" target="_blank" rel="noopener noreferrer" style={{
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }} className="card">
            <MessageCircle size={28} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>WhatsApp</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Chat with us instantly</div>
            </div>
            <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
          </a>

          <a href="https://youtube.com/@piyushdhara" target="_blank" rel="noopener noreferrer" style={{
            background: 'linear-gradient(135deg, #FF0000, #CC0000)',
            color: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }} className="card">
            <Video size={28} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>YouTube</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Free video lectures</div>
            </div>
            <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
          </a>

          <a href="https://facebook.com/piyushdhara" target="_blank" rel="noopener noreferrer" style={{
            background: 'linear-gradient(135deg, #1877F2, #0C5DC7)',
            color: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }} className="card">
            <Globe size={28} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Facebook</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Updates & community</div>
            </div>
            <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
          </a>

          <a href="mailto:support@piyushdhara.com" style={{
            background: 'linear-gradient(135deg, #EA580C, #F97316)',
            color: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }} className="card">
            <Mail size={28} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Email</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Detailed queries</div>
            </div>
            <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
          </a>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: '2.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <BookOpen size={20} color="#2563EB" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {[
            { q: 'How do I enroll in a course batch?', a: 'Click on any batch from "Explore Batches", then click "Enroll in Batch" and fill in your student details. Enrollment is instant!' },
            { q: 'Are the video lectures available offline?', a: 'Currently all lectures are streamed online. You can watch them anytime at your convenience through your enrolled batch.' },
            { q: 'Can I access free notes without enrolling?', a: 'Yes! All published notes and PDFs under "Free Notes & PDFs" in the sidebar are freely accessible to everyone.' },
            { q: 'How can I check my SEE/NEB exam results?', a: 'Visit our "SEE/NEB Exam Alerts" page for direct links to the official NTC result portals and latest NEB notices.' },
            { q: 'What subjects are covered in PiyushDhara?', a: 'We cover SEE (Class 10), NEB Class 11-12 Science & Commerce, IOE Entrance Preparation, and Loksewa Tayari.' },
            { q: 'Is there a refund policy for paid courses?', a: 'Please contact our support team within 7 days of enrollment for any refund-related queries.' },
          ].map((faq, i) => (
            <div key={i} className="card glass" style={{ padding: '1.25rem 1.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.4rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#2563EB', fontWeight: 800, flexShrink: 0 }}>Q.</span>
                {faq.q}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: '1.55', paddingLeft: '1.35rem' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '2.5rem', padding: '1.5rem', borderTop: '1px solid var(--border-color)', color: '#94A3B8', fontSize: '0.85rem' }}>
        PiyushDhara Academic Support · Gaurav Sir & Team · Bhaktapur, Nepal
      </div>
    </div>
  );
};

export default AcademicSupport;
