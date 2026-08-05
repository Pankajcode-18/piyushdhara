const getApiBase = () => {
  let base = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!base || base.trim() === '') {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      base = '/api';
    } else {
      base = 'http://localhost:5000/api';
    }
  }
  let cleanBase = base.trim().replace(/\/+$/, '');
  if (!cleanBase.endsWith('/api')) {
    cleanBase += '/api';
  }
  return cleanBase;
};

export const API_BASE = getApiBase();
export const BACKEND_URL = API_BASE.replace(/\/api\/?$/, '');

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};

export const getCourseThumbnail = (course) => {
  if (!course) return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80';
  
  if (course.thumbnailUrl && course.thumbnailUrl !== 'no-photo.jpg' && !course.thumbnailUrl.includes('no-photo')) {
    return getFileUrl(course.thumbnailUrl);
  }
  
  const title = (course.title || '').toUpperCase();
  if (title.includes('MATH')) {
    return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80';
  }
  if (title.includes('WEB') || title.includes('CODE') || title.includes('TECH')) {
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
  }
  if (title.includes('PHYSICS') || title.includes('IOE') || title.includes('ENTRANCE')) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  }
  if (title.includes('LOKSEWA') || title.includes('GK')) {
    return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80';
  }

  return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80';
};

// Auto-handle expired token: clear localStorage and redirect to login
const handleAuthError = (res) => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  }
};

// Public endpoints — only published courses
export const fetchCourses = async () => {
  const res = await fetch(`${API_BASE}/public/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
};

// Admin endpoint — all courses (published + unpublished)
export const fetchAllCoursesAdmin = async (token) => {
  const res = await fetch(`${API_BASE}/courses`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch all courses');
  return res.json();
};

export const fetchCourseDetails = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/public/courses/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Direct course fetch failed, trying fallback lookup:', e);
  }

  // Smart fallback lookup by ID, slug, or title match from all active courses
  try {
    const allCourses = await fetchCourses();
    if (Array.isArray(allCourses) && allCourses.length > 0) {
      const matched = allCourses.find(
        (c) =>
          c._id?.toString() === id?.toString() ||
          c.slug === id ||
          c.title?.toLowerCase().replace(/\s+/g, '-').includes(id?.toLowerCase())
      );
      if (matched) return matched;
      return allCourses[0]; // Fallback to first available course
    }
  } catch (err) {
    console.error('Course fallback fetch failed:', err);
  }

  throw new Error('Failed to fetch course details');
};

export const fetchChapterContent = async (chapterId) => {
  const res = await fetch(`${API_BASE}/public/chapters/${chapterId}/content`);
  if (!res.ok) throw new Error('Failed to fetch chapter content');
  return res.json();
};

export const fetchVideoDetails = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/public/videos/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Direct video fetch failed:', e);
  }

  // Smart fallback lookup from available courses
  try {
    const allCourses = await fetchCourses();
    if (Array.isArray(allCourses)) {
      for (const course of allCourses) {
        if (course.subjects) {
          for (const subj of course.subjects) {
            if (subj.chapters) {
              for (const chap of subj.chapters) {
                if (chap._id) {
                  try {
                    const content = await fetchChapterContent(chap._id);
                    if (content.videos && content.videos.length > 0) {
                      const vMatch = content.videos.find(
                        (v) =>
                          v._id?.toString() === id?.toString() ||
                          v.title?.toLowerCase().replace(/\s+/g, '-').includes(id?.toLowerCase())
                      );
                      if (vMatch) return vMatch;
                    }
                  } catch (err) {}
                }
              }
            }
          }
        }
      }
      // If no specific video matched, fallback to first video of first course
      if (allCourses.length > 0 && allCourses[0].subjects?.[0]?.chapters?.[0]?._id) {
        const firstContent = await fetchChapterContent(allCourses[0].subjects[0].chapters[0]._id);
        if (firstContent.videos?.[0]) return firstContent.videos[0];
      }
    }
  } catch (err) {
    console.error('Video fallback fetch failed:', err);
  }

  throw new Error('Failed to fetch video details');
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

// Firebase & Student / Teacher Auth Endpoints
export const registerStudentApi = async (firebaseToken, studentData) => {
  const res = await fetch(`${API_BASE}/auth/student/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`
    },
    body: JSON.stringify(studentData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Student registration failed');
  }
  return res.json();
};

export const loginStudentApi = async (firebaseToken) => {
  const res = await fetch(`${API_BASE}/auth/student/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Student login failed');
  }
  return res.json();
};

