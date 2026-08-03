import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home, HelpCircle, MessageSquare, BarChart2, Bookmark, TrendingUp,
  Search, Plus, ThumbsUp, Heart, Award, Share2, CheckCircle2, Sparkles,
  Flame, Eye, Filter, Check, User, Zap, Tag, Star, FileText, Download,
  AlertCircle, Bell, Trophy, Users, ChevronRight, Image, Code2,
  Smile, MoreHorizontal, Clock, BookOpen, Target, Layers, X,
  Image as ImageIcon, Paperclip, Hash, Globe, Lock, ChevronDown,
  ArrowUp, ArrowDown, Pin, Verified, Shield, Send, CornerDownRight
} from 'lucide-react';
import {
  fetchCommunityPostsApi,
  reactToCommunityItemApi,
  voteCommunityPollApi,
  toggleSaveCommunityPostApi,
  fetchUserCommunityProfileApi,
  getFileUrl
} from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import AskDoubtModal from '../components/community/AskDoubtModal';
import CreatePollModal from '../components/community/CreatePollModal';
import CreateDiscussionModal from '../components/community/CreateDiscussionModal';

/* ── STYLE CONSTANTS ─────────────────────────────────────────────────────── */
const C = {
  navy:    '#0D2B5C',
  navyDk:  '#091E42',
  navyLt:  '#1E3A8A',
  gold:    '#C89A2B',
  goldLt:  '#FDE68A',
  bg:      '#F4F6FB',
  card:    '#FFFFFF',
  border:  '#E5E7EB',
  text:    '#1F2937',
  muted:   '#6B7280',
  light:   '#F9FAFB',
  blue:    '#2563EB',
  purple:  '#7C3AED',
  green:   '#059669',
  red:     '#EF4444',
  orange:  '#F59E0B',
};

/* ── SKELETON CARD ───────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
    <style>{`@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}`}</style>
    {[1,2,3].map(i => (
      <div key={i} style={{ marginBottom: i < 3 ? '0.75rem' : 0 }}>
        <div style={{ height: i === 1 ? 14 : i === 2 ? 22 : 14, borderRadius: 8, background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s ease infinite', width: i === 1 ? '30%' : i === 2 ? '80%' : '55%' }} />
      </div>
    ))}
    <div style={{ display:'flex', gap: '0.5rem', marginTop: '1rem' }}>
      {[1,2,3].map(i => <div key={i} style={{ height:28, width:80, borderRadius:8, background:'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize:'400% 100%', animation:'shimmer 1.4s ease infinite' }} />)}
    </div>
  </div>
);

/* ── TIME AGO HELPER ─────────────────────────────────────────────────────── */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds/86400)}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day:'numeric', month:'short' });
};

/* ── REACTIONS CONFIG ─────────────────────────────────────────────────────── */
const REACTIONS = [
  { type:'like',       emoji:'👍', label:'Like',       color:'#2563EB' },
  { type:'love',       emoji:'❤️',  label:'Love',       color:'#EF4444' },
  { type:'celebrate',  emoji:'🎉', label:'Celebrate',  color:'#F59E0B' },
  { type:'helpful',    emoji:'💡', label:'Helpful',    color:'#7C3AED' },
  { type:'appreciate', emoji:'👏', label:'Appreciate', color:'#059669' },
  { type:'funny',      emoji:'😂', label:'Funny',      color:'#F97316' },
];

