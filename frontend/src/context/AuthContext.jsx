import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { ensureMasterDataSeeded, syncEnterpriseMasterData } from '../utils/enterpriseSync';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Pre-defined default system credentials for recognized accounts
export const DEFAULT_USER_PASSWORDS = {
  'admin@skillgap.com': 'AdminPass123!',
  'admin@copilot.com': 'admin123',
  'admin@smartjobadvisor.com': 'AdminPass123!',
  'j.manju.raghvin@gmail.com': 'admin123',
  'manager@skillgap.com': 'Password123!',
  'recruiter@skillgap.com': 'Password123!',
  'recruiter@copilot.com': 'recruiter123',
  'sarah.jenkins@gmail.com': 'recruiter123',
  'user@skillgap.com': 'Password123!',
  'candidate@skillgap.com': 'Password123!',
  'candidate@copilot.com': 'candidate123',
  'devansh.verma@example.com': 'Password123!',
  'rohan.mehta@cloudhire.io': 'Password123!',
  'priya.sharma@aimodels.io': 'Password123!',
  'sarah.johnson@example.com': 'candidate123',
  'sarah.johnson@gmail.com': 'candidate123',
  'abhishek@gmail.com': 'candidate123',
  'omkar.kakumanu17@gmail.com': 'candidate123'
};

export const EMAIL_ALIASES_MAP = {
  'admin@skillgap.com': ['admin@copilot.com', 'admin@smartjobadvisor.com', 'j.manju.raghvin@gmail.com'],
  'admin@copilot.com': ['admin@skillgap.com', 'admin@smartjobadvisor.com', 'j.manju.raghvin@gmail.com'],
  'j.manju.raghvin@gmail.com': ['admin@skillgap.com', 'admin@copilot.com', 'admin@smartjobadvisor.com'],
  'manager@skillgap.com': ['recruiter@skillgap.com', 'recruiter@copilot.com', 'sarah.jenkins@gmail.com'],
  'recruiter@skillgap.com': ['manager@skillgap.com', 'recruiter@copilot.com', 'sarah.jenkins@gmail.com'],
  'recruiter@copilot.com': ['manager@skillgap.com', 'recruiter@skillgap.com', 'sarah.jenkins@gmail.com'],
  'sarah.jenkins@gmail.com': ['manager@skillgap.com', 'recruiter@skillgap.com', 'recruiter@copilot.com'],
  'user@skillgap.com': ['candidate@skillgap.com', 'candidate@copilot.com'],
  'candidate@skillgap.com': ['user@skillgap.com', 'candidate@copilot.com'],
  'candidate@copilot.com': ['user@skillgap.com', 'candidate@skillgap.com', 'sarah.johnson@example.com', 'sarah.johnson@gmail.com'],
  'sarah.johnson@example.com': ['sarah.johnson@gmail.com', 'candidate@copilot.com', 'user@skillgap.com'],
  'sarah.johnson@gmail.com': ['sarah.johnson@example.com', 'candidate@copilot.com', 'user@skillgap.com']
};

export const getUserPassword = (email) => {
  if (!email) return null;
  const clean = email.toLowerCase().trim();
  try {
    const passwords = JSON.parse(localStorage.getItem('skillgap_user_passwords') || '{}');
    if (passwords[clean]) return passwords[clean];
    const rcPass = localStorage.getItem('rc_password_' + clean);
    if (rcPass) return rcPass;
    if (DEFAULT_USER_PASSWORDS[clean]) return DEFAULT_USER_PASSWORDS[clean];
    // Check aliases
    const aliases = EMAIL_ALIASES_MAP[clean] || [];
    for (const a of aliases) {
      if (passwords[a]) return passwords[a];
      if (DEFAULT_USER_PASSWORDS[a]) return DEFAULT_USER_PASSWORDS[a];
    }
  } catch (err) {
    console.warn('Error reading user password:', err);
  }
  return DEFAULT_USER_PASSWORDS[clean] || null;
};

export const setUserPassword = (email, newPassword) => {
  if (!email || !newPassword) return false;
  const clean = email.toLowerCase().trim();
  try {
    const passwords = JSON.parse(localStorage.getItem('skillgap_user_passwords') || '{}');
    passwords[clean] = newPassword;
    localStorage.setItem('rc_password_' + clean, newPassword);

    const aliases = EMAIL_ALIASES_MAP[clean] || [];
    for (const a of aliases) {
      passwords[a] = newPassword;
      localStorage.setItem('rc_password_' + a, newPassword);
    }
    localStorage.setItem('skillgap_user_passwords', JSON.stringify(passwords));
    return true;
  } catch (err) {
    console.warn('Error setting user password:', err);
    return false;
  }
};

