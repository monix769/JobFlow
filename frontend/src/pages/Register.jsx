import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserPlus, UserCheck, Building2, AlertCircle, Sparkles } from 'lucide-react';

export default function Register({ setCurrentUser }) {
  const [role, setRole] = useState('CANDIDATE'); // 'CANDIDATE' | 'RECRUITER'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [headline, setHeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await authService.register({
        fullName,
        email,
        password,
        role,
        companyName: role === 'RECRUITER' ? companyName : null,
        headline: headline || (role === 'RECRUITER' ? `Recruiter @ ${companyName || 'Company'}` : 'Software Engineer')
      });
      setCurrentUser(user);
      if (user.role === 'RECRUITER') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    const user = authService.switchDemoUser(demoRole);
    if (user) {
      setCurrentUser(user);
      if (demoRole === 'RECRUITER') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="app-container" style={{ maxWidth: '520px', width: '100%' }}>
        
        <div className="glass-panel" style={{ padding: '36px 32px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
              marginBottom: '12px'
            }}>
              <UserPlus size={24} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Create Your Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the next generation recruitment network</p>
          </div>

          {/* Role Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => setRole('CANDIDATE')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'CANDIDATE' ? '#6366f1' : 'transparent',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <UserCheck size={16} />
              Job Seeker
            </button>

            <button
              type="button"
              onClick={() => setRole('RECRUITER')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'RECRUITER' ? '#8b5cf6' : 'transparent',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Building2 size={16} />
              Employer / Recruiter
            </button>
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Jordan Hayes"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="jordan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {role === 'RECRUITER' && (
              <div className="input-group">
                <label className="input-label">Company / Organization Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Stripe, Linear, Vercel"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Headline / Current Title</label>
              <input
                type="text"
                className="form-control"
                placeholder={role === 'RECRUITER' ? 'e.g. Senior Tech Recruiter' : 'e.g. Full-Stack Engineer'}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            >
              {loading ? "Creating Account..." : `Register as ${role === 'RECRUITER' ? 'Recruiter' : 'Candidate'}`}
            </button>
          </form>

          {/* Quick Demo Option */}
          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Or test immediately with demo credentials:</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('CANDIDATE')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Candidate Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('RECRUITER')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Recruiter Demo
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
