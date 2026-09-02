import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpDown,
  Building,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function Jobs({ onApplyJob, savedJobIds, onToggleSave }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const selectedParamId = searchParams.get('selected');

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'salary' | 'applicants'

  // Modal Detail State
  const [activeJobDetail, setActiveJobDetail] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [searchTerm]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getAllJobs(searchTerm);
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  // If selectedParamId is provided, open detail modal
  useEffect(() => {
    if (selectedParamId && jobs.length > 0) {
      const found = jobs.find(j => j.id === Number(selectedParamId));
      if (found) setActiveJobDetail(found);
    }
  }, [selectedParamId, jobs]);

  const toggleTypeFilter = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleLevelFilter = (lvl) => {
    setSelectedLevels(prev => 
      prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedLevels([]);
    setMinSalary(0);
    setSearchTerm('');
    setSearchParams({});
  };

  // Filter and Sort Logic
  const filteredJobs = jobs.filter(job => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(job.jobType)) {
      return false;
    }
    if (selectedLevels.length > 0 && !selectedLevels.includes(job.experienceLevel)) {
      return false;
    }
    if (minSalary > 0 && job.salaryMax < minSalary) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'salary') {
      return b.salaryMax - a.salaryMax;
    }
    if (sortBy === 'applicants') {
      return (b.applicantsCount || 0) - (a.applicantsCount || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="app-container">
        
        {/* Header Title */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
            <Layers size={13} />
            Job Marketplace
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Explore Open Engineering Roles</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Browse {jobs.length} high-growth technology positions with transparent compensation and direct recruiter pipelines.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div 
          className="glass-panel"
          style={{
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Search Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 320px' }}>
            <Search size={20} color="#818cf8" />
            <input
              type="text"
              placeholder="Search by role, stack (React, Node, Rust), company..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchParams(e.target.value ? { search: e.target.value } : {});
              }}
              className="form-control"
              style={{ border: 'none', background: 'transparent', padding: '8px 0', fontSize: '1rem' }}
            />
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams({});
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', background: 'rgba(15, 23, 42, 0.9)' }}
            >
              <option value="latest">Newest First</option>
              <option value="salary">Highest Compensation</option>
              <option value="applicants">Most In Demand</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Jobs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '28px', alignItems: 'start' }} className="jobs-layout-grid">
          
          {/* Filters Sidebar */}
          <aside className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '94px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                <Filter size={18} color="#818cf8" />
                <span>Filters</span>
              </div>
              <button 
                onClick={clearFilters}
                style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>

            {/* Employment Type */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Workplace & Type
              </div>
              {[
                { id: 'FULL_TIME', label: 'Full-Time' },
                { id: 'REMOTE', label: 'Remote' },
                { id: 'CONTRACT', label: 'Contract' },
                { id: 'INTERNSHIP', label: 'Internship' }
              ].map(item => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(item.id)}
                    onChange={() => toggleTypeFilter(item.id)}
                    style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* Experience Level */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Experience Level
              </div>
              {[
                { id: 'ENTRY_LEVEL', label: 'Entry Level' },
                { id: 'MID_LEVEL', label: 'Mid-Level' },
                { id: 'SENIOR_LEVEL', label: 'Senior Level' },
                { id: 'LEAD_EXECUTIVE', label: 'Lead / Executive' }
              ].map(item => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(item.id)}
                    onChange={() => toggleLevelFilter(item.id)}
                    style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* Minimum Salary Slider */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Min Salary
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
                  ${minSalary / 1000}k+
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>
          </aside>

          {/* Jobs Listing */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing <strong style={{ color: '#fff' }}>{filteredJobs.length}</strong> matching positions
              </span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
                <Briefcase size={44} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No matching positions found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Try adjusting your keywords or clearing the active filters.
                </p>
                <button onClick={clearFilters} className="btn btn-secondary btn-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={(j) => setActiveJobDetail(j)}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={onToggleSave}
                    onApplyDirect={onApplyJob}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Job Slide-over / Modal */}
        {activeJobDetail && (
          <div className="modal-overlay" onClick={() => setActiveJobDetail(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#818cf8'
                  }}>
                    {activeJobDetail.company.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {activeJobDetail.company}
                    </div>
                    <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>{activeJobDetail.title}</h2>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveJobDetail(null)} 
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '8px', borderRadius: '50%' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chips row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="badge badge-primary">{activeJobDetail.jobType}</span>
                <span className="badge badge-neutral">{activeJobDetail.experienceLevel}</span>
                <span className="badge badge-success" style={{ fontWeight: 800 }}>
                  ${Math.round(activeJobDetail.salaryMin / 1000)}k - ${Math.round(activeJobDetail.salaryMax / 1000)}k / year
                </span>
                <span className="badge badge-neutral">📍 {activeJobDetail.location}</span>
              </div>

              {/* Job Description */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>About the Role</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {activeJobDetail.description}
                </p>
              </div>

              {/* Requirements */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>Key Requirements & Qualifications</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {activeJobDetail.requirements}
                </p>
              </div>

              {/* Benefits */}
              {activeJobDetail.benefits && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>Perks & Benefits</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {activeJobDetail.benefits}
                  </p>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  onClick={() => onToggleSave(activeJobDetail.id)}
                  className="btn btn-secondary"
                >
                  {savedJobIds.includes(activeJobDetail.id) ? "Bookmarked ✓" : "Bookmark"}
                </button>
                <button
                  onClick={() => {
                    const target = activeJobDetail;
                    setActiveJobDetail(null);
                    onApplyJob(target);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  <Sparkles size={16} />
                  Apply for this Role
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
