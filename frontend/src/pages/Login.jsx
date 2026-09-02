import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { LogIn, Sparkles, UserCheck, Building2, AlertCircle } from 'lucide-react';

export default function Login({ setCurrentUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      if (user.role === 'RECRUITER') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const user = authService.switchDemoUser(role);
    if (user) {
      setCurrentUser(user);
      if (role === 'RECRUITER') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="app-container" style={{ maxWidth: '460px', width: '100%' }}>
        
        <div className="glass-panel" style={{ padding: '36px 32px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
              marginBottom: '14px'
            }}>
              <LogIn size={24} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to manage applications and hiring pipelines</p>
          </div>

          {/* 1-Click Demo Logins */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '10px' }}>
              <Sparkles size={14} color="#818cf8" />
              <span>1-Click Instant Demo Login</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('CANDIDATE')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                <UserCheck size={14} color="#818cf8" />
                Candidate Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('RECRUITER')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                <Building2 size={14} color="#c084fc" />
                Recruiter Demo
              </button>
            </div>
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
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="alex.candidate@jobflow.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              {loading ? "Signing in..." : "Sign In to JobFlow"}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
