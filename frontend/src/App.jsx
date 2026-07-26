import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';

// Route Guards
import ProtectedRoute from './components/routes/ProtectedRoute';
import StudentRoute from './components/routes/StudentRoute';
import TeacherRoute from './components/routes/TeacherRoute';
import AdminRoute from './components/routes/AdminRoute';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public & Auth Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import LectureRoom from './pages/LectureRoom';
import About from './pages/About';
import Notes from './pages/Notes';
import ExamAlerts from './pages/ExamAlerts';
import AcademicSupport from './pages/AcademicSupport';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherLogin from './pages/TeacherLogin';
import TeacherRegister from './pages/TeacherRegister';
import VerifyEmailScreen from './pages/VerifyEmailScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import MyCourses from './pages/MyCourses';
import StudentProfile from './pages/StudentProfile';

// Admin / Teacher Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageCourses from './pages/admin/AdminManageCourses';
import AdminCourseContent from './pages/admin/AdminCourseContent';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Student & Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetails />} />
                <Route path="about" element={<About />} />
                <Route path="notes" element={<Notes />} />
                <Route path="exam-alerts" element={<ExamAlerts />} />
                <Route path="support" element={<AcademicSupport />} />
                <Route path="contact" element={<AcademicSupport />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="teacher-login" element={<TeacherLogin />} />
                <Route path="teacher-register" element={<TeacherRegister />} />
                <Route path="verify-email" element={<VerifyEmailScreen />} />
                <Route path="forgot-password" element={<ForgotPasswordScreen />} />
                
                {/* Protected Student Routes */}
                <Route 
                  path="watch/:id" 
                  element={
                    <StudentRoute>
                      <LectureRoom />
                    </StudentRoute>
                  } 
                />
                <Route 
                  path="lecture/:id" 
                  element={
                    <StudentRoute>
                      <LectureRoom />
                    </StudentRoute>
                  } 
                />
                <Route 
                  path="my-courses" 
                  element={
                    <StudentRoute>
                      <MyCourses />
                    </StudentRoute>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <StudentRoute>
                      <StudentProfile />
                    </StudentRoute>
                  } 
                />
              </Route>

              {/* Admin / Teacher Protected Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminManageCourses />} />
                <Route path="courses/:id/content" element={<AdminCourseContent />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
