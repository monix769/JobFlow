import API_URL from '../config/api';

// Job Service with Search, Filter, CRUD & Bookmarking

const INITIAL_JOBS = [
  {
    id: 1,
    recruiterId: 2,
    title: "Senior Frontend Architect",
    company: "Stripe",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    department: "Engineering",
    location: "San Francisco, CA (Hybrid)",
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR_LEVEL",
    salaryMin: 160000,
    salaryMax: 210000,
    currency: "USD",
    description: "Join Stripe to shape the next generation of global economic infrastructure. As a Senior Frontend Architect, you will lead the architecture of developer-facing dashboards, performance telemetry, and high-volume checkout micro-frontends.",
    requirements: "5+ years building complex web applications with React/TypeScript; Deep expertise in state management, web vitals, and design systems at scale; Passion for developer experience.",
    benefits: "Comprehensive healthcare, $5,000 yearly learning stipend, 401(k) match 5%, generous equity grants, flexible time off.",
    tags: "React, TypeScript, CSS Architecture, Performance, Design Systems",
    status: "ACTIVE",
    applicantsCount: 14,
    createdAt: "2026-08-15T10:00:00Z"
  },
  {
    id: 2,
    recruiterId: 3,
    title: "Principal Systems Engineer (Distributed Sync)",
    company: "Linear",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80",
    department: "Core Platform",
    location: "Remote (Global)",
    jobType: "REMOTE",
    experienceLevel: "LEAD_EXECUTIVE",
    salaryMin: 190000,
    salaryMax: 245000,
    currency: "USD",
    description: "Linear is looking for a Principal Systems Engineer to build real-time sync protocols, low-latency CRDT synchronization engines, and high-throughput backend APIs.",
    requirements: "Extensive experience with distributed consensus, WebSockets, Rust/Node/Java; Proven track record scaling real-time collaboration applications to millions of active sessions.",
    benefits: "Remote-first culture, home office setup budget ($3,000), wellness allowance, company offsites in Europe & Japan.",
    tags: "Distributed Systems, Real-Time Sync, WebSockets, Java, Rust",
    status: "ACTIVE",
    applicantsCount: 8,
    createdAt: "2026-08-18T14:30:00Z"
  },
  {
    id: 3,
    recruiterId: 2,
    title: "Full-Stack Product Engineer",
    company: "Vercel",
    companyLogo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80",
    department: "Developer Experience",
    location: "Remote (US/EU)",
    jobType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    salaryMin: 135000,
    salaryMax: 175000,
    currency: "USD",
    description: "Help developers push code to millions in seconds. You will build user-facing preview workflows, telemetry metrics, and AI deployment tooling on Next.js platform.",
    requirements: "3+ years with modern JavaScript/TypeScript, Next.js, and serverless architectures; Strong UI taste and empathy for developer tooling.",
    benefits: "Competitive salary, equity package, unlimited PTO, top-tier health coverage, annual company retreats.",
    tags: "Next.js, TypeScript, Serverless, TailwindCSS, Edge Computing",
    status: "ACTIVE",
    applicantsCount: 21,
    createdAt: "2026-08-20T08:15:00Z"
  },
  {
    id: 4,
    recruiterId: 3,
    title: "DevOps & Cloud Security Specialist",
    company: "Airbnb",
    companyLogo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    department: "Cloud Infrastructure",
    location: "Seattle, WA (Hybrid)",
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR_LEVEL",
    salaryMin: 155000,
    salaryMax: 205000,
    currency: "USD",
    description: "Manage mission-critical multi-region AWS and Kubernetes clusters powering Airbnb global travel search and bookings.",
    requirements: "Strong knowledge of Kubernetes, Terraform, AWS IAM, zero-trust network models, and automated CI/CD pipelines.",
    benefits: "Travel credits ($2,000/yr), comprehensive medical/dental/vision, parental leave, on-site gourmet meals.",
    tags: "AWS, Kubernetes, Terraform, Docker, Zero-Trust, CI/CD",
    status: "ACTIVE",
    applicantsCount: 6,
    createdAt: "2026-08-22T11:45:00Z"
  },
  {
    id: 5,
    recruiterId: 2,
    title: "AI Product Designer & Design Engineer",
    company: "Figma",
    companyLogo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    department: "Product Design",
    location: "San Francisco, CA",
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR_LEVEL",
    salaryMin: 165000,
    salaryMax: 215000,
    currency: "USD",
    description: "Shape the future of intelligent canvas tools. Bridge the gap between interaction design and code with rapid prototyping, web canvas engines, and generative AI interfaces.",
    requirements: "Portfolio showing high-craft UI/UX for complex web apps; Proficiency writing production HTML/CSS/Canvas/React; Intuition for micro-interactions.",
    benefits: "Health & wellness stipends, 401k matching, annual company summits, pet insurance.",
    tags: "Figma, Canvas, React, Design Systems, Generative AI, UX",
    status: "ACTIVE",
    applicantsCount: 19,
    createdAt: "2026-08-26T09:00:00Z"
  },
  {
    id: 6,
    recruiterId: 3,
    title: "Database Reliability & Storage Engineer",
    company: "Supabase",
    companyLogo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    department: "Data Platform",
    location: "Remote (Worldwide)",
    jobType: "REMOTE",
    experienceLevel: "SENIOR_LEVEL",
    salaryMin: 150000,
    salaryMax: 200000,
    currency: "USD",
    description: "Scale open-source PostgreSQL across hundreds of thousands of active tenant clusters. Optimize connection pooling, pgvector embeddings, and real-time streaming replication.",
    requirements: "Deep PostgreSQL internals, WAL replication, Linux kernel tuning, Go or Rust.",
    benefits: "Work from anywhere in the world, $3,000 workstation allowance, async-first team culture.",
    tags: "PostgreSQL, pgvector, Go, Rust, Database Internals, Linux",
    status: "ACTIVE",
    applicantsCount: 11,
    createdAt: "2026-08-28T16:20:00Z"
  }
];

