import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
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

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageCourses from './pages/admin/AdminManageCourses';
import AdminCourseContent from './pages/admin/AdminCourseContent';

// Protected Route Guard for Teacher / Admin Portal
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Student / Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetails />} />
              <Route path="watch/:id" element={<LectureRoom />} />
              <Route path="about" element={<About />} />
              <Route path="notes" element={<Notes />} />
              <Route path="exam-alerts" element={<ExamAlerts />} />
              <Route path="support" element={<AcademicSupport />} />
              <Route path="contact" element={<AcademicSupport />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Admin Routes with Auth Guard */}
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminManageCourses />} />
              <Route path="courses/:id/content" element={<AdminCourseContent />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
