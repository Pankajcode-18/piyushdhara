import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  PlayCircle, ArrowLeft, Download, Video, FileText, Bookmark,
  ExternalLink, CheckCircle2, ChevronLeft, ChevronRight,
  User, BookOpen, Zap, Clock, Moon, Sun
} from 'lucide-react';
import { fetchVideoDetails, fetchChapterContent } from '../utils/api';
import teacherImg from '../assets/gaurov.jpeg';
import { useTheme } from '../context/ThemeContext';

const LectureRoom = () => {
  const { studyMode, toggleStudyMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [chapterNotes, setChapterNotes] = useState([]);
  const [chapterVideos, setChapterVideos] = useState([]);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(id));
    const completed = JSON.parse(localStorage.getItem('completed_lectures') || '[]');
    setIsCompleted(completed.includes(id));
  }, [id]);

  const toggleBookmark = () => {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (bookmarks.includes(id)) {
      bookmarks = bookmarks.filter((b) => b !== id);
      setIsBookmarked(false);
    } else {
      bookmarks.push(id);
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const toggleComplete = () => {
    let completed = JSON.parse(localStorage.getItem('completed_lectures') || '[]');
    if (completed.includes(id)) {
      completed = completed.filter((b) => b !== id);
      setIsCompleted(false);
    } else {
      completed.push(id);
      setIsCompleted(true);
    }
    localStorage.setItem('completed_lectures', JSON.stringify(completed));
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchVideoDetails(id);
        setVideo(data);
        if (data.chapter) {
          const content = await fetchChapterContent(data.chapter);
          setChapterNotes(content.notes || []);
          setChapterVideos(content.videos || []);
        }
      } catch {
        setVideo({
          _id: id,
          title: 'Class Lecture: Rotational Dynamics — Part 1',
          description: 'Detailed analysis of Moment of Inertia, Angular Momentum, and torque numericals per Nepal SEE/NEB syllabus.',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          isFree: true,
          duration: 1200,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const formatDuration = (secs) => {
    if (!secs) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentIndex = chapterVideos.findIndex((v) => v._id === id);
  const prevVideo = currentIndex > 0 ? chapterVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < chapterVideos.length - 1 ? chapterVideos[currentIndex + 1] : null;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '3px solid var(--primary)', borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '0.9rem' }}>Loading lecture...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Video not found.</p>
      </div>
    );
  }

  const ytId = getYouTubeId(video.videoUrl);

  return (
    <div className="bg-mesh animate-fade-in" style={{ minHeight: '90vh', paddingBottom: '3rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>

        {/* Top Header: Breadcrumb & Top-Right Study Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="lecture-breadcrumb" style={{ margin: 0 }}>
            <Link to="/courses">Batches</Link>
            <span className="sep">›</span>
            <Link to={`/courses/${video.chapter || ''}`}>Course</Link>
            <span className="sep">›</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {video.title}
            </span>
          </div>

          {/* Top Right Study Mode Button */}
          <button
            onClick={toggleStudyMode}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: studyMode ? '1.5px solid var(--primary)' : '1px solid var(--border)',
              background: studyMode ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' : 'var(--bg-card)',
              color: studyMode ? '#38BDF8' : 'var(--text-primary)',
              boxShadow: studyMode ? '0 4px 14px rgba(56,189,248,0.25)' : 'var(--shadow-sm)'
            }}
            title="Toggle Study Mode (Turn off / Turn on light)"
          >
            {studyMode ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="var(--primary)" />}
            <span>{studyMode ? 'Study Mode: ON 🌙' : 'Study Mode: OFF 💡'}</span>
          </button>
        </div>

        {/* Two-column layout */}
        <div className="main-content-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2.2fr) minmax(0, 1fr)',
          gap: '2rem',
          alignItems: 'start',
        }}>

          {/* ── Left: Player + Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Video Player */}
            <div className="lecture-video-container">
              {ytId ? (
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title={video.title}
                />
              ) : (
                <video
                  src={video.videoUrl?.startsWith('http') ? video.videoUrl : `http://localhost:5000/${video.videoUrl}`}
                  controls autoPlay
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>

            {/* Playback Speed (only for native video) */}
            {!ytId && (
              <div className="card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Zap size={16} color="var(--warning)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Playback Speed:</span>
                {[0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    style={{
                      padding: '0.3rem 0.7rem', fontSize: '0.82rem', fontWeight: 600,
                      borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                      background: playbackSpeed === speed ? 'var(--primary)' : 'var(--bg-input)',
                      color: playbackSpeed === speed ? '#FFFFFF' : 'var(--text-muted)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            )}

            {/* Title + Actions */}
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {video.isFree && <span className="badge badge-green"><CheckCircle2 size={10} /> Free</span>}
                {video.duration && (
                  <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                    <Clock size={10} /> {formatDuration(video.duration)}
                  </span>
                )}
              </div>

              <h1 style={{
                fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)',
                letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '0.5rem',
              }}>{video.title}</h1>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {video.description}
              </p>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <button
                onClick={toggleComplete}
                className={`mark-complete-btn ${isCompleted ? 'completed' : 'incomplete'}`}
              >
                <CheckCircle2 size={15} />
                {isCompleted ? 'Completed ✓' : 'Mark Complete'}
              </button>

              <button
                onClick={toggleBookmark}
                className="btn btn-outline"
                style={{
                  padding: '0.55rem 1rem', fontSize: '0.85rem', gap: '0.4rem',
                  borderColor: isBookmarked ? 'var(--primary)' : 'var(--border)',
                  color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)',
                  background: isBookmarked ? 'var(--primary-light)' : 'transparent',
                }}
              >
                <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>



              {ytId && (
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', gap: '0.4rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                >
                  <ExternalLink size={14} />
                  Watch on YouTube
                </a>
              )}
            </div>

            {/* Instructor Card */}
            <div className="instructor-card">
              <img
                src={teacherImg}
                onError={(e) => { e.target.src = '/gaurov.jpeg'; }}
                alt="Instructor"
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>Gaurav Sir</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Lead Physics & Mathematics Instructor</p>
              </div>
              <span className="badge badge-blue">
                <BookOpen size={10} /> Verified
              </span>
            </div>

            {/* Prev / Next Navigation */}
            {(prevVideo || nextVideo) && (
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
                {prevVideo ? (
                  <Link
                    to={`/watch/${prevVideo._id}`}
                    className="btn btn-outline"
                    style={{ flex: 1, gap: '0.5rem', padding: '0.65rem 1rem', fontSize: '0.85rem', justifyContent: 'flex-start', maxWidth: '48%' }}
                  >
                    <ChevronLeft size={15} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prevVideo.title}
                    </span>
                  </Link>
                ) : <div style={{ flex: 1 }} />}

                {nextVideo && (
                  <Link
                    to={`/watch/${nextVideo._id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, gap: '0.5rem', padding: '0.65rem 1rem', fontSize: '0.85rem', justifyContent: 'flex-end', maxWidth: '48%' }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {nextVideo.title}
                    </span>
                    <ChevronRight size={15} />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Resources Panel ── */}
          <div className="card" style={{ padding: '0', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)', maxHeight: 'calc(100vh - var(--navbar-height) - 2rem)', display: 'flex', flexDirection: 'column' }}>

            {/* Tabs */}
            <div className="tabs-header" style={{ padding: '0 0.25rem' }}>
              <button
                className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <FileText size={15} /> Handouts
              </button>
              <button
                className={`tab-btn ${activeTab === 'playlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('playlist')}
              >
                <Video size={15} /> Playlist
                {chapterVideos.length > 0 && (
                  <span style={{
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    fontSize: '0.65rem', fontWeight: 800,
                    padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', marginLeft: '0.2rem',
                  }}>{chapterVideos.length}</span>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
              {activeTab === 'notes' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {chapterNotes.length === 0 ? (
                    <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={22} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', lineHeight: 1.3 }}>
                            {video?.title ? `${video.title} — Handout & Formula Sheet` : 'Chapter Handwritten PDF Notes'}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
                            Handwritten notes prepared by Gaurav Sir &amp; Team.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <a
                          href={video?.videoUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.82rem', gap: '0.35rem', justifyContent: 'center' }}
                        >
                          <ExternalLink size={14} /> Open in New Tab
                        </a>
                        <a
                          href={video?.videoUrl || '#'}
                          download
                          className="btn btn-outline"
                          style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.82rem', gap: '0.35rem', justifyContent: 'center' }}
                        >
                          <Download size={14} /> Download PDF
                        </a>
                      </div>
                    </div>
                  ) : (
                    chapterNotes.map((note) => {
                      const notePdfUrl = note.fileUrl?.startsWith('http') ? note.fileUrl : `http://localhost:5000/${note.fileUrl}`;
                      return (
                        <div key={note._id || note.title} className="card" style={{ padding: '1.25rem', border: '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <FileText size={22} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', lineHeight: 1.3 }}>
                                {note.title}
                              </h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
                                PDF Handout &amp; Formula Notes
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <a
                              href={notePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.82rem', gap: '0.35rem', justifyContent: 'center' }}
                            >
                              <ExternalLink size={14} /> Open in New Tab
                            </a>
                            <a
                              href={notePdfUrl}
                              download
                              className="btn btn-outline"
                              style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.82rem', gap: '0.35rem', justifyContent: 'center' }}
                            >
                              <Download size={14} /> Download PDF
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {chapterVideos.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon"><Video size={24} /></div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>No playlist</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>No other lectures in this chapter.</p>
                    </div>
                  ) : (
                    chapterVideos.map((v, idx) => {
                      const isCurrent = v._id === id;
                      const vCompleted = JSON.parse(localStorage.getItem('completed_lectures') || '[]').includes(v._id);
                      return (
                        <Link
                          key={v._id}
                          to={`/watch/${v._id}`}
                          style={{
                            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                            padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-lg)',
                            textDecoration: 'none',
                            background: isCurrent
                              ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
                              : 'var(--bg-input)',
                            border: isCurrent ? 'none' : '1px solid var(--border)',
                            pointerEvents: isCurrent ? 'none' : 'auto',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{
                            width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                            background: isCurrent ? 'rgba(255,255,255,0.2)' : (vCompleted ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)'),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 800,
                            color: isCurrent ? '#FFF' : (vCompleted ? 'var(--success)' : 'var(--text-muted)'),
                            border: isCurrent ? 'none' : `1px solid ${vCompleted ? 'var(--success)' : 'var(--border)'}`,
                          }}>
                            {vCompleted && !isCurrent ? '✓' : idx + 1}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: '0.82rem', fontWeight: isCurrent ? 700 : 500, margin: 0,
                              color: isCurrent ? '#FFFFFF' : 'var(--text-primary)',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{v.title}</p>
                            {v.duration && (
                              <p style={{ fontSize: '0.7rem', color: isCurrent ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', margin: 0 }}>
                                {formatDuration(v.duration)}
                              </p>
                            )}
                          </div>
                          {isCurrent && <PlayCircle size={14} color="rgba(255,255,255,0.9)" style={{ flexShrink: 0, marginTop: '2px' }} />}
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureRoom;
