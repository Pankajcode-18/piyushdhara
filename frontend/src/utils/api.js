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
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Google login failed');
  }
  return res.json();
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
        name: 'Gaurav Sir & Team',
        designation: 'Senior Lead Educator & Entrance Specialist',
        qualification: 'M.Sc. Mathematics & Physics Specialist',
        experience: '10+ Years',
        bio: 'Legendary mathematics & physics educator leading PiyushDhara with over 10+ years of experience simplifying SEE, NEB, and IOE entrance concepts for 15,000+ students across Nepal.',
        specializations: ['Mahabharath Math', 'NEB Physics', 'IOE Entrance'],
        photo: '/teacher.png',
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
