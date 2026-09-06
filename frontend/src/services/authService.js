import API_URL from '../config/api';

// Auth Service with Dual Mode (Backend API + Instant Local Storage Fallback)

const INITIAL_USERS = [
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
];

const initStorage = () => {
  if (!localStorage.getItem('jobflow_users')) {
    localStorage.setItem('jobflow_users', JSON.stringify(INITIAL_USERS));
  }

  if (!localStorage.getItem('jobflow_current_user')) {
    // Default logged in as candidate Alex Morgan for immediate preview
    localStorage.setItem(
      'jobflow_current_user',
      JSON.stringify(INITIAL_USERS[0])
    );

    localStorage.setItem(
      'jobflow_token',
      'mock_jwt_token_alex_morgan_candidate'
    );
  }
};

initStorage();

export const authService = {
  getCurrentUser: () => {
    const user = localStorage.getItem('jobflow_current_user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('jobflow_token');
  },

  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();

        localStorage.setItem('jobflow_token', data.token);
        localStorage.setItem(
          'jobflow_current_user',
          JSON.stringify(data.user)
        );

        return data.user;
      }
    } catch (e) {
      console.warn(
        "Backend API unavailable, using local mock auth store."
      );
    }

    // Local Fallback
    const users = JSON.parse(
      localStorage.getItem('jobflow_users') || '[]'
    );

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (user) {
      localStorage.setItem(
        'jobflow_token',
        `mock_jwt_token_${user.id}`
      );

      localStorage.setItem(
        'jobflow_current_user',
        JSON.stringify(user)
      );

      return user;
    }

    throw new Error(
      'Invalid email or password. You can use the 1-click demo buttons below!'
    );
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        const data = await res.json();

        localStorage.setItem('jobflow_token', data.token);

        localStorage.setItem(
          'jobflow_current_user',
          JSON.stringify(data.user)
        );

        return data.user;
      }
    } catch (e) {
      console.warn(
        "Backend API unavailable, saving registered user locally."
      );
    }

    // Local Fallback
    const users = JSON.parse(
      localStorage.getItem('jobflow_users') || '[]'
    );

    if (
      users.find(
        u => u.email.toLowerCase() === userData.email.toLowerCase()
      )
    ) {
      throw new Error('Email is already registered');
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      avatarUrl:
        userData.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    };

    users.push(newUser);

    localStorage.setItem(
      'jobflow_users',
      JSON.stringify(users)
    );

    localStorage.setItem(
      'jobflow_token',
      `mock_jwt_token_${newUser.id}`
    );

    localStorage.setItem(
      'jobflow_current_user',
      JSON.stringify(newUser)
    );

    return newUser;
  },

  switchDemoUser: (role) => {
    const users = JSON.parse(
      localStorage.getItem('jobflow_users') || '[]'
    );

    const targetUser =
      users.find(u => u.role === role) ||
      INITIAL_USERS.find(u => u.role === role);

    if (targetUser) {
      localStorage.setItem(
        'jobflow_current_user',
        JSON.stringify(targetUser)
      );

      localStorage.setItem(
        'jobflow_token',
        `mock_jwt_token_${targetUser.id}`
      );

      return targetUser;
    }

    return null;
  },

  updateProfile: (updatedProfile) => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const merged = {
      ...currentUser,
      ...updatedProfile
    };

    localStorage.setItem(
      'jobflow_current_user',
      JSON.stringify(merged)
    );

    const users = JSON.parse(
      localStorage.getItem('jobflow_users') || '[]'
    );

    const updatedUsers = users.map(user =>
      user.id === merged.id ? merged : user
    );

    localStorage.setItem(
      'jobflow_users',
      JSON.stringify(updatedUsers)
    );

    return merged;
  },

  logout: () => {
    localStorage.removeItem('jobflow_token');
    localStorage.removeItem('jobflow_current_user');
  }
};