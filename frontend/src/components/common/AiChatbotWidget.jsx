import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Paperclip, 
  Copy, 
  Check, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  FileText, 
  Trash2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { sendAiChatApi, analyzeAiFileApi } from '../../utils/api';

// Lightweight custom Markdown renderer helper
const renderMarkdownText = (text, navigate) => {
  if (!text) return '';

  // Split lines for list / header processing
  const lines = text.split('\n');
  
  return lines.map((line, lineIdx) => {
    let content = line;

    // Headers
    if (line.startsWith('### ')) {
      return (
        <h4 key={lineIdx} style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.6rem 0 0.3rem 0', color: '#0F172A' }}>
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={lineIdx} style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.75rem 0 0.35rem 0', color: '#0F172A' }}>
          {line.replace('## ', '')}
        </h3>
      );
    }

    // Bullet points
    const isBullet = line.startsWith('- ') || line.startsWith('* ');
    if (isBullet) {
      content = line.substring(2);
    }

    // Process inline markdown (bold, code, links)
    const parts = [];
    let currentStr = content;
    let match;

    // Process markdown links [Label](/url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIdx = 0;
    const elements = [];

    while ((match = linkRegex.exec(currentStr)) !== null) {
      if (match.index > lastIdx) {
        elements.push(currentStr.substring(lastIdx, match.index));
      }
      const label = match[1];
      const url = match[2];
      elements.push(
        <button
          key={match.index}
          onClick={() => {
            if (url.startsWith('/')) navigate(url);
            else window.open(url, '_blank');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563EB',
            fontWeight: 800,
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontSize: 'inherit',
            fontFamily: 'inherit'
          }}
        >
          {label} <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </button>
      );
      lastIdx = linkRegex.lastIndex;
    }
    if (lastIdx < currentStr.length) {
      elements.push(currentStr.substring(lastIdx));
    }

    const formattedElements = elements.map((elem, elemIdx) => {
      if (typeof elem !== 'string') return elem;

      // Bold text **text**
      const boldParts = elem.split(/\*\*([^*]+)\*\*/g);
      return boldParts.map((bPart, bIdx) => {
        if (bIdx % 2 === 1) {
          return <strong key={bIdx} style={{ fontWeight: 800, color: '#0F172A' }}>{bPart}</strong>;
        }
        return bPart;
      });
    });

    if (isBullet) {
      return (
        <div key={lineIdx} style={{ display: 'flex', gap: '0.4rem', margin: '0.2rem 0', paddingLeft: '0.5rem' }}>
          <span style={{ color: '#2563EB', fontWeight: 800 }}>•</span>
          <div>{formattedElements}</div>
        </div>
      );
    }

    return (
      <div key={lineIdx} style={{ marginBottom: line.trim() ? '0.35rem' : '0.5rem' }}>
        {formattedElements}
      </div>
    );
  });
};

