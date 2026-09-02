import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { 
  PlusCircle, 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  X, 
  Sparkles, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  ExternalLink,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function RecruiterDashboard({ currentUser }) {
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal Post Job State
  const [showPostModal, setShowPostModal] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote (Worldwide)',
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR_LEVEL',
    salaryMin: 150000,
    salaryMax: 200000,
    tags: 'React, TypeScript, Cloud',
    description: '',
    requirements: '',
    benefits: 'Comprehensive health, 401(k) match, unlimited PTO, annual learning stipend.'
  });

  // Candidate Review Modal / Drawer State
  const [activeApplicantReview, setActiveApplicantReview] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState('SCREENING');
  const [statusFeedback, setStatusFeedback] = useState('');

  useEffect(() => {
    loadRecruiterData();
  }, [currentUser]);

  const loadRecruiterData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const jobs = await jobService.getJobsByRecruiter(currentUser.id);
      setRecruiterJobs(jobs);

      const applicants = await applicationService.getAllApplicationsForRecruiter(currentUser.id);
      setAllApplicants(applicants);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJobSubmit = async (e) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.description || !newJobForm.requirements) {
      alert('Please fill out all required fields.');
      return;
    }

    await jobService.createJob(currentUser.id, {
      ...newJobForm,
      company: currentUser.companyName || "Tech Innovations Inc.",
      companyLogo: currentUser.avatarUrl
    });

    setShowPostModal(false);
    setNewJobForm({
      title: '',
      department: 'Engineering',
      location: 'Remote (Worldwide)',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR_LEVEL',
      salaryMin: 150000,
      salaryMax: 200000,
      tags: 'React, TypeScript, Cloud',
      description: '',
      requirements: '',
      benefits: 'Comprehensive health, 401(k) match, unlimited PTO, annual learning stipend.'
    });
    loadRecruiterData();
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      await jobService.deleteJob(jobId);
      loadRecruiterData();
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    await applicationService.updateStatus(appId, newStatus, reviewNotes);
    setStatusFeedback(`Candidate stage updated to ${newStatus}`);
    setTimeout(() => setStatusFeedback(''), 3000);
    loadRecruiterData();
    if (activeApplicantReview && activeApplicantReview.id === appId) {
      setActiveApplicantReview(prev => ({ ...prev, status: newStatus, recruiterNotes: reviewNotes }));
    }
  };

  const filteredApplicants = selectedJobForApplicants 
    ? allApplicants.filter(a => a.jobId === selectedJobForApplicants.id)
    : allApplicants;

  const stats = {
    totalJobs: recruiterJobs.length,
    totalApplicants: allApplicants.length,
    interviewing: allApplicants.filter(a => a.status === 'INTERVIEW').length,
    offers: allApplicants.filter(a => a.status === 'OFFER').length,
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="app-container">
        
        {/* Recruiter Header */}
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
            background: 'linear-gradient(135deg, rgba(29, 18, 48, 0.85) 0%, rgba(10, 15, 26, 0.9) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img 
              src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
              alt={currentUser?.fullName}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '3px solid #8b5cf6',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#ffffff' }}>{currentUser?.fullName}</h1>
                <span className="badge badge-warning">Recruiter Persona</span>
              </div>
              <div style={{ color: '#c084fc', fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>
                {currentUser?.headline || 'Talent Partner'} • {currentUser?.companyName || 'Stripe'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '6px' }}>
                <span>🏢 {currentUser?.companyName || 'Enterprise Talent'}</span>
                <span>✉️ {currentUser?.email}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowPostModal(true)} 
            className="btn btn-primary btn-lg"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)' }}
          >
            <PlusCircle size={18} />
            Post New Opportunity
          </button>
        </div>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Postings
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {stats.totalJobs}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Applicants
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
              {stats.totalApplicants}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              In Interview Loops
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              {stats.interviewing}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Offers Extended
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              {stats.offers}
            </div>
          </div>
        </div>

        {/* Main Sections: Posted Jobs & Applicant Review Funnel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }} className="recruiter-grid">
          
          {/* SECTION 1: Managed Job Postings */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#fff' }}>Your Job Postings</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{recruiterJobs.length} active roles</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recruiterJobs.map(job => (
                <div 
                  key={job.id} 
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderColor: selectedJobForApplicants?.id === job.id ? '#8b5cf6' : 'var(--border-subtle)',
                    background: selectedJobForApplicants?.id === job.id ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-card)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {job.department} • {job.jobType}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff', marginTop: '2px' }}>{job.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                        📍 {job.location} | ${Math.round(job.salaryMin/1000)}k - ${Math.round(job.salaryMax/1000)}k
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px', color: 'var(--danger)' }}
                      title="Delete Job"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc' }}>
                      👥 {job.applicantsCount || 0} Candidates
                    </span>

                    <button
                      onClick={() => setSelectedJobForApplicants(selectedJobForApplicants?.id === job.id ? null : job)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        background: selectedJobForApplicants?.id === job.id ? '#8b5cf6' : 'rgba(255, 255, 255, 0.08)',
                        color: selectedJobForApplicants?.id === job.id ? '#fff' : 'var(--text-main)'
                      }}
                    >
                      {selectedJobForApplicants?.id === job.id ? "Showing Applicants ✓" : "Filter Applicants"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Applicant Pipeline & Stage Reviewer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', color: '#fff' }}>
                  {selectedJobForApplicants ? `Applicants for: ${selectedJobForApplicants.title}` : "All Candidate Applications"}
                </h2>
                {selectedJobForApplicants && (
                  <button 
                    onClick={() => setSelectedJobForApplicants(null)}
                    style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.8rem', cursor: 'pointer', marginTop: '2px' }}
                  >
                    ← Clear job filter (show all {allApplicants.length})
                  </button>
                )}
              </div>
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <Users size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No applicants in this queue</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  When candidates apply to your openings, their profile and resume will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredApplicants.map(app => (
                  <div key={app.id} className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{app.fullName}</h4>
                        <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                          Role: {app.job?.title || "Engineering Position"}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div>
                        {app.status === 'APPLIED' && <span className="badge badge-info">Applied</span>}
                        {app.status === 'SCREENING' && <span className="badge badge-primary">Screening</span>}
                        {app.status === 'INTERVIEW' && <span className="badge badge-warning">Interview</span>}
                        {app.status === 'OFFER' && <span className="badge badge-success">Offer</span>}
                        {app.status === 'REJECTED' && <span className="badge badge-danger">Rejected</span>}
                      </div>
                    </div>

                    {/* Cover letter snippet */}
                    {app.coverLetter && (
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        marginBottom: '14px',
                        lineHeight: '1.4'
                      }}>
                        "{app.coverLetter}"
                      </p>
                    )}

                    {/* Stage Pipeline Buttons */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Set Stage:
                      </span>
                      
                      <button
                        onClick={() => handleStatusChange(app.id, 'SCREENING')}
                        className={`btn btn-sm ${app.status === 'SCREENING' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                      >
                        Screening
                      </button>

                      <button
                        onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                        className={`btn btn-sm ${app.status === 'INTERVIEW' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                      >
                        Interview Loop
                      </button>

                      <button
                        onClick={() => handleStatusChange(app.id, 'OFFER')}
                        className={`btn btn-sm ${app.status === 'OFFER' ? 'btn-success' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                      >
                        Extend Offer 🎉
                      </button>

                      <button
                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                        className={`btn btn-sm ${app.status === 'REJECTED' ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                      >
                        Reject
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* MODAL: Post New Job Opportunity */}
        {showPostModal && (
          <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={22} color="#8b5cf6" />
                  <h2 style={{ fontSize: '1.4rem' }}>Post New Job Opening</h2>
                </div>
                <button 
                  onClick={() => setShowPostModal(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px', borderRadius: '50%' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePostJobSubmit}>
                <div className="input-group">
                  <label className="input-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Lead Distributed Systems Engineer"
                    value={newJobForm.title}
                    onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newJobForm.department}
                      onChange={(e) => setNewJobForm({ ...newJobForm, department: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Location / Remote Policy</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newJobForm.location}
                      onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Workplace Type</label>
                    <select
                      className="form-control"
                      value={newJobForm.jobType}
                      onChange={(e) => setNewJobForm({ ...newJobForm, jobType: e.target.value })}
                    >
                      <option value="FULL_TIME">Full-Time</option>
                      <option value="REMOTE">Remote</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Experience Level</label>
                    <select
                      className="form-control"
                      value={newJobForm.experienceLevel}
                      onChange={(e) => setNewJobForm({ ...newJobForm, experienceLevel: e.target.value })}
                    >
                      <option value="ENTRY_LEVEL">Entry Level</option>
                      <option value="MID_LEVEL">Mid Level</option>
                      <option value="SENIOR_LEVEL">Senior Level</option>
                      <option value="LEAD_EXECUTIVE">Lead / Executive</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Min Salary (USD / yr)</label>
                    <input
                      type="number"
                      step="5000"
                      className="form-control"
                      value={newJobForm.salaryMin}
                      onChange={(e) => setNewJobForm({ ...newJobForm, salaryMin: Number(e.target.value) })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Max Salary (USD / yr)</label>
                    <input
                      type="number"
                      step="5000"
                      className="form-control"
                      value={newJobForm.salaryMax}
                      onChange={(e) => setNewJobForm({ ...newJobForm, salaryMax: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Stack Tags (Comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. React, TypeScript, GraphQL, Rust"
                    value={newJobForm.tags}
                    onChange={(e) => setNewJobForm({ ...newJobForm, tags: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Job Description *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Describe the mission, challenges, and team responsibilities..."
                    value={newJobForm.description}
                    onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Requirements & Qualifications *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="List required technical skills, years of experience..."
                    value={newJobForm.requirements}
                    onChange={(e) => setNewJobForm({ ...newJobForm, requirements: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowPostModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                    Publish Opening
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
