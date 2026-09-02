import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { 
  Briefcase, 
  UserCheck, 
  Building2, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Layers,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({ currentUser, setCurrentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const handleSwitchPersona = (role) => {
    const user = authService.switchDemoUser(role);
    if (user) {
      setCurrentUser(user);
      setPersonaOpen(false);
      if (role === 'CANDIDATE') {
        navigate('/candidate-dashboard');
      } else {
        navigate('/recruiter-dashboard');
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '74px',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
          }}>
            <Briefcase size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#ffffff' }}>
              Job<span style={{ color: '#818cf8' }}>Flow</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--text-dim)',
              marginTop: '-4px'
            }}>Recruitment OS</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link 
            to="/jobs" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/jobs') ? '#818cf8' : 'var(--text-muted)',
              transition: 'color 0.2s ease'
            }}
          >
            <Layers size={17} />
            Explore Jobs
          </Link>

          {currentUser && currentUser.role === 'CANDIDATE' && (
            <Link 
              to="/candidate-dashboard" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/candidate-dashboard') ? '#818cf8' : 'var(--text-muted)'
              }}
            >
              <LayoutDashboard size={17} />
              My Applications
            </Link>
          )}

          {currentUser && currentUser.role === 'RECRUITER' && (
            <Link 
              to="/recruiter-dashboard" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/recruiter-dashboard') ? '#818cf8' : 'var(--text-muted)'
              }}
            >
              <Building2 size={17} />
              Recruiter Hub
            </Link>
          )}
        </div>

        {/* User / Persona Switcher / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* 1-Click Role / Persona Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPersonaOpen(!personaOpen)}
              className="btn btn-secondary btn-sm"
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Quickly switch between Candidate and Recruiter personas to test all features"
            >
              <Sparkles size={15} color="#818cf8" />
              <span>Role: {currentUser ? (currentUser.role === 'RECRUITER' ? 'Recruiter' : 'Candidate') : 'Guest'}</span>
              <ChevronDown size={14} />
            </button>

            {personaOpen && (
              <div 
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  width: '260px',
                  padding: '10px',
                  zIndex: 1001,
                  background: '#0e1628',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', padding: '6px 8px', textTransform: 'uppercase' }}>
                  ⚡ Quick Demo Persona Switch
                </div>
                
                <button
                  onClick={() => handleSwitchPersona('CANDIDATE')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: currentUser?.role === 'CANDIDATE' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px'
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                    alt="Alex" 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Alex Morgan</div>
                    <div style={{ fontSize: '0.72rem', color: '#a5b4fc' }}>Candidate (Job Seeker)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSwitchPersona('RECRUITER')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: currentUser?.role === 'RECRUITER' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                    alt="Sarah" 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sarah Jenkins</div>
                    <div style={{ fontSize: '0.72rem', color: '#c084fc' }}>Recruiter @ Stripe</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
                  alt={currentUser.fullName}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(99, 102, 241, 0.5)', objectFit: 'cover' }}
                />
                <div style={{ display: 'none' }} className="user-name-label">
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{currentUser.fullName}</div>
                </div>
              </div>

              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '7px 10px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
