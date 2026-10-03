import { useState, useEffect } from 'react';
import { getMyJobs, getMyCourses, createJob, createCourse, deleteJob, deleteCourse } from '../api';
import toast from 'react-hot-toast';
import { Building2, Briefcase, GraduationCap, Plus, Trash2, Video, Image, FileText, X } from 'lucide-react';

export default function OrgDashboard() {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'courses'
  const [jobs, setJobs]           = useState([]);
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);

  // Modals
  const [showJobModal, setShowJobModal]       = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [submitting, setSubmitting]           = useState(false);

  // Job form
  const [jobTitle, setJobTitle]               = useState('');
  const [jobDesc, setJobDesc]                 = useState('');
  const [jobReqs, setJobReqs]                 = useState('');
  const [jobSkills, setJobSkills]             = useState('');
  const [jobLocation, setJobLocation]         = useState('Remote');
  const [jobType, setJobType]                 = useState('remote');
  const [salaryMin, setSalaryMin]             = useState('');
  const [salaryMax, setSalaryMax]             = useState('');

  // Course form
  const [courseTitle, setCourseTitle]         = useState('');
  const [courseDesc, setCourseDesc]           = useState('');
  const [courseSkills, setCourseSkills]       = useState('');
  const [courseLevel, setCourseLevel]         = useState('beginner');
  const [courseDuration, setCourseDuration]   = useState('');
  const [coursePrice, setCoursePrice]         = useState('0');
  const [thumbnailFile, setThumbnailFile]     = useState(null);
  const [videoFile, setVideoFile]             = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jRes, cRes] = await Promise.all([getMyJobs(), getMyCourses()]);
      setJobs(jRes.data.jobs || []);
      setCourses(cRes.data.courses || []);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createJob({
        title: jobTitle,
        description: jobDesc,
        requirements: jobReqs,
        skills: jobSkills,
        location: jobLocation,
        type: jobType,
        salary: { min: Number(salaryMin) || 0, max: Number(salaryMax) || 0 }
      });
      toast.success('Job listing created!');
      setShowJobModal(false);
      resetJobForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', courseTitle);
      formData.append('description', courseDesc);
      formData.append('skills', courseSkills);
      formData.append('level', courseLevel);
      formData.append('duration', courseDuration);
      formData.append('price', coursePrice);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      if (videoFile) formData.append('video', videoFile);

      await createCourse(formData);
      toast.success('Course created with Cloudinary media!');
      setShowCourseModal(false);
      resetCourseForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job listing?')) return;
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      setJobs(jobs.filter(j => j._id !== id));
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      setCourses(courses.filter(c => c._id !== id));
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const resetJobForm = () => {
    setJobTitle(''); setJobDesc(''); setJobReqs(''); setJobSkills(''); setJobLocation('Remote'); setJobType('remote'); setSalaryMin(''); setSalaryMax('');
  };

  const resetCourseForm = () => {
    setCourseTitle(''); setCourseDesc(''); setCourseSkills(''); setCourseLevel('beginner'); setCourseDuration(''); setCoursePrice('0'); setThumbnailFile(null); setVideoFile(null);
  };

  if (loading) return <div className="page-loader"><span className="loader"></span></div>;

  return (
    <div className="dashboard container animate-in">
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1>Employer Portal 🏢</h1>
          <p>Post open job requirements, publish skills courses, and review applicants.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setShowJobModal(true)} className="btn btn-primary">
            <Plus size={18} /> Post New Job
          </button>
          <button onClick={() => setShowCourseModal(true)} className="btn btn-secondary">
            <Plus size={18} /> Publish Course
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          <Briefcase size={16} style={{ marginRight: 6, display: 'inline-block' }} /> Posted Jobs ({jobs.length})
        </button>
        <button className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
          <GraduationCap size={16} style={{ marginRight: 6, display: 'inline-block' }} /> Published Courses ({courses.length})
        </button>
      </div>

      {activeTab === 'jobs' ? (
        jobs.length === 0 ? (
          <div className="empty-state card">
            <Briefcase size={48} />
            <h3>No jobs posted yet</h3>
            <p>Click "Post New Job" above to list your company's requirements.</p>
          </div>
        ) : (
          <div className="grid-2">
            {jobs.map((j) => (
              <div key={j._id} className="card job-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="job-title">{j.title}</h3>
                    <div className="job-company">
                      <Building2 size={14} /> {j.location} • <span style={{ textTransform: 'capitalize' }}>{j.type}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteJob(j._id)} className="btn btn-danger btn-sm" title="Delete job">
                    <Trash2 size={14} />
                  </button>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {j.description}
                </p>

                <div className="job-meta">
                  <span className="badge badge-primary">{j.applicants?.length || 0} Applicants</span>
                  <span className="badge badge-accent">Status: {j.status}</span>
                </div>

                <div className="job-skills">
                  {j.skills?.map((s, i) => <span key={i} className="tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        courses.length === 0 ? (
          <div className="empty-state card">
            <GraduationCap size={48} />
            <h3>No courses published yet</h3>
            <p>Click "Publish Course" to add a training course for job seekers.</p>
          </div>
        ) : (
          <div className="grid-3">
            {courses.map((c) => (
              <div key={c._id} className="card course-card">
                {c.thumbnailUrl ? (
                  <img src={c.thumbnailUrl} alt={c.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                ) : (
                  <div className="course-thumb"><Video size={36} /></div>
                )}
                <div className="course-body">
                  <h3 className="course-title">{c.title}</h3>
                  <div className="course-skills">
                    {c.skills?.map((s, i) => <span key={i} className="tag">{s}</span>)}
                  </div>
                  <div className="course-footer">
                    <span className="badge badge-accent">{c.level}</span>
                    <button onClick={() => handleDeleteCourse(c._id)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal: Post Job */}
      {showJobModal && (
        <div className="modal-overlay">
          <div className="modal animate-in">
            <div className="modal-header">
              <h3 className="modal-title">Post New Job Requirement</h3>
              <button className="modal-close" onClick={() => setShowJobModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateJob}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input type="text" required className="form-input" placeholder="e.g. Senior Frontend Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea required className="form-textarea" placeholder="Detailed job description..." value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (comma separated) *</label>
                <input type="text" required className="form-input" placeholder="React, TypeScript, Redux, CSS" value={jobSkills} onChange={(e) => setJobSkills(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements (one per line)</label>
                <textarea className="form-textarea" placeholder="3+ years of experience&#10;B.Tech in CS or equivalent" value={jobReqs} onChange={(e) => setJobReqs(e.target.value)} rows={3} />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Work Location</label>
                  <input type="text" className="form-input" placeholder="Bangalore / Remote" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
                {submitting ? <span className="loader"></span> : 'Publish Job Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publish Course */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal animate-in">
            <div className="modal-header">
              <h3 className="modal-title">Publish Training Course</h3>
              <button className="modal-close" onClick={() => setShowCourseModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label className="form-label">Course Title *</label>
                <input type="text" required className="form-input" placeholder="e.g. Modern React & Redux Mastery" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea required className="form-textarea" placeholder="What will students learn in this course?" value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Skills Taught (comma separated) *</label>
                <input type="text" required className="form-input" placeholder="React, Hooks, State Management" value={courseSkills} onChange={(e) => setCourseSkills(e.target.value)} />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select className="form-select" value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input type="text" className="form-input" placeholder="e.g. 4 Hours" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image (Cloudinary Upload)</label>
                <input type="file" accept="image/*" className="form-input" onChange={(e) => setThumbnailFile(e.target.files[0])} />
              </div>

              <div className="form-group">
                <label className="form-label">Course Video File (Cloudinary Upload)</label>
                <input type="file" accept="video/*" className="form-input" onChange={(e) => setVideoFile(e.target.files[0])} />
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
                {submitting ? <span className="loader"></span> : 'Upload & Publish Course'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
