import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../api';
import toast from 'react-hot-toast';
import { Building2, ArrowLeft, Play, Clock, Award } from 'lucide-react';

export default function CourseDetail() {
  const { id }                = useParams();
  const navigate              = useNavigate();
  const [course, setCourse]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCourseById(id);
        setCourse(res.data.course);
      } catch {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) return <div className="page-loader"><span className="loader"></span></div>;
  if (!course) return null;

  return (
    <div className="container section animate-in">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to Courses
      </button>

      <div className="card" style={{ padding: 40 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="badge badge-accent" style={{ textTransform: 'capitalize', marginBottom: 12 }}>{course.level} Level</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 10 }}>{course.title}</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={16} /> Provided by {course.organisation?.name}</span>
            {course.duration && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> {course.duration}</span>}
          </div>
        </div>

        {/* Video Player (Cloudinary URL) */}
        {course.videoUrl ? (
          <div style={{ marginBottom: 40, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
            <video src={course.videoUrl} controls style={{ width: '100%', maxHeight: 480, display: 'block' }} />
          </div>
        ) : (
          <div style={{ padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32 }}>
            <Play size={40} style={{ marginBottom: 10, opacity: 0.4 }} />
            <p>Video lecture coming soon</p>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>Course Overview</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{course.description}</p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>Skills You Will Master</h3>
          <div className="tag-wrap">
            {course.skills?.map((s, i) => (
              <span key={i} className="tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