export const googleStudentLoginApi = async (firebaseToken) => {
  const res = await fetch(`${API_BASE}/auth/student/google`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`
    },
  });
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { message: text || `HTTP ${res.status}` };
  }
  if (!res.ok) {
    throw new Error(data.message || `Backend Server Error (HTTP ${res.status})`);
  }
  return data;
};

export const registerTeacherApi = async (firebaseToken, teacherData) => {
  const res = await fetch(`${API_BASE}/auth/teacher/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`
    },
    body: JSON.stringify(teacherData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Teacher registration failed');
  }
  return res.json();
};

export const loginTeacherApi = async (firebaseToken) => {
  const res = await fetch(`${API_BASE}/auth/teacher/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Teacher login failed');
  }
  return res.json();
};

export const loginTeacherWithFirebaseApi = async (idToken) => {
  const res = await fetch(`${API_BASE}/teacher/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Teacher Firebase authentication failed');
  }
  return res.json();
};

export const getStudentProfileApi = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/auth/student/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
};

export const fetchStudentReportCardApi = async (studentEmail = '') => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const emailParam = studentEmail || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '');
  const query = emailParam ? `?studentEmail=${encodeURIComponent(emailParam)}` : '';

  const res = await fetch(`${API_BASE}/student/report-card${query}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to load report card');
  }
  return res.json();
};

export const updateStudentProfileApi = async (profileData) => {
  const token = localStorage.getItem('token');
  const isFormData = profileData instanceof FormData;
  
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}/auth/student/profile`, {
    method: 'PUT',
    headers,
    body: isFormData ? profileData : JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update student profile');
  }

  return res.json();
};

export const getTeacherProfileApi = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/auth/teacher/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
};

export const logoutAuthApi = async () => {
  await fetch(`${API_BASE}/auth/student/logout`, { method: 'POST' }).catch(() => {});
  await fetch(`${API_BASE}/auth/teacher/logout`, { method: 'POST' }).catch(() => {});
};

// Teacher OTP Auth Endpoints
export const sendTeacherOtpApi = async (email) => {
  const res = await fetch(`${API_BASE}/teacher/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Server error or endpoint not found. Please ensure backend server is running.');
  }
  if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
  return data;
};

export const verifyTeacherOtpApi = async (email, otp) => {
  const res = await fetch(`${API_BASE}/teacher/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Server error or invalid response during verification.');
  }
  if (!res.ok) throw new Error(data.message || 'OTP verification failed');
  return data;
};

export const checkTeacherPhoneApi = async (phone) => {
  const res = await fetch(`${API_BASE}/teacher/check-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Server error or endpoint not found.');
  }
  if (!res.ok) throw new Error(data.message || 'Teacher phone number not found');
  return data;
};

// Twilio SMS OTP API Endpoints
export const sendSmsOtpApi = async (phone) => {
  const res = await fetch(`${API_BASE}/teacher/send-sms-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Server error during SMS OTP sending.');
  }
  if (!res.ok) throw new Error(data.message || 'Failed to send SMS OTP');
  return data;
};

export const verifySmsOtpApi = async (phone, otp) => {
  const res = await fetch(`${API_BASE}/teacher/verify-sms-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Server error during SMS OTP verification.');
  }
  if (!res.ok) throw new Error(data.message || 'SMS OTP verification failed');
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

// AI Chatbot Endpoints
export const sendAiChatApi = async (prompt, chatHistory = [], documentContext = '') => {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, chatHistory, documentContext }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'AI service unavailable');
  }
  return res.json();
};

export const analyzeAiFileApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/ai/upload-analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'File analysis failed');
  }
  return res.json();
};

