import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyToJob } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Building2, MapPin, DollarSign, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export default function JobDetail() {
  const { id }                = useParams();
  const navigate              = useNavigate();
  const { authType, user }    = useAuth();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data.job);
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleApply = async () => {
    if (authType !== 'user') {
      toast.error('Please sign in as a Job Seeker to apply');
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await applyToJob(id);
      toast.success('Application submitted successfully!');
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-loader"><span className="loader"></span></div>;
  if (!job) return null;

  return (
    <div className="container section animate-in">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="card" style={{ padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
          <div>
            <span className="badge badge-accent" style={{ textTransform: 'capitalize', marginBottom: 12 }}>{job.type}</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>{job.title}</h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={16} /> {job.organisation?.name}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} /> {job.location}</span>
            </div>
          </div>

          <div>
            {applied ? (
              <span className="badge badge-success" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> Application Submitted
              </span>
            ) : (
              <button onClick={handleApply} disabled={applying} className="btn btn-primary btn-lg">
                {applying ? <span className="loader"></span> : <><Send size={18} /> Apply Now</>}
              </button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>About the Role</h3>
          <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
            {job.description}
          </p>
        </div>

        {job.requirements?.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>Requirements</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {job.requirements.map((req, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>Required Skills</h3>
          <div className="tag-wrap">
            {job.skills?.map((s, idx) => (
              <span key={idx} className="tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
