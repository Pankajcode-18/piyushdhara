import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  HelpCircle,
  BarChart2,
  CheckCircle2,
  Award,
  ThumbsUp,
  ThumbsDown,
  CornerDownRight,
  Share2,
  Bookmark,
  Send,
  Shield,
  Code,
  Sparkles,
  User,
  Heart
} from 'lucide-react';
import {
  fetchCommunityPostByIdApi,
  fetchCommunityAnswersApi,
  createCommunityAnswerApi,
  voteAnswerApi,
  markBestAnswerApi,
  fetchCommunityCommentsApi,
  createCommunityCommentApi,
  reactToCommunityItemApi,
  voteCommunityPollApi,
  toggleSaveCommunityPostApi,
  getFileUrl
} from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const CommunityPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [post, setPost] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Answer Form State
  const [answerContent, setAnswerContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isAnsAnonymous, setIsAnsAnonymous] = useState(false);
  const [submittingAns, setSubmittingAns] = useState(false);

  // Comment Form State per parent
  const [activeReplyBox, setActiveReplyBox] = useState(null); // comment ID or 'post'
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadPostDetails = async () => {
    try {
      setLoading(true);
      const postRes = await fetchCommunityPostByIdApi(id);
      if (postRes.success) {
        setPost(postRes.post);
      }

      // Fetch answers if doubt or post
      const ansRes = await fetchCommunityAnswersApi(id);
      if (ansRes.success) {
        setAnswers(ansRes.answers);
      }

      // Fetch comments
      const commRes = await fetchCommunityCommentsApi('post', id);
      if (commRes.success) {
        setComments(commRes.comments);
      }
    } catch (err) {
      console.error('Error loading post details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostDetails();
  }, [id]);

  // Handle Submitting an Answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    try {
      setSubmittingAns(true);
      const codeSnippets = showCodeInput && codeSnippet.trim() ? [{ language: codeLanguage, code: codeSnippet.trim() }] : [];

      const res = await createCommunityAnswerApi(id, {
        content: answerContent,
        isAnonymous: isAnsAnonymous,
        codeSnippets
      });

      if (res.success) {
        setAnswerContent('');
        setCodeSnippet('');
        setShowCodeInput(false);
        setAnswers([...answers, res.answer]);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit answer');
    } finally {
      setSubmittingAns(false);
    }
  };

  // Handle Answer Vote (Upvote / Downvote)
  const handleAnswerVote = async (answerId, voteType) => {
    try {
      const res = await voteAnswerApi(answerId, voteType);
      if (res.success) {
        setAnswers(prev => prev.map(a => {
          if (a._id === answerId) {
            return {
              ...a,
              netUpvotes: res.netUpvotes,
              hasUpvoted: res.hasUpvoted,
              hasDownvoted: res.hasDownvoted
            };
          }
          return a;
        }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Mark Best Answer
  const handleMarkBestAnswer = async (answerId) => {
    try {
      const res = await markBestAnswerApi(answerId);
      if (res.success) {
        setAnswers(prev => prev.map(a => ({
          ...a,
          isBestAnswer: a._id === answerId
        })));
        alert('Answer marked as Best Answer! 🏆');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Submitting a Comment or Nested Reply
  const handleCommentSubmit = async (parentId = null) => {
    if (!commentContent.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await createCommunityCommentApi({
        targetType: 'post',
        targetId: id,
        parentId,
        content: commentContent,
        isAnonymous: false
      });

      if (res.success) {
        setCommentContent('');
        setActiveReplyBox(null);
        setComments([...comments, res.comment]);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Poll Vote handler
  const handlePollVote = async (optionId) => {
    try {
      const res = await voteCommunityPollApi(id, [optionId]);
      if (res.success) {
        setPost(prev => ({
          ...prev,
          poll: res.poll,
          userPollVotes: res.userPollVotes
        }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Helper for rendering recursive comment tree
  const renderComments = (parentId = null, depth = 0) => {
    const childComments = comments.filter(c => String(c.parentId) === String(parentId));
    if (childComments.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', paddingLeft: depth > 0 ? '1.25rem' : '0', borderLeft: depth > 0 ? '2px solid #E2E8F0' : 'none' }}>
        {childComments.map(comm => (
          <div key={comm._id} style={{ background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0', padding: '0.75rem 0.85rem' }}>
            
            {/* Comment Author Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', overflow: 'hidden' }}>
                  {comm.author?.photo ? (
                    <img src={getFileUrl(comm.author.photo)} alt="Author" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    comm.author?.name ? comm.author.name.charAt(0).toUpperCase() : 'S'
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>{comm.author?.name || 'Student'}</span>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>• {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <button
                onClick={() => setActiveReplyBox(activeReplyBox === comm._id ? null : comm._id)}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <CornerDownRight size={13} /> Reply
              </button>
            </div>

            {/* Comment Text */}
            <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0 0 0.35rem 0', lineHeight: 1.4 }}>
              {comm.content}
            </p>

            {/* Reply Input Box */}
            {activeReplyBox === comm._id && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none' }}
                />
                <button
                  onClick={() => handleCommentSubmit(comm._id)}
                  disabled={submittingComment}
                  style={{ padding: '0.45rem 0.85rem', borderRadius: '0.5rem', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Send
                </button>
              </div>
            )}

            {/* Render Child Nested Replies */}
            {renderComments(comm._id, depth + 1)}

          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', minHeight: '80vh' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 700 }}>Loading post &amp; discussion details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Post not found or has been removed.</h2>
        <Link to="/community" style={{ color: '#2563EB', fontWeight: 800 }}>← Return to Community Hub</Link>
      </div>
    );
  }

  const isDoubt = post.postType === 'doubt';
  const isPoll = post.postType === 'poll';
  const isQuestionAuthor = userProfile && String(userProfile._id) === String(post.author?._id);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '1.5rem 1rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}
        >
          <ArrowLeft size={16} /> Back to Community Hub
        </button>

        {/* ── MAIN POST CARD ────────────────────────────────────────────────── */}
        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '1.5rem' }}>
          
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', overflow: 'hidden', border: '2px solid #E2E8F0' }}>
                {post.author?.photo ? (
                  <img src={getFileUrl(post.author.photo)} alt={post.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'S'
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{post.author?.name || 'Student'}</span>
                  {post.isAnonymous && <span style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 900 }}>ANONYMOUS</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {post.author?.school || 'PiyushDhara Learner'} • Posted {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {isDoubt && <span style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>❓ ACADEMIC DOUBT</span>}
              {isPoll && <span style={{ background: '#F3E8FF', color: '#7C3AED', border: '1px solid #E9D5FF', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>📊 POLL</span>}
              {!isDoubt && !isPoll && <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>💬 DISCUSSION</span>}
            </div>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.85rem 0', lineHeight: 1.3 }}>
            {post.title}
          </h1>

          {/* Detailed Content */}
          <div style={{ fontSize: '0.95rem', color: '#1E293B', lineHeight: 1.65, whiteSpace: 'pre-wrap', marginBottom: '1.25rem' }}>
            {post.content}
          </div>

          {/* Poll Display */}
          {isPoll && post.poll && (
            <div style={{ background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.85rem' }}>
                🗳️ {post.poll.question || post.title} ({post.poll.totalVotes || 0} Total Votes)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {post.poll.options.map((opt) => {
                  const hasVotedThisOpt = post.userPollVotes?.includes(opt.optionId);
                  const pct = post.poll.totalVotes > 0 ? Math.round((opt.votesCount / post.poll.totalVotes) * 100) : 0;

                  return (
                    <button
                      key={opt.optionId}
                      onClick={() => handlePollVote(opt.optionId)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                        border: `1.5px solid ${hasVotedThisOpt ? '#7C3AED' : '#CBD5E1'}`,
                        background: '#FFFFFF', cursor: 'pointer', textAlign: 'left',
                        position: 'relative', overflow: 'hidden'
                      }}
                    >
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: hasVotedThisOpt ? '#F3E8FF' : '#F1F5F9', transition: 'width 0.4s ease' }} />
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', fontWeight: 800, color: hasVotedThisOpt ? '#6D28D9' : '#0F172A' }}>
                        <span>{opt.text} {hasVotedThisOpt && '✓ (Your Choice)'}</span>
                        <span>{pct}% ({opt.votesCount})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Uploaded Images & Files */}
          {post.images && post.images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {post.images.map((imgUrl, i) => (
                <img key={i} src={getFileUrl(imgUrl)} alt="Attached screenshot" style={{ width: '100%', height: '140px', borderRadius: '0.75rem', objectFit: 'cover', border: '1px solid #CBD5E1' }} />
              ))}
            </div>
          )}

        </div>

        {/* ── ANSWERS SECTION ──────────────────────────────────────────────── */}
        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '1.5rem' }}>
          
          <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={20} color="#2563EB" /> Answers ({answers.length})
          </h2>

          {/* Answers List */}
          {answers.length === 0 ? (
            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '0.85rem', textAlign: 'center', color: '#64748B', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              No answers submitted yet. Be the first to answer this doubt!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
              {answers.map((ans) => (
                <div key={ans._id} style={{
                  background: ans.isBestAnswer ? '#FEFCE8' : '#F8FAFC',
                  borderRadius: '1rem',
                  border: ans.isBestAnswer ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                  padding: '1.25rem', position: 'relative'
                }}>

                  {/* Best Answer Badge */}
                  {ans.isBestAnswer && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#F59E0B', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '9999px', marginBottom: '0.85rem' }}>
                      🏆 BEST ANSWER MARKED BY AUTHOR
                    </div>
                  )}

                  {/* Author Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', overflow: 'hidden' }}>
                        {ans.author?.photo ? (
                          <img src={getFileUrl(ans.author.photo)} alt={ans.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          ans.author?.name ? ans.author.name.charAt(0).toUpperCase() : 'S'
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{ans.author?.name || 'Student Educator'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{new Date(ans.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Question Author Action: Mark Best Answer */}
                    {isQuestionAuthor && !ans.isBestAnswer && (
                      <button
                        onClick={() => handleMarkBestAnswer(ans._id)}
                        style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        🏆 Mark as Best Answer
                      </button>
                    )}
                  </div>

                  {/* Answer Content */}
                  <div style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '0.85rem' }}>
                    {ans.content}
                  </div>

                  {/* Code Snippets if any */}
                  {ans.codeSnippets && ans.codeSnippets.length > 0 && ans.codeSnippets.map((cs, idx) => (
                    <div key={idx} style={{ background: '#0F172A', color: '#F8FAFC', borderRadius: '0.65rem', padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.82rem', marginBottom: '0.85rem', overflowX: 'auto' }}>
                      <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{cs.language} snippet</div>
                      <code>{cs.code}</code>
                    </div>
                  ))}

                  {/* Upvote & Downvote Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                    <button
                      onClick={() => handleAnswerVote(ans._id, 'upvote')}
                      style={{
                        padding: '0.35rem 0.65rem', borderRadius: '0.5rem',
                        border: '1px solid #CBD5E1', background: ans.hasUpvoted ? '#EFF6FF' : '#FFFFFF',
                        color: ans.hasUpvoted ? '#2563EB' : '#475569', fontWeight: 800, fontSize: '0.78rem',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                      }}
                    >
                      <ThumbsUp size={14} /> Upvote ({ans.upvotes?.length || 0})
                    </button>

                    <button
                      onClick={() => handleAnswerVote(ans._id, 'downvote')}
                      style={{
                        padding: '0.35rem 0.65rem', borderRadius: '0.5rem',
                        border: '1px solid #CBD5E1', background: ans.hasDownvoted ? '#FEF2F2' : '#FFFFFF',
                        color: ans.hasDownvoted ? '#DC2626' : '#475569', fontWeight: 800, fontSize: '0.78rem',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                      }}
                    >
                      <ThumbsDown size={14} /> ({ans.downvotes?.length || 0})
                    </button>

                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>
                      Net Score: {ans.netUpvotes || 0}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Submit New Answer Form */}
          <form onSubmit={handleAnswerSubmit} style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.65rem 0' }}>
              Your Answer
            </h3>

            <textarea
              rows={4}
              placeholder="Write a clear, step-by-step solution to help your peer..."
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none', resize: 'vertical', marginBottom: '0.65rem' }}
              required
            />

            {/* Toggle Code Snippet input */}
            <div style={{ marginBottom: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Code size={16} /> {showCodeInput ? 'Remove Code Block' : '+ Attach Code Snippet'}
              </button>

              {showCodeInput && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', width: '160px' }}
                  >
                    <option value="javascript">JavaScript / Node</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++ / C</option>
                    <option value="java">Java</option>
                    <option value="html">HTML / CSS</option>
                    <option value="sql">SQL / Database</option>
                  </select>
                  <textarea
                    rows={3}
                    placeholder="Paste code snippet here..."
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #0F172A', background: '#0F172A', color: '#FFF', fontFamily: 'monospace', fontSize: '0.82rem' }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isAnsAnonymous}
                  onChange={(e) => setIsAnsAnonymous(e.target.checked)}
                />
                Answer Anonymously
              </label>

              <button
                type="submit"
                disabled={submittingAns}
                style={{
                  padding: '0.65rem 1.35rem', borderRadius: '0.65rem', border: 'none',
                  background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                {submittingAns ? 'Submitting Answer...' : 'Post Answer'}
              </button>
            </div>
          </form>

        </div>

        {/* ── THREADED COMMENTS & REPLIES SECTION ───────────────────────────── */}
        <div style={{ background: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={18} color="#2563EB" /> Comments &amp; Discussion Thread ({comments.length})
          </h3>

          {/* Top Post Comment Input Box */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Add a comment to this discussion..."
              value={activeReplyBox === 'post' ? commentContent : ''}
              onFocus={() => setActiveReplyBox('post')}
              onChange={(e) => setCommentContent(e.target.value)}
              style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
            />
            <button
              onClick={() => handleCommentSubmit(null)}
              disabled={submittingComment}
              style={{ padding: '0.6rem 1.1rem', borderRadius: '0.65rem', background: '#0F172A', color: '#FFF', border: 'none', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Comment
            </button>
          </div>

          {/* Nested Comments Render */}
          {comments.length === 0 ? (
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', textAlign: 'center', padding: '1rem' }}>
              No comments yet. Start the conversation!
            </div>
          ) : (
            renderComments(null, 0)
          )}
        </div>

      </div>
    </div>
  );
};

export default CommunityPostDetail;
