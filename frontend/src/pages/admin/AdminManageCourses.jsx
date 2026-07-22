import { useState, useEffect } from 'react';
import { fetchCourses, createCourseApi, updateCourseApi, deleteCourseApi } from '../../utils/api';
import { Plus, Trash, Eye, EyeOff, FolderPlus, UploadCloud, Image, User, BookOpen, CheckCircle2, X, Layers, Edit3, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const getCourseThumbnail = (course) => {
  if (course.thumbnailUrl && !course.thumbnailUrl.includes('koonji') && !course.thumbnailUrl.includes('localhost')) {
    return course.thumbnailUrl;
  }
  const t = (course.title || '').toLowerCase();
  if (t.includes('math')) return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80';
  if (t.includes('web') || t.includes('code') || t.includes('mern')) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
  if (t.includes('ioe') || t.includes('engineering')) return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80';
  if (t.includes('loksewa') || t.includes('gk')) return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80';
  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
};

const AdminManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [instructorName, setInstructorName] = useState('Gaurav Sir & Team');
  const [teacherImageUrl, setTeacherImageUrl] = useState('/teacher.png');
  const [teacherImageFile, setTeacherImageFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditCourseId(null);
    setTitle('');
    setDescription('');
    setPrice(0);
    setIsPublished(true);
    setInstructorName('Gaurav Sir & Team');
    setTeacherImageUrl('/teacher.png');
    setTeacherImageFile(null);
    setThumbnailUrl('');
    setThumbnailFile(null);
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (course) => {
    setEditCourseId(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setIsPublished(course.isPublished);
    setInstructorName(course.instructorName || 'Gaurav Sir & Team');
    setTeacherImageUrl(course.teacherImageUrl || '/teacher.png');
    setTeacherImageFile(null);
    setThumbnailUrl(course.thumbnailUrl || '');
    setThumbnailFile(null);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('isPublished', isPublished);
      formData.append('instructorName', instructorName);
      
      if (teacherImageFile) {
        formData.append('teacherImage', teacherImageFile);
      } else {
        formData.append('teacherImageUrl', teacherImageUrl);
      }

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else {
        formData.append('thumbnailUrl', thumbnailUrl);
      }

      if (editCourseId) {
        // Edit course flow
        await updateCourseApi(token, editCourseId, formData);
      } else {
        // Create course flow
        await createCourseApi(token, formData);
      }
      setShowModal(false);
      setTitle('');
      setDescription('');
      setPrice(0);
      setInstructorName('Gaurav Sir & Team');
      setTeacherImageUrl('/teacher.png');
      setTeacherImageFile(null);
      setThumbnailUrl('');
      setThumbnailFile(null);
      setEditCourseId(null);
      loadCourses();
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course batch? This action cannot be undone.')) {
      try {
        await deleteCourseApi(token, courseId);
        loadCourses();
      } catch (err) {
        alert(err.message || 'Failed to delete course');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.25rem', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', display: 'inline-block' }}></span>
            COURSE MANAGEMENT CENTER
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Manage Batches
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '0.25rem 0 0 0' }}>
            Add, edit, publish or delete educational courses dynamically.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '9999px', border: '1px solid #E2E8F0', fontSize: '0.82rem', fontWeight: 700, color: '#475569', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <BookOpen size={16} color="#2563EB" />
            <span>{courses.length} Active Batch{courses.length !== 1 ? 'es' : ''}</span>
          </div>

          <button 
            onClick={handleOpenCreateModal} 
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.4rem', borderRadius: '9999px', border: 'none',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#FFFFFF',
              fontSize: '0.92rem', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(37,99,235,0.3)', transition: 'all 0.25s ease'
            }}
            className="hover-lift"
          >
            <Plus size={20} /> Add New Course
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading course directory...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {courses.map((course) => (
            <div 
              key={course._id} 
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '1.5rem', 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 8px 25px -4px rgba(15,23,42,0.06)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
              className="hover-lift"
            >
              {/* Thumbnail Banner Header */}
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#F1F5F9' }}>
                <img 
                  src={getCourseThumbnail(course)} 
                  alt={course.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80'; }}
                />
                
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.4) 0%, transparent 60%)' }} />

                {/* Floating Badges */}
                <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', right: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <span style={{ 
                    fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', 
                    background: course.isPublished ? '#DCFCE7' : '#FEF3C7', 
                    color: course.isPublished ? '#166534' : '#92400E', 
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
                  }}>
                    {course.isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>

                  <span style={{ 
                    fontSize: '0.78rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', 
                    background: '#FFFFFF', color: '#2563EB', boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
                  }}>
                    {course.price === 0 ? 'FREE' : `Rs. ${course.price}`}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.35rem 1.35rem 0.85rem 1.35rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                  {course.title}
                </h3>

                <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9', fontSize: '0.82rem', color: '#475569' }}>
                  <span style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GraduationCap size={15} color="#2563EB" /> {course.instructorName || 'Gaurav Sir & Team'}
                  </span>
                  <span style={{ fontWeight: 800, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.2rem 0.6rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Users size={13} /> {course.enrollCount || 0} Enrolled
                  </span>
                </div>
              </div>
              
              {/* Card Footer Actions */}
              <div style={{ padding: '0.85rem 1.35rem 1.35rem 1.35rem', background: '#FFFFFF', borderTop: '1px solid #F8FAFC', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Link 
                  to={`/admin/courses/${course._id}/content`} 
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
                    padding: '0.75rem', fontSize: '0.9rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFFFFF', borderRadius: '0.85rem',
                    textDecoration: 'none', boxShadow: '0 6px 18px rgba(37,99,235,0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-lift"
                >
                  <Layers size={17} /> Manage Content &amp; Chapters
                </Link>

                <div style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
                  <button 
                    onClick={() => handleOpenEditModal(course)} 
                    style={{ 
                      flex: 1, padding: '0.55rem', fontSize: '0.85rem', fontWeight: 700,
                      background: '#FFFFFF', border: '1.5px solid #CBD5E1', color: '#334155',
                      borderRadius: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <Edit3 size={15} /> Edit Details
                  </button>
                  <button 
                    onClick={() => handleDelete(course._id)} 
                    style={{ 
                      padding: '0.55rem 0.85rem', background: '#FEF2F2', border: '1.5px solid #FEE2E2',
                      color: '#DC2626', borderRadius: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Delete Batch"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Edit/Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '580px', padding: '2.5rem 2.25rem', background: '#FFFFFF', borderRadius: '1.75rem', border: '1px solid #DBEAFE', boxShadow: '0 25px 60px -15px rgba(37,99,235,0.2)', maxHeight: '92vh', overflowY: 'auto', position: 'relative' }}>
            
            {/* Close Icon Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '3px', margin: '0 auto 0.85rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.12)' }}>
                <FolderPlus size={30} color="#2563EB" />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                {editCourseId ? 'Edit Course Batch' : 'Create New Course Batch'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                Set batch title, instructor details, price tier, and upload custom thumbnails.
              </p>
            </div>

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '0.85rem 1rem', borderRadius: '0.85rem', marginBottom: '1.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Course Title */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Course Batch Title
                </label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%', height: '48px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem',
                      fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none'
                    }}
                    placeholder="e.g. IOE Physics Crash Course & Mock Tests"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Course Batch Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%', height: '90px', borderRadius: '0.85rem', padding: '0.85rem 1rem',
                    fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none', resize: 'none'
                  }}
                  placeholder="Detailed outline of the course batch..."
                />
              </div>

              {/* Instructor Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Instructor / Teacher Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type="text"
                    required
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    style={{
                      width: '100%', height: '48px', borderRadius: '0.85rem', paddingLeft: '2.85rem', paddingRight: '1rem',
                      fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none'
                    }}
                    placeholder="e.g. Gaurav Sir & Team"
                  />
                </div>
              </div>

              {/* Image Upload Grid (Teacher Photo + Thumbnail Image) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Teacher Photo */}
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
                    onChange={(e) => setTeacherImageFile(e.target.files[0])}
                    style={{ fontSize: '0.75rem', color: '#475569', width: '100%' }}
                  />
                  {teacherImageFile ? (
                    <p style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: '0.4rem', fontWeight: 700 }}>
                      ✓ {teacherImageFile.name}
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                      Default: /teacher.png
                    </p>
                  )}
                </div>

                {/* Course Thumbnail */}
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
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                    style={{ fontSize: '0.75rem', color: '#475569', width: '100%' }}
                  />
                  {thumbnailFile ? (
                    <p style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: '0.4rem', fontWeight: 700 }}>
                      ✓ {thumbnailFile.name}
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                      Auto High-Res Unsplash
                    </p>
                  )}
                </div>

              </div>

              {/* Price & Publish Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    style={{
                      width: '100%', height: '48px', borderRadius: '0.85rem', paddingLeft: '1rem', paddingRight: '1rem',
                      fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none'
                    }}
                    placeholder="0 for Free"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Publish Status
                  </label>
                  <select
                    value={isPublished ? 'yes' : 'no'}
                    onChange={(e) => setIsPublished(e.target.value === 'yes')}
                    style={{
                      width: '100%', height: '48px', borderRadius: '0.85rem', paddingLeft: '1rem', paddingRight: '1rem',
                      fontSize: '0.92rem', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', outline: 'none'
                    }}
                  >
                    <option value="yes">Publish Immediately</option>
                    <option value="no">Save as Draft</option>
                  </select>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, height: '48px', borderRadius: '0.85rem', border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF', color: '#475569', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: 1, height: '48px', borderRadius: '0.85rem', fontSize: '0.95rem', fontWeight: 700,
                    boxShadow: '0 8px 25px rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  <CheckCircle2 size={18} /> {editCourseId ? 'Save Changes' : 'Create Batch'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageCourses;
