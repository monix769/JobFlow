import React from 'react';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Users, 
  Building, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function JobCard({ job, onSelect, isSaved, onToggleSave, onApplyDirect }) {
  const formatSalary = (min, max, currency = 'USD') => {
    const symbol = currency === 'USD' ? '$' : currency;
    const minK = Math.round(min / 1000);
    const maxK = Math.round(max / 1000);
    return `${symbol}${minK}k - ${symbol}${maxK}k / yr`;
  };

  const getJobTypeBadge = (type) => {
    switch (type) {
      case 'REMOTE':
        return <span className="badge badge-success">Remote</span>;
      case 'FULL_TIME':
        return <span className="badge badge-primary">Full-Time</span>;
      case 'CONTRACT':
        return <span className="badge badge-warning">Contract</span>;
      case 'INTERNSHIP':
        return <span className="badge badge-info">Internship</span>;
      default:
        return <span className="badge badge-neutral">{type}</span>;
    }
  };

  const tagsList = job.tags ? job.tags.split(',').map(t => t.trim()) : [];

  return (
    <div 
      className="glass-panel glass-panel-interactive animate-fade-in"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative'
      }}
    >
      <div>
        {/* Header: Company Logo, Info, and Bookmark Button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#818cf8',
              flexShrink: 0
            }}>
              {job.company ? job.company.charAt(0).toUpperCase() : <Building size={20} />}
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {job.company}
              </div>
              <h3 
                onClick={() => onSelect(job)} 
                style={{ 
                  fontSize: '1.15rem', 
                  cursor: 'pointer',
                  color: '#ffffff',
                  marginTop: '2px',
                  lineHeight: '1.3'
                }}
              >
                {job.title}
              </h3>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '8px',
              borderRadius: '50%',
              color: isSaved ? '#f59e0b' : 'var(--text-dim)',
              background: isSaved ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: isSaved ? 'rgba(245, 158, 11, 0.3)' : 'transparent'
            }}
            title={isSaved ? "Saved" : "Save Job"}
          >
            <Bookmark size={17} fill={isSaved ? "#f59e0b" : "none"} />
          </button>
        </div>

        {/* Location & Salary Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <MapPin size={15} color="#94a3b8" />
            <span>{job.location}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
            <DollarSign size={15} />
            <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <Users size={14} />
            <span>{job.applicantsCount || 0} applicants</span>
          </div>
        </div>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5'
        }}>
          {job.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {getJobTypeBadge(job.jobType)}
          {tagsList.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              {tag}
            </span>
          ))}
          {tagsList.length > 3 && (
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              +{tagsList.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <button
          onClick={() => onSelect(job)}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.85rem' }}
        >
          View Details
        </button>

        <button
          onClick={() => onApplyDirect(job)}
          className="btn btn-primary btn-sm"
          style={{ fontSize: '0.85rem' }}
        >
          <Sparkles size={14} />
          Quick Apply
        </button>
      </div>
    </div>
  );
}
