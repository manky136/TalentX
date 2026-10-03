import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, Compass, Building2, CheckCircle2, ArrowRight, Upload, Sparkles, Target, GraduationCap } from 'lucide-react';

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={16} /> Next-Gen Career & Hiring Platform
          </div>
          <h1 className="hero-title">
            Bridge Your <span>Skill Gap</span>.<br />Land Your Dream Job.
          </h1>
          <p className="hero-sub">
            TalentX connects talent with opportunities. Tell us your skills and target role, get personalized career roadmaps, learn from top organization courses, or post job requirements.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started as Job Seeker <ArrowRight size={18} />
            </Link>
            <Link to="/org/register" className="btn btn-secondary btn-lg">
              <Building2 size={18} /> Post Jobs & Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Everything You Need To Succeed</h2>
            <p className="section-sub">A complete ecosystem for career growth and employer hiring</p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(108,99,255,0.15)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: 20 }}>
                <Compass size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Smart Career Roadmap</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Specify your existing skills and desired job title. Our engine analyzes open market requirements and highlights exactly what you need to learn.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(67,224,209,0.15)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: 20 }}>
                <Briefcase size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Direct Job Listings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Browse verified job openings posted directly by hiring organizations. Apply seamlessly with your Cloudinary-hosted resume.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,101,132,0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: 20 }}>
                <GraduationCap size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Company-Led Courses</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Upskill with specialized courses created by real companies. Watch video lectures and gain practical industry skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Roles CTA */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-2">
            <div className="card" style={{ padding: 40, border: '1px solid rgba(108,99,255,0.3)' }}>
              <span className="badge badge-primary" style={{ marginBottom: 16 }}>FOR JOB SEEKERS</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 14 }}>Build Your Career Path</h3>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--success)" /> List your technical & soft skills</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--success)" /> Upload resume directly to Cloudinary storage</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--success)" /> Receive step-by-step career guidance</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--success)" /> Apply to open positions with one click</li>
              </ul>
              <Link to="/register" className="btn btn-primary">
                Create User Account <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card" style={{ padding: 40, border: '1px solid rgba(67,224,209,0.3)' }}>
              <span className="badge badge-accent" style={{ marginBottom: 16 }}>FOR ORGANISATIONS</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 14 }}>Hire & Upskill Talent</h3>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--accent)" /> Post job vacancies with required skills</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--accent)" /> Review applicant profiles and resumes</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--accent)" /> Publish training courses with Cloudinary media</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={18} color="var(--accent)" /> Build a strong talent pipeline</li>
              </ul>
              <Link to="/org/register" className="btn btn-secondary">
                Register Organisation <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          <p>© {new Date().getFullYear()} TalentX. Powered by Cloudinary & Node.js/React.</p>
        </div>
      </footer>
    </div>
  );
}