const initJobs = () => {
  if (!localStorage.getItem('jobflow_jobs')) {
    localStorage.setItem('jobflow_jobs', JSON.stringify(INITIAL_JOBS));
  }

  if (!localStorage.getItem('jobflow_saved_jobs')) {
    localStorage.setItem(
      'jobflow_saved_jobs',
      JSON.stringify([2, 4])
    );
  }
};

initJobs();

export const jobService = {
  getAllJobs: async (query = '') => {
    try {
      const url = query
        ? `${API_URL}/api/jobs?search=${encodeURIComponent(query)}`
        : `${API_URL}/api/jobs`;

      const res = await fetch(url);

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local jobs.");
    }

    let jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    if (query) {
      const q = query.toLowerCase();

      jobs = jobs.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          (j.tags && j.tags.toLowerCase().includes(q))
      );
    }

    return jobs;
  },

  getJobById: async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/jobs/${id}`
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local jobs.");
    }

    const jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    return jobs.find(
      j => j.id === Number(id)
    ) || null;
  },

  getJobsByRecruiter: async (recruiterId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/jobs/recruiter/${recruiterId}`
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, using local jobs.");
    }

    const jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    return jobs.filter(
      j => j.recruiterId === Number(recruiterId)
    );
  },

  createJob: async (recruiterId, jobData) => {
    try {
      const res = await fetch(
        `${API_URL}/api/jobs/recruiter/${recruiterId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jobData)
        }
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, creating job locally.");
    }

    const jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    const newJob = {
      ...jobData,
      id: Date.now(),
      recruiterId: Number(recruiterId),
      applicantsCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    jobs.unshift(newJob);

    localStorage.setItem(
      'jobflow_jobs',
      JSON.stringify(jobs)
    );

    return newJob;
  },

  updateJob: async (id, updatedData) => {
    try {
      const res = await fetch(
        `${API_URL}/api/jobs/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        }
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend unavailable, updating job locally.");
    }

    const jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    const index = jobs.findIndex(
      j => j.id === Number(id)
    );

    if (index !== -1) {
      jobs[index] = {
        ...jobs[index],
        ...updatedData
      };

      localStorage.setItem(
        'jobflow_jobs',
        JSON.stringify(jobs)
      );

      return jobs[index];
    }

    throw new Error('Job not found');
  },

  deleteJob: async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/jobs/${id}`,
        {
          method: 'DELETE'
        }
      );

      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn("Backend unavailable, deleting job locally.");
    }

    let jobs = JSON.parse(
      localStorage.getItem('jobflow_jobs') || '[]'
    );

    jobs = jobs.filter(
      j => j.id !== Number(id)
    );

    localStorage.setItem(
      'jobflow_jobs',
      JSON.stringify(jobs)
    );

    return true;
  },

  getSavedJobIds: () => {
    return JSON.parse(
      localStorage.getItem('jobflow_saved_jobs') || '[]'
    );
  },

  toggleSaveJob: (jobId) => {
    const saved = JSON.parse(
      localStorage.getItem('jobflow_saved_jobs') || '[]'
    );

    const numId = Number(jobId);

    let updated;

    if (saved.includes(numId)) {
      updated = saved.filter(
        id => id !== numId
      );
    } else {
      updated = [...saved, numId];
    }

    localStorage.setItem(
      'jobflow_saved_jobs',
      JSON.stringify(updated)
    );

    return updated;
  }
};