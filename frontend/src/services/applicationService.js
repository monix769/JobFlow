import API_URL from '../config/api';

// Application Service with Candidate Application Submission & Recruiter Stage Management

const INITIAL_APPLICATIONS = [
  {
    id: 1,
    jobId: 1,
    candidateId: 1,
    fullName: "Alex Morgan",
    email: "alex.candidate@jobflow.dev",
    phone: "+1 (555) 349-2910",
    portfolioUrl: "https://alexmorgan.dev",
    resumeName: "Alex_Morgan_Senior_Frontend_Resume.pdf",
    coverLetter:
      "I have built enterprise design systems and high-scale dashboard tools that handled over 50M monthly pageviews. Stripe has always been my benchmark for developer ergonomics and technical rigor.",
    status: "INTERVIEW",
    rating: 5,
    recruiterNotes:
      "Exceptional portfolio, strong alignment with Stripe design system standards. Scheduled for round 2 technical loop.",
    appliedAt: "2026-08-20T14:32:00Z"
  },
  {
    id: 2,
    jobId: 3,
    candidateId: 1,
    fullName: "Alex Morgan",
    email: "alex.candidate@jobflow.dev",
    phone: "+1 (555) 349-2910",
    portfolioUrl: "https://alexmorgan.dev",
    resumeName: "Alex_Morgan_Resume_2026.pdf",
    coverLetter:
      "Huge fan of Next.js and Edge runtime innovations. I would love to contribute to developer experience tools.",
    status: "SCREENING",
    rating: 4,
    recruiterNotes:
      "Solid background in Next.js and React server components. Resume passed automated screening.",
    appliedAt: "2026-08-25T09:15:00Z"
  },
  {
    id: 3,
    jobId: 1,
    candidateId: 99,
    fullName: "Elena Rostova",
    email: "elena.rostova@engineer.io",
    phone: "+1 (555) 912-4412",
    portfolioUrl: "https://elenarostova.dev",
    resumeName: "Elena_Rostova_Staff_UI_Resume.pdf",
    coverLetter:
      "10+ years engineering user interfaces, micro-frontend orchestration, and WebGL visualizations.",
    status: "APPLIED",
    rating: 4,
    recruiterNotes: "Impressive background at scale.",
    appliedAt: "2026-08-27T11:00:00Z"
  }
];

const initApplications = () => {
  if (!localStorage.getItem('jobflow_applications')) {
    localStorage.setItem(
      'jobflow_applications',
      JSON.stringify(INITIAL_APPLICATIONS)
    );
  }
};

initApplications();

export const applicationService = {
  apply: async (candidateId, jobId, applicationData) => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications/apply/candidate/${candidateId}/job/${jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(applicationData)
        }
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local application storage.");
    }

    const apps = JSON.parse(
      localStorage.getItem('jobflow_applications') || '[]'
    );

    const existing = apps.find(
      a =>
        a.candidateId === Number(candidateId) &&
        a.jobId === Number(jobId)
    );

    if (existing) {
      throw new Error(
        'You have already submitted an application for this position.'
      );
    }

    const newApp = {
      ...applicationData,
      id: Date.now(),
      candidateId: Number(candidateId),
      jobId: Number(jobId),
      status: 'APPLIED',
      rating: 0,
      recruiterNotes: '',
      appliedAt: new Date().toISOString()
    };

    apps.unshift(newApp);

    localStorage.setItem(
      'jobflow_applications',
      JSON.stringify(apps)
    );

    // Increment applicantsCount on local job
    const jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    const jobIndex = jobs.findIndex(
      j => j.id === Number(jobId)
    );

    if (jobIndex !== -1) {
      jobs[jobIndex].applicantsCount =
        (jobs[jobIndex].applicantsCount || 0) + 1;

      localStorage.setItem(
        'jobflow_jobs',
        JSON.stringify(jobs)
      );
    }

    return newApp;
  },

  getCandidateApplications: async (candidateId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications/candidate/${candidateId}`
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local application storage.");
    }

    const apps = JSON.parse(
      localStorage.getItem('jobflow_applications') || '[]'
    );

    const candidateApps = apps.filter(
      a => a.candidateId === Number(candidateId)
    );

    // Hydrate with job details
    const jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    return candidateApps.map(app => {
      const job = jobs.find(
        j => j.id === app.jobId
      );

      return {
        ...app,
        job
      };
    });
  },

  getJobApplications: async (jobId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications/job/${jobId}`
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local application storage.");
    }

    const apps = JSON.parse(
      localStorage.getItem('jobflow_applications') || '[]'
    );

    return apps.filter(
      a => a.jobId === Number(jobId)
    );
  },

  getAllApplicationsForRecruiter: async (recruiterId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications/recruiter/${recruiterId}`
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local application storage.");
    }

    const jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    const recruiterJobs = jobs.filter(
      j => j.recruiterId === Number(recruiterId)
    );

    const recruiterJobIds = recruiterJobs.map(
      j => j.id
    );

    const apps = JSON.parse(
      localStorage.getItem('jobflow_applications') || '[]'
    );

    const matchingApps = apps.filter(
      a => recruiterJobIds.includes(a.jobId)
    );

    return matchingApps.map(app => {
      const job = jobs.find(
        j => j.id === app.jobId
      );

      return {
        ...app,
        job
      };
    });
  },

  updateStatus: async (
    applicationId,
    status,
    recruiterNotes,
    rating
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications/${applicationId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status,
            recruiterNotes,
            rating
          })
        }
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local application storage.");
    }

    const apps = JSON.parse(
      localStorage.getItem('jobflow_applications') || '[]'
    );

    const index = apps.findIndex(
      a => a.id === Number(applicationId)
    );

    if (index !== -1) {
      if (status !== undefined) {
        apps[index].status = status;
      }

      if (recruiterNotes !== undefined) {
        apps[index].recruiterNotes = recruiterNotes;
      }

      if (rating !== undefined) {
        apps[index].rating = rating;
      }

      localStorage.setItem(
        'jobflow_applications',
        JSON.stringify(apps)
      );

      return apps[index];
    }

    throw new Error('Application not found');
  }
};