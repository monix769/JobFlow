import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { authService } from './services/authService';
import { jobService } from './services/jobService';
import { applicationService } from './services/applicationService';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  AlertCircle,
  Building,
  DollarSign
} from 'lucide-react';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [savedJobIds, setSavedJobIds] = useState(jobService.getSavedJobIds());

  // Global Quick Apply Modal State
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '+1 (555) 349-2910',
    portfolioUrl: 'https://alexmorgan.dev',
    resumeName: 'Alex_Morgan_Resume_2026.pdf',
    coverLetter: ''
  });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setApplyForm(prev => ({
        ...prev,
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        portfolioUrl: currentUser.skills ? 'https://github.com/portfolio' : prev.portfolioUrl
      }));
    }
  }, [currentUser]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggleSave = (jobId) => {
    const updated = jobService.toggleSaveJob(jobId);
    setSavedJobIds(updated);
    const isNowSaved = updated.includes(jobId);
    showToast(isNowSaved ? 'Job added to saved list!' : 'Job removed from saved list', 'info');
  };

  const openApplyModal = (job) => {
    if (!currentUser) {
      showToast('Please sign in to apply for this role', 'warning');
      navigate('/login');
      return;
    }
    setApplyModalJob(job);
    setApplyError('');
    setApplySuccess(false);
    setApplyForm({
      fullName: currentUser.fullName || 'Alex Morgan',
      email: currentUser.email || 'alex.candidate@jobflow.dev',
      phone: '+1 (555) 349-2910',
      portfolioUrl: 'https://alexmorgan.dev',
      resumeName: 'Alex_Morgan_Senior_Frontend_Resume.pdf',
      coverLetter: `I am very excited about the ${job.title} opportunity at ${job.company}. My technical experience aligns closely with your core requirements.`
    });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setApplyError('');
    try {
      await applicationService.apply(currentUser.id, applyModalJob.id, applyForm);
      setApplySuccess(true);
      
      // Fire celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('🎉 Application submitted successfully!', 'success');

      setTimeout(() => {
        setApplyModalJob(null);
        setApplySuccess(false);
        if (currentUser.role === 'CANDIDATE') {
          navigate('/candidate-dashboard');
        }
      }, 1800);
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {/* Main Routed Content */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onApplyJob={openApplyModal} 
                savedJobIds={savedJobIds} 
                onToggleSave={handleToggleSave} 
              />
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <Jobs 
                onApplyJob={openApplyModal} 
                savedJobIds={savedJobIds} 
                onToggleSave={handleToggleSave} 
              />
            } 
          />
          <Route 
            path="/candidate-dashboard" 
            element={
              <ProtectedRoute requiredRole="CANDIDATE">
                <CandidateDashboard 
                  currentUser={currentUser} 
                  setCurrentUser={setCurrentUser}
                  onApplyJob={openApplyModal}
                  savedJobIds={savedJobIds}
                  onToggleSave={handleToggleSave}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter-dashboard" 
            element={
              <ProtectedRoute requiredRole="RECRUITER">
                <RecruiterDashboard currentUser={currentUser} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={<Login setCurrentUser={setCurrentUser} />} 
          />
          <Route 
            path="/register" 
            element={<Register setCurrentUser={setCurrentUser} />} 
          />
        </Routes>
      </main>

      {/* Global Easy Apply Modal */}
      {applyModalJob && (
        <div className="modal-overlay" onClick={() => !applyLoading && setApplyModalJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="#818cf8" />
                <h2 style={{ fontSize: '1.4rem' }}>Easy Apply to {applyModalJob.company}</h2>
              </div>
              <button 
                onClick={() => setApplyModalJob(null)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px', borderRadius: '50%' }}
                disabled={applyLoading}
              >
                <X size={18} />
              </button>
            </div>

            {/* Position Summary Pill */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 600 }}>Applying For:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{applyModalJob.title}</div>
              </div>
              <span className="badge badge-success">
                ${Math.round(applyModalJob.salaryMin/1000)}k - ${Math.round(applyModalJob.salaryMax/1000)}k
              </span>
            </div>

            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <CheckCircle2 size={56} color="#34d399" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '8px' }}>Application Sent!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  The talent acquisition team at <strong>{applyModalJob.company}</strong> has received your submission.
                </p>
                <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#818cf8' }}>
                  Redirecting to your application tracker...
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                {applyError && (
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
                    marginBottom: '16px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{applyError}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={applyForm.fullName}
                      onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Portfolio / GitHub URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={applyForm.portfolioUrl}
                      onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
                    />
                  </div>
                </div>

                {/* Resume Picker */}
                <div className="input-group">
                  <label className="input-label">Select Attached Resume (PDF)</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px dashed rgba(99, 102, 241, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={20} color="#818cf8" />
                      <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>
                        {applyForm.resumeName}
                      </span>
                    </div>
                    <span className="badge badge-primary">Verified PDF</span>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="input-group">
                  <label className="input-label">Cover Note & Why You're a Great Fit</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Briefly highlight your experience with this tech stack..."
                    value={applyForm.coverLetter}
                    onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button 
                    type="button" 
                    onClick={() => setApplyModalJob(null)} 
                    className="btn btn-secondary"
                    disabled={applyLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={applyLoading}
                    style={{ padding: '10px 24px' }}
                  >
                    <Sparkles size={16} />
                    {applyLoading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: toast.type === 'success' ? '#064e3b' : '#1e1b4b',
          border: `1px solid ${toast.type === 'success' ? '#10b981' : '#6366f1'}`,
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 2000,
          animation: 'fadeIn 0.25s ease',
          fontSize: '0.92rem',
          fontWeight: 600
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} color="#34d399" /> : <Sparkles size={18} color="#818cf8" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'rgba(5, 7, 11, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '36px 0',
        marginTop: '60px'
      }}>
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Job<span style={{ color: '#818cf8' }}>Flow</span>
            </span>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '4px' }}>
              Enterprise Recruitment & Career Progression Platform • 2026
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>TypeScript</span>
            <span>React</span>
            <span>Spring Boot</span>
            <span>REST API</span>
            <span>SQL Database</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
