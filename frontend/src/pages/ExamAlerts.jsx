import { motion } from 'framer-motion';
import { Bell, ExternalLink, Calendar, Award, FileText, BookOpen, ClipboardList } from 'lucide-react';

const notices = [
  {
    tag: 'Grade 12 (NEB)',
    tagColor: '#2563EB',
    tagBg: 'rgba(37,99,235,0.1)',
    title: 'कक्षा १२ को Accounting, Rural Development, Instructional Pedagogy, Education & Development, Sociology, Opt. Nepali, Opt. English विषयको पुनर्योगको नतिजा प्रकाशन सम्बन्धी सूचना',
    desc: 'Grade 12 re-totaling result publication notice for multiple subjects.',
    link: 'https://neb.gov.np/detail/217',
  },
  {
    tag: 'Grade 12 (NEB)',
    tagColor: '#2563EB',
    tagBg: 'rgba(37,99,235,0.1)',
    title: 'कक्षा १२ को अनिवार्य नेपाली र अनिवार्य गणित विषयको पुनर्योगको नतिजा प्रकाशन सम्बन्धी सूचना',
    desc: 'Re-totaling result publication notice for Compulsory Nepali & Compulsory Mathematics.',
    link: 'https://neb.gov.np/detail/216',
  },
  {
    tag: 'Grade 12 (NEB)',
    tagColor: '#2563EB',
    tagBg: 'rgba(37,99,235,0.1)',
    title: 'कक्षा १२ को मौका (पूरक) परीक्षाको परीक्षा केन्द्र सम्बन्धी सूचना',
    desc: 'Supplementary exam centre allocation notice for Grade 12.',
    link: 'https://neb.gov.np/detail/212',
  },
  {
    tag: 'Grade 12 (NEB)',
    tagColor: '#2563EB',
    tagBg: 'rgba(37,99,235,0.1)',
    title: 'कक्षा १२ को मौका (पूरक) परीक्षाको समयतालिका तथा आवेदन फाराम बुझाउने सम्बन्धी सूचना',
    desc: 'Grade 12 supplementary exam timetable & application form submission notice.',
    link: 'https://neb.gov.np/detail/211',
  },
  {
    tag: 'Grade 12 (NEB)',
    tagColor: '#2563EB',
    tagBg: 'rgba(37,99,235,0.1)',
    title: 'राष्ट्रिय परीक्षा बोर्ड, सानोठिमी, भक्तपुरको कक्षा १२ को परीक्षाफल प्रकाशनसम्बन्धी विज्ञप्ति',
    desc: 'Grade 12 annual board exam result publication official press release.',
    link: 'https://neb.gov.np/detail/209',
  },
  {
    tag: 'Grade 12 (NEB)',
    tagColor: '#2563EB',
    tagBg: 'rgba(37,99,235,0.1)',
    title: 'कक्षा १२ को वार्षिक परीक्षाको समयतालिका',
    desc: 'Grade 12 annual board examination timetable.',
    link: 'https://neb.gov.np/detail/174',
  },
  {
    tag: 'Class 10 (SEE)',
    tagColor: '#059669',
    tagBg: 'rgba(16,185,129,0.1)',
    title: '२०८२ सालको माध्यमिक शिक्षा परीक्षा (नियमित तथा ग्रेडवृद्धि) को समयतालिका सम्बन्धी सूचना',
    desc: 'SEE 2082 regular & grade-increment board exam timetable.',
    link: 'https://neb.gov.np/detail/171',
  },
  {
    tag: 'Class 10 (SEE)',
    tagColor: '#059669',
    tagBg: 'rgba(16,185,129,0.1)',
    title: 'नेपाल सरकार राष्ट्रिय परीक्षा बोर्ड (SEE) सानोठिमी भक्तपुरको नतिजा प्रकाशन सम्बन्धी सूचना',
    desc: 'SEE result publication notice from NEB, Sanothimi, Bhaktapur.',
    link: 'https://neb.gov.np/detail/149',
  },
  {
    tag: 'Class 10 (SEE)',
    tagColor: '#059669',
    tagBg: 'rgba(16,185,129,0.1)',
    title: 'नेपाल सरकार राष्ट्रिय परीक्षा बोर्ड (SEE) सानोठिमी भक्तपुरको पुनर्योग सम्बन्धी सूचना',
    desc: 'SEE re-totaling application & result notice.',
    link: 'https://neb.gov.np/detail/138',
  },
  {
    tag: 'Grade 12 (NEB)',
    tagColor: '#2563EB',
    tagBg: 'rgba(37,99,235,0.1)',
    title: 'स्थगित नतिजा प्रकाशन, पुनर्योग, पुन:परीक्षण, ग्रेडसिट एकीकृत, प्रमाणपत्रका त्रुटि तथा अभिलेख संशोधन सम्बन्धी निर्देशिका, २०८३',
    desc: 'Directive for withheld results, re-totaling, re-checking, gradesheet integration & certificate correction — 2083.',
    link: 'https://neb.gov.np/detail/208',
  },
];

