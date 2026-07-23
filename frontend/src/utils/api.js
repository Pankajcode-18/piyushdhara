const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

// Safe JSON parser helper to prevent "Unexpected end of JSON input" errors
const safeParseJson = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    if (!res.ok) {
      throw new Error(`Server Response (${res.status}): ${text.slice(0, 120) || 'Invalid server response'}`);
    }
    return {};
  }
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
  const data = await safeParseJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to fetch courses');
  return data;
};

export const fetchCourseDetails = async (id) => {
  const res = await fetch(`${API_BASE}/public/courses/${id}`);
  const data = await safeParseJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to fetch course details');
  return data;
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
export const loginUserApi = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await safeParseJson(res);
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const registerUserApi = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await safeParseJson(res);
  if (!res.ok) throw new Error(data.message || 'Registration failed');
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
