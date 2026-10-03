import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../api';
import toast from 'react-hot-toast';
import { GraduationCap, Search, Play, BookOpen } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [level, setLevel]     = useState('');

  useEffect(() => {
    fetchCourses();
  }, [level]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses({ search, level });
      setCourses(res.data.courses || []);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="container section animate-in">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Company Courses & Training 🎓</h1>
        <p>Acquire missing skills through video courses published by real organizations</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <div style={{ flex: 2, position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search courses by skill or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
        </div>

        <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)} style={{ flex: 1 }}>
          <option value="">All Difficulty Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button type="submit" className="btn btn-primary">
          <Search size={16} /> Search
        </button>
      </form>

      {loading ? (
        <div className="page-loader"><span className="loader"></span></div>
      ) : courses.length === 0 ? (
        <div className="empty-state card">
          <GraduationCap size={48} />
          <h3>No courses found</h3>
          <p>Try adjusting your search terms or filter.</p>
        </div>
      ) : (
        <div className="grid-3">
          {courses.map((course) => (
            <Link key={course._id} to={`/courses/${course._id}`}>
              <div className="card course-card">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                ) : (
                  <div className="course-thumb">
                    <Play size={40} />
                  </div>
                )}
                <div className="course-body">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-org">{course.organisation?.name || 'Company Course'}</div>

                  <div className="course-skills">
                    {course.skills?.map((s, i) => (
                      <span key={i} className="tag">{s}</span>
                    ))}
                  </div>

                  <div className="course-footer">
                    <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>{course.level}</span>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {course.duration || 'Free Access'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
