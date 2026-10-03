import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../api';
import toast from 'react-hot-toast';
import { Briefcase, Search, MapPin, Building2, ChevronRight } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [type, setType]         = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [type]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs({ search, type, location });
      setJobs(res.data.jobs || []);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container section animate-in">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Explore Open Positions 💼</h1>
        <p>Discover opportunities matching your skills from top hiring organisations</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <div style={{ flex: 2, position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by job title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
        </div>

        <input
          type="text"
          className="form-input"
          placeholder="Location (e.g. Remote, Bangalore)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ flex: 1 }}
        />

        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1 }}>
          <option value="">All Job Types</option>
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <button type="submit" className="btn btn-primary">
          <Search size={16} /> Search
        </button>
      </form>

      {loading ? (
        <div className="page-loader"><span className="loader"></span></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state card">
          <Briefcase size={48} />
          <h3>No matching job openings found</h3>
          <p>Try searching for a different skill or clear your filters.</p>
        </div>
      ) : (
        <div className="grid-2">
          {jobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`}>
              <div className="card job-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-company">
                      <Building2 size={14} /> {job.organisation?.name || 'Company'} • <MapPin size={14} /> {job.location}
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{job.type}</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description}
                </p>

                <div className="job-skills">
                  {job.skills?.map((s, i) => (
                    <span key={i} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