export const verifyUserPassword = (email, inputPassword) => {
  if (!email || !inputPassword) return false;
  const stored = getUserPassword(email);
  if (!stored) {
    return false;
  }
  return stored === inputPassword;
};

export const getStoredProfileByEmail = (email) => {
  if (!email) return null;
  try {
    const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
    return db[email.toLowerCase().trim()] || null;
  } catch {
    return null;
  }
};

export const saveStoredProfileByEmail = (email, profileData) => {
  if (!email || !profileData) return;
  try {
    const key = email.toLowerCase().trim();
    const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
    db[key] = {
      ...(db[key] || {}),
      ...profileData,
      email: key
    };
    localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
  } catch (err) {
    console.warn('Failed to save profile to persistent store:', err);
  }
};

// Recognized Protected Main / Super Administrators (Infosys Enterprise Governance Standard)
export const PROTECTED_MAIN_ADMIN_EMAILS = [
  'admin@skillgap.com',
  'admin@smartjobadvisor.com',
  'admin@copilot.com',
  'j.manju.raghvin@gmail.com'
];

export const isProtectedMainAdmin = (email) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return PROTECTED_MAIN_ADMIN_EMAILS.includes(clean);
};

export const updateCandidateApprovalStatus = (email, status) => {
  if (!email) return;
  try {
    const key = email.toLowerCase().trim();
    if (isProtectedMainAdmin(key) && status !== 'APPROVED') {
      console.warn('Protected main admin status cannot be revoked.');
      return;
    }
    const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
    if (db[key]) {
      db[key].approvalStatus = status;
      db[key].isApproved = (status === 'APPROVED');
      localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
    }
  } catch (err) {
    console.warn('Failed to update candidate approval status:', err);
  }
};

export const AuthProvider = ({ children }) => {
  // REQUIREMENT: When website is opened freshly, there should NOT be any active account automatically logged in!
  // Direct "Bridge Gap..." landing page should be shown.
  // Active session exists ONLY if user explicitly logged in during this active browser session.
  const [user, setUser] = useState(() => {
    try {
      const sessionActive = sessionStorage.getItem('skillgap_active_session');
      if (!sessionActive) {
        return null; // Start with NO active account on site open!
      }
      const saved = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed?.email) {
        const stored = getStoredProfileByEmail(parsed.email);
        return stored ? { ...parsed, ...stored } : parsed;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize default passwords in localStorage if not set
    try {
      const current = JSON.parse(localStorage.getItem('skillgap_user_passwords') || '{}');
      let changed = false;
      for (const [em, pass] of Object.entries(DEFAULT_USER_PASSWORDS)) {
        if (!current[em]) {
          current[em] = pass;
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem('skillgap_user_passwords', JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Could not initialize default passwords', e);
    }

    const sessionActive = sessionStorage.getItem('skillgap_active_session');
    if (!sessionActive) {
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const saved = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (token) {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const stored = parsed?.email ? getStoredProfileByEmail(parsed.email) : null;
          setUser(stored ? { ...parsed, ...stored } : parsed);
        } catch (e) {
          // ignore corrupted storage
        }
      }
      userService.getProfile()
        .then((data) => {
          if (data) {
            const stored = data.email ? getStoredProfileByEmail(data.email) : null;
            const merged = stored ? { ...data, ...stored } : data;
            setUser(merged);
            sessionStorage.setItem('user', JSON.stringify(merged));
            localStorage.setItem('user', JSON.stringify(merged));
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            logout();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (authData) => {
    const email = authData.user?.email;
    const stored = email ? getStoredProfileByEmail(email) : null;
    const mergedUser = stored ? { ...authData.user, ...stored } : authData.user;
    
    // Set active session flags
    sessionStorage.setItem('skillgap_active_session', 'true');
    sessionStorage.setItem('token', authData.accessToken || ('token_' + Date.now()));
    sessionStorage.setItem('user', JSON.stringify(mergedUser));

    // Also sync to localStorage for persistent settings/profiles
    localStorage.setItem('token', authData.accessToken || ('token_' + Date.now()));
    localStorage.setItem('user', JSON.stringify(mergedUser));
    setUser(mergedUser);
  };

  const logout = () => {
    if (user?.email) {
      saveStoredProfileByEmail(user.email, user);
    }
    sessionStorage.removeItem('skillgap_active_session');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserProfile = (newProfile) => {
    setUser(newProfile);
    sessionStorage.setItem('user', JSON.stringify(newProfile));
    localStorage.setItem('user', JSON.stringify(newProfile));
    if (newProfile?.email) {
      saveStoredProfileByEmail(newProfile.email, newProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginUser, 
      logout, 
      updateUserProfile, 
      isAuthenticated: !!user,
      getUserPassword,
      setUserPassword,
      verifyUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { syncEnterpriseMasterData };
