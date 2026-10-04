import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

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

export const updateCandidateApprovalStatus = (email, status) => {
  if (!email) return;
  try {
    const key = email.toLowerCase().trim();
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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token) {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const stored = parsed?.email ? getStoredProfileByEmail(parsed.email) : null;
          setUser(stored ? { ...parsed, ...stored } : parsed);
        } catch (e) {
          // ignore corrupted localstorage
        }
      }
      userService.getProfile()
        .then((data) => {
          if (data) {
            const stored = data.email ? getStoredProfileByEmail(data.email) : null;
            const merged = stored ? { ...data, ...stored } : data;
            setUser(merged);
            localStorage.setItem('user', JSON.stringify(merged));
          }
        })
        .catch((err) => {
          // Only log out on explicit 401 Unauthorized from backend
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
    
    localStorage.setItem('token', authData.accessToken);
    localStorage.setItem('user', JSON.stringify(mergedUser));
    setUser(mergedUser);
  };

  const logout = () => {
    if (user?.email) {
      saveStoredProfileByEmail(user.email, user);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserProfile = (newProfile) => {
    setUser(newProfile);
    localStorage.setItem('user', JSON.stringify(newProfile));
    if (newProfile?.email) {
      saveStoredProfileByEmail(newProfile.email, newProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, updateUserProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
