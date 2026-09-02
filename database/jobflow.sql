-- ==========================================================
-- JobFlow Database Schema & Seed Data
-- Full-Stack Job Application & Recruitment Management System
-- ==========================================================

CREATE DATABASE IF NOT EXISTS jobflow_db;
USE jobflow_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CANDIDATE', 'RECRUITER', 'ADMIN') NOT NULL DEFAULT 'CANDIDATE',
    company_name VARCHAR(150),
    headline VARCHAR(200),
    location VARCHAR(100),
    bio TEXT,
    skills VARCHAR(500),
    avatar_url VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    company_logo VARCHAR(300),
    department VARCHAR(100),
    location VARCHAR(100) NOT NULL,
    job_type ENUM('FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
    experience_level ENUM('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'LEAD_EXECUTIVE') NOT NULL DEFAULT 'MID_LEVEL',
    salary_min INT NOT NULL,
    salary_max INT NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    benefits TEXT,
    tags VARCHAR(300),
    status ENUM('ACTIVE', 'PAUSED', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    applicants_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    portfolio_url VARCHAR(300),
    resume_name VARCHAR(200) NOT NULL,
    resume_url VARCHAR(500),
    cover_letter TEXT,
    status ENUM('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED') NOT NULL DEFAULT 'APPLIED',
    rating INT DEFAULT 0,
    recruiter_notes TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_job_candidate UNIQUE (job_id, candidate_id)
);

-- 4. Saved Jobs Table (Candidate Bookmarks)
CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_saved_job UNIQUE (user_id, job_id)
);

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- Insert Users (Passwords are bcrypt hashes of 'password123')
INSERT INTO users (id, full_name, email, password, role, company_name, headline, location, bio, skills, avatar_url)
VALUES 
(1, 'Alex Morgan', 'alex.candidate@jobflow.dev', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE', NULL, 'Senior Full-Stack & React Engineer', 'San Francisco, CA (Remote)', 'Passionate full-stack developer with 5+ years building reactive web applications and distributed cloud systems.', 'React, TypeScript, Node.js, Spring Boot, PostgreSQL, Docker, TailwindCSS', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
(2, 'Sarah Jenkins', 'sarah.recruiter@stripe.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'RECRUITER', 'Stripe', 'Head of Technical Recruiting @ Stripe', 'San Francisco, CA', 'Connecting world-class engineering talent with core infrastructure and fintech products.', 'Technical Recruiting, Fintech, Executive Search, Talent Strategy', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
(3, 'Marcus Vance', 'marcus.recruiter@linear.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'RECRUITER', 'Linear', 'Engineering Talent Partner @ Linear', 'New York, NY', 'Building the future of software project tools with top product designers and systems architects.', 'Product Recruiting, Design Engineering, Distributed Teams', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');

-- Insert Job Postings
INSERT INTO jobs (id, recruiter_id, title, company, company_logo, department, location, job_type, experience_level, salary_min, salary_max, currency, description, requirements, benefits, tags, status, applicants_count)
VALUES 
(1, 2, 'Senior Frontend Architect', 'Stripe', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Engineering', 'San Francisco, CA (Hybrid)', 'FULL_TIME', 'SENIOR_LEVEL', 160000, 210000, 'USD', 
'Join Stripe to shape the next generation of global economic infrastructure. As a Senior Frontend Architect, you will lead the architecture of developer-facing dashboards and high-volume checkout components.',
'5+ years building complex web applications with React/TypeScript; Deep expertise in state management, web vitals, and micro-frontends; Experience with design systems at scale.',
'Comprehensive healthcare, $5,000 yearly learning stipend, 401(k) match 5%, generous equity grants, flexible time off.',
'React, TypeScript, CSS Architecture, Performance, Design Systems', 'ACTIVE', 14),

(2, 3, 'Principal Systems Engineer (Distributed Systems)', 'Linear', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Core Platform', 'Remote (Global)', 'REMOTE', 'LEAD_EXECUTIVE', 190000, 245000, 'USD', 
'Linear is looking for a Principal Systems Engineer to build real-time sync protocols, low-latency CRDT synchronization engines, and high-throughput backend APIs.',
'Extensive experience with distributed consensus, WebSockets, Rust/Node/Java; Proven track record scaling real-time collaboration applications to millions of active sessions.',
'Remote-first culture, home office setup budget ($3,000), wellness allowance, company offsites in Europe & Japan.',
'Distributed Systems, Real-Time Sync, WebSockets, Java, Rust', 'ACTIVE', 8),

(3, 2, 'Full-Stack Product Engineer', 'Vercel', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80', 'Developer Experience', 'Remote (US/EU)', 'FULL_TIME', 'MID_LEVEL', 135000, 175000, 'USD', 
'Help developers push code to millions in seconds. You will build user-facing preview workflows, telemetry metrics, and AI deployment tooling on Next.js platform.',
'3+ years with modern JavaScript/TypeScript, Next.js, and serverless architectures; Strong UI taste and empathy for developer tooling.',
'Competitive salary, equity package, unlimited PTO, top-tier health coverage, annual company retreats.',
'Next.js, TypeScript, Serverless, TailwindCSS, Edge Computing', 'ACTIVE', 21),

(4, 3, 'DevOps & Cloud Security Specialist', 'Airbnb', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80', 'Cloud Infrastructure', 'Seattle, WA (Hybrid)', 'FULL_TIME', 'SENIOR_LEVEL', 155000, 205000, 'USD', 
'Manage mission-critical multi-region AWS and Kubernetes clusters powering Airbnb global travel search and bookings.',
'Strong knowledge of Kubernetes, Terraform, AWS IAM, zero-trust network models, and automated CI/CD pipelines.',
'Travel credits ($2,000/yr), comprehensive medical/dental/vision, parental leave, on-site gourmet meals.',
'AWS, Kubernetes, Terraform, Docker, Zero-Trust, CI/CD', 'ACTIVE', 6);

-- Insert Sample Applications
INSERT INTO applications (id, job_id, candidate_id, full_name, email, phone, portfolio_url, resume_name, resume_url, cover_letter, status, rating, recruiter_notes, applied_at)
VALUES 
(1, 1, 1, 'Alex Morgan', 'alex.candidate@jobflow.dev', '+1 (555) 349-2910', 'https://alexmorgan.dev', 'Alex_Morgan_Senior_Frontend_Resume.pdf', '#', 'I have built enterprise design systems and high-scale dashboard tools that handled over 50M monthly pageviews. Stripe has always been my benchmark for developer ergonomics and technical rigor.', 'INTERVIEW', 5, 'Exceptional portfolio, strong alignment with Stripe design system standards. Scheduled for round 2 technical loop.', '2026-08-20 14:32:00'),
(2, 3, 1, 'Alex Morgan', 'alex.candidate@jobflow.dev', '+1 (555) 349-2910', 'https://alexmorgan.dev', 'Alex_Morgan_Resume_2026.pdf', '#', 'Huge fan of Next.js and Edge runtime innovations. I would love to contribute to developer experience tools.', 'SCREENING', 4, 'Solid background in Next.js and React server components. Resume passed automated screening.', '2026-08-25 09:15:00');

-- Insert Saved Jobs for Candidate
INSERT INTO saved_jobs (id, user_id, job_id, saved_at)
VALUES 
(1, 1, 2, '2026-08-21 10:00:00'),
(2, 1, 4, '2026-08-22 16:45:00');