// Teacher Profiles API
export const fetchTeachersApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/public/teachers`);
    if (!res.ok) throw new Error('Failed to fetch teachers');
    return await res.json();
  } catch (e) {
    return [
      {
        _id: '6a6111111111111111111111',
        name: 'Pankaj Baduwal',
        designation: 'Lead Educator & Engineer',
        qualification: 'B.E. Computer Engineering',
        experience: '8+ Years',
        bio: 'Lead Computer Science educator and engineer leading PiyushDhara with extensive experience simplifying web development, entrance prep, and core subjects for thousands of students.',
        specializations: ['Web Development', 'Computer Science', 'IOE Entrance'],
        photo: '/gaurov.jpeg',
        rating: 4.9,
        studentsMentored: '15,000+',
        verified: true,
      },
      {
        _id: '6a6222222222222222222222',
        name: 'Er. Pankaj Baduwal',
        designation: 'Senior Engineering & Computer Science Lecturer',
        qualification: 'B.E. Computer Engineering, IOE Rank Holder',
        experience: '7+ Years',
        bio: 'Tech lead & senior lecturer specializing in Web Development, Computer Engineering routines, and IOE entrance numerical shortcuts.',
        specializations: ['Full-Stack Web Dev', 'IOE Computer Science', 'Physics'],
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        studentsMentored: '8,500+',
        verified: true,
      },
      {
        _id: '6a6333333333333333333333',
        name: 'Dr. A. Sharma',
        designation: 'Senior Chemistry & Entrance Consultant',
        qualification: 'Ph.D. Organic Chemistry',
        experience: '12+ Years',
        bio: 'Dedicated chemistry specialist renowned for simplifying organic reaction mechanisms, physical chemistry formulas, and NEB board preparation.',
        specializations: ['Organic Chemistry', 'Physical Chemistry', 'NEB Board Exams'],
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        studentsMentored: '6,200+',
        verified: true,
      }
    ];
  }
};

export const createTeacherProfileApi = async (teacherData) => {
  const res = await fetch(`${API_BASE}/public/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacherData),
  });
  if (!res.ok) throw new Error('Failed to create teacher profile');
  return res.json();
};

// ============================================================================
// CERTIFICATION LMS API ENDPOINTS
// ============================================================================

export const fetchCertificationsApi = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.difficulty) query.append('difficulty', params.difficulty);
  if (params.search) query.append('search', params.search);
  if (params.studentEmail) query.append('studentEmail', params.studentEmail);

  const res = await fetch(`${API_BASE}/certifications?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch certifications');
  return res.json();
};

export const fetchCertificationDetailsApi = async (identifier, studentEmail = '') => {
  const query = studentEmail ? `?studentEmail=${encodeURIComponent(studentEmail)}` : '';
  const res = await fetch(`${API_BASE}/certifications/${identifier}${query}`);
  if (!res.ok) throw new Error('Failed to fetch certification details');
  return res.json();
};

export const enrollCertificationApi = async (id, studentEmail, studentName = '') => {
  const res = await fetch(`${API_BASE}/certifications/${id}/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentEmail, studentName })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to enroll in certification');
  return data;
};