const AiChatbotWidget = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null); // { name, text }

  const [copiedIdx, setCopiedIdx] = useState(null);
  const [feedback, setFeedback] = useState({}); // { [idx]: 'like' | 'dislike' }

  const [showPopupBanner, setShowPopupBanner] = useState(true);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initial Welcome Messages
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am **PiyushDhara AI**, your 24/7 intelligent study & platform assistant. 🚀\n\nHow can I help your learning journey today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, loading]);

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && !attachedFile) return;

    const userMessage = {
      role: 'user',
      text: textToSend.trim(),
      attachment: attachedFile ? attachedFile.name : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      // Build brief history turns
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await sendAiChatApi(textToSend, history, attachedFile?.text || '');
      
      const assistantMessage = {
        role: 'assistant',
        text: res.reply || 'I am ready to assist you.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setAttachedFile(null);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ ${err.message || 'Apologies, I encountered an issue fetching the response. Please try again.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await analyzeAiFileApi(file);
      
      setAttachedFile({
        name: file.name,
        text: res.extractedText || res.reply
      });

      if (res.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `📄 **Analysis of uploaded file: "${file.name}"**\n\n${res.reply}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

    } catch (err) {
      alert(err.message || 'Failed to upload and process file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleRegenerate = async (idx) => {
    if (loading || idx === 0) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Conversation cleared! How else can I assist your study preparation today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setAttachedFile(null);
  };

  const suggestedPills = [
    '🎓 How do I enroll in a batch?',
    '📖 Where can I find free PDF notes?',
    '📐 Explain L\'Hospital\'s rule for limits',
    '👤 How do I view my student profile?'
  ];

  return (
    <>
      {/* ── 1. FLOATING LAUNCHER BUTTON & POPUP BANNER ─────────── */}
      {!isOpen && (
        <div 
          className="ai-floating-launcher ai-chatbot-fab"
          style={{ 
            position: 'fixed', 
            bottom: 'calc(var(--mobile-bottom-bar-height, 0px) + 1.5rem)', 
            right: '1.25rem', 
            zIndex: 9999, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            gap: '0.6rem' 
          }}
        >
          
          {/* Floating "Ask Anything AI" Speech Bubble Banner */}
          {showPopupBanner && (
            <div 
              className="animate-fade-in"
              style={{
                background: '#FFFFFF',
                color: '#0F172A',
                padding: '0.7rem 1.1rem',
                borderRadius: '1.1rem',
                boxShadow: '0 12px 35px rgba(15,23,42,0.22)',
                border: '1.5px solid #2563EB',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}
              onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            >
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1E4ED8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Ask PiyushDhara AI Anything! <Sparkles size={14} color="#38BDF8" />
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                  Batches, Notes, GenAI & Exam Q&A ⚡
                </div>
              </div>

              {/* Close Banner Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowPopupBanner(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  marginLeft: '0.25rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Dismiss preview"
              >
                <X size={14} />
              </button>

              {/* Speech Bubble Arrow Tail */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-7px',
                  right: '25px',
                  width: '12px',
                  height: '12px',
                  background: '#FFFFFF',
                  borderRight: '1.5px solid #2563EB',
                  borderBottom: '1.5px solid #2563EB',
                  transform: 'rotate(45deg)'
                }}
              />
            </div>
          )}

          {/* Round Floating Bot Launcher Button */}
          <button
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 12px 35px rgba(37,99,235,0.45)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            title="Open PiyushDhara AI Assistant"
          >
            <Bot size={30} />
            
            {/* Active Online Status Badge */}
            <span 
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#10B981',
                border: '2.5px solid #FFFFFF'
              }}
            />
          </button>
        </div>
      )}

      {/* ── 2. CHATBOT WINDOW ────────────────────────────────────── */}
      {isOpen && (
        <div
          className="animate-fade-in ai-chatbot-window"
          style={{
            position: 'fixed',
            bottom: isMinimized ? '2rem' : '1.5rem',
            right: isMinimized ? '2rem' : '1.5rem',
            zIndex: 9999,
            width: isMaximized ? '92vw' : 'min(420px, calc(100vw - 2rem))',
            maxWidth: '1000px',
            height: isMinimized ? '60px' : (isMaximized ? '85vh' : 'min(580px, calc(100vh - 4rem))'),
            maxHeight: '90vh',
            background: '#FFFFFF',
            borderRadius: isMinimized ? '1rem' : '1.5rem',
            boxShadow: '0 25px 60px -15px rgba(15,23,42,0.35)',
            border: '1px solid #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* ── WINDOW HEADER BAR ── */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                <Bot size={20} color="#FFFFFF" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  PiyushDhara AI <Sparkles size={14} color="#38BDF8" />
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
                  Google Gemini Powered
                </span>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.4rem' }}
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.4rem' }}
              >
                {isMinimized ? <ChevronDown size={16} /> : <Minimize2 size={16} />}
              </button>

              <button
                onClick={() => { setIsMaximized(!isMaximized); setIsMinimized(false); }}
                title={isMaximized ? 'Normal View' : 'Maximize View'}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.4rem' }}
              >
                <Maximize2 size={16} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── CHAT CONTENT BODY ── */}
          {!isMinimized && (
            <>
              <div 
                style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '1.25rem', 
                  background: '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '88%',
                        alignSelf: isUser ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {/* File attachment indicator */}
                      {msg.attachment && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '0.25rem 0.65rem', borderRadius: '0.5rem', marginBottom: '0.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FileText size={12} /> Attachment: {msg.attachment}
                        </div>
                      )}

                      {/* Bubble Card */}
                      <div
                        style={{
                          padding: '0.9rem 1.15rem',
                          borderRadius: isUser ? '1.25rem 1.25rem 0.2rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.2rem',
                          background: isUser ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#FFFFFF',
                          color: isUser ? '#FFFFFF' : '#0F172A',
                          border: isUser ? 'none' : '1px solid #E2E8F0',
                          boxShadow: isUser ? '0 4px 15px rgba(37,99,235,0.2)' : '0 4px 12px rgba(0,0,0,0.03)',
                          fontSize: '0.9rem',
                          lineHeight: '1.6'
                        }}
                      >
                        {isUser ? msg.text : renderMarkdownText(msg.text, navigate)}
                      </div>

                      {/* Message Actions Bar (Assistant side) */}
                      {!isUser && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem', paddingLeft: '0.25rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{msg.time}</span>

                          <button
                            onClick={() => handleCopyText(msg.text, idx)}
                            title="Copy Response"
                            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }}
                          >
                            {copiedIdx === idx ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                          </button>

                          <button
                            onClick={() => handleRegenerate(idx)}
                            title="Regenerate Response"
                            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }}
                          >
                            <RotateCcw size={13} />
                          </button>

                          <button
                            onClick={() => setFeedback(prev => ({ ...prev, [idx]: 'like' }))}
                            title="Helpful"
                            style={{ background: 'none', border: 'none', color: feedback[idx] === 'like' ? '#10B981' : '#64748B', cursor: 'pointer', padding: 0 }}
                          >
                            <ThumbsUp size={13} />
                          </button>

                          <button
                            onClick={() => setFeedback(prev => ({ ...prev, [idx]: 'dislike' }))}
                            title="Not Helpful"
                            style={{ background: 'none', border: 'none', color: feedback[idx] === 'dislike' ? '#DC2626' : '#64748B', cursor: 'pointer', padding: 0 }}
                          >
                            <ThumbsDown size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading Indicator */}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid #E2E8F0', width: 'fit-content' }}>
                    <Bot size={18} color="#2563EB" className="animate-spin" />
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>PiyushDhara AI is thinking...</span>
                  </div>
                )}

                {/* Suggested Prompt Pills (Show when only initial message) */}
                {messages.length === 1 && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Suggested Questions:</span>
                    {suggestedPills.map((pill, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(pill)}
                        style={{
                          textAlign: 'left',
                          padding: '0.65rem 1rem',
                          borderRadius: '0.85rem',
                          border: '1px solid #DBEAFE',
                          background: '#FFFFFF',
                          color: '#1E4ED8',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(37,99,235,0.04)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── FILE ATTACHMENT BADGE ── */}
              {attachedFile && (
                <div style={{ padding: '0.5rem 1.25rem', background: '#EFF6FF', borderTop: '1px solid #DBEAFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={14} /> Attachment: {attachedFile.name}
                  </span>
                  <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: '#1D4ED8', cursor: 'pointer', padding: 0 }}>✕</button>
                </div>
              )}

              {/* ── INPUT CONTROL BAR ── */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                style={{ 
                  padding: '0.85rem 1.25rem', 
                  background: '#FFFFFF', 
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                {/* File Upload Button */}
                <button
                  type="button"
                  disabled={uploading || loading}
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Document / PDF / Image"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '0.75rem',
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    flexShrink: 0
                  }}
                >
                  <Paperclip size={18} className={uploading ? 'animate-spin' : ''} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {/* Input Text Box */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={attachedFile ? 'Ask a question about your uploaded document...' : 'Ask PiyushDhara AI anything...'}
                  disabled={loading}
                  style={{
                    flex: 1,
                    height: '42px',
                    borderRadius: '0.85rem',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 1rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !attachedFile)}
                  className="btn btn-primary"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '0.85rem',
                    padding: 0,
                    justifyContent: 'center',
                    flexShrink: 0,
                    opacity: (!input.trim() && !attachedFile) ? 0.5 : 1
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}

        </div>
      )}
    </>
  );
};

export default AiChatbotWidget;
