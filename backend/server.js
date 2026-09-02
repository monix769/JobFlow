const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database matching jobflow.sql
const SEED_DATA = {
  users: [
    {
      id: 1,
      fullName: "Alex Morgan",
      email: "alex.candidate@jobflow.dev",
      role: "CANDIDATE",
      companyName: null,
      headline: "Senior Full-Stack & React Engineer",
      location: "San Francisco, CA (Remote)",
      bio: "Passionate full-stack developer with 5+ years building reactive web applications and distributed cloud systems.",
      skills: "React, TypeScript, Node.js, Spring Boot, PostgreSQL, Docker, TailwindCSS",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      fullName: "Sarah Jenkins",
      email: "sarah.recruiter@stripe.com",
      role: "RECRUITER",
      companyName: "Stripe",
      headline: "Head of Technical Recruiting @ Stripe",
      location: "San Francisco, CA",
      bio: "Connecting world-class engineering talent with core infrastructure and fintech products.",
      skills: "Technical Recruiting, Fintech, Executive Search, Talent Strategy",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      fullName: "Marcus Vance",
      email: "marcus.recruiter@linear.app",
      role: "RECRUITER",
      companyName: "Linear",
      headline: "Engineering Talent Partner @ Linear",
      location: "New York, NY",
      bio: "Building the future of software project tools with top product designers and systems architects.",
      skills: "Product Recruiting, Design Engineering, Distributed Teams",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  ],
  jobs: [
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
  ],
  applications: [
    {
      id: 1,
      jobId: 1,
      candidateId: 1,
      fullName: "Alex Morgan",
      email: "alex.candidate@jobflow.dev",
      phone: "+1 (555) 349-2910",
      portfolioUrl: "https://alexmorgan.dev",
      resumeName: "Alex_Morgan_Senior_Frontend_Resume.pdf",
      coverLetter: "I have built enterprise design systems and high-scale dashboard tools that handled over 50M monthly pageviews. Stripe has always been my benchmark for developer ergonomics and technical rigor.",
      status: "INTERVIEW",
      rating: 5,
      recruiterNotes: "Exceptional portfolio, strong alignment with Stripe design system standards. Scheduled for round 2 technical loop.",
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
      coverLetter: "Huge fan of Next.js and Edge runtime innovations. I would love to contribute to developer experience tools.",
      status: "SCREENING",
      rating: 4,
      recruiterNotes: "Solid background in Next.js and React server components. Resume passed automated screening.",
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
      coverLetter: "10+ years engineering user interfaces, micro-frontend orchestration, and WebGL visualizations.",
      status: "APPLIED",
      rating: 4,
      recruiterNotes: "Impressive background at scale.",
      appliedAt: "2026-08-27T11:00:00Z"
    }
  ]
};

// Database helper functions
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database file, resetting to seeds:', err);
  }
  saveDB(SEED_DATA);
  return SEED_DATA;
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// Root Health & API Explorer
app.get('/', (req, res) => {
  const db = loadDB();
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      status: "online",
      message: "JobFlow Backend REST API",
      port: PORT,
      database: {
        jobs: db.jobs.length,
        users: db.users.length,
        applications: db.applications.length
      },
      endpoints: [
        "/api/jobs",
        "/api/jobs/:id",
        "/api/jobs/recruiter/:recruiterId",
        "/api/applications/candidate/:candidateId",
        "/api/applications/recruiter/:recruiterId",
        "/api/auth/login",
        "/api/auth/register"
      ]
    });
  }

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JobFlow Backend API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #07090e; color: #f8fafc; padding: 40px 20px; line-height: 1.5; }
          .card { background: #0e131f; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 30px; max-width: 620px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h1 { color: #ffffff; margin-bottom: 6px; font-size: 1.6rem; }
          h1 span { color: #818cf8; }
          a { color: #818cf8; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
          .badge { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; display: inline-block; margin-bottom: 20px; }
          .stats { display: flex; gap: 14px; margin: 20px 0; }
          .stat-box { flex: 1; background: rgba(255,255,255,0.04); padding: 12px; border-radius: 8px; text-align: center; }
          .stat-num { font-size: 1.3rem; font-weight: 800; color: #fff; }
          .stat-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; }
          ul { list-style: none; padding: 0; margin-top: 14px; }
          li { padding: 10px 12px; background: rgba(0,0,0,0.25); border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
          .btn-front { display: block; text-align: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Job<span>Flow</span> Backend REST API</h1>
          <span class="badge">● Server Active & Running on Port 8080</span>
          
          <div class="stats">
            <div class="stat-box">
              <div class="stat-num">${db.jobs.length}</div>
              <div class="stat-label">Active Jobs</div>
            </div>
            <div class="stat-box">
              <div class="stat-num">${db.users.length}</div>
              <div class="stat-label">Users</div>
            </div>
            <div class="stat-box">
              <div class="stat-num">${db.applications.length}</div>
              <div class="stat-label">Applications</div>
            </div>
          </div>

          <h3 style="margin-top: 20px; font-size: 1rem; color: #e2e8f0;">Quick API Endpoints:</h3>
          <ul>
            <li><span>All Active Jobs</span> <a href="/api/jobs" target="_blank">/api/jobs →</a></li>
            <li><span>Candidate Applications</span> <a href="/api/applications/candidate/1" target="_blank">/api/applications/candidate/1 →</a></li>
            <li><span>Recruiter Applications</span> <a href="/api/applications/recruiter/2" target="_blank">/api/applications/recruiter/2 →</a></li>
          </ul>

          <a href="http://localhost:5173" class="btn-front" target="_blank">Open Frontend UI (http://localhost:5173) 🚀</a>
        </div>
      </body>
    </html>
  `);
});

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const db = loadDB();
  const { fullName, email, password, role, companyName, headline } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(400).json({ message: "Email is already registered" });

  const newUser = {
    id: Date.now(),
    fullName: fullName || "User",
    email,
    role: role || "CANDIDATE",
    companyName: companyName || null,
    headline: headline || "Professional",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  };

  db.users.push(newUser);
  saveDB(db);
  res.json({ token: `jwt_${newUser.id}`, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const db = loadDB();
  const { email, password } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  res.json({ token: `jwt_${user.id}`, user });
});

app.get('/api/auth/me/:id', (req, res) => {
  const db = loadDB();
  const user = db.users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// --- JOBS ROUTES ---
app.get('/api/jobs', (req, res) => {
  const db = loadDB();
  const { search } = req.query;
  if (!search) return res.json(db.jobs.filter(j => j.status === 'ACTIVE'));

  const q = search.toLowerCase();
  const filtered = db.jobs.filter(j => 
    j.status === 'ACTIVE' && (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      (j.tags && j.tags.toLowerCase().includes(q))
    )
  );
  res.json(filtered);
});

app.get('/api/jobs/:id', (req, res) => {
  const db = loadDB();
  const job = db.jobs.find(j => j.id === Number(req.params.id));
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

app.get('/api/jobs/recruiter/:recruiterId', (req, res) => {
  const db = loadDB();
  const recruiterJobs = db.jobs.filter(j => j.recruiterId === Number(req.params.recruiterId));
  res.json(recruiterJobs);
});

app.post('/api/jobs/recruiter/:recruiterId', (req, res) => {
  const db = loadDB();
  const recruiterId = Number(req.params.recruiterId);
  const newJob = {
    ...req.body,
    id: Date.now(),
    recruiterId,
    applicantsCount: 0,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };
  db.jobs.unshift(newJob);
  saveDB(db);
  res.json(newJob);
});

app.put('/api/jobs/:id', (req, res) => {
  const db = loadDB();
  const id = Number(req.params.id);
  const idx = db.jobs.findIndex(j => j.id === id);
  if (idx === -1) return res.status(404).json({ message: "Job not found" });

  db.jobs[idx] = { ...db.jobs[idx], ...req.body };
  saveDB(db);
  res.json(db.jobs[idx]);
});

app.delete('/api/jobs/:id', (req, res) => {
  const db = loadDB();
  const id = Number(req.params.id);
  db.jobs = db.jobs.filter(j => j.id !== id);
  saveDB(db);
  res.json({ message: "Job deleted successfully" });
});

// --- APPLICATIONS ROUTES ---
app.post('/api/applications/apply/candidate/:candidateId/job/:jobId', (req, res) => {
  const db = loadDB();
  const candidateId = Number(req.params.candidateId);
  const jobId = Number(req.params.jobId);

  const existing = db.applications.find(a => a.candidateId === candidateId && a.jobId === jobId);
  if (existing) return res.status(400).json({ message: "You have already applied for this position." });

  const newApp = {
    ...req.body,
    id: Date.now(),
    candidateId,
    jobId,
    status: 'APPLIED',
    rating: 0,
    recruiterNotes: '',
    appliedAt: new Date().toISOString()
  };

  db.applications.unshift(newApp);

  const job = db.jobs.find(j => j.id === jobId);
  if (job) job.applicantsCount = (job.applicantsCount || 0) + 1;

  saveDB(db);
  res.json(newApp);
});

app.get('/api/applications/candidate/:candidateId', (req, res) => {
  const db = loadDB();
  const candidateId = Number(req.params.candidateId);
  const candidateApps = db.applications.filter(a => a.candidateId === candidateId);
  const hydrated = candidateApps.map(a => ({
    ...a,
    job: db.jobs.find(j => j.id === a.jobId)
  }));
  res.json(hydrated);
});

app.get('/api/applications/job/:jobId', (req, res) => {
  const db = loadDB();
  const jobId = Number(req.params.jobId);
  const jobApps = db.applications.filter(a => a.jobId === jobId);
  res.json(jobApps);
});

app.get('/api/applications/recruiter/:recruiterId', (req, res) => {
  const db = loadDB();
  const recruiterId = Number(req.params.recruiterId);
  const recruiterJobs = db.jobs.filter(j => j.recruiterId === recruiterId);
  const recruiterJobIds = recruiterJobs.map(j => j.id);

  const matchingApps = db.applications.filter(a => recruiterJobIds.includes(a.jobId));
  const hydrated = matchingApps.map(app => ({
    ...app,
    job: db.jobs.find(j => j.id === app.jobId)
  }));
  res.json(hydrated);
});

app.patch('/api/applications/:id/status', (req, res) => {
  const db = loadDB();
  const id = Number(req.params.id);
  const appItem = db.applications.find(a => a.id === id);
  if (!appItem) return res.status(404).json({ message: "Application not found" });

  const { status, recruiterNotes, rating } = req.body;
  if (status !== undefined) appItem.status = status;
  if (recruiterNotes !== undefined) appItem.recruiterNotes = recruiterNotes;
  if (rating !== undefined) appItem.rating = rating;

  saveDB(db);
  res.json(appItem);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 JobFlow Backend API & Database Server running on http://localhost:${PORT}`);
});
