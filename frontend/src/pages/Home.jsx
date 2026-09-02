import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Briefcase,
  Zap,
  Globe2,
  Code2,
  Cpu,
  Palette,
  Terminal,
  Building2,
  Award
} from 'lucide-react';

export default function Home({ onApplyJob, savedJobIds, onToggleSave }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const jobs = await jobService.getAllJobs();
        setFeaturedJobs(jobs.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const categories = [
    { name: 'Engineering & Dev', icon: <Code2 size={20} color="#818cf8" />, count: '240+ roles' },
    { name: 'AI & Machine Learning', icon: <Cpu size={20} color="#34d399" />, count: '95+ roles' },
    { name: 'Product & Design', icon: <Palette size={20} color="#f472b6" />, count: '80+ roles' },
    { name: 'DevOps & Cloud', icon: <Terminal size={20} color="#38bdf8" />, count: '110+ roles' },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '40px 0 70px', position: 'relative', overflow: 'hidden' }}>
        <div className="app-container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            <Sparkles size={16} color="#818cf8" />
            <span>Next-Gen Full-Stack Recruitment Ecosystem</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            letterSpacing: '-1.5px',
            marginBottom: '20px',
            lineHeight: 1.15
          }}>
            Connecting Top Talent with <br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>High-Impact Opportunities</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            marginBottom: '36px',
            maxWidth: '700px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            JobFlow powers intelligent hiring. Apply to world-class software engineering, design, and AI roles with real-time application stage transparency.
          </p>

          {/* Search Box */}
          <form 
            onSubmit={handleSearchSubmit}
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(99, 102, 241, 0.25)',
              maxWidth: '680px',
              margin: '0 auto 32px'
            }}
          >
            <div style={{ padding: '0 12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Search size={22} color="#818cf8" />
            </div>
            <input
              type="text"
              placeholder="Search by title, skill, company (e.g. React, Stripe, Remote)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '1.05rem',
                fontFamily: 'var(--font-body)',
                padding: '12px 0'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              Search Jobs
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Trending Searches:</span>
            {['React', 'TypeScript', 'Remote', 'Kubernetes', 'Next.js', 'Distributed Systems'].map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Counter Bar */}
      <section style={{ padding: '20px 0 50px' }}>
        <div className="app-container">
          <div 
            className="glass-panel"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              padding: '30px 40px',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
                10,000+
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                Active Opportunities
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                450+
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                Top Tech Employers
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-heading)' }}>
                98.4%
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                Candidate Match Rate
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                $165k
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                Avg. Software Salary
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '40px 0' }}>
        <div className="app-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Explore by Discipline</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Find specialized roles tailored to your exact stack</p>
            </div>
            <Link to="/jobs" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {categories.map((cat, i) => (
              <div 
                key={i}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(cat.name.split(' ')[0])}`)}
                className="glass-panel glass-panel-interactive"
                style={{ padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '3px' }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '50px 0' }}>
        <div className="app-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '8px' }}>Hand-Picked</div>
              <h2 style={{ fontSize: '1.75rem' }}>Featured Opportunities</h2>
            </div>
            <Link to="/jobs" className="btn btn-secondary btn-sm">
              Explore All Jobs <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {featuredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={(j) => navigate(`/jobs?selected=${j.id}`)}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={onToggleSave}
                onApplyDirect={onApplyJob}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dual Persona Showcase (Candidate & Recruiter Experience) */}
      <section style={{ padding: '60px 0' }}>
        <div className="app-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {/* For Candidates */}
            <div className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div className="badge badge-primary" style={{ marginBottom: '14px' }}>For Candidates</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Track Every Stage of Your Career Journey</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
                Say goodbye to the "black hole" of job boards. With JobFlow, see real-time status as hiring teams move your application through screening, technical interview, and offer stages.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <CheckCircle2 size={18} color="#34d399" />
                  <span>1-Click Easy Apply with custom cover notes</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <CheckCircle2 size={18} color="#34d399" />
                  <span>Live 4-step hiring pipeline timeline tracker</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <CheckCircle2 size={18} color="#34d399" />
                  <span>Direct feedback notes from verified talent partners</span>
                </li>
              </ul>
              <Link to="/candidate-dashboard" className="btn btn-primary" style={{ width: '100%' }}>
                View Candidate Dashboard
              </Link>
            </div>

            {/* For Recruiters */}
            <div className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div className="badge badge-warning" style={{ marginBottom: '14px' }}>For Employers & Recruiters</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Supercharge Your Applicant Funnel</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
                Publish new engineering openings in seconds. Review applicant portfolios, manage stage transitions, leave candidate ratings, and hire top 1% engineers faster.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <CheckCircle2 size={18} color="#c084fc" />
                  <span>Instant job posting & salary range benchmarking</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#c084fc' }}>
                  <CheckCircle2 size={18} color="#c084fc" />
                  <span>Interactive stage switcher (Screening ➔ Offer)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#c084fc' }}>
                  <CheckCircle2 size={18} color="#c084fc" />
                  <span>Real-time applicant funnel and conversion metrics</span>
                </li>
              </ul>
              <Link to="/recruiter-dashboard" className="btn btn-secondary" style={{ width: '100%', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
                Access Recruiter Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="app-container">
          <div 
            className="glass-panel"
            style={{
              padding: '50px 40px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.2)'
            }}
          >
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px' }}>Ready to Elevate Your Hiring & Career?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 28px', fontSize: '1.05rem' }}>
              Join thousands of software engineers and recruiting leaders building tomorrow's tech on JobFlow.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/jobs" className="btn btn-primary btn-lg">
                Browse Open Roles
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
