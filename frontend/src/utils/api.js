const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE = getApiBase();
export const BACKEND_URL = API_BASE.replace(/\/api\/?$/, '');

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};

// Auto-handle expired token: clear localStorage and redirect to login
const handleAuthError = (res) => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  }
};

// Public endpoints
export const fetchCourses = async () => {
  const res = await fetch(`${API_BASE}/public/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
};

export const fetchCourseDetails = async (id) => {
  const res = await fetch(`${API_BASE}/public/courses/${id}`);
  if (!res.ok) throw new Error('Failed to fetch course details');
  return res.json();
};

export const fetchChapterContent = async (chapterId) => {
  const res = await fetch(`${API_BASE}/public/chapters/${chapterId}/content`);
  if (!res.ok) throw new Error('Failed to fetch chapter content');
  return res.json();
};

export const fetchVideoDetails = async (id) => {
  const res = await fetch(`${API_BASE}/public/videos/${id}`);
  if (!res.ok) throw new Error('Failed to fetch video details');
  return res.json();
};

export const searchCourses = async (query) => {
  const res = await fetch(`${API_BASE}/public/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search courses');
  return res.json();
};

export const fetchPublishedNotesApi = async () => {
  const res = await fetch(`${API_BASE}/public/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
};

export const enrollStudentApi = async (enrollData) => {
  const res = await fetch(`${API_BASE}/public/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enrollData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Enrollment failed');
  }
  return res.json();
};

// Auth endpoints
export const loginUserApi = async (identifier, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const registerUserApi = async (name, phone, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const enrollUserCourseApi = async (token, courseId) => {
  const res = await fetch(`${API_BASE}/student/enroll`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ courseId }),
  });
  handleAuthError(res);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Course enrollment failed');
  return data;
};

export const fetchEnrolledCoursesApi = async (token) => {
  const res = await fetch(`${API_BASE}/student/my-courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  handleAuthError(res);
  if (!res.ok) throw new Error('Failed to fetch enrolled courses');
  return res.json();
};

// Comments / Q&A Discussion endpoints
export const fetchVideoCommentsApi = async (videoId) => {
  const res = await fetch(`${API_BASE}/public/comments/video/${videoId}`);
  if (!res.ok) throw new Error('Failed to fetch video comments');
  return res.json();
};

export const postVideoCommentApi = async (token, videoId, text, userName, parentComment = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/comments/video/${videoId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, userName, parentComment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to post comment');
  return data;
};

export const deleteVideoCommentApi = async (token, commentId) => {
  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  handleAuthError(res);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete comment');
  return data;
};

// Rating & Feedback endpoints
export const fetchVideoFeedbackApi = async (videoId) => {
  const res = await fetch(`${API_BASE}/public/feedback/video/${videoId}`);
  if (!res.ok) throw new Error('Failed to fetch video feedback');
  return res.json();
};

export const submitVideoFeedbackApi = async (token, videoId, rating, feedbackText, userName) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/feedback/video/${videoId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ rating, feedbackText, userName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit feedback');
  return data;
};

// Admin endpoints
export const fetchAdminStats = async (token) => {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  handleAuthError(res);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
};

export const fetchCourseEnrollmentsApi = async (token, courseId) => {
  const res = await fetch(`${API_BASE}/admin/enrollments/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  handleAuthError(res);
  if (!res.ok) throw new Error('Failed to fetch enrollments');
  return res.json();
};

export const createCourseApi = async (token, courseData) => {
  const isFormData = courseData instanceof FormData;
  const headers = { Authorization: `Bearer ${token}` };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers,
    body: isFormData ? courseData : JSON.stringify(courseData),
  });
  handleAuthError(res);
  if (!res.ok) throw new Error('Failed to create course');
  return res.json();
};

export const updateCourseApi = async (token, id, courseData) => {
  const isFormData = courseData instanceof FormData;
  const headers = { Authorization: `Bearer ${token}` };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'PUT',
    headers,
    body: isFormData ? courseData : JSON.stringify(courseData),
  });
  handleAuthError(res);
  if (!res.ok) throw new Error('Failed to update course');
  return res.json();
};

export const deleteCourseApi = async (token, id) => {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete course');
  return res.json();
};

export const createSubjectApi = async (token, courseId, subjectData) => {
  const res = await fetch(`${API_BASE}/courses/${courseId}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subjectData),
  });
  if (!res.ok) throw new Error('Failed to create subject');
  return res.json();
};

export const createChapterApi = async (token, subjectId, chapterData) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/${subjectId}/chapters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(chapterData),
  });
  if (!res.ok) throw new Error('Failed to create chapter');
  return res.json();
};

export const uploadVideoApi = async (token, chapterId, formData) => {
  // Using FormData since we want to support file uploads via multer
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/videos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload video');
  return res.json();
};

export const uploadNoteApi = async (token, chapterId, formData) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload notes');
  return res.json();
};

export const fetchChapterVideosApi = async (token, chapterId) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch chapter videos');
  return res.json();
};

export const fetchChapterNotesApi = async (token, chapterId) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch chapter notes');
  return res.json();
};

export const deleteVideoApi = async (token, chapterId, videoId) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/videos/${videoId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete video');
  return res.json();
};

export const deleteNoteApi = async (token, chapterId, noteId) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/notes/${noteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete notes');
  return res.json();
};

export const updateVideoApi = async (token, chapterId, videoId, formData) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/videos/${videoId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update video');
  return res.json();
};

export const updateNoteApi = async (token, chapterId, noteId, formData) => {
  const res = await fetch(`${API_BASE}/courses/ignored/subjects/ignored/chapters/${chapterId}/notes/${noteId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update notes');
  return res.json();
};

// Visitor Analytics API
// Visitor Analytics API
export const recordVisitorApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/public/visitor`, { method: 'POST' });
    const contentType = res.headers.get('content-type');
    if (!res.ok || !contentType || !contentType.includes('application/json')) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const fetchVisitorStatsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/public/visitor-stats`);
    const contentType = res.headers.get('content-type');
    if (!res.ok || !contentType || !contentType.includes('application/json')) {
      return { totalVisits: 1250, todayVisits: 1 };
    }
    return await res.json();
  } catch (e) {
    return { totalVisits: 1250, todayVisits: 1 };
  }
};

// Study Streak API
export const recordStreakApi = async (userId = null, currentStreak = 0) => {
  try {
    const res = await fetch(`${API_BASE}/public/streak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentStreak }),
    });
    const contentType = res.headers.get('content-type');
    if (!res.ok || !contentType || !contentType.includes('application/json')) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};
