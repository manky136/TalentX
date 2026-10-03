import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile, uploadResume } from '../api';
import toast from 'react-hot-toast';
import { User, Briefcase, FileText, Upload, Plus, X, Compass, CheckCircle, Save, ExternalLink } from 'lucide-react';

export default function UserDashboard() {
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [bio, setBio]             = useState('');
  const [targetTitle, setTargetTitle] = useState('');
  const [jobType, setJobType]     = useState('any');
  const [location, setLocation]   = useState('');
  const [skills, setSkills]       = useState([]);
  const [newSkill, setNewSkill]   = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      const u = res.data.user;
      setProfile(u);
      setBio(u.bio || '');
      setSkills(u.skills || []);
      setTargetTitle(u.jobPreferences?.title || '');
      setJobType(u.jobPreferences?.type || 'any');
      setLocation(u.jobPreferences?.location || '');
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already added');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUserProfile({
        bio,
        skills,
        jobPreferences: { title: targetTitle, location, type: jobType }
      });
      setProfile(res.data.user);
      toast.success('Profile & preferences updated!');
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const res = await uploadResume(formData);
      setProfile({ ...profile, resumeUrl: res.data.resumeUrl });
      toast.success('Resume uploaded to Cloudinary!');
    } catch {
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="page-loader"><span className="loader"></span></div>;

  return (
    <div className="dashboard container animate-in">
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1>Welcome, {profile?.name} 👋</h1>
          <p>Manage your skills, target job preferences, and resume for career guidance.</p>
        </div>
        <Link to="/roadmap" className="btn btn-primary btn-lg">
          <Compass size={18} /> View Career Roadmap
        </Link>
      </div>

      <div className="grid-3" style={{ marginBottom: 40 }}>
        <div className="card stat-card">
          <div className="stat-num" style={{ color: 'var(--primary-light)' }}>{skills.length}</div>
          <div className="stat-label">Listed Skills</div>
        </div>

        <div className="card stat-card">
          <div className="stat-num" style={{ color: 'var(--accent)' }}>
            {targetTitle ? '1 Active' : 'None'}
          </div>
          <div className="stat-label">Target Role Goal</div>
        </div>

        <div className="card stat-card">
          <div className="stat-num" style={{ color: profile?.resumeUrl ? 'var(--success)' : 'var(--warning)' }}>
            {profile?.resumeUrl ? 'Uploaded' : 'Missing'}
          </div>
          <div className="stat-label">Cloudinary Resume</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {/* Left Column - Skills & Preferences */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={20} color="var(--primary-light)" /> Profile & Skills
          </h2>

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Short Bio</label>
              <textarea
                className="form-textarea"
                placeholder="Tell recruiters briefly about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">My Skills</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Node.js, Python"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                />
                <button type="button" onClick={handleAddSkill} className="btn btn-secondary btn-sm">
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="tag-wrap">
                {skills.map((s, idx) => (
                  <span key={idx} className="tag">
                    {s}
                    <button type="button" onClick={() => handleRemoveSkill(s)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills added yet.</span>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 32, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Briefcase size={18} color="var(--accent)" /> Target Job Goal
            </h3>

            <div className="form-group">
              <label className="form-label">Desired Job Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Full Stack Developer, Data Analyst"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="any">Any Work Type</option>
                  <option value="remote">Remote Only</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location Preference</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bangalore, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
              {saving ? <span className="loader"></span> : <><Save size={16} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Right Column - Cloudinary Resume & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={20} color="var(--secondary)" /> Resume Storage (Cloudinary)
            </h2>

            {profile?.resumeUrl ? (
              <div style={{ background: 'rgba(34,211,163,0.06)', border: '1px solid rgba(34,211,163,0.2)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--success)', fontWeight: 600, marginBottom: 8 }}>
                  <CheckCircle size={18} /> Resume active on Cloudinary
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16, wordBreak: 'break-all' }}>
                  {profile.resumeUrl}
                </p>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex' }}>
                  View Resume <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                Upload your resume PDF to Cloudinary so hiring companies can review your profile.
              </p>
            )}

            <div className="file-upload">
              <input type="file" accept=".pdf" onChange={handleResumeUpload} disabled={uploading} />
              <Upload size={32} color="var(--primary-light)" />
              <p>
                {uploading ? 'Uploading to Cloudinary...' : 'Click or drag PDF resume here to upload'}
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>Next Steps</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              Once you've filled your skills and job preference, check the <strong>Career Roadmap</strong> tab to see your skill gaps and recommended courses!
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/roadmap" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                <Compass size={16} /> Roadmap
              </Link>
              <Link to="/jobs" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                <Briefcase size={16} /> Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