export const fetchCertificationLearnDataApi = async (id, studentEmail, lessonId = '') => {
  const query = new URLSearchParams({ studentEmail });
  if (lessonId) query.append('lessonId', lessonId);

  const res = await fetch(`${API_BASE}/certifications/${id}/learn?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load learning workspace');
  return res.json();
};

export const completeCertificationLessonApi = async (id, lessonId, payload) => {
  const res = await fetch(`${API_BASE}/certifications/${id}/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark lesson complete');
  return data;
};

export const submitCertificationQuizApi = async (id, lessonId, payload) => {
  const res = await fetch(`${API_BASE}/certifications/${id}/lessons/${lessonId}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit quiz');
  return data;
};

export const submitCertificationAssignmentApi = async (id, lessonId, payload) => {
  const res = await fetch(`${API_BASE}/certifications/${id}/lessons/${lessonId}/assignment/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit assignment');
  return data;
};

export const submitFinalAssessmentApi = async (id, payload) => {
  const res = await fetch(`${API_BASE}/certifications/${id}/final-assessment/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit final assessment');
  return data;
};

export const fetchStudentQuizAttemptsApi = async (studentEmail) => {
  const res = await fetch(`${API_BASE}/quizzes/student/my-attempts?studentEmail=${encodeURIComponent(studentEmail)}`);
  if (!res.ok) throw new Error('Failed to fetch student quiz attempts');
  return res.json();
};

export const fetchCertificateByIdApi = async (certificateId) => {
  const res = await fetch(`${API_BASE}/certifications/certificates/${certificateId}`);
  if (!res.ok) throw new Error('Certificate verification failed');
  return res.json();
};

export const fetchStudentCertificationsApi = async (studentEmail) => {
  const res = await fetch(`${API_BASE}/certifications/my-certifications?studentEmail=${encodeURIComponent(studentEmail)}`);
  if (!res.ok) throw new Error('Failed to fetch student certifications');
  return res.json();
};

export const adminCreateCertificationApi = async (certData) => {
  const res = await fetch(`${API_BASE}/certifications/admin/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create certification');
  return data;
};

export const adminCreateModuleApi = async (certId, moduleData) => {
  const res = await fetch(`${API_BASE}/certifications/admin/${certId}/modules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(moduleData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add module');
  return data;
};

export const adminCreateLessonApi = async (moduleId, lessonData) => {
  const res = await fetch(`${API_BASE}/certifications/admin/modules/${moduleId}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lessonData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add lesson');
  return data;
};

export const adminGradeAssignmentApi = async (submissionId, gradeData) => {
  const res = await fetch(`${API_BASE}/certifications/admin/submissions/${submissionId}/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gradeData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to grade assignment');
  return data;
};

export const fetchCertificationAnalyticsApi = async () => {
  const res = await fetch(`${API_BASE}/certifications/admin/analytics`);
  if (!res.ok) throw new Error('Failed to fetch certification analytics');
  return res.json();
};

export const adminGetFullCertificationForEditApi = async (id) => {
  const res = await fetch(`${API_BASE}/certifications/admin/${id}/full`);
  if (!res.ok) throw new Error('Failed to load certification studio data');
  return res.json();
};

export const adminUpdateCertificationApi = async (id, certData) => {
  const res = await fetch(`${API_BASE}/certifications/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update certification');
  return data;
};

export const adminDeleteCertificationApi = async (id) => {
  const res = await fetch(`${API_BASE}/certifications/admin/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete certification');
  return data;
};

export const adminUpdateLessonApi = async (lessonId, lessonData) => {
  const res = await fetch(`${API_BASE}/certifications/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lessonData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update lesson');
  return data;
};

export const adminDeleteModuleApi = async (moduleId) => {
  const res = await fetch(`${API_BASE}/certifications/admin/modules/${moduleId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete module');
  return data;
};

export const adminDeleteLessonApi = async (lessonId) => {
  const res = await fetch(`${API_BASE}/certifications/admin/lessons/${lessonId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete lesson');
  return data;
};

export const adminGetSubmissionsApi = async () => {
  const res = await fetch(`${API_BASE}/certifications/admin/submissions`);
  if (!res.ok) throw new Error('Failed to fetch student submissions');
  return res.json();
};

// ── QUIZ & ASSESSMENT SYSTEM APIs ──────────────────────────────
export const fetchQuizzesApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/quizzes?${query}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch quizzes');
  return data;
};

export const fetchQuizByIdApi = async (slugOrId, studentEmail = '') => {
  const res = await fetch(`${API_BASE}/quizzes/${slugOrId}?studentEmail=${encodeURIComponent(studentEmail)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch quiz details');
  return data;
};

export const startQuizApi = async (quizId, studentEmail, studentName) => {
  const res = await fetch(`${API_BASE}/quizzes/${quizId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentEmail, studentName })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to start quiz');
  return data;
};

export const submitQuizApi = async (quizId, submitData) => {
  const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit quiz');
  return data;
};

export const fetchQuizResultApi = async (quizId, submissionId) => {
  const res = await fetch(`${API_BASE}/quizzes/${quizId}/results/${submissionId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch quiz results');
  return data;
};

export const fetchQuizLeaderboardApi = async (quizId) => {
  const res = await fetch(`${API_BASE}/quizzes/${quizId}/leaderboard`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch quiz leaderboard');
  return data;
};

export const fetchAdminQuizzesApi = async () => {
  const res = await fetch(`${API_BASE}/quizzes/admin/all`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch admin quizzes');
  return data;
};

export const createAdminQuizApi = async (quizData) => {
  const res = await fetch(`${API_BASE}/quizzes/admin/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quizData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create quiz');
  return data;
};

export const updateAdminQuizApi = async (quizId, quizData) => {
  const res = await fetch(`${API_BASE}/quizzes/admin/${quizId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quizData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update quiz');
  return data;
};

export const deleteAdminQuizApi = async (quizId) => {
  const res = await fetch(`${API_BASE}/quizzes/admin/${quizId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete quiz');
  return data;
};

export const duplicateAdminQuizApi = async (quizId) => {
  const res = await fetch(`${API_BASE}/quizzes/admin/${quizId}/duplicate`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to duplicate quiz');
  return data;
};

export const fetchAdminQuizSubmissionsApi = async () => {
  const res = await fetch(`${API_BASE}/quizzes/admin/submissions`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch admin quiz submissions');
  return data;
};

export const gradeAdminQuizSubmissionApi = async (gradeData) => {
  const res = await fetch(`${API_BASE}/quizzes/admin/grade-submission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gradeData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to grade submission');
  return data;
};

// Security Audit API
export const recordSecurityLogApi = async (logPayload) => {
  try {
    const res = await fetch(`${API_BASE}/quizzes/security-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logPayload)
    });
    return await res.json();
  } catch (err) {
    console.error('recordSecurityLogApi error:', err);
    return { success: false };
  }
};

export const fetchSecurityAuditLogsApi = async () => {
  const res = await fetch(`${API_BASE}/quizzes/admin/security-audit`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch security audit logs');
  return data;
};

// Dynamic Platform Config API
export const fetchPlatformConfigApi = async () => {
  const res = await fetch(`${API_BASE}/public/platform-config`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch platform configuration');
  return data;
};

export const updatePlatformConfigApi = async (token, configData) => {
  const res = await fetch(`${API_BASE}/admin/platform-config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(configData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update platform configuration');
  return data;
};

// ==========================================
// COMMUNITY HUB & DISCUSSIONS FORUM API
// ==========================================

const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');
  const userStr = localStorage.getItem('user') || localStorage.getItem('studentUser');
  let email = '';
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      email = u.email || '';
    } catch(e) {}
  }

  const headers = { ...extraHeaders };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (email) headers['x-student-email'] = email;
  return headers;
};

export const fetchCommunityPostsApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/community/posts?${query}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch community posts');
  return data;
};

export const fetchCommunityPostByIdApi = async (id) => {
  const res = await fetch(`${API_BASE}/community/posts/${id}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch post details');
  return data;
};

export const createCommunityPostApi = async (postData) => {
  const isFormData = postData instanceof FormData;
  const userStr = localStorage.getItem('user') || localStorage.getItem('studentUser');
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      if (u.email && isFormData && !postData.has('studentEmail')) {
        postData.append('studentEmail', u.email);
      } else if (u.email && !isFormData) {
        postData.studentEmail = u.email;
      }
    } catch(e) {}
  }

  const extraHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${API_BASE}/community/posts`, {
    method: 'POST',
    headers: getAuthHeaders(extraHeaders),
    body: isFormData ? postData : JSON.stringify(postData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create community post');
  return data;
};

export const createCommunityAnswerApi = async (postId, answerData) => {
  const isFormData = answerData instanceof FormData;
  const extraHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };

  const res = await fetch(`${API_BASE}/community/posts/${postId}/answers`, {
    method: 'POST',
    headers: getAuthHeaders(extraHeaders),
    body: isFormData ? answerData : JSON.stringify(answerData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit answer');
  return data;
};

export const fetchCommunityAnswersApi = async (postId) => {
  const res = await fetch(`${API_BASE}/community/posts/${postId}/answers`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch answers');
  return data;
};

export const voteAnswerApi = async (answerId, voteType) => {
  const res = await fetch(`${API_BASE}/community/answers/${answerId}/vote`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ voteType })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit vote');
  return data;
};

export const markBestAnswerApi = async (answerId) => {
  const res = await fetch(`${API_BASE}/community/answers/${answerId}/best`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark best answer');
  return data;
};

export const createCommunityCommentApi = async (commentData) => {
  const res = await fetch(`${API_BASE}/community/comments`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(commentData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to post comment');
  return data;
};

export const fetchCommunityCommentsApi = async (targetType, targetId) => {
  const res = await fetch(`${API_BASE}/community/comments?targetType=${targetType}&targetId=${targetId}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch comments');
  return data;
};

export const reactToCommunityItemApi = async (targetType, targetId, type) => {
  const res = await fetch(`${API_BASE}/community/reactions`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ targetType, targetId, type })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit reaction');
  return data;
};

export const voteCommunityPollApi = async (postId, optionIds, isAnonymous = false) => {
  const res = await fetch(`${API_BASE}/community/posts/${postId}/poll/vote`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ optionIds, isAnonymous })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to vote in poll');
  return data;
};

export const toggleSaveCommunityPostApi = async (postId) => {
  const res = await fetch(`${API_BASE}/community/posts/${postId}/save`, {
    method: 'POST',
    headers: getAuthHeaders()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to bookmark post');
  return data;
};

export const fetchUserCommunityProfileApi = async () => {
  const res = await fetch(`${API_BASE}/community/profile`, {
    headers: getAuthHeaders()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch community profile');
  return data;
};





