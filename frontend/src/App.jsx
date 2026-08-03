import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
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
import ReportCard from './pages/ReportCard';
import CommunityHub from './pages/CommunityHub';
import CommunityPostDetail from './pages/CommunityPostDetail';

// Certification LMS Pages
import Certifications from './pages/Certifications';
import CertificationDetails from './pages/CertificationDetails';
import CertificationLearn from './pages/CertificationLearn';
import CertificateView from './pages/CertificateView';
import AdminManageCertifications from './pages/admin/AdminManageCertifications';

// Quiz & Assessment System Pages
import QuizzesList from './pages/QuizzesList';
import QuizTake from './pages/QuizTake';
import QuizResults from './pages/QuizResults';
import QuizLeaderboard from './pages/QuizLeaderboard';
import AdminQuizManager from './pages/AdminQuizManager';

// Admin / Teacher Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageCourses from './pages/admin/AdminManageCourses';
import AdminCourseContent from './pages/admin/AdminCourseContent';
import AdminSecurityAudit from './pages/admin/AdminSecurityAudit';
import AdminPlatformSettings from './pages/admin/AdminPlatformSettings';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const QuizTakeWrapper = () => {
  const { id } = useParams();
  return <QuizTake key={id} />;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="app">
            <Routes>
              {/* Student & Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetails />} />
                
                {/* Certifications LMS Routes */}
                <Route path="certifications" element={<Certifications />} />
                <Route path="certifications/:id" element={<CertificationDetails />} />
                <Route 
                  path="certifications/:id/learn" 
                  element={
                    <StudentRoute>
                      <CertificationLearn />
                    </StudentRoute>
                  } 
                />
                <Route path="certificates/:certificateId" element={<CertificateView />} />

                {/* Quiz & Assessment System Routes */}
                <Route path="quizzes" element={<QuizzesList />} />
                <Route 
                  path="quizzes/:id/take" 
                  element={
                    <StudentRoute>
                      <QuizTakeWrapper />
                    </StudentRoute>
                  } 
                />
                <Route path="quizzes/:id/results/:submissionId" element={<QuizResults />} />
                <Route path="quizzes/:id/leaderboard" element={<QuizLeaderboard />} />

                {/* Community Hub & Discussion Forum Routes */}
                <Route path="community" element={<CommunityHub />} />
                <Route path="community/post/:id" element={<CommunityPostDetail />} />

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
                <Route 
                  path="student/report-card" 
                  element={
                    <StudentRoute>
                      <ReportCard />
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
                <Route path="certifications" element={<AdminManageCertifications />} />
                <Route path="quizzes" element={<AdminQuizManager />} />
                <Route path="security-audit" element={<AdminSecurityAudit />} />
                <Route path="settings" element={<AdminPlatformSettings />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
