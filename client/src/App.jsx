import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import OrgLogin from './pages/OrgLogin';
import OrgRegister from './pages/OrgRegister';
import UserDashboard from './pages/UserDashboard';
import OrgDashboard from './pages/OrgDashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Roadmap from './pages/Roadmap';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ className: 'hot-toast-bar' }} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/org/login" element={<OrgLogin />} />
          <Route path="/org/register" element={<OrgRegister />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/org/dashboard" element={<OrgDashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
