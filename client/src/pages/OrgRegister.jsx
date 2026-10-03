import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orgRegister } from '../api';
import toast from 'react-hot-toast';
import { Mail, Lock, Building2, Globe, ArrowRight } from 'lucide-react';

export default function OrgRegister() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite]   = useState('');
  const [loading, setLoading]   = useState(false);
  const { loginOrg }            = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await orgRegister({ name, email, password, industry, website });
      loginOrg(res.data.accessToken, res.data.org);
      toast.success('Organisation registered successfully!');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div className="auth-logo">TalentX</div>
        <p className="auth-tagline">Register Organisation / Employer</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Organisation Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="TechCorp Solutions"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
              <Building2 size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Work Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="recruiter@techcorp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <input
                type="text"
                className="form-input"
                placeholder="Software / FinTech"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://company.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
            {loading ? <span className="loader"></span> : <>Register Organisation <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="auth-link-row">
          Already registered? <Link to="/org/login">Sign in here</Link>
        </div>

        <div className="auth-divider">OR</div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/register" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            Register as Job Seeker
          </Link>
        </div>
      </div>
    </div>
  );
}
