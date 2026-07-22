import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchCourseDetails, 
  createSubjectApi, 
  createChapterApi, 
  uploadVideoApi, 
  uploadNoteApi,
  fetchChapterVideosApi,
  fetchChapterNotesApi,
  deleteVideoApi,
  deleteNoteApi,
  updateVideoApi,
  updateNoteApi,
  fetchCourseEnrollmentsApi,
  updateCourseApi
} from '../../utils/api';
import { ArrowLeft, Plus, Play, FileText, Upload, Trash2, Edit2, X, Check, Users, Settings, BookOpen, User, UploadCloud, Image, FolderPlus, CheckCircle2 } from 'lucide-react';

const AdminCourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollCount, setEnrollCount] = useState(0);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showEnrollList, setShowEnrollList] = useState(false);
  const token = localStorage.getItem('token');

  // Course Batch Editing Modal State
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editInstructorName, setEditInstructorName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editTeacherFile, setEditTeacherFile] = useState(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);
  const [savingBatch, setSavingBatch] = useState(false);

  const openEditBatchModal = () => {
    if (!course) return;
    setEditTitle(course.title);
    setEditDescription(course.description);
    setEditInstructorName(course.instructorName || 'Gaurav Sir & Team');
    setEditPrice(course.price || 0);
    setEditTeacherFile(null);
    setEditThumbnailFile(null);
    setShowEditBatchModal(true);
  };

  const handleSaveBatchDetails = async (e) => {
    e.preventDefault();
    try {
      setSavingBatch(true);
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('description', editDescription);
      formData.append('instructorName', editInstructorName);
      formData.append('price', editPrice);
      
      if (editTeacherFile) {
        formData.append('teacherImage', editTeacherFile);
      }
      if (editThumbnailFile) {
        formData.append('thumbnail', editThumbnailFile);
      }

      await updateCourseApi(token, id, formData);
      setShowEditBatchModal(false);
      loadCourseDetails();
      alert('Batch details updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update batch details');
    } finally {
      setSavingBatch(false);
    }
  };

  // Input states
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  
  // Selected IDs for active subject & chapter content editing
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [activeChapterId, setActiveChapterId] = useState(null);

  // Video Upload States
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);

  // Note Upload States
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteFile, setNoteFile] = useState(null);
  const [noteUploading, setNoteUploading] = useState(false);

  // Uploaded Contents State
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [loadingContents, setLoadingContents] = useState(false);

  // Inline editing state variables
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [editVideoDesc, setEditVideoDesc] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteDesc, setEditNoteDesc] = useState('');
  const [editNoteFile, setEditNoteFile] = useState(null);

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseDetails(id);
      setCourse(data);
      if (data.subjects && data.subjects.length > 0 && !activeSubjectId) {
        setActiveSubjectId(data.subjects[0]._id);
      }
      // Fetch enrollment count for this course
      try {
        const enrollData = await fetchCourseEnrollmentsApi(token, id);
        setEnrollCount(enrollData.count || 0);
        setEnrolledStudents(enrollData.enrollments || []);
      } catch (e) {
        // ignore token/auth errors silently
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseDetails();
  }, [id]);

  const loadChapterContents = async () => {
    if (!activeChapterId) return;
    try {
      setLoadingContents(true);
      const videos = await fetchChapterVideosApi(token, activeChapterId);
      const notes = await fetchChapterNotesApi(token, activeChapterId);
      setUploadedVideos(videos);
      setUploadedNotes(notes);
    } catch (err) {
      console.error('Failed to load chapter content', err);
    } finally {
      setLoadingContents(false);
    }
  };

  useEffect(() => {
    if (activeChapterId) {
      loadChapterContents();
    } else {
      setUploadedVideos([]);
      setUploadedNotes([]);
    }
  }, [activeChapterId]);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectTitle.trim()) return;
    try {
      await createSubjectApi(token, id, { title: newSubjectTitle });
      setNewSubjectTitle('');
      loadCourseDetails();
    } catch (err) {
      alert(err.message || 'Failed to add subject');
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim() || !activeSubjectId) return;
    try {
      await createChapterApi(token, activeSubjectId, { title: newChapterTitle });
      setNewChapterTitle('');
      loadCourseDetails();
    } catch (err) {
      alert(err.message || 'Failed to add chapter');
    }
  };

  // Content Upload Handlers
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim() || !activeChapterId) {
      alert('Please fill video title and enter a YouTube URL.');
      return;
    }
    try {
      setVideoUploading(true);
      const formData = new FormData();
      formData.append('title', videoTitle);
      formData.append('description', videoDesc);
      formData.append('videoUrl', videoUrl);

      await uploadVideoApi(token, activeChapterId, formData);
      setVideoTitle('');
      setVideoDesc('');
      setVideoUrl('');
      alert('Video lecture linked successfully!');
      loadChapterContents();
    } catch (err) {
      alert(err.message || 'Video upload failed');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleNoteUpload = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteFile || !activeChapterId) {
      alert('Please fill notes title and select a PDF file.');
      return;
    }
    try {
      setNoteUploading(true);
      const formData = new FormData();
      formData.append('title', noteTitle);
      formData.append('description', noteDesc);
      formData.append('note', noteFile);

      await uploadNoteApi(token, activeChapterId, formData);
      setNoteTitle('');
      setNoteDesc('');
      setNoteFile(null);
      alert('Notes PDF uploaded successfully!');
      loadChapterContents();
    } catch (err) {
      alert(err.message || 'Notes upload failed');
    } finally {
      setNoteUploading(false);
    }
  };

  // Video Actions (Delete / Edit)
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video lecture?')) return;
    try {
      await deleteVideoApi(token, activeChapterId, videoId);
      loadChapterContents();
    } catch (err) {
      alert(err.message || 'Failed to delete video');
    }
  };

  const startEditVideo = (vid) => {
    setEditingVideoId(vid._id);
    setEditVideoTitle(vid.title);
    setEditVideoDesc(vid.description || '');
    setEditVideoUrl(vid.videoUrl);
  };

  const handleSaveVideoEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', editVideoTitle);
      formData.append('description', editVideoDesc);
      formData.append('videoUrl', editVideoUrl);

      await updateVideoApi(token, activeChapterId, editingVideoId, formData);
      setEditingVideoId(null);
      loadChapterContents();
    } catch (err) {
      alert(err.message || 'Failed to update video');
    }
  };

  // Notes Actions (Delete / Edit)
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this PDF note handout?')) return;
    try {
      await deleteNoteApi(token, activeChapterId, noteId);
      loadChapterContents();
    } catch (err) {
      alert(err.message || 'Failed to delete notes');
    }
  };

  const startEditNote = (note) => {
    setEditingNoteId(note._id);
    setEditNoteTitle(note.title);
    setEditNoteDesc(note.description || '');
    setEditNoteFile(null);
  };

  const handleSaveNoteEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', editNoteTitle);
      formData.append('description', editNoteDesc);
      if (editNoteFile) {
        formData.append('note', editNoteFile);
      }

      await updateNoteApi(token, activeChapterId, editingNoteId, formData);
      setEditingNoteId(null);
      setEditNoteFile(null);
      loadChapterContents();
    } catch (err) {
      alert(err.message || 'Failed to update notes');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading content compiler...</div>;
  }

  if (!course) {
    return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Batch not found.</div>;
  }

  const currentSubject = course.subjects?.find((s) => s._id === activeSubjectId);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      
      {/* Header bar */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin/courses')} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Curriculum</h1>
            <p style={{ color: 'var(--text-muted)' }}>{course.title}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Edit Batch Details Button */}
          <button
            onClick={openEditBatchModal}
            className="btn btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <Edit2 size={16} /> Edit Batch Info
          </button>

          {/* Enrollment Count Badge */}
          <button
            onClick={() => setShowEnrollList(!showEnrollList)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '0.75rem',
              background: 'rgba(37,99,235,0.08)',
              border: '1.5px solid rgba(37,99,235,0.2)',
              color: '#2563EB',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <Users size={18} />
            {enrollCount} Student{enrollCount !== 1 ? 's' : ''} Enrolled
            <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#64748B' }}>
              {showEnrollList ? '▲ Hide' : '▼ View List'}
            </span>
          </button>
        </div>
      </div>

      {/* Edit Batch Details Modal */}
      {showEditBatchModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '580px', padding: '2.5rem 2.25rem', background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #DBEAFE', boxShadow: '0 25px 60px -15px rgba(37,99,235,0.2)', maxHeight: '92vh', overflowY: 'auto', position: 'relative' }}>
            
            {/* Close Icon Button */}
            <button
              onClick={() => setShowEditBatchModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '3px', margin: '0 auto 0.85rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.12)' }}>
                <Edit2 size={28} color="#2563EB" />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                Edit Batch Details
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                Update course title, description, instructor branding, and uploaded thumbnails.
              </p>
            </div>

            <form onSubmit={handleSaveBatchDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Batch Title */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Batch Title
                </label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      width: '100%', height: '48px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem',
                      fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Course Description
                </label>
                <textarea
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{
                    width: '100%', height: '90px', borderRadius: '0.85rem', padding: '0.85rem 1rem',
                    fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              {/* Instructor Name & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Instructor Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                      type="text"
                      required
                      value={editInstructorName}
                      onChange={(e) => setEditInstructorName(e.target.value)}
                      style={{
                        width: '100%', height: '48px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem',
                        fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    style={{
                      width: '100%', height: '48px', borderRadius: '0.85rem', paddingLeft: '1rem', paddingRight: '1rem',
                      fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Image Upload Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Upload Teacher Image */}
                <div style={{ background: '#F8FAFC', border: '1.5px dashed #BFDBFE', borderRadius: '0.85rem', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
                    <UploadCloud size={18} color="#2563EB" />
                  </div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>
                    Upload Teacher Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditTeacherFile(e.target.files[0])}
                    style={{ fontSize: '0.75rem', color: '#475569', width: '100%' }}
                  />
                  {editTeacherFile ? (
                    <p style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: '0.4rem', fontWeight: 700 }}>
                      ✓ {editTeacherFile.name}
                    </p>
                  ) : course?.teacherImageUrl && (
                    <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Current: {course.teacherImageUrl}
                    </p>
                  )}
                </div>

                {/* Upload Batch Thumbnail Image */}
                <div style={{ background: '#F8FAFC', border: '1.5px dashed #BFDBFE', borderRadius: '0.85rem', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
                    <Image size={18} color="#2563EB" />
                  </div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>
                    Upload Batch Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditThumbnailFile(e.target.files[0])}
                    style={{ fontSize: '0.75rem', color: '#475569', width: '100%' }}
                  />
                  {editThumbnailFile ? (
                    <p style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: '0.4rem', fontWeight: 700 }}>
                      ✓ {editThumbnailFile.name}
                    </p>
                  ) : course?.thumbnailUrl && (
                    <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Current: {course.thumbnailUrl}
                    </p>
                  )}
                </div>

              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditBatchModal(false)} 
                  style={{
                    flex: 1, height: '48px', borderRadius: '0.85rem', border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF', color: '#475569', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingBatch} 
                  className="btn btn-primary"
                  style={{
                    flex: 1, height: '48px', borderRadius: '0.85rem', fontSize: '0.95rem', fontWeight: 700,
                    boxShadow: '0 8px 25px rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  <CheckCircle2 size={18} /> {savingBatch ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrolled Students List Panel */}
      {showEnrollList && (
        <div className="glass animate-fade-in" style={{ borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Enrolled Students ({enrollCount})
          </h3>
          {enrolledStudents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No students have enrolled in this batch yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>#</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>School</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>Phone</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>Email</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>Enrolled On</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((s, idx) => (
                    <tr key={s._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#94A3B8' }}>{idx + 1}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#1E293B' }}>{s.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{s.school}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{s.phone}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{s.email}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#94A3B8', fontSize: '0.8rem' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        
        {/* Left column: Subjects listing */}
        <div>
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)' }}>Syllabus Subjects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {course.subjects?.map((subj) => (
                <button
                  key={subj._id}
                  onClick={() => {
                    setActiveSubjectId(subj._id);
                    setActiveChapterId(null);
                  }}
                  className="btn"
                  style={{
                    justifyContent: 'flex-start',
                    background: activeSubjectId === subj._id ? '#EFF6FF' : '#FFFFFF',
                    color: activeSubjectId === subj._id ? '#1D4ED8' : '#334155',
                    border: activeSubjectId === subj._id ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    fontWeight: activeSubjectId === subj._id ? 700 : 600,
                    borderRadius: '0.75rem',
                    padding: '0.7rem 1rem',
                    width: '100%'
                  }}
                >
                  {subj.title}
                </button>
              ))}
            </div>
          </div>

          {/* Create Subject Form */}
          <form onSubmit={handleAddSubject} className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>New Subject Title</label>
            <input
              type="text"
              required
              value={newSubjectTitle}
              onChange={(e) => setNewSubjectTitle(e.target.value)}
              style={{ width: '100%', borderRadius: '0.65rem', paddingLeft: '0.75rem', marginBottom: '0.65rem', height: '42px', border: '1.5px solid #CBD5E1', fontSize: '0.88rem' }}
              placeholder="e.g. Physics, Mathematics"
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.55rem', fontSize: '0.88rem', borderRadius: '0.65rem' }}>
              <Plus size={16} /> Add Subject
            </button>
          </form>
        </div>

        {/* Right column: Chapters, Videos, and Notes details */}
        <div>
          {currentSubject ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Chapters list under active subject */}
              <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#0F172A' }}>Chapters in {currentSubject.title}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {currentSubject.chapters?.map((chap) => (
                    <button
                      key={chap._id}
                      onClick={() => setActiveChapterId(chap._id)}
                      style={{
                        background: activeChapterId === chap._id ? '#EFF6FF' : '#FFFFFF',
                        color: activeChapterId === chap._id ? '#1D4ED8' : '#334155',
                        border: activeChapterId === chap._id ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                        fontWeight: activeChapterId === chap._id ? 700 : 600,
                        padding: '0.55rem 1rem',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {chap.title}
                    </button>
                  ))}
                  {currentSubject.chapters?.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No chapters added to this subject yet.</p>}
                </div>

                {/* Create Chapter Form */}
                <form onSubmit={handleAddChapter} style={{ display: 'flex', gap: '0.75rem', maxWidth: '400px' }}>
                  <input
                    type="text"
                    required
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="search-input"
                    style={{ flex: 1, borderRadius: '0.3rem', paddingLeft: '0.75rem' }}
                    placeholder="New Chapter Title (e.g. Unit 1: Optics)"
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    Add Chapter
                  </button>
                </form>
              </div>

              {/* Uploaded Contents list & Uploads Panel if a chapter is active */}
              {activeChapterId ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Currently Uploaded Materials Section */}
                  <div className="glass" style={{ padding: '1.5rem', borderRadius: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Uploaded Content in this Chapter</h3>
                    
                    {loadingContents ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading uploaded files...</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        
                        {/* Videos List */}
                        <div>
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                            <Play size={18} /> Lectures ({uploadedVideos.length})
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {uploadedVideos.map((vid) => (
                              <div key={vid._id} style={{ padding: '0.75rem', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                                {editingVideoId === vid._id ? (
                                  <form onSubmit={handleSaveVideoEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input 
                                      type="text" 
                                      required 
                                      value={editVideoTitle} 
                                      onChange={(e) => setEditVideoTitle(e.target.value)} 
                                      className="search-input" 
                                      style={{ padding: '0.3rem', fontSize: '0.9rem' }}
                                    />
                                    <textarea 
                                      value={editVideoDesc} 
                                      onChange={(e) => setEditVideoDesc(e.target.value)} 
                                      className="search-input" 
                                      style={{ padding: '0.3rem', fontSize: '0.85rem', height: '40px' }}
                                    />
                                    <input 
                                      type="text" 
                                      required 
                                      value={editVideoUrl} 
                                      onChange={(e) => setEditVideoUrl(e.target.value)} 
                                      className="search-input" 
                                      style={{ padding: '0.3rem', fontSize: '0.85rem' }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                                      <button type="submit" className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                                        <Check size={12} /> Save
                                      </button>
                                      <button type="button" onClick={() => setEditingVideoId(null)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                                        <X size={12} /> Cancel
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                      <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>{vid.title}</p>
                                      {vid.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0' }}>{vid.description}</p>}
                                      <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary-color)', wordBreak: 'break-all' }}>{vid.videoUrl}</a>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                      <button onClick={() => startEditVideo(vid)} className="btn btn-outline" style={{ padding: '0.3rem', border: 'none' }} title="Edit/Replace Link">
                                        <Edit2 size={14} />
                                      </button>
                                      <button onClick={() => handleDeleteVideo(vid._id)} className="btn btn-outline" style={{ padding: '0.3rem', border: 'none', color: 'red' }} title="Delete Lecture">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {uploadedVideos.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No lectures uploaded yet.</p>}
                          </div>
                        </div>

                        {/* Notes List */}
                        <div>
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
                            <FileText size={18} /> Notes Handouts ({uploadedNotes.length})
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {uploadedNotes.map((note) => (
                              <div key={note._id} style={{ padding: '0.75rem', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                                {editingNoteId === note._id ? (
                                  <form onSubmit={handleSaveNoteEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input 
                                      type="text" 
                                      required 
                                      value={editNoteTitle} 
                                      onChange={(e) => setEditNoteTitle(e.target.value)} 
                                      className="search-input" 
                                      style={{ padding: '0.3rem', fontSize: '0.9rem' }}
                                    />
                                    <textarea 
                                      value={editNoteDesc} 
                                      onChange={(e) => setEditNoteDesc(e.target.value)} 
                                      className="search-input" 
                                      style={{ padding: '0.3rem', fontSize: '0.85rem', height: '40px' }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Replace File (Optional)</label>
                                      <input 
                                        type="file" 
                                        accept=".pdf,.docx,.ppt" 
                                        onChange={(e) => setEditNoteFile(e.target.files[0])} 
                                        style={{ fontSize: '0.8rem' }}
                                      />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                                      <button type="submit" className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                                        <Check size={12} /> Save
                                      </button>
                                      <button type="button" onClick={() => setEditingNoteId(null)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                                        <X size={12} /> Cancel
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                      <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>{note.title}</p>
                                      {note.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0' }}>{note.description}</p>}
                                      <a href={note.fileUrl.startsWith('http') ? note.fileUrl : `http://localhost:5000/${note.fileUrl}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>Open Handout PDF</a>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                      <button onClick={() => startEditNote(note)} className="btn btn-outline" style={{ padding: '0.3rem', border: 'none' }} title="Edit Details/Replace PDF">
                                        <Edit2 size={14} />
                                      </button>
                                      <button onClick={() => handleDeleteNote(note._id)} className="btn btn-outline" style={{ padding: '0.3rem', border: 'none', color: 'red' }} title="Delete Handout">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {uploadedNotes.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No note PDFs uploaded yet.</p>}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Upload Actions Grid Panel */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    
                    {/* Video Upload Section */}
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', border: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={20} color="#2563EB" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Upload Video Lecture</h3>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Embed HD YouTube video lectures</span>
                        </div>
                      </div>

                      <form onSubmit={handleVideoUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>Video Title</label>
                          <input
                            type="text"
                            required
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '1rem', paddingRight: '1rem', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
                            placeholder="e.g. Universal Gravitation Part 1 — Formula Derivation"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>Short Description</label>
                          <textarea
                            value={videoDesc}
                            onChange={(e) => setVideoDesc(e.target.value)}
                            style={{ width: '100%', height: '70px', borderRadius: '0.85rem', padding: '0.75rem 1rem', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', resize: 'none', background: '#FFFFFF', color: '#0F172A' }}
                            placeholder="Lecture highlights and key formulas covered..."
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>YouTube Video URL</label>
                          <input
                            type="text"
                            required
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '1rem', paddingRight: '1rem', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
                            placeholder="e.g. https://www.youtube.com/watch?v=wa9iAtcR7fo"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={videoUploading} 
                          className="btn btn-primary"
                          style={{
                            height: '48px', borderRadius: '0.85rem', fontSize: '0.92rem', fontWeight: 700,
                            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                            boxShadow: '0 6px 20px rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem'
                          }}
                        >
                          <Upload size={18} /> {videoUploading ? 'Linking Video...' : 'Upload Video Lecture'}
                        </button>
                      </form>
                    </div>

                    {/* Note Upload Section */}
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ECFDF5', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} color="#059669" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Upload PDF Notes</h3>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Share downloadable handwritten notes PDF</span>
                        </div>
                      </div>

                      <form onSubmit={handleNoteUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>Notes Title</label>
                          <input
                            type="text"
                            required
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            style={{ width: '100%', height: '46px', borderRadius: '0.85rem', paddingLeft: '1rem', paddingRight: '1rem', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
                            placeholder="e.g. Unit 1 Complete Handwritten Notes PDF"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>Short Description</label>
                          <textarea
                            value={noteDesc}
                            onChange={(e) => setNoteDesc(e.target.value)}
                            style={{ width: '100%', height: '70px', borderRadius: '0.85rem', padding: '0.75rem 1rem', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', resize: 'none', background: '#FFFFFF', color: '#0F172A' }}
                            placeholder="Doc summary, formula cheatsheets included..."
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>Select PDF/Doc File</label>
                          <div style={{ background: '#F8FAFC', border: '1.5px dashed #A7F3D0', borderRadius: '0.85rem', padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <input
                              type="file"
                              accept=".pdf,.docx,.ppt"
                              onChange={(e) => setNoteFile(e.target.files[0])}
                              style={{ fontSize: '0.82rem', color: '#334155', width: '100%' }}
                            />
                            {noteFile && (
                              <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.35rem', fontWeight: 700 }}>
                                ✓ Selected PDF: {noteFile.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          disabled={noteUploading} 
                          style={{
                            height: '48px', borderRadius: '0.85rem', fontSize: '0.92rem', fontWeight: 700,
                            background: 'linear-gradient(135deg, #059669, #047857)', color: '#FFFFFF', border: 'none', cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(5,150,105,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem'
                          }}
                        >
                          <Upload size={18} /> {noteUploading ? 'Uploading PDF...' : 'Upload Notes PDF'}
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>Select a chapter above to upload video lectures and PDF handouts.</p>
              )}

            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Create or select a subject on the left to begin compiling chapters.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminCourseContent;
