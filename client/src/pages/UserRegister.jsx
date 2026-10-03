import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userRegister } from '../api';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function UserRegister() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { loginUser }           = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userRegister({ name, email, password });
      loginUser(res.data.accessToken, res.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
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
        <p className="auth-tagline">Create Job Seeker Account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
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
            {loading ? <span className="loader"></span> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="auth-link-row">
          Already registered? <Link to="/login">Sign in here</Link>
        </div>

        <div className="auth-divider">OR</div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/org/register" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            Register as Hiring Organisation
          </Link>
        </div>
      </div>
    </div>
  );
}
