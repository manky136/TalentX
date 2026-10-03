import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRoadmap } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Compass, CheckCircle2, AlertTriangle, Briefcase, GraduationCap, ArrowRight, User } from 'lucide-react';

export default function Roadmap() {
  const { authType }          = useAuth();
  const navigate              = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authType !== 'user') {
      toast.error('Career Roadmap is for Job Seekers');
      navigate('/login');
      return;
    }
    fetchRoadmap();
  }, [authType, navigate]);

  const fetchRoadmap = async () => {
    try {
      const res = await getRoadmap();
      setData(res.data);
    } catch {
      toast.error('Failed to generate career roadmap');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-loader"><span className="loader"></span></div>;

  return (
    <div className="container section animate-in">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
          <Compass size={16} /> Skill-Gap Analysis Engine
        </div>
        <h1>Your Personalized Career Roadmap 🚀</h1>
        <p>Target Goal: <strong>{data?.targetTitle || 'Not Set Yet'}</strong></p>
      </div>

      {!data?.targetTitle && (
        <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 40 }}>
          <AlertTriangle size={36} color="var(--warning)" style={{ marginBottom: 12 }} />
          <h3>Set a Target Job Goal</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            Head over to your profile dashboard and enter your desired job title so we can analyze skill requirements.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            <User size={16} /> Go to Dashboard
          </Link>
        </div>
      )}

      {/* Skill Breakdown */}
      <div className="grid-2" style={{ marginBottom: 48 }}>
        {/* Acquired Skills */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={20} /> Skills You Already Have ({data?.userSkills?.length || 0})
          </h2>
          <div className="skills-wrap">
            {data?.userSkills?.length > 0 ? (
              data.userSkills.map((s, i) => (
                <span key={i} className="skill-pill has">
                  <CheckCircle2 size={14} /> {s}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No skills added to profile yet.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={20} /> Skill Gap to Bridge ({data?.missingSkills?.length || 0})
          </h2>
          <div className="skills-wrap">
            {data?.missingSkills?.length > 0 ? (
              data.missingSkills.map((s, i) => (
                <span key={i} className="skill-pill missing">
                  <AlertTriangle size={14} /> {s}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--success)', fontSize: '0.9rem' }}>
                🎉 Great job! You match all major required skills for your target role!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses to bridge skill gap */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <GraduationCap size={24} color="var(--primary-light)" /> Recommended Courses to Bridge Your Gap
        </h2>

        {data?.recommendedCourses?.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
            No specific courses needed or found for current gap. Explore our general courses catalog.
          </div>
        ) : (
          <div className="grid-3">
            {data?.recommendedCourses?.map((course) => (
              <Link key={course._id} to={`/courses/${course._id}`}>
                <div className="card course-card">
                  {course.thumbnailUrl && (
                    <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  )}
                  <div className="course-body">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-org">{course.organisation?.name}</div>
                    <div className="course-skills">
                      {course.skills?.map((s, i) => <span key={i} className="tag">{s}</span>)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Matching Job Listings */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Briefcase size={24} color="var(--accent)" /> Matching Open Jobs ({data?.matchingJobs?.length || 0})
        </h2>

        <div className="grid-2">
          {data?.matchingJobs?.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`}>
              <div className="card job-card">
                <h3 className="job-title">{job.title}</h3>
                <div className="job-company">{job.organisation?.name} • {job.location}</div>
                <div className="job-skills" style={{ marginTop: 12 }}>
                  {job.skills?.map((s, i) => <span key={i} className="tag">{s}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
