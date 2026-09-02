import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Bookmark, 
  User, 
  UploadCloud, 
  ExternalLink,
  MessageSquare,
  Award,
  ChevronRight
} from 'lucide-react';

export default function CandidateDashboard({ currentUser, setCurrentUser, onApplyJob, savedJobIds, onToggleSave }) {
  const [applications, setApplications] = useState([]);
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'saved' | 'profile'
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    headline: currentUser?.headline || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    skills: currentUser?.skills || '',
    avatarUrl: currentUser?.avatarUrl || ''
  });
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    loadCandidateData();
  }, [currentUser, savedJobIds]);

  const loadCandidateData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const apps = await applicationService.getCandidateApplications(currentUser.id);
      setApplications(apps);

      const allJobs = await jobService.getAllJobs();
      const saved = allJobs.filter(j => savedJobIds.includes(j.id));
      setSavedJobsList(saved);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updated = authService.updateProfile(profileForm);
    if (updated) {
      setCurrentUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const getStageStepNumber = (status) => {
    switch (status) {
      case 'APPLIED': return 1;
      case 'SCREENING': return 2;
      case 'INTERVIEW': return 3;
      case 'OFFER': return 4;
      case 'REJECTED': return 0;
      default: return 1;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <span className="badge badge-info">Application Received</span>;
      case 'SCREENING':
        return <span className="badge badge-primary">Under Screening</span>;
      case 'INTERVIEW':
        return <span className="badge badge-warning">Interview Loop</span>;
      case 'OFFER':
        return <span className="badge badge-success">🎉 Offer Extended</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Not Selected</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const stats = {
    total: applications.length,
    screening: applications.filter(a => a.status === 'SCREENING').length,
    interview: applications.filter(a => a.status === 'INTERVIEW').length,
    offer: applications.filter(a => a.status === 'OFFER').length,
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="app-container">
        
        {/* Candidate Profile Header Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '28px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
            background: 'linear-gradient(135deg, rgba(20, 29, 48, 0.85) 0%, rgba(10, 15, 26, 0.9) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img 
              src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={currentUser?.fullName}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '3px solid #6366f1',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#ffffff' }}>{currentUser?.fullName}</h1>
                <span className="badge badge-primary">Candidate Persona</span>
              </div>
              <div style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>
                {currentUser?.headline || 'Full-Stack Software Engineer'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '6px' }}>
                <span>📍 {currentUser?.location || 'San Francisco, CA'}</span>
                <span>✉️ {currentUser?.email}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setActiveTab('profile')} 
              className="btn btn-secondary btn-sm"
            >
              <User size={15} />
              Edit Profile & Resume
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Applied
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {stats.total}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              In Screening
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              {stats.screening}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Interviews Scheduled
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              {stats.interview}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Offers Received
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              {stats.offer}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'applications' ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === 'applications' ? '#818cf8' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Clock size={17} />
            Active Applications ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'saved' ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === 'saved' ? '#818cf8' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Bookmark size={17} />
            Saved Jobs ({savedJobsList.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === 'profile' ? '#818cf8' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <User size={17} />
            Profile & Skills
          </button>
        </div>

        {/* TAB 1: Applications Timeline & Status Tracker */}
        {activeTab === 'applications' && (
          <div>
            {applications.length === 0 ? (
              <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
                <Briefcase size={40} color="var(--text-dim)" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No applications submitted yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Explore top engineering jobs and apply with 1-click to start tracking your interview progress.
                </p>
                <button onClick={() => window.location.href = '/jobs'} className="btn btn-primary">
                  Explore Open Roles
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {applications.map(app => {
                  const stepNum = getStageStepNumber(app.status);
                  return (
                    <div key={app.id} className="glass-panel animate-fade-in" style={{ padding: '26px' }}>
                      {/* App Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                              {app.job?.company || "Tech Employer"}
                            </span>
                            <span style={{ color: 'var(--text-dim)' }}>•</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                              Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginTop: '4px' }}>
                            {app.job?.title || "Software Engineering Role"}
                          </h3>
                        </div>

                        <div>
                          {getStatusBadge(app.status)}
                        </div>
                      </div>

                      {/* 4-Step Pipeline Indicator */}
                      <div className="timeline-stages" style={{ margin: '26px 0 20px' }}>
                        {[
                          { step: 1, label: 'Applied' },
                          { step: 2, label: 'Screening' },
                          { step: 3, label: 'Interview Loop' },
                          { step: 4, label: 'Offer' }
                        ].map(stage => {
                          const isCompleted = stepNum > stage.step;
                          const isActive = stepNum === stage.step;
                          return (
                            <div key={stage.step} className={`timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                              <div className="timeline-circle">
                                {isCompleted ? '✓' : stage.step}
                              </div>
                              <span className="timeline-label">{stage.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Recruiter Feedback Note */}
                      {app.recruiterNotes && (
                        <div style={{
                          background: 'rgba(99, 102, 241, 0.08)',
                          borderLeft: '3px solid #6366f1',
                          padding: '12px 16px',
                          borderRadius: '0 8px 8px 0',
                          marginTop: '16px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}>
                          <MessageSquare size={17} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
                              Talent Partner Note
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#e2e8f0', marginTop: '2px' }}>
                              "{app.recruiterNotes}"
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Details summary */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '18px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileText size={15} color="#818cf8" />
                          <span>Submitted: <strong>{app.resumeName}</strong></span>
                        </div>

                        {app.portfolioUrl && (
                          <a 
                            href={app.portfolioUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: '#818cf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            Portfolio Link <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Saved Jobs */}
        {activeTab === 'saved' && (
          <div>
            {savedJobsList.length === 0 ? (
              <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
                <Bookmark size={40} color="var(--text-dim)" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No saved jobs</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  Click the bookmark icon on any job card to save it for later.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {savedJobsList.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={(j) => window.location.href = `/jobs?selected=${j.id}`}
                    isSaved={true}
                    onToggleSave={onToggleSave}
                    onApplyDirect={onApplyJob}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Profile & Resume */}
        {activeTab === 'profile' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '750px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>Edit Candidate Profile</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your profile details are automatically pre-filled when you submit 1-click job applications.
            </p>

            {profileSuccess && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={18} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Professional Headline</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Location / Timezone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. San Francisco, CA (Open to Remote)"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Skills (Comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React, TypeScript, Spring Boot, AWS, Docker"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Short Bio / Introduction</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