/* ── NAV ITEMS ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key:'all',         label:'Community Feed',       icon:Home,          badge:null    },
  { key:'ask_doubt',   label:'Ask a Doubt',          icon:HelpCircle,    badge:'HOT'   },
  { key:'discussions', label:'Discussions',          icon:MessageSquare, badge:null    },
  { key:'polls',       label:'Polls',                icon:BarChart2,     badge:null    },
  { key:'trending',    label:'Trending',             icon:Flame,         badge:null    },
  { key:'helpful',     label:'Most Helpful',         icon:Star,          badge:null    },
  { key:'my_posts',    label:'My Posts',             icon:FileText,      badge:null    },
  { key:'saved',       label:'Saved Posts',          icon:Bookmark,      badge:null    },
  { key:'notifs',      label:'Notifications',        icon:Bell,          badge:'3'     },
  { key:'leaders',     label:'Leaderboard',          icon:Trophy,        badge:null    },
];

const CATEGORIES = ['All','Academic Doubts','Study Tips & Notes','Entrance Preparation','Coding & Projects','Placement & Internships','Career Advice','General Discussion'];
const POPULAR_TAGS = ['javascript','react','ioeentrance','physics','mathematics','webdev','python','mongodb','loksewa','placement','gateexam','css','nodejs','algorithms'];

const TOP_CONTRIBUTORS = [
  { name:'Aayush Sharma', score:1240, badge:'🏆', dept:'B.E. Computer', rank:1 },
  { name:'Priya Adhikari', score:980,  badge:'🥈', dept:'B.Sc. CSIT',   rank:2 },
  { name:'Sneha Karki',   score:720,  badge:'🥉', dept:'B.C.A.',        rank:3 },
  { name:'Rohan Shrestha', score:610, badge:'⭐', dept:'Grade 12 Sci',  rank:4 },
];

const ANNOUNCEMENTS = [
  { text:'🎯 Weekly Quiz Tournament starts Friday – Win up to 500 XP!', hot:true },
  { text:'📚 New Batch "React Mastery" enrollment now open', hot:false },
  { text:'🏆 Community Hall of Fame: Top 10 contributors of July announced', hot:false },
];

/* ══════════════════════════════════════════════════════════════════════════ */
/*  POST CARD COMPONENT                                                       */
/* ══════════════════════════════════════════════════════════════════════════ */
const PostCard = ({ post, onReact, onPollVote, onToggleSave }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const reactionRef = useRef(null);

  const isDoubt      = post.postType === 'doubt';
  const isPoll       = post.postType === 'poll';
  const isDiscussion = post.postType === 'discussion';
  const totalReacts  = Object.values(post.reactionsCount || {}).reduce((a,b)=>a+b,0);

  const typeConfig = isDoubt
    ? { label:'❓ DOUBT',       bg:'#EFF6FF', color:'#2563EB', border:'#BFDBFE' }
    : isPoll
    ? { label:'📊 POLL',        bg:'#F3E8FF', color:'#7C3AED', border:'#E9D5FF' }
    : { label:'💬 DISCUSSION',  bg:'#ECFDF5', color:'#059669', border:'#A7F3D0' };

  const difficultyConfig = {
    'Easy':   { bg:'#D1FAE5', color:'#065F46' },
    'Medium': { bg:'#FEF3C7', color:'#92400E' },
    'Hard':   { bg:'#FEE2E2', color:'#991B1B' },
  }[post.difficulty] || null;

  useEffect(() => {
    const handler = (e) => { if (reactionRef.current && !reactionRef.current.contains(e.target)) setShowReactions(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{
        background: C.card,
        borderRadius: 18,
        border: `1px solid ${hovered ? '#C3D2E8' : C.border}`,
        padding: '1.5rem',
        boxShadow: hovered ? '0 8px 32px rgba(13,43,92,0.10)' : '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'all 0.22s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        position: 'relative',
      }}
    >
      {post.isPinned && (
        <div style={{ position:'absolute', top:14, right:14, display:'flex', alignItems:'center', gap:4, background:'#FEF3C7', color:'#92400E', padding:'2px 8px', borderRadius:99, fontSize:'0.65rem', fontWeight:800 }}>
          <Pin size={10} /> PINNED
        </div>
      )}

      {/* ─ Author Row ─ */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          {/* Avatar */}
          <div style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg, ${C.navy}, ${C.navyLt})`, color:'#FFF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.1rem', border:`2.5px solid ${C.gold}`, flexShrink:0, overflow:'hidden', minWidth:48 }}>
            {post.author?.photo
              ? <img src={getFileUrl(post.author.photo)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>{ e.target.style.display='none'; }} />
              : (post.isAnonymous ? '🕵️' : (post.author?.name || 'S').charAt(0).toUpperCase())
            }
          </div>
          <div>
            <div style={{ fontSize:'0.9rem', fontWeight:800, color:C.text, display:'flex', alignItems:'center', gap:'0.4rem' }}>
              {post.isAnonymous ? <span style={{ color:C.muted }}>Anonymous Student</span> : <span>{post.author?.name || 'Student'}</span>}
              {post.isFeatured && <Verified size={14} color={C.blue} fill={C.blue} />}
              {post.isAnonymous && <span style={{ background:'#F3E8FF', color:'#7C3AED', fontSize:'0.6rem', padding:'1px 6px', borderRadius:99, fontWeight:900 }}>ANON</span>}
            </div>
            <div style={{ fontSize:'0.72rem', color:C.muted, display:'flex', alignItems:'center', gap:'0.3rem' }}>
              <span>{post.author?.school || 'PiyushDhara Learner'}</span>
              <span>•</span>
              <Clock size={11} />
              <span>{timeAgo(post.createdAt)}</span>
              {post.viewsCount > 0 && <><span>•</span><Eye size={11}/><span>{post.viewsCount} views</span></>}
            </div>
          </div>
        </div>

        {/* Badges row */}
        <div style={{ display:'flex', gap:'0.35rem', alignItems:'center', flexShrink:0 }}>
          {difficultyConfig && (
            <span style={{ background:difficultyConfig.bg, color:difficultyConfig.color, fontSize:'0.62rem', fontWeight:800, padding:'2px 8px', borderRadius:99 }}>
              {post.difficulty}
            </span>
          )}
          <span style={{ background:typeConfig.bg, color:typeConfig.color, border:`1px solid ${typeConfig.border}`, fontSize:'0.65rem', fontWeight:800, padding:'2px 9px', borderRadius:99 }}>
            {typeConfig.label}
          </span>
          <button style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, padding:4, borderRadius:6, display:'flex', alignItems:'center' }}>
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      {/* ─ Title ─ */}
      <Link to={`/community/post/${post._id}`} style={{ textDecoration:'none' }}>
        <h2 style={{ fontSize:'1.08rem', fontWeight:900, color:C.navy, margin:'0 0 0.55rem 0', lineHeight:1.35, cursor:'pointer', transition:'color 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.color=C.blue}
          onMouseLeave={e=>e.currentTarget.style.color=C.navy}
        >
          {post.isFeatured && <Star size={14} color={C.gold} style={{ marginRight:6, verticalAlign:'middle' }} />}
          {post.title}
        </h2>
      </Link>

      {/* ─ Content Preview ─ */}
      <p style={{ fontSize:'0.875rem', color:'#374151', margin:'0 0 1rem 0', lineHeight:1.65, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {post.content}
      </p>

      {/* ─ Poll Widget ─ */}
      {isPoll && post.poll && (
        <div style={{ background:'linear-gradient(135deg, #F8F4FF, #F3EDFF)', borderRadius:14, border:`1px solid #E9D5FF`, padding:'1rem', marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.82rem', fontWeight:800, color:'#5B21B6', marginBottom:'0.65rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
            <BarChart2 size={15} /> {post.poll.question || post.title}
            <span style={{ marginLeft:'auto', background:'#EDE9FE', padding:'2px 8px', borderRadius:99, fontSize:'0.65rem' }}>{post.poll.totalVotes || 0} votes</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {post.poll.options.map((opt, idx) => {
              const hasVoted   = post.userPollVotes?.includes(opt.optionId);
              const pct        = post.poll.totalVotes > 0 ? Math.round((opt.votesCount / post.poll.totalVotes) * 100) : 0;
              const isLeading  = post.poll.options.every(o => o.votesCount <= opt.votesCount) && opt.votesCount > 0;
              return (
                <button key={opt.optionId} onClick={()=>onPollVote(post._id, opt.optionId)} style={{ width:'100%', padding:'0.6rem 0.85rem', borderRadius:10, border:`2px solid ${hasVoted ? '#7C3AED' : 'transparent'}`, background:'#FFFFFF', cursor:'pointer', textAlign:'left', position:'relative', overflow:'hidden', transition:'all 0.2s' }}>
                  <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${pct}%`, background: hasVoted ? 'linear-gradient(90deg,#EDE9FE,#DDD6FE)' : 'linear-gradient(90deg,#F1F5F9,#E2E8F0)', transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)', borderRadius:'10px 0 0 10px' }} />
                  <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.82rem', fontWeight:700, color: hasVoted ? '#5B21B6' : C.text }}>
                    <span style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                      {isLeading && <span style={{ fontSize:'0.7rem' }}>🏆</span>}
                      {opt.text}
                      {hasVoted && <Check size={13} color='#7C3AED' />}
                    </span>
                    <span style={{ fontWeight:800 }}>{pct}%</span>
                  </div>
                </button>
              );
            })}
          </div>
          {post.poll.expiresAt && (
            <div style={{ fontSize:'0.68rem', color:'#7C3AED', marginTop:'0.5rem', textAlign:'right' }}>
              <Clock size={11} style={{ verticalAlign:'middle' }} /> Closes {timeAgo(post.poll.expiresAt)}
            </div>
          )}
        </div>
      )}

      {/* ─ Images ─ */}
      {post.images?.length > 0 && (
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.85rem', overflowX:'auto' }}>
          {post.images.slice(0,3).map((imgUrl,i) => (
            <img key={i} src={getFileUrl(imgUrl)} alt="" style={{ width:120, height:85, borderRadius:10, objectFit:'cover', border:`1px solid ${C.border}` }} />
          ))}
          {post.images.length > 3 && <div style={{ width:120, height:85, borderRadius:10, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:800, color:C.muted, border:`1px solid ${C.border}` }}>+{post.images.length-3} more</div>}
        </div>
      )}

      {/* ─ Tags ─ */}
      {post.tags?.length > 0 && (
        <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'0.85rem' }}>
          {post.tags.slice(0,6).map((t,i) => (
            <span key={i} style={{ background:'#F0F4FF', color:C.blue, fontSize:'0.7rem', fontWeight:700, padding:'3px 9px', borderRadius:6, border:`1px solid #DBEAFE`, transition:'all 0.15s', cursor:'pointer' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=C.blue; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='#F0F4FF'; e.currentTarget.style.color=C.blue; }}
            >
              #{t}
            </span>
          ))}
          {post.category && <span style={{ background:'#FFF7ED', color:'#C2410C', fontSize:'0.7rem', fontWeight:700, padding:'3px 9px', borderRadius:6, border:'1px solid #FED7AA' }}>{post.category}</span>}
        </div>
      )}

      {/* ─ Footer Actions ─ */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', paddingTop:'0.75rem', borderTop:`1px solid ${C.border}`, flexWrap:'wrap' }}>

        {/* Reactions */}
        <div style={{ position:'relative', flexShrink:0 }} ref={reactionRef}>
          <button
            onClick={()=>setShowReactions(s=>!s)}
            style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'6px 12px', borderRadius:99, border:`1px solid ${C.border}`, background:C.light, fontSize:'0.78rem', fontWeight:700, color:C.text, cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.borderColor=C.blue; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=C.light; e.currentTarget.style.borderColor=C.border; }}
          >
            <span style={{ fontSize:'0.95rem', lineHeight:1 }}>{post.userReaction ? REACTIONS.find(r=>r.type===post.userReaction)?.emoji || '👍' : '👍'}</span>
            <span>{totalReacts > 0 ? totalReacts : 'React'}</span>
          </button>
          {showReactions && (
            <div style={{ position:'absolute', bottom:'calc(100% + 8px)', left:0, background:'#FFFFFF', borderRadius:99, boxShadow:'0 12px 40px rgba(0,0,0,0.18)', padding:'6px 10px', display:'flex', gap:'4px', zIndex:50, border:`1px solid ${C.border}` }}>
              {REACTIONS.map(r => (
                <button key={r.type} onClick={()=>{ onReact(post._id, r.type); setShowReactions(false); }} title={r.label}
                  onMouseEnter={e=>setHoveredReaction(r.type)}
                  onMouseLeave={e=>setHoveredReaction(null)}
                  style={{ background:'none', border:'none', fontSize: hoveredReaction===r.type ? '1.55rem' : '1.25rem', cursor:'pointer', transition:'all 0.15s', transform: hoveredReaction===r.type ? 'translateY(-4px)' : 'none', lineHeight:1 }}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width:1, height:18, background:C.border, flexShrink:0 }} />

        {/* Comments */}
        <Link to={`/community/post/${post._id}`}
          style={{ display:'flex', alignItems:'center', gap:'0.35rem', textDecoration:'none', fontSize:'0.78rem', fontWeight:700, color:C.muted, padding:'6px 11px', borderRadius:99, border:`1px solid ${C.border}`, background:C.light, transition:'all 0.18s', whiteSpace:'nowrap', flexShrink:0 }}
          onMouseEnter={e=>{ e.currentTarget.style.background='#ECFDF5'; e.currentTarget.style.color=C.green; e.currentTarget.style.borderColor=C.green; }}
          onMouseLeave={e=>{ e.currentTarget.style.background=C.light; e.currentTarget.style.color=C.muted; e.currentTarget.style.borderColor=C.border; }}
        >
          <MessageSquare size={14} />
          <span>{post.answersCount || post.commentsCount || 0} Answers</span>
        </Link>

        {/* Spacer pushes Share+Save to right */}
        <div style={{ flex:1 }} />

        {/* Share */}
        <button
          style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.78rem', fontWeight:700, color:C.muted, background:'none', border:'none', cursor:'pointer', padding:'6px 10px', borderRadius:99, transition:'all 0.18s', whiteSpace:'nowrap', flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.color=C.navy}
          onMouseLeave={e=>e.currentTarget.style.color=C.muted}
        >
          <Share2 size={14} /> Share
        </button>

        {/* Bookmark */}
        <button
          onClick={()=>onToggleSave(post._id)}
          style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.78rem', fontWeight:700, color: post.isSaved ? C.gold : C.muted, background: post.isSaved ? '#FFFBEB' : 'none', border: post.isSaved ? `1px solid ${C.goldLt}` : 'none', cursor:'pointer', padding:'6px 12px', borderRadius:99, transition:'all 0.18s', whiteSpace:'nowrap', flexShrink:0 }}
          onMouseEnter={e=>{ if(!post.isSaved){ e.currentTarget.style.color=C.navy; } }}
          onMouseLeave={e=>{ if(!post.isSaved){ e.currentTarget.style.color=C.muted; } }}
        >
          <Bookmark size={14} fill={post.isSaved ? C.gold : 'none'} color={post.isSaved ? C.gold : C.muted} />
          <span>{post.isSaved ? 'Saved ✓' : 'Save'}</span>
        </button>

      </div>

    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*  CREATE POST COMPOSER                                                      */
/* ══════════════════════════════════════════════════════════════════════════ */
const CreatePostComposer = ({ userProfile, onAskDoubt, onCreatePoll, onStartDiscussion }) => {
  const avatar = userProfile?.photo ? getFileUrl(userProfile.photo) : null;
  const initials = (userProfile?.name || 'S').charAt(0).toUpperCase();

  return (
    <div style={{ background:C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:'1.25rem 1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', marginBottom:'1rem' }}>
      {/* Input row */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', marginBottom:'0.85rem' }}>
        <div style={{ width:46, height:46, borderRadius:'50%', background:`linear-gradient(135deg, ${C.navy}, ${C.navyLt})`, color:'#FFF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.05rem', flexShrink:0, overflow:'hidden', border:`2.5px solid ${C.gold}`, minWidth:46 }}>
          {avatar ? <img src={avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>{ e.target.style.display='none'; }} /> : initials}
        </div>
        <button
          onClick={onAskDoubt}
          style={{ flex:1, textAlign:'left', padding:'0.75rem 1.2rem', borderRadius:99, border:`1.5px solid ${C.border}`, background:C.bg, color:C.muted, fontSize:'0.9rem', cursor:'pointer', fontFamily:"'Inter',sans-serif", transition:'all 0.18s' }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.navy; e.currentTarget.style.background='#EEF2FF'; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bg; }}
        >
          Ask a doubt, share knowledge, or create a poll…
        </button>
      </div>
      {/* Action Buttons */}
      <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap', alignItems:'center', paddingTop:'0.75rem', borderTop:`1px solid ${C.border}` }}>
        {[
          { icon:HelpCircle, label:'Ask Doubt',   color:'#2563EB', bg:'#EFF6FF', onClick:onAskDoubt       },
          { icon:MessageSquare, label:'Discussion',color:C.green,  bg:'#ECFDF5', onClick:onStartDiscussion },
          { icon:BarChart2, label:'Create Poll',   color:C.purple, bg:'#F3E8FF', onClick:onCreatePoll      },
          { icon:Code2,     label:'Code Snippet',  color:'#F59E0B',bg:'#FFFBEB', onClick:onAskDoubt        },
          { icon:ImageIcon, label:'Image',         color:C.muted,  bg:C.light,   onClick:onStartDiscussion },
        ].map(({icon:Icon, label, color, bg, onClick}) => (
          <button key={label} onClick={onClick}
            style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'7px 13px', borderRadius:99, background:bg, color, fontSize:'0.78rem', fontWeight:700, border:'none', cursor:'pointer', transition:'all 0.18s', flexShrink:0, whiteSpace:'nowrap' }}
            onMouseEnter={e=>e.currentTarget.style.filter='brightness(0.93)'}
            onMouseLeave={e=>e.currentTarget.style.filter='none'}
          >
            <Icon size={15} /> <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*  FILTER CHIPS                                                              */
/* ══════════════════════════════════════════════════════════════════════════ */
const FilterChips = ({ active, onChange }) => {
  const chips = [
    { id:'latest',      label:'🕐 Latest'      },
    { id:'trending',    label:'🔥 Trending'    },
    { id:'unanswered',  label:'❓ Unanswered'  },
    { id:'polls',       label:'📊 Polls'       },
    { id:'my_posts',    label:'📝 My Posts'    },
    { id:'saved',       label:'❤️ Saved'       },
  ];
  return (
    <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap', alignItems:'center', marginBottom:'1rem' }}>
      {chips.map(c => (
        <button key={c.id} onClick={()=>onChange(c.id)}
          style={{ padding:'7px 15px', borderRadius:99, border:'none', background: active===c.id ? C.navy : C.card, color: active===c.id ? '#FFF' : C.text, fontSize:'0.8rem', fontWeight: active===c.id ? 800 : 600, cursor:'pointer', transition:'all 0.18s', flexShrink:0, boxShadow: active===c.id ? `0 4px 12px rgba(13,43,92,0.22)` : `0 1px 4px rgba(0,0,0,0.05)`, border:`1px solid ${active===c.id ? C.navy : C.border}`, whiteSpace:'nowrap' }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMMUNITY HUB PAGE                                                  */
/* ══════════════════════════════════════════════════════════════════════════ */
const CommunityHub = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userProfile } = useAuth();

  const activeTab = searchParams.get('tab') || 'all';

  const [searchQuery,       setSearchQuery]       = useState(searchParams.get('q') || '');
  const [selectedCategory,  setSelectedCategory]  = useState('All');
  const [activeFilter,      setActiveFilter]      = useState(searchParams.get('filter') || 'latest');
  const [posts,             setPosts]             = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [totalPosts,        setTotalPosts]        = useState(0);
  const [page,              setPage]              = useState(1);
  const [communityProfile,  setCommunityProfile]  = useState(null);
  const [showAskModal,      setShowAskModal]      = useState(false);
  const [showPollModal,     setShowPollModal]     = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [sidebarOpen,       setSidebarOpen]       = useState(false);
  const [activeChip,        setActiveChip]        = useState('latest');

  /* ── Load Posts ── */
  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = { page, limit:15, filter:activeFilter };
      if (searchQuery?.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      if (activeTab === 'saved')       params.filter    = 'saved';
      if (activeTab === 'my_posts')    params.filter    = 'my_posts';
      if (activeTab === 'ask_doubt')   params.postType  = 'doubt';
      if (activeTab === 'discussions') params.postType  = 'discussion';
      if (activeTab === 'polls')       params.postType  = 'poll';
      if (activeTab === 'trending')    params.filter    = 'trending';
      if (activeTab === 'helpful')     params.filter    = 'most_answered';

      const res = await fetchCommunityPostsApi(params);
      if (res.success) { setPosts(res.posts); setTotalPosts(res.total); }
    } catch(err) { console.error('Community posts error:', err); }
    finally { setLoading(false); }
  };

  const loadProfile = async () => {
    try {
      const res = await fetchUserCommunityProfileApi();
      if (res.success) setCommunityProfile(res.profile);
    } catch {}
  };

  useEffect(() => { loadPosts(); }, [activeTab, activeFilter, selectedCategory, page]);
  useEffect(() => { if (localStorage.getItem('token')) loadProfile(); }, []);

  const handleTabChange = (key) => {
    setSearchParams({ tab: key });
    setPage(1);
    if (key === 'ask_doubt') {
      setShowAskModal(true);
    }
  };
  const handleChipChange = (id) => {
    setActiveChip(id);
    if (id === 'polls' || id === 'my_posts' || id === 'saved' || id === 'unanswered' || id === 'ask_doubt' || id === 'discussions') {
      handleTabChange(id);
    } else {
      setActiveFilter(id);
      handleTabChange('all');
    }
  };

  const handleSearchSubmit = (e) => { e.preventDefault(); setPage(1); loadPosts(); };

  const handlePostSuccess = (newPost) => {
    setActiveChip('latest');
    setActiveFilter('latest');
    setPage(1);
    if (newPost && newPost._id) {
      setPosts(prev => [newPost, ...prev.filter(p => p._id !== newPost._id)]);
    }
    loadPosts();
  };

  const handleReaction    = async (postId, type) => {
    try {
      const res = await reactToCommunityItemApi('post', postId, type);
      if (res.success) setPosts(prev=>prev.map(p=> p._id===postId ? {...p, reactionsCount:res.reactionsCount, userReaction:res.userReaction} : p));
    } catch {}
  };
  const handlePollVote    = async (postId, optionId) => {
    try {
      const res = await voteCommunityPollApi(postId, [optionId]);
      if (res.success) setPosts(prev=>prev.map(p=> p._id===postId ? {...p, poll:res.poll, userPollVotes:res.userPollVotes} : p));
    } catch(err) { alert(err.message || 'Vote failed'); }
  };
  const handleToggleSave  = async (postId) => {
    try {
      const res = await toggleSaveCommunityPostApi(postId);
      if (res.success) setPosts(prev=>prev.map(p=> p._id===postId ? {...p, isSaved:res.isSaved} : p));
    } catch {}
  };

  /* ═══════════════════ RENDER ═══════════════════════════════════════════ */
  return (
    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:"'Inter','Poppins',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@700;800;900&display=swap');
        .composer-label { display:inline; }
        .community-grid { display:grid; grid-template-columns:260px 1fr 300px; gap:1.5rem; }
        .right-sidebar  { display:flex; flex-direction:column; gap:1rem; }
        @media(max-width:1200px) { .community-grid { grid-template-columns:220px 1fr; } .right-sidebar { display:none; } }
        @media(max-width:860px)  { .community-grid { grid-template-columns:1fr; } .left-sidebar { display:none; } .composer-label { display:none; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .post-appear { animation: fadeInUp 0.3s ease both; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:99px; }
      `}</style>

      {/* ─── HERO BANNER ─────────────────────────────────────────────────── */}
      <div style={{ background:`linear-gradient(135deg, ${C.navyDk} 0%, ${C.navy} 55%, #1a3a6e 100%)`, padding:'2.25rem 2rem 2rem', position:'relative', overflow:'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', right:-80, top:-80, width:300, height:300, borderRadius:'50%', background:'rgba(200,154,43,0.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:60,  top:40,  width:120, height:120, borderRadius:'50%', background:'rgba(200,154,43,0.05)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', left:-60,  bottom:-60, width:250, height:250, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(200,154,43,0.15)', padding:'4px 14px', borderRadius:99, fontSize:'0.7rem', fontWeight:800, color:C.gold, marginBottom:'0.8rem', border:`1px solid rgba(200,154,43,0.3)` }}>
            <Sparkles size={13} /> PIYUSHDHARA COMMUNITY FORUM
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1.5rem' }}>
            <div>
              <h1 style={{ fontSize:'2rem', fontWeight:900, color:'#FFFFFF', margin:'0 0 0.4rem 0', fontFamily:'Poppins,sans-serif', letterSpacing:'-0.02em', lineHeight:1.15 }}>
                Ask Doubts, Share Insights &<br/><span style={{ color:C.gold }}>Grow Together 🚀</span>
              </h1>
              <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.65)', margin:0, maxWidth:520 }}>
                Connect with thousands of students. Get fast answers, join discussions, participate in live polls, and build your academic reputation.
              </p>
            </div>

            {/* Hero stats */}
            <div style={{ display:'flex', gap:'1.5rem' }}>
              {[{ val:'2.4K', label:'Active Students' }, { val:'850+', label:'Discussions' }, { val:'95%', label:'Answered' }].map(({val,label}) => (
                <div key={label} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.6rem', fontWeight:900, color:C.gold, lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.55)', fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem', flexWrap:'wrap' }}>
            {[
              { label:'❓ Ask a Doubt',      bg:`linear-gradient(135deg,${C.blue},#1D4ED8)`,  shadow:'rgba(37,99,235,0.4)',  onClick:()=>setShowAskModal(true)        },
              { label:'📊 Create Poll',      bg:`linear-gradient(135deg,${C.purple},#6D28D9)`, shadow:'rgba(124,58,237,0.4)', onClick:()=>setShowPollModal(true)       },
              { label:'💬 Start Discussion', bg:`linear-gradient(135deg,${C.green},#047857)`,  shadow:'rgba(5,150,105,0.4)',  onClick:()=>setShowDiscussionModal(true) },
            ].map(({label,bg,shadow,onClick}) => (
              <button key={label} onClick={onClick}
                style={{ padding:'10px 20px', borderRadius:12, border:'none', background:bg, color:'#FFF', fontWeight:800, fontSize:'0.85rem', cursor:'pointer', boxShadow:`0 6px 20px ${shadow}`, transition:'all 0.2s', display:'inline-flex', alignItems:'center', gap:'0.4rem' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'1.5rem 1.5rem' }}>

        {/* Mobile Tab Bar (visible ≤768px only) */}
        <div className="community-mobile-tabs">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                className={`community-mobile-tab-btn${isActive ? ' active' : ''}`}
                onClick={() => handleTabChange(item.key)}
              >
                <Icon size={14} />
                {item.label}
                {item.badge && <span style={{ background: item.badge === 'HOT' ? '#EF4444' : '#0D2B5C', color: '#FFF', fontSize: '0.52rem', fontWeight: 900, padding: '1px 5px', borderRadius: 99 }}>{item.badge}</span>}
              </button>
            );
          })}
        </div>

        <div className="community-grid">

          {/* ═══ LEFT SIDEBAR ═════════════════════════════════════════════ */}
          <div className="left-sidebar community-left-sidebar" style={{ position:'sticky', top:80, display:'flex', flexDirection:'column', gap:'1rem', alignSelf:'start', maxHeight:'calc(100vh - 100px)', overflowY:'auto' }}>

            {/* Profile Mini Card */}
            {userProfile && (
              <div style={{ background:`linear-gradient(135deg, ${C.navyDk}, ${C.navy})`, borderRadius:16, padding:'1.5rem 1.25rem 1.25rem', color:'#FFF', textAlign:'center', position:'relative' }}>
                {/* Decorative circles - behind everything */}
                <div style={{ position:'absolute', right:-20, top:-20, width:80, height:80, borderRadius:'50%', background:'rgba(200,154,43,0.15)', pointerEvents:'none', zIndex:0 }} />
                <div style={{ position:'absolute', left:-15, bottom:-15, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none', zIndex:0 }} />
                {/* Avatar - above decorative circles */}
                <div style={{ position:'relative', zIndex:1, width:72, height:72, borderRadius:'50%', margin:'0 auto 0.75rem', flexShrink:0 }}>
                  {/* Outer gold ring */}
                  <div style={{ width:'100%', height:'100%', borderRadius:'50%', border:`3px solid ${C.gold}`, padding:3, boxSizing:'border-box', background:`linear-gradient(135deg,${C.gold},#E5B543)` }}>
                    <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:`linear-gradient(135deg,${C.gold},#E5B543)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1.5rem', color:C.navyDk }}>
                      {userProfile?.photo
                        ? <img src={getFileUrl(userProfile.photo)} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }} onError={e=>{ e.target.style.display='none'; }} />
                        : (userProfile?.name || 'S').charAt(0).toUpperCase()
                      }
                    </div>
                  </div>
                </div>
                <div style={{ position:'relative', zIndex:1, fontSize:'0.92rem', fontWeight:800, marginBottom:'0.2rem' }}>{userProfile?.name || 'Student'}</div>
                <div style={{ position:'relative', zIndex:1, fontSize:'0.68rem', color:'rgba(255,255,255,0.55)', marginBottom:'1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', padding:'0 0.5rem' }}>{userProfile?.email || ''}</div>
                <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'center', gap:'1.5rem' }}>
                  {[{ val:communityProfile?.stats?.questionsAsked||0, label:'Questions' }, { val:communityProfile?.stats?.answersGiven||0, label:'Answers' }, { val:communityProfile?.stats?.reputationScore||0, label:'XP' }].map(({val,label}) => (
                    <div key={label}>
                      <div style={{ fontSize:'1.05rem', fontWeight:900, color:C.gold }}>{val}</div>
                      <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.55)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:'0.65rem', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem', paddingLeft:8 }}>NAVIGATION</div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button key={item.key} onClick={()=>handleTabChange(item.key)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', borderRadius:10, border:'none', background: isActive ? '#EFF6FF' : 'transparent', color: isActive ? C.blue : C.text, fontWeight: isActive ? 800 : 600, fontSize:'0.84rem', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}
                      onMouseEnter={e=>{ if(!isActive) { e.currentTarget.style.background=C.bg; } }}
                      onMouseLeave={e=>{ if(!isActive) { e.currentTarget.style.background='transparent'; } }}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                        <Icon size={17} color={isActive ? C.blue : C.muted} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && <span style={{ background: item.badge==='HOT' ? C.red : C.navy, color:'#FFF', fontSize:'0.58rem', fontWeight:900, padding:'2px 6px', borderRadius:99 }}>{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories */}
            <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:'0.65rem', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem', paddingLeft:8 }}>CATEGORIES</div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={()=>{ setSelectedCategory(cat); setPage(1); }}
                    style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'7px 10px', borderRadius:8, border:'none', background: selectedCategory===cat ? '#F0F4FF' : 'transparent', color: selectedCategory===cat ? C.blue : C.muted, fontWeight: selectedCategory===cat ? 700 : 500, fontSize:'0.8rem', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}
                  >
                    <Hash size={13} color={selectedCategory===cat ? C.blue : '#CBD5E1'} />
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ CENTER FEED ══════════════════════════════════════════════ */}
          <div>
            {/* Search Bar */}
            <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:'0.85rem 1rem', marginBottom:'0.85rem', boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
              <form onSubmit={handleSearchSubmit} style={{ display:'flex', gap:'0.65rem', alignItems:'center' }}>
                <div style={{ position:'relative', flex:1 }}>
                  <Search size={17} color={C.muted} style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input
                    type="text"
                    placeholder="Search doubts, topics, discussions, or tags…"
                    value={searchQuery}
                    onChange={e=>setSearchQuery(e.target.value)}
                    style={{ width:'100%', padding:'0.65rem 1rem 0.65rem 2.6rem', borderRadius:99, border:`1.5px solid ${C.border}`, fontSize:'0.86rem', outline:'none', fontFamily:'Inter,sans-serif', background:C.bg, color:C.text, transition:'all 0.2s', boxSizing:'border-box' }}
                    onFocus={e=>e.target.style.borderColor=C.navy}
                    onBlur={e=>e.target.style.borderColor=C.border}
                  />
                </div>
                <button type="submit"
                  style={{ padding:'0.65rem 1.35rem', borderRadius:99, background:`linear-gradient(135deg,${C.navy},${C.navyLt})`, color:'#FFF', border:'none', fontWeight:800, fontSize:'0.83rem', cursor:'pointer', flexShrink:0 }}
                >
                  Search
                </button>
              </form>
            </div>

            {/* Filter Chips */}
            <FilterChips active={activeChip} onChange={handleChipChange} />

            {/* Create Post Composer */}
            <CreatePostComposer
              userProfile={userProfile}
              onAskDoubt={()=>setShowAskModal(true)}
              onCreatePoll={()=>setShowPollModal(true)}
              onStartDiscussion={()=>setShowDiscussionModal(true)}
            />

            {/* ─ Feed ─ */}
            {loading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {[1,2,3].map(i=><SkeletonCard key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'4rem 2rem', background:C.card, borderRadius:18, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>💬</div>
                <h3 style={{ fontSize:'1.2rem', fontWeight:900, color:C.navy, margin:'0 0 0.5rem 0' }}>No Posts Found</h3>
                <p style={{ fontSize:'0.88rem', color:C.muted, maxWidth:380, margin:'0 auto 1.5rem' }}>
                  Be the first to ask a doubt, share study notes, or start a discussion in this community!
                </p>
                <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
                  <button onClick={()=>setShowAskModal(true)} style={{ padding:'10px 22px', borderRadius:99, background:C.navy, color:'#FFF', border:'none', fontWeight:800, fontSize:'0.85rem', cursor:'pointer' }}>Ask a Doubt</button>
                  <button onClick={()=>setShowDiscussionModal(true)} style={{ padding:'10px 22px', borderRadius:99, background:C.card, color:C.navy, border:`2px solid ${C.navy}`, fontWeight:800, fontSize:'0.85rem', cursor:'pointer' }}>Start Discussion</button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {posts.map((post, idx) => (
                  <div key={post._id} className="post-appear" style={{ animationDelay:`${idx * 0.05}s` }}>
                    <PostCard
                      post={post}
                      onReact={handleReaction}
                      onPollVote={handlePollVote}
                      onToggleSave={handleToggleSave}
                    />
                  </div>
                ))}

                {/* Pagination */}
                {totalPosts > 15 && (
                  <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', paddingTop:'0.5rem' }}>
                    <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                      style={{ padding:'8px 20px', borderRadius:99, border:`1px solid ${C.border}`, background:C.card, fontWeight:700, cursor:page===1?'not-allowed':'pointer', color:page===1?C.muted:C.text, fontSize:'0.82rem' }}>
                      ← Previous
                    </button>
                    <span style={{ display:'flex', alignItems:'center', fontSize:'0.8rem', color:C.muted, padding:'0 10px' }}>Page {page}</span>
                    <button onClick={()=>setPage(p=>p+1)} disabled={posts.length < 15}
                      style={{ padding:'8px 20px', borderRadius:99, border:`1px solid ${C.border}`, background:C.navy, color:'#FFF', fontWeight:700, cursor:posts.length<15?'not-allowed':'pointer', fontSize:'0.82rem' }}>
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═══ RIGHT SIDEBAR ════════════════════════════════════════════ */}
          <div className="right-sidebar community-right-sidebar">

            {/* 🏆 Top Contributors */}
            <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:'1.25rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <Trophy size={18} color={C.gold} />
                <span style={{ fontSize:'0.88rem', fontWeight:800, color:C.text }}>Top Contributors</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {TOP_CONTRIBUTORS.map((c) => (
                  <div key={c.name} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'8px 10px', borderRadius:12, background: c.rank===1 ? '#FFFBEB' : C.bg, border: c.rank===1 ? `1px solid #FDE68A` : `1px solid transparent` }}>
                    <span style={{ fontSize:'1.1rem', minWidth:22, textAlign:'center' }}>{c.badge}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.82rem', fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                      <div style={{ fontSize:'0.68rem', color:C.muted }}>{c.dept}</div>
                    </div>
                    <span style={{ fontSize:'0.75rem', fontWeight:800, color:C.gold, flexShrink:0 }}>{c.score} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 Trending Topics */}
            <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:'1.25rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <Flame size={18} color={C.red} />
                <span style={{ fontSize:'0.88rem', fontWeight:800, color:C.text }}>Trending Topics</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                {['React 18 Concurrent Mode','IOE Entrance Prep 2026','Python vs JavaScript','Machine Learning Basics','GATE Exam Strategy'].map((t,i) => (
                  <button key={t} onClick={()=>{ setSearchQuery(t); handleSearchSubmit({ preventDefault:()=>{} }); }}
                    style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'8px 10px', borderRadius:10, border:'none', background:'transparent', cursor:'pointer', textAlign:'left', transition:'background 0.15s', width:'100%' }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <span style={{ fontSize:'0.75rem', fontWeight:900, color:C.muted, minWidth:16 }}>#{i+1}</span>
                    <span style={{ fontSize:'0.8rem', fontWeight:600, color:C.text, flex:1 }}>{t}</span>
                    <TrendingUp size={13} color={C.muted} />
                  </button>
                ))}
              </div>
            </div>

            {/* 🏆 My Karma */}
            {communityProfile && (
              <div style={{ background:`linear-gradient(135deg, ${C.navyDk}, ${C.navy})`, borderRadius:16, padding:'1.25rem', color:'#FFF', boxShadow:`0 8px 24px rgba(13,43,92,0.25)` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                  <Award size={18} color={C.gold} />
                  <span style={{ fontSize:'0.88rem', fontWeight:800 }}>My Community Karma</span>
                </div>
                <div style={{ textAlign:'center', marginBottom:'1rem' }}>
                  <div style={{ fontSize:'2.2rem', fontWeight:900, color:C.gold, lineHeight:1 }}>{communityProfile.stats?.reputationScore || 0}</div>
                  <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.6)', fontWeight:600, textTransform:'uppercase' }}>Reputation XP</div>
                </div>
                {/* XP progress bar */}
                <div style={{ marginBottom:'0.85rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'rgba(255,255,255,0.6)', marginBottom:4 }}>
                    <span>Level {communityProfile.xpLevel || 1}</span>
                    <span>Next: Level {(communityProfile.xpLevel||1)+1}</span>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:99, height:7 }}>
                    <div style={{ background:`linear-gradient(90deg, ${C.gold}, #E5B543)`, borderRadius:99, height:'100%', width:`${Math.min(100, ((communityProfile.stats?.reputationScore||0) % 100))}%`, transition:'width 0.5s ease' }} />
                  </div>
                </div>
                {/* Badges */}
                {communityProfile.badges?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
                    {communityProfile.badges.slice(0,6).map(b => (
                      <span key={b.id} title={b.title} style={{ background:'rgba(255,255,255,0.1)', padding:'4px 10px', borderRadius:99, fontSize:'0.68rem', fontWeight:700, border:'1px solid rgba(255,255,255,0.15)' }}>
                        {b.icon} {b.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 📢 Announcements */}
            <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:'1.25rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <Bell size={18} color={C.blue} />
                <span style={{ fontSize:'0.88rem', fontWeight:800, color:C.text }}>Announcements</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {ANNOUNCEMENTS.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:'0.6rem', padding:'8px', borderRadius:10, background: a.hot ? '#FFF7ED' : C.bg, border: a.hot ? '1px solid #FED7AA' : `1px solid ${C.border}` }}>
                    <div style={{ fontSize:'0.78rem', color:C.text, lineHeight:1.4 }}>{a.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 📚 Popular Tags */}
            <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:'1.25rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <Tag size={18} color={C.purple} />
                <span style={{ fontSize:'0.88rem', fontWeight:800, color:C.text }}>Popular Tags</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {POPULAR_TAGS.map(t => (
                  <button key={t} onClick={()=>{ setSearchQuery(t); loadPosts(); }}
                    style={{ background:'#F0F4FF', border:'none', color:C.blue, padding:'5px 11px', borderRadius:8, fontSize:'0.73rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.background=C.navy; e.currentTarget.style.color='#FFF'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background='#F0F4FF'; e.currentTarget.style.color=C.blue; }}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── MODALS ──────────────────────────────────────────────────────── */}
      <AskDoubtModal        isOpen={showAskModal}        onClose={()=>setShowAskModal(false)}        onSuccess={handlePostSuccess} />
      <CreatePollModal      isOpen={showPollModal}       onClose={()=>setShowPollModal(false)}       onSuccess={handlePostSuccess} />
      <CreateDiscussionModal isOpen={showDiscussionModal} onClose={()=>setShowDiscussionModal(false)} onSuccess={handlePostSuccess} />
    </div>
  );
};

export default CommunityHub;