const ExamAlerts = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-banner-responsive"
        style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0F9FF 100%)',
          borderRadius: '1.5rem',
          padding: '3rem 2.5rem',
          color: '#0F172A',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #DBEAFE',
          boxShadow: '0 20px 40px -15px rgba(37,99,235,0.08)'
        }}
      >
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: '#DBEAFE', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, color: '#1D4ED8', marginBottom: '1.25rem' }}>
            <Bell size={14} /> OFFICIAL NEB NOTICE BOARD
          </div>
          <h1 className="page-title-responsive" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#0F172A' }}>
            SEE / NEB Exam Alerts
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '650px', lineHeight: '1.7' }}>
            Latest official notices, exam routines, result publications &amp; supplementary exam updates from the 
            <strong style={{ color: '#0F172A' }}> National Examinations Board (राष्ट्रिय परीक्षा बोर्ड)</strong>, Sanothimi, Bhaktapur.
          </p>
        </div>
      </motion.div>

      {/* Quick Links Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <a href="https://neb.ntc.net.np" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)', color: 'white', borderRadius: '1rem', padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s' }} className="card">
          <Award size={22} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Grade 12 Result</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>neb.ntc.net.np</div>
          </div>
          <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </a>

        <a href="https://see.ntc.net.np" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', borderRadius: '1rem', padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s' }} className="card">
          <Award size={22} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>SEE Result</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>see.ntc.net.np</div>
          </div>
          <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </a>

        <a href="https://neb.gov.np/model-question" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: 'white', borderRadius: '1rem', padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s' }} className="card">
          <ClipboardList size={22} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Model Questions</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>CDC Sample Papers</div>
          </div>
          <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </a>

        <a href="https://neb.gov.np/" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', borderRadius: '1rem', padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s' }} className="card">
          <BookOpen size={22} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>NEB Portal</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>neb.gov.np</div>
          </div>
          <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </a>
      </div>

      {/* Section Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <FileText size={20} color="#2563EB" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Latest Official Notices</h2>
      </div>

      {/* Notice Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices.map((notice, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="card glass"
            style={{ padding: '1.25rem 1.5rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '0.65rem', background: notice.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
              <Calendar size={18} color={notice.tagColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: notice.tagColor, background: notice.tagBg, padding: '0.15rem 0.55rem', borderRadius: '0.3rem', display: 'inline-block', marginBottom: '0.45rem' }}>
                {notice.tag}
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: '1.45' }}>
                {notice.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                {notice.desc}
              </p>
            </div>
            <a
              href={notice.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', gap: '0.35rem', whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'center' }}
            >
              View <ExternalLink size={13} />
            </a>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '2.5rem', padding: '1.5rem', borderTop: '1px solid var(--border-color)', color: '#94A3B8', fontSize: '0.85rem' }}>
        All notices sourced from the official website of{' '}
        <a href="https://neb.gov.np/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
          राष्ट्रिय परीक्षा बोर्ड (neb.gov.np) <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
        </a>
      </div>
    </div>
  );
};

export default ExamAlerts;
