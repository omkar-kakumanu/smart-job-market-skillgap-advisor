import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkillBadge from '../components/SkillBadge';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';
import { useAuth, getStoredProfileByEmail, saveStoredProfileByEmail, getUserPassword, setUserPassword, verifyUserPassword } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { User, Plus, Trash2, Save, Award, Lock, Unlock, Shield, Trophy, Edit3, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { PROFICIENCY_LEVELS, EXPERIENCE_LEVELS } from '../utils/constants';

const DEFAULT_SKILLS = [
  { id: 1, name: 'Java', category: 'Backend' },
  { id: 2, name: 'Spring Boot', category: 'Backend' },
  { id: 3, name: 'React', category: 'Frontend' },
  { id: 4, name: 'TypeScript', category: 'Frontend' },
  { id: 5, name: 'Docker', category: 'DevOps' },
  { id: 6, name: 'Kubernetes', category: 'DevOps' },
  { id: 7, name: 'AWS Cloud', category: 'Cloud' },
  { id: 8, name: 'PostgreSQL', category: 'Database' },
  { id: 9, name: 'Python', category: 'Data & AI' },
  { id: 10, name: 'Machine Learning', category: 'Data & AI' },
  { id: 11, name: 'Microservices Architecture', category: 'Architecture' },
  { id: 12, name: 'Kafka', category: 'Messaging' },
  { id: 13, name: 'Redis', category: 'Cache' },
  { id: 14, name: 'GraphQL', category: 'API' },
  { id: 15, name: 'CI/CD Pipelines', category: 'DevOps' },
  { id: 16, name: 'Tailwind CSS', category: 'Frontend' },
  { id: 17, name: 'Next.js', category: 'Frontend' },
  { id: 18, name: 'System Design', category: 'Architecture' },
  { id: 19, name: 'Cybersecurity & Auth', category: 'Security' },
  { id: 20, name: 'SQL & Database Optimization', category: 'Database' }
];

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user');
    const parsed = user || (saved ? JSON.parse(saved) : null);
    if (parsed?.email) {
      const stored = getStoredProfileByEmail(parsed.email);
      if (stored) return { ...parsed, ...stored };
    }
    return parsed || {
      fullName: 'Alex Vance',
      email: 'candidate@skillgap.com',
      targetCareerRole: 'Full Stack Java Developer',
      experienceLevel: 'ENTRY_LEVEL',
      bio: 'Full Stack Java Developer specializing in modern enterprise architectures, Spring Boot, and reactive frontends.',
      skills: [
        { id: 101, skillId: 1, skillName: 'Java', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 3.5 },
        { id: 102, skillId: 2, skillName: 'Spring Boot', category: 'Backend', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 2.0 },
        { id: 103, skillId: 3, skillName: 'React', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 2.5 }
      ]
    };
  });
  const [allSkills, setAllSkills] = useState(DEFAULT_SKILLS);
  const [selectedSkillId, setSelectedSkillId] = useState(DEFAULT_SKILLS[0].id);
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [years, setYears] = useState('2.0');
  const [saving, setSaving] = useState(false);

  const [candidatesList, setCandidatesList] = useState([]);
  const [selectedCandidateEmail, setSelectedCandidateEmail] = useState('');

  const isPrivilegedRecruiterOrAdmin = 
    user?.role === 'ROLE_ADMIN' || 
    user?.role === 'ROLE_MANAGER' || 
    user?.role === 'ROLE_RECRUITER' || 
    user?.role === 'RECRUITER' || 
    user?.role === 'MANAGER' || 
    user?.role === 'ADMIN' || 
    user?.email?.toLowerCase().includes('admin') || 
    user?.email?.toLowerCase().includes('recruiter') || 
    user?.email?.toLowerCase().includes('manager');

  const isAdmin = isPrivilegedRecruiterOrAdmin;
  const isLocked = Boolean(profile?.isProfileLocked) && !isAdmin;

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState(null);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordNotice(null);

    const userEmail = profile?.email || user?.email;
    if (!userEmail) {
      setPasswordNotice({ type: 'ERROR', message: 'No active user session detected.' });
      return;
    }

    if (!currentPassword) {
      setPasswordNotice({ type: 'ERROR', message: 'Please enter your current password.' });
      return;
    }

    const expected = getUserPassword(userEmail);
    if (expected && currentPassword !== expected) {
      setPasswordNotice({ type: 'ERROR', message: 'Current password is incorrect. Please verify your credentials.' });
      showToast('Current password does not match.', 'error');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordNotice({ type: 'ERROR', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ type: 'ERROR', message: 'New password and confirm password do not match.' });
      return;
    }

    setPasswordUpdating(true);
    const updated = setUserPassword(userEmail, newPassword);
    setPasswordUpdating(false);

    if (updated) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordNotice({ type: 'SUCCESS', message: 'Password updated successfully! Next time please sign in with your new password.' });
      showToast('Account password updated successfully!', 'success');
    } else {
      setPasswordNotice({ type: 'ERROR', message: 'Failed to update password. Please try again.' });
    }
  };


  const handleAdminToggleLock = () => {
    const newLock = !profile?.isProfileLocked;
    const updated = { ...profile, isProfileLocked: newLock };
    setProfile(updated);

    if (selectedCandidateEmail) {
      try {
        const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
        const key = selectedCandidateEmail.toLowerCase().trim();
        db[key] = { ...(db[key] || {}), ...updated, isProfileLocked: newLock };
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      } catch (err) {
        console.warn('Failed saving candidate lock', err);
      }
    } else {
      updateUserProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      if (updated.email) {
        saveStoredProfileByEmail(updated.email, updated);
      }
    }
    showToast(newLock ? 'Profile locked.' : 'Administrator unlocked candidate profile for editing!', 'info');
  };

  useEffect(() => {
    const init = async () => {
      // 1. Fetch available skills
      try {
        const skills = await jobService.getAllSkills();
        if (skills && Array.isArray(skills) && skills.length > 0) {
          setAllSkills(skills);
          setSelectedSkillId(skills[0].id);
        }
      } catch (err) {
        console.warn('Backend skills catalogue offline, using default skill inventory');
      }

      // 2. Load candidate profiles for recruiters/admins
      try {
        const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
        const list = Object.values(db);
        if (list.length > 0) {
          setCandidatesList(list);
        } else {
          setCandidatesList([
            { fullName: 'Devansh Verma', email: 'devansh.verma@example.com', targetCareerRole: 'Full Stack Java Developer', experienceLevel: 'SENIOR_LEVEL' },
            { fullName: 'Candidate Applicant', email: 'candidate@skillgap.com', targetCareerRole: 'Full Stack Java Developer', experienceLevel: 'MID_LEVEL' },
            { fullName: 'Alex Vance', email: 'user@skillgap.com', targetCareerRole: 'Full Stack Java Developer', experienceLevel: 'MID_LEVEL' }
          ]);
        }
      } catch (e) {
        console.warn('Candidates list load fallback', e);
      }

      // 3. Fetch remote profile if backend is accessible
      try {
        const p = await userService.getProfile();
        if (p) {
          setProfile(p);
          updateUserProfile(p);
        }
      } catch (err) {
        console.warn('Backend profile offline, using stored local profile');
      }
    };
    init();
  }, []);

  const handleSwitchCandidate = (candEmail) => {
    setSelectedCandidateEmail(candEmail);
    if (!candEmail) {
      const saved = localStorage.getItem('user');
      setProfile(user || (saved ? JSON.parse(saved) : null));
      showToast('Switched back to your personal profile', 'info');
      return;
    }
    const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
    const cand = db[candEmail.toLowerCase().trim()];
    if (cand) {
      setProfile({
        ...cand,
        skills: Array.isArray(cand.skills) ? cand.skills.map((sk, idx) => ({
          id: sk.id || (idx + 100),
          skillId: sk.skillId || (idx + 1),
          skillName: sk.skillName || sk.name || (typeof sk === 'string' ? sk : 'Skill'),
          category: sk.category || 'TECHNICAL',
          proficiencyLevel: sk.proficiencyLevel || sk.level || 'INTERMEDIATE',
          yearsExperience: sk.yearsExperience || sk.years || 2.0
        })) : []
      });
      showToast(`Now managing candidate profile for ${cand.fullName}`, 'success');
    } else {
      const foundInList = candidatesList.find(c => c.email.toLowerCase() === candEmail.toLowerCase());
      if (foundInList) {
        setProfile({
          fullName: foundInList.fullName,
          email: foundInList.email,
          targetCareerRole: foundInList.targetCareerRole || 'Full Stack Java Developer',
          experienceLevel: foundInList.experienceLevel || 'MID_LEVEL',
          bio: foundInList.bio || '',
          skills: []
        });
        showToast(`Now managing candidate profile for ${foundInList.fullName}`, 'success');
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedProfile = {
      ...(profile || {}),
      fullName: profile?.fullName || user?.fullName || 'Candidate',
      profileImageUrl: profile?.profileImageUrl || '',
      targetCareerRole: profile?.targetCareerRole || 'Software Engineer',
      experienceLevel: profile?.experienceLevel || 'ENTRY_LEVEL',
      bio: profile?.bio || '',
      skills: profile?.skills || []
    };

    setProfile(updatedProfile);

    if (selectedCandidateEmail) {
      // Recruiter saving candidate profile
      const targetKey = selectedCandidateEmail.toLowerCase().trim();
      try {
        const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
        db[targetKey] = {
          ...(db[targetKey] || {}),
          ...updatedProfile
        };
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      } catch (err) {
        console.warn('Failed saving candidate to local db', err);
      }

      try {
        await userService.updateCandidateProfile(selectedCandidateEmail, {
          fullName: updatedProfile.fullName,
          targetCareerRole: updatedProfile.targetCareerRole,
          experienceLevel: updatedProfile.experienceLevel,
          bio: updatedProfile.bio
        });
      } catch (err) {
        console.warn('Backend candidate update sync skipped:', err);
      }

      setSaving(false);
      showToast(`Candidate profile & skills for ${updatedProfile.fullName} saved successfully!`, 'success');
      return;
    }

    // Candidate saving own profile
    updateUserProfile(updatedProfile);
    localStorage.setItem('user', JSON.stringify(updatedProfile));
    if (updatedProfile.email) {
      saveStoredProfileByEmail(updatedProfile.email, updatedProfile);
    }

    try {
      const payload = {
        fullName: updatedProfile.fullName,
        profileImageUrl: updatedProfile.profileImageUrl,
        targetCareerRole: updatedProfile.targetCareerRole,
        experienceLevel: updatedProfile.experienceLevel,
        bio: updatedProfile.bio
      };
      const remoteUpdated = await userService.updateProfile(payload);
      if (remoteUpdated) {
        const merged = { ...updatedProfile, ...remoteUpdated };
        setProfile(merged);
        updateUserProfile(merged);
        localStorage.setItem('user', JSON.stringify(merged));
        if (merged.email) {
          saveStoredProfileByEmail(merged.email, merged);
        }
      }
    } catch (err) {
      console.warn('Backend updateProfile offline/sync skipped, profile saved locally:', err);
    } finally {
      setSaving(false);
      showToast('Profile & preferences saved successfully!', 'success');
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;
    const skillObj = allSkills.find((s) => String(s.id) === String(selectedSkillId));
    const skillName = skillObj ? skillObj.name : 'Technical Skill';
    const category = skillObj ? skillObj.category : 'General';

    const currentSkills = profile?.skills || [];
    if (currentSkills.some((s) => String(s.skillId) === String(selectedSkillId) || s.skillName === skillName)) {
      showToast('Competency is already cataloged in profile', 'info');
      return;
    }

    const newSkill = {
      id: Date.now(),
      skillId: Number(selectedSkillId),
      skillName,
      category,
      proficiencyLevel: proficiency,
      yearsExperience: parseFloat(years) || 1.0
    };

    const updated = {
      ...profile,
      skills: [...currentSkills, newSkill]
    };

    setProfile(updated);

    if (selectedCandidateEmail) {
      // Recruiter saving skill to candidate
      const targetKey = selectedCandidateEmail.toLowerCase().trim();
      try {
        const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
        db[targetKey] = {
          ...(db[targetKey] || {}),
          ...updated
        };
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      } catch (err) {
        console.warn('Failed saving candidate skill locally', err);
      }

      try {
        await userService.addCandidateSkill(selectedCandidateEmail, {
          skillName,
          category,
          level: proficiency,
          years: parseFloat(years) || 1.0
        });
      } catch (err) {
        console.warn('Backend addCandidateSkill offline/sync skipped');
      }

      showToast(`Added ${skillName} to ${profile.fullName || 'candidate'} verified skills!`, 'success');
      return;
    }

    // Candidate saving own skill
    updateUserProfile(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    if (updated.email) {
      saveStoredProfileByEmail(updated.email, updated);
    }
    showToast(`Added ${skillName} to verified inventory!`, 'success');

    try {
      await userService.addSkill(selectedSkillId, proficiency, years);
      const remoteP = await userService.getProfile();
      if (remoteP) {
        setProfile(remoteP);
        updateUserProfile(remoteP);
        if (remoteP.email) {
          saveStoredProfileByEmail(remoteP.email, remoteP);
        }
      }
    } catch (err) {
      console.warn('Backend skill persistence offline, saved in local profile state');
    }
  };

  const handleRemoveSkill = async (skillId) => {
    const updatedSkills = (profile?.skills || []).filter((s) => s.skillId !== skillId && s.id !== skillId);
    const updated = {
      ...profile,
      skills: updatedSkills
    };

    setProfile(updated);

    if (selectedCandidateEmail) {
      // Recruiter removing candidate skill
      const targetKey = selectedCandidateEmail.toLowerCase().trim();
      try {
        const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
        db[targetKey] = {
          ...(db[targetKey] || {}),
          ...updated
        };
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      } catch (err) {
        console.warn('Failed removing candidate skill locally', err);
      }

      try {
        if (typeof skillId === 'number') {
          await userService.deleteCandidateSkill(selectedCandidateEmail, skillId);
        }
      } catch (err) {
        console.warn('Backend deleteCandidateSkill skipped');
      }

      showToast('Competency removed from candidate inventory', 'info');
      return;
    }

    // Candidate removing own skill
    updateUserProfile(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    if (updated.email) {
      saveStoredProfileByEmail(updated.email, updated);
    }
    showToast('Competency removed from inventory', 'info');

    try {
      await userService.removeSkill(skillId);
      const remoteP = await userService.getProfile();
      if (remoteP) {
        setProfile(remoteP);
        updateUserProfile(remoteP);
        if (remoteP.email) {
          saveStoredProfileByEmail(remoteP.email, remoteP);
        }
      }
    } catch (err) {
      console.warn('Backend removeSkill offline, saved in local profile state');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Candidate Dashboard', to: '/dashboard' }, { label: 'Candidate Profile' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            <span>Professional Profile & Competency Matrix</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Maintain your verified technical competencies, target engineering specialization, and career trajectory.
          </p>
        </div>

        {/* Privileged Recruiter & Administrator Candidate Switcher */}
        {isPrivilegedRecruiterOrAdmin && (
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-700/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Shield className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base">Recruiter & Administrator Candidate Management</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    {isAdmin ? 'Administrator Privileges' : 'Recruiter Privileges'}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  {selectedCandidateEmail 
                    ? `Currently editing candidate: ${profile?.fullName || selectedCandidateEmail}. You can add/delete skills, adjust target role, and save profile.` 
                    : 'Select any candidate below to edit their verified competencies, adjust seniority, or manage candidates on the Leaderboard Console.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                id="recruiter-profile-candidate-select"
                value={selectedCandidateEmail}
                onChange={(e) => handleSwitchCandidate(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 shadow-sm border border-indigo-300 focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                <option value="">-- Select Candidate to Edit Skills --</option>
                {candidatesList.map(c => (
                  <option key={c.email} value={c.email}>
                    {c.fullName} ({c.email})
                  </option>
                ))}
              </select>

              {selectedCandidateEmail && (
                <button
                  type="button"
                  onClick={() => handleSwitchCandidate('')}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition cursor-pointer"
                >
                  Reset to My Profile
                </button>
              )}

              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isAdmin ? <Shield className="w-4 h-4 text-slate-950" /> : <Trophy className="w-4 h-4 text-slate-950" />}
                <span>{isAdmin ? 'System Admin Console →' : 'Recruiter Console →'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Lock Notice Banner */}
        {profile?.isProfileLocked && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <strong>Profile Locked After Official Submission:</strong> Your profile and verified competencies have been locked following submission. Only platform administrators and recruiters have authority to edit candidate credentials.
              </div>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={handleAdminToggleLock}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Admin Unlock Profile</span>
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Info Form */}
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Professional Credentials & Specialization</h3>
              {profile?.isProfileLocked && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Locked</span>
                </span>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Profile Photo Uploader */}
              <ProfilePhotoUploader
                value={profile?.profileImageUrl || ''}
                onChange={(url) => !isLocked && setProfile({ ...profile, profileImageUrl: url })}
                fullName={profile?.fullName || 'Candidate'}
                label="Professional Photo"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={profile?.fullName || ''}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary Email Address (Verified)</label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm opacity-70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Engineering Role</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={profile?.targetCareerRole || ''}
                    onChange={(e) => setProfile({ ...profile, targetCareerRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Seniority & Experience Level</label>
                  <select
                    disabled={isLocked}
                    value={profile?.experienceLevel || 'ENTRY_LEVEL'}
                    onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm disabled:opacity-60"
                  >
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Professional Executive Summary</label>
                <textarea
                  rows="3"
                  disabled={isLocked}
                  value={profile?.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Provide a concise executive summary highlighting core engineering disciplines, systems experience, and technical leadership..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm disabled:opacity-60"
                />
              </div>

              {!isLocked ? (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-bold text-white gradient-btn rounded-xl shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Persisting Profile...' : 'Save Profile & Preferences'}</span>
                </button>
              ) : (
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  Profile editing locked. Contact an administrator to request modifications.
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Manage Skill Inventory */}
          <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span>Verified Competency Inventory ({profile?.skills?.length || 0})</span>
            </h3>

            {/* Add Skill Controls */}
            {!isLocked ? (
              <div className="space-y-3 p-4 rounded-2xl bg-white/40 dark:bg-darkcard/40 border border-gray-200/30 dark:border-gray-800/30">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Catalog Technical Competency</label>
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs"
                >
                  {allSkills.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs"
                  >
                    {PROFICIENCY_LEVELS.map((pl) => (
                      <option key={pl.value} value={pl.value}>{pl.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.5"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    placeholder="Years Experience"
                    className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs"
                  />
                </div>

                <button
                  onClick={handleAddSkill}
                  className="w-full py-2 text-xs font-bold text-white gradient-btn rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Include Competency in Profile</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold text-center">
                Competency catalog additions locked following submission.
              </div>
            )}

            {/* Existing Skills Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {profile?.skills?.map((s) => (
                <SkillBadge
                  key={s.id}
                  name={s.skillName}
                  category={s.category}
                  level={s.proficiencyLevel}
                  years={s.yearsExperience}
                  onRemove={!isLocked ? () => handleRemoveSkill(s.skillId || s.id) : undefined}
                />
              ))}
            </div>
          </div>
        </div>

          {/* Account Security & Password Management Card */}
          <div className="glass p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4 font-sans mt-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60 dark:border-gray-800/60">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-emerald-950/40 text-indigo-600 dark:text-emerald-400 flex items-center justify-center border border-indigo-200 dark:border-emerald-800">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-gray-900 dark:text-white">Account Security & Change Password</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Update your platform login credentials for <span className="font-mono font-bold text-indigo-600 dark:text-emerald-400">{profile?.email || user?.email}</span>
                </p>
              </div>
            </div>

            {passwordNotice && (
              <div
                className={`p-3 rounded-2xl text-xs font-medium border flex items-start gap-2 ${
                  passwordNotice.type === 'SUCCESS'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                }`}
              >
                {passwordNotice.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{passwordNotice.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-3 font-tech">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={passwordUpdating}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {passwordUpdating ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>

      </main>
    </div>
  );
};

export default Profile;
