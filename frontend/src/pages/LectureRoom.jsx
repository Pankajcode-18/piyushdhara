import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  PlayCircle, ArrowLeft, Download, Video, FileText, Bookmark,
  ExternalLink, CheckCircle2, ChevronLeft, ChevronRight,
  User, BookOpen, Zap, Clock, Moon, Sun, MessageSquare, Star, Send, Trash2, ShieldCheck, ThumbsUp, Flame
} from 'lucide-react';
import { 
  fetchVideoDetails, fetchChapterContent,
  fetchVideoCommentsApi, postVideoCommentApi, deleteVideoCommentApi,
  fetchVideoFeedbackApi, submitVideoFeedbackApi, recordStreakApi, getFileUrl
} from '../utils/api';
import teacherImg from '../assets/gaurov.jpeg';
import { useTheme } from '../context/ThemeContext';

const LectureRoom = () => {
  const { studyMode, toggleStudyMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [chapterNotes, setChapterNotes] = useState([]);
  const [chapterVideos, setChapterVideos] = useState([]);

  const [bottomTab, setBottomTab] = useState('discussion');

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

  // Comments State
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  // Feedback State
  const [feedbackSummary, setFeedbackSummary] = useState({ averageRating: 0, totalRatings: 0, feedbacks: [] });
  const [userRating, setUserRating] = useState(5);
  const [userFeedbackText, setUserFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const loadComments = async () => {
    try {
      const data = await fetchVideoCommentsApi(id);
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadFeedback = async () => {
    try {
      const data = await fetchVideoFeedbackApi(id);
      setFeedbackSummary(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchVideoDetails(id);
        setVideo(data);
        if (data.chapter) {
          const chapId = typeof data.chapter === 'object' ? data.chapter._id : data.chapter;
          if (chapId) {
            const content = await fetchChapterContent(chapId);
            setChapterNotes(content.notes || []);
            setChapterVideos(content.videos || []);
          }
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
    loadComments();
    loadFeedback();

    // Trigger daily study streak update for active student
    const triggerStreak = async () => {
      const currentLocal = Number(localStorage.getItem('study_streak_count') || 1);
      const res = await recordStreakApi(userObj?._id, currentLocal);
      if (res && res.streakCount) {
        localStorage.setItem('study_streak_count', res.streakCount);
        if (userObj) {
          userObj.streakCount = res.streakCount;
          userObj.lastStudyDate = res.lastStudyDate;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
      }
    };
    triggerStreak();
  }, [id]);

  const [guestName, setGuestName] = useState(() => {
    return userObj?.name || localStorage.getItem('student_name') || '';
  });

  const handleNameChange = (val) => {
    setGuestName(val);
    localStorage.setItem('student_name', val);
  };

  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handlePostReply = async (parentCommentId) => {
    if (!replyText.trim()) return;

    const authorName = userObj?.name || guestName.trim() || localStorage.getItem('student_name') || 'Instructor / Teacher';
    if (guestName.trim()) {
      localStorage.setItem('student_name', guestName.trim());
    }

    try {
      setPostingComment(true);
      await postVideoCommentApi(token, id, replyText, authorName, parentCommentId);
      setReplyText('');
      setReplyToId(null);
      await loadComments();
    } catch (err) {
      alert(err.message || 'Failed to post reply');
    } finally {
      setPostingComment(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const authorName = userObj?.name || guestName.trim() || localStorage.getItem('student_name') || 'Enrolled Student';
    if (guestName.trim()) {
      localStorage.setItem('student_name', guestName.trim());
    }

    try {
      setPostingComment(true);
      await postVideoCommentApi(token, id, commentText, authorName);
      setCommentText('');
      await loadComments();
    } catch (err) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteVideoCommentApi(token, commentId);
      await loadComments();
    } catch (err) {
      alert(err.message || 'Failed to delete comment');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const authorName = userObj?.name || guestName.trim() || localStorage.getItem('student_name') || 'Enrolled Student';
    if (guestName.trim()) {
      localStorage.setItem('student_name', guestName.trim());
    }

    try {
      setSubmittingFeedback(true);
      await submitVideoFeedbackApi(token, id, userRating, userFeedbackText, authorName);
      setUserFeedbackText('');
      alert('Thank you for rating and giving feedback on this lecture!');
      await loadFeedback();
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

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
                  src={video?.videoUrl ? getFileUrl(video.videoUrl) : 'https://www.w3schools.com/html/mov_bbb.mp4'}
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

            {/* ── Public Discussion Q&A & Rating Feedback Section ── */}
            <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)', marginTop: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              
              {/* Bottom Section Sub-tabs */}
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1.5px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setBottomTab('discussion')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    color: bottomTab === 'discussion' ? 'var(--primary)' : 'var(--text-muted)',
                    borderBottom: bottomTab === 'discussion' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MessageSquare size={16} /> Discussion &amp; Q&amp;A Board ({comments.length})
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab('feedback')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    color: bottomTab === 'feedback' ? '#F59E0B' : 'var(--text-muted)',
                    borderBottom: bottomTab === 'feedback' ? '2.5px solid #F59E0B' : '2.5px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Star size={16} fill="#F59E0B" color="#F59E0B" /> Rating &amp; Feedback ({feedbackSummary.totalRatings})
                </button>
              </div>

              {/* TAB 1: Discussion & Q&A Board */}
              {bottomTab === 'discussion' && (
                <div>
                  <form onSubmit={handlePostComment} style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>
                        {userObj?.name ? userObj.name.charAt(0).toUpperCase() : (guestName ? guestName.charAt(0).toUpperCase() : 'S')}
                      </div>

                      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {!userObj && (
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Your Name (e.g. Piyush Dhara)"
                            style={{
                              width: '100%',
                              borderRadius: '0.65rem',
                              padding: '0.55rem 0.85rem',
                              fontSize: '0.85rem',
                              border: '1.5px solid var(--border)',
                              background: 'var(--bg-input)',
                              color: 'var(--text-primary)',
                              outline: 'none'
                            }}
                          />
                        )}

                        <textarea
                          rows={3}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Ask a doubt or participate in lecture discussion..."
                          style={{
                            width: '100%',
                            borderRadius: '0.85rem',
                            padding: '0.85rem 1rem',
                            fontSize: '0.9rem',
                            border: '1.5px solid var(--border)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            resize: 'none'
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {userObj ? `Posting as ${userObj.name} (${userObj.role === 'admin' ? 'Teacher' : 'Enrolled Student'})` : `Posting as ${guestName.trim() || 'Enrolled Student'}`}
                          </span>
                          <button
                            type="submit"
                            disabled={postingComment || !commentText.trim()}
                            className="btn btn-primary"
                            style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', gap: '0.35rem' }}
                          >
                            <Send size={14} /> {postingComment ? 'Posting...' : 'Post Comment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* List of Comments */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {comments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                        <MessageSquare size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>No comments posted yet. Be the first to ask a doubt or start the discussion!</p>
                      </div>
                    ) : (
                      comments.filter(cmt => !cmt.parentComment).map((cmt) => {
                        const replies = comments.filter(r => (r.parentComment?._id || r.parentComment) === cmt._id);
                        return (
                          <div key={cmt._id} style={{ padding: '1.1rem 1.25rem', borderRadius: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                            
                            {/* Comment Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: cmt.userRole === 'admin' ? '#2563EB' : '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                                  {cmt.userName ? cmt.userName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', marginRight: '0.4rem' }}>
                                    {cmt.userName}
                                  </span>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '9999px',
                                    background: cmt.userRole === 'admin' ? '#DBEAFE' : '#D1FAE5',
                                    color: cmt.userRole === 'admin' ? '#1D4ED8' : '#047857'
                                  }}>
                                    {cmt.userRole === 'admin' ? 'Teacher / Instructor' : 'Student'}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {new Date(cmt.createdAt).toLocaleString()}
                                </span>
                                {(userObj?._id === cmt.user?._id || userObj?._id === cmt.user || userObj?.role === 'admin') && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(cmt._id)}
                                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.2rem' }}
                                    title="Delete comment"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Comment Content */}
                            <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', lineHeight: 1.5, paddingLeft: '2.6rem' }}>
                              {cmt.text}
                            </p>

                            {/* Action Buttons: Reply */}
                            <div style={{ paddingLeft: '2.6rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyToId(replyToId === cmt._id ? null : cmt._id);
                                  setReplyText('');
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, padding: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                              >
                                <MessageSquare size={13} /> {replyToId === cmt._id ? 'Cancel Reply' : 'Reply / Answer'}
                              </button>
                            </div>

                            {/* Inline Reply Form */}
                            {replyToId === cmt._id && (
                              <div style={{ marginTop: '0.85rem', marginLeft: '2.6rem', padding: '0.85rem', borderRadius: '0.75rem', background: 'var(--bg-card)', border: '1.5px solid var(--primary-light)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                                  {userObj?.role === 'admin' ? 'Replying as Teacher / Instructor' : `Replying as ${userObj?.name || guestName || 'Student'}`}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Write your reply to ${cmt.userName}...`}
                                    style={{
                                      flex: 1,
                                      borderRadius: '0.5rem',
                                      padding: '0.45rem 0.85rem',
                                      fontSize: '0.85rem',
                                      border: '1px solid var(--border)',
                                      outline: 'none'
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handlePostReply(cmt._id)}
                                    disabled={postingComment || !replyText.trim()}
                                    className="btn btn-primary"
                                    style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                                  >
                                    Send Reply
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Nested Replies List */}
                            {replies.length > 0 && (
                              <div style={{ marginTop: '1rem', marginLeft: '2.6rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '2px solid var(--primary-light)', paddingLeft: '1rem' }}>
                                {replies.map((reply) => (
                                  <div key={reply._id} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: reply.userRole === 'admin' ? '#EFF6FF' : 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                                          {reply.userName}
                                        </span>
                                        <span style={{
                                          fontSize: '0.65rem',
                                          fontWeight: 800,
                                          padding: '0.1rem 0.4rem',
                                          borderRadius: '9999px',
                                          background: reply.userRole === 'admin' ? '#DBEAFE' : '#D1FAE5',
                                          color: reply.userRole === 'admin' ? '#1D4ED8' : '#047857'
                                        }}>
                                          {reply.userRole === 'admin' ? 'Teacher / Instructor' : 'Student'}
                                        </span>
                                      </div>
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {new Date(reply.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                                      {reply.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Rating & Feedback */}
              {bottomTab === 'feedback' && (
                <div>
                  {/* Rating Header Metrics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '1.25rem', background: '#FEF3C7', borderRadius: '1rem', border: '1px solid #FDE68A' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#D97706', lineHeight: 1 }}>
                        {feedbackSummary.averageRating}
                      </div>
                      <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'center', margin: '0.3rem 0' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={star <= Math.round(feedbackSummary.averageRating) ? "#F59E0B" : "none"}
                            color="#F59E0B"
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E' }}>
                        {feedbackSummary.totalRatings} Total Ratings
                      </div>
                    </div>

                    {/* Interactive Star Selector & Form */}
                    <form onSubmit={handleSubmitFeedback} style={{ flex: 1 }}>
                      <div style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#92400E' }}>
                        Rate &amp; Review this Lecture:
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                          >
                            <Star
                              size={24}
                              fill={star <= userRating ? "#F59E0B" : "none"}
                              color="#F59E0B"
                            />
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {!userObj && (
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Your Name (e.g. Piyush Dhara)"
                            style={{
                              borderRadius: '0.5rem',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.85rem',
                              border: '1px solid #FCD34D',
                              outline: 'none'
                            }}
                          />
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={userFeedbackText}
                            onChange={(e) => setUserFeedbackText(e.target.value)}
                            placeholder="Write short feedback or quality review..."
                            style={{
                              flex: 1,
                              borderRadius: '0.5rem',
                              padding: '0.5rem 0.85rem',
                              fontSize: '0.85rem',
                              border: '1px solid #FCD34D',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="submit"
                            disabled={submittingFeedback}
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', background: '#D97706', borderColor: '#D97706' }}
                          >
                            Submit Rating
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* List of Feedbacks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {feedbackSummary.feedbacks?.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                        No rating feedback submitted yet.
                      </div>
                    ) : (
                      feedbackSummary.feedbacks?.map((fb) => (
                        <div key={fb._id} style={{ padding: '0.85rem 1.1rem', borderRadius: '0.85rem', background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                              {fb.userName}
                            </span>
                            <div style={{ display: 'flex', gap: '0.15rem' }}>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={12} fill={s <= fb.rating ? "#F59E0B" : "none"} color="#F59E0B" />
                              ))}
                            </div>
                          </div>
                          {fb.feedbackText && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                              "{fb.feedbackText}"
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── Right: Resources Panel ── */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            {/* Daily Study Streak Pill Badge (Above Entire Card Container) */}
            <div 
              className="streak-hover-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: '0.85rem',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                border: '1.5px solid #FCD34D',
                color: '#92400E',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(245, 158, 11, 0.18)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Flame size={18} fill="#F59E0B" color="#D97706" />
                <span>🔥 {userObj?.streakCount || Number(localStorage.getItem('study_streak_count') || 1)} Day Streak Active</span>
              </div>
              <span style={{
                fontSize: '0.7rem',
                background: '#F59E0B',
                color: '#FFFFFF',
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
                fontWeight: 800,
              }}>Saved ✓</span>

              {/* Hover Popup Tooltip Box */}
              <div className="streak-tooltip-popup" style={{ width: '280px', left: '50%', transform: 'translateX(-50%) translateY(8px) scale(0.96)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Flame size={18} fill="#F59E0B" color="#F59E0B" />
                  <strong style={{ fontSize: '0.9rem', color: '#FEF3C7' }}>Daily Study Streak Active!</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.45, fontWeight: 500 }}>
                  You are currently on a <strong style={{ color: '#FDE68A' }}>{userObj?.streakCount || Number(localStorage.getItem('study_streak_count') || 1)} Day Study Streak</strong>! Keep studying daily to maintain your streak.
                </p>
              </div>
            </div>

            {/* Resources Panel Card Container */}
            <div className="card" style={{ padding: '0', borderRadius: 'var(--radius-xl)', overflow: 'hidden', maxHeight: 'calc(100vh - var(--navbar-height) - 6rem)', display: 'flex', flexDirection: 'column' }}>

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
                        const notePdfUrl = getFileUrl(note.fileUrl);
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
    </div>
  );
};

export default LectureRoom;
