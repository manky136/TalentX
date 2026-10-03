import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, BookOpen, Compass, User, Building2, LogOut, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const { user, org, authType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          Talent<span>X</span>
        </Link>

        <div className="navbar-links">
          <Link to="/jobs" className="navbar-link">
            <Briefcase size={16} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
            Jobs
          </Link>
          <Link to="/courses" className="navbar-link">
            <BookOpen size={16} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
            Courses
          </Link>

          {authType === 'user' && (
            <Link to="/roadmap" className="navbar-link">
              <Compass size={16} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
              Career Roadmap
            </Link>
          )}

          {authType === 'user' ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                <User size={16} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
                {user?.name || 'Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : authType === 'org' ? (
            <>
              <Link to="/org/dashboard" className="navbar-link">
                <Building2 size={16} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
                {org?.name || 'Org Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                User Sign In
              </Link>
              <Link to="/org/login" className="btn btn-primary btn-sm">
                For Employers <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
