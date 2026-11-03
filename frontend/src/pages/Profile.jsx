import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkillBadge from '../components/SkillBadge';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';
import { 
  useAuth, 
  getStoredProfileByEmail, 
  saveStoredProfileByEmail, 
  getUserPassword, 
  setUserPassword 
} from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { syncEnterpriseMasterData } from '../utils/enterpriseSync';
import SyncDataModal from '../components/SyncDataModal';
import { 
  User, 
  Plus, 
  Trash2, 
  Save, 
  Award, 
  Lock, 
  Unlock, 
  Shield, 
  Briefcase, 
  Trophy, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  XCircle,
  Sparkles,
  Send,
  HelpCircle,
  Check,
  FileText,
  Building2,
  Users
} from 'lucide-react';
import { PROFICIENCY_LEVELS, EXPERIENCE_LEVELS, SKILL_CATEGORIES } from '../utils/constants';

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

export const SEED_SKILL_REQUESTS = [
  {
    id: 'skill_req_101',
    candidateEmail: 'devansh.verma@example.com',
    candidateName: 'Devansh Verma',
    targetCareerRole: 'Full Stack Java Developer',
    skillName: 'Apache Kafka Event Streams',
    category: 'Messaging',
    proficiencyLevel: 'ADVANCED',
    yearsExperience: 2.5,
    justification: 'Architected distributed event messaging with Kafka clusters and Spring Cloud Stream in production high-throughput telemetry.',
    status: 'PENDING_APPROVAL',
    requestedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'skill_req_102',
    candidateEmail: 'user@skillgap.com',
    candidateName: 'Alex Vance',
    targetCareerRole: 'Full Stack Java Developer',
    skillName: 'GraphQL & Apollo Federation',
    category: 'API',
    proficiencyLevel: 'INTERMEDIATE',
    yearsExperience: 1.5,
    justification: 'Completed production schema stitching and Spring Boot GraphQL API gateway for microservices.',
    status: 'PENDING_APPROVAL',
    requestedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'skill_req_103',
    candidateEmail: 'candidate@skillgap.com',
    candidateName: 'Candidate Applicant',
    targetCareerRole: 'Full Stack Java Developer',
    skillName: 'Kubernetes Cluster Management',
    category: 'DevOps',
    proficiencyLevel: 'ADVANCED',
    yearsExperience: 3.0,
    justification: 'Certified Kubernetes Administrator (CKA). Managed multi-node cluster deployments with Helm charts and zero-downtime rolling updates.',
    status: 'APPROVED',
    approvedBy: 'Administrator Review Board',
    approvedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    requestedAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN' || user?.email?.toLowerCase().includes('admin');
  const isRecruiter = !isAdmin && (
    user?.role === 'ROLE_MANAGER' ||
    user?.role === 'ROLE_RECRUITER' ||
    user?.role === 'RECRUITER' ||
    user?.role === 'MANAGER' ||
    user?.email?.toLowerCase().includes('recruiter') ||
    user?.email?.toLowerCase().includes('manager')
  );
  const isCandidate = !isAdmin && !isRecruiter;

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user');
    const parsed = user || (saved ? JSON.parse(saved) : null);
    if (parsed?.email) {
      const stored = getStoredProfileByEmail(parsed.email);
      if (stored) return { ...parsed, ...stored };
    }
    return parsed || {
      fullName: isAdmin ? 'Platform Administrator' : isRecruiter ? 'Talent Recruiter' : 'Alex Vance',
      email: isAdmin ? 'admin@skillgap.com' : isRecruiter ? 'recruiter@skillgap.com' : 'candidate@skillgap.com',
      targetCareerRole: 'Full Stack Java Developer',
      positionTitle: isAdmin ? 'System Administrator & Governance Lead' : 'Senior Technical Recruiter',
      department: isAdmin ? 'Enterprise Infrastructure & Governance' : 'Talent Acquisition & Sourcing',
      experienceLevel: 'ENTRY_LEVEL',
      bio: isAdmin 
        ? 'Platform Administrator overseeing skill taxonomies, candidate approvals, and governance operations.' 
        : isRecruiter 
        ? 'Technical recruiter specializing in software engineering talent assessment, candidate scoring, and requisitions.' 
        : 'Full Stack Java Developer specializing in modern enterprise architectures, Spring Boot, and reactive frontends.',
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
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Skill Request State for Candidate
  const [showSkillRequestModal, setShowSkillRequestModal] = useState(false);
  const [skillRequestForm, setSkillRequestForm] = useState({
    skillName: '',
    category: 'TECHNICAL',
    proficiencyLevel: 'INTERMEDIATE',
    yearsExperience: '2.0',
    justification: ''
  });
  const [mySkillRequests, setMySkillRequests] = useState([]);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState(null);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Load profile and candidate skill requests
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

      // 2. Fetch remote profile if backend is accessible
      try {
        const p = await userService.getProfile();
        if (p) {
          setProfile(prev => ({ ...prev, ...p }));
          updateUserProfile(p);
        }
      } catch (err) {
        console.warn('Backend profile offline, using stored local profile');
      }

      // 3. Load skill requests for candidate
      try {
        const storedReqs = localStorage.getItem('skillgap_skill_requests');
        let reqList = [];
        if (storedReqs) {
          reqList = JSON.parse(storedReqs);
        } else {
          reqList = SEED_SKILL_REQUESTS;
          localStorage.setItem('skillgap_skill_requests', JSON.stringify(reqList));
        }

        const candidateEmail = (user?.email || profile?.email || '').toLowerCase().trim();
        const userReqs = reqList.filter(r => (r.candidateEmail || '').toLowerCase().trim() === candidateEmail);
        setMySkillRequests(userReqs);
      } catch (err) {
        console.warn('Failed loading skill requests', err);
      }
    };
    init();
  }, [user]);

  const isLocked = Boolean(profile?.isProfileLocked) && !isAdmin;

  // Save profile changes
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedProfile = {
      ...(profile || {}),
      fullName: profile?.fullName?.trim() || (isAdmin ? 'Platform Administrator' : isRecruiter ? 'Talent Recruiter' : 'Candidate'),
      profileImageUrl: profile?.profileImageUrl || '',
      targetCareerRole: profile?.targetCareerRole || '',
      positionTitle: profile?.positionTitle || (isAdmin ? 'System Administrator' : isRecruiter ? 'Technical Recruiter' : 'Candidate'),
      department: profile?.department || '',
      experienceLevel: profile?.experienceLevel || 'ENTRY_LEVEL',
      bio: profile?.bio || ''
    };

    setProfile(updatedProfile);
    updateUserProfile(updatedProfile);
    localStorage.setItem('user', JSON.stringify(updatedProfile));
    if (updatedProfile.email) {
      saveStoredProfileByEmail(updatedProfile.email, updatedProfile);
    }

    try {
      await userService.updateProfile({
        fullName: updatedProfile.fullName,
        profileImageUrl: updatedProfile.profileImageUrl,
        targetCareerRole: updatedProfile.targetCareerRole,
        experienceLevel: updatedProfile.experienceLevel,
        bio: updatedProfile.bio
      });
    } catch (err) {
      console.warn('Backend sync skipped:', err);
    } finally {
      setSaving(false);
      showToast(isAdmin ? 'Administrator profile saved successfully!' : isRecruiter ? 'Recruiter profile saved successfully!' : 'Candidate profile saved successfully!', 'success');
    }
  };

  // Add skill directly (Candidate)
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
    updateUserProfile(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    if (updated.email) {
      saveStoredProfileByEmail(updated.email, updated);
    }
    showToast(`Added ${skillName} to verified inventory!`, 'success');

    try {
      await userService.addSkill(selectedSkillId, proficiency, years);
    } catch (err) {
      console.warn('Backend skill persistence skipped');
    }
  };

  // Remove skill (Candidate)
  const handleRemoveSkill = async (skillId) => {
    const updatedSkills = (profile?.skills || []).filter((s) => s.skillId !== skillId && s.id !== skillId);
    const updated = { ...profile, skills: updatedSkills };
    setProfile(updated);
    updateUserProfile(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    if (updated.email) {
      saveStoredProfileByEmail(updated.email, updated);
    }
    showToast('Competency removed from inventory', 'info');
    try {
      await userService.removeSkill(skillId);
    } catch (err) {
      console.warn('Backend removeSkill skipped');
    }
  };

  // Candidate Submits a Skill Request
  const handleSubmitSkillRequest = (e) => {
    e.preventDefault();
    if (!skillRequestForm.skillName.trim()) {
      showToast('Please specify the skill name you wish to request', 'error');
      return;
    }

    const newReq = {
      id: `skill_req_${Date.now()}`,
      candidateEmail: (user?.email || profile?.email || 'candidate@skillgap.com').toLowerCase().trim(),
      candidateName: profile?.fullName || user?.fullName || 'Candidate',
      targetCareerRole: profile?.targetCareerRole || 'Engineering Candidate',
      skillName: skillRequestForm.skillName.trim(),
      category: skillRequestForm.category || 'TECHNICAL',
      proficiencyLevel: skillRequestForm.proficiencyLevel || 'INTERMEDIATE',
      yearsExperience: parseFloat(skillRequestForm.yearsExperience) || 1.0,
      justification: skillRequestForm.justification.trim() || 'Verified professional project and engineering experience.',
      status: 'PENDING_APPROVAL',
      requestedAt: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('skillgap_skill_requests') || '[]');
      const updatedList = [newReq, ...stored];
      localStorage.setItem('skillgap_skill_requests', JSON.stringify(updatedList));

      const candidateEmail = (user?.email || profile?.email || '').toLowerCase().trim();
      setMySkillRequests(updatedList.filter(r => (r.candidateEmail || '').toLowerCase().trim() === candidateEmail));

      setShowSkillRequestModal(false);
      setSkillRequestForm({
        skillName: '',
        category: 'TECHNICAL',
        proficiencyLevel: 'INTERMEDIATE',
        yearsExperience: '2.0',
        justification: ''
      });
      showToast(`Skill request for "${newReq.skillName}" submitted! Administrators and Recruiters will review and verify it.`, 'success');
    } catch (err) {
      console.warn('Failed saving skill request', err);
      showToast('Failed to submit skill request. Please try again.', 'error');
    }
  };

  // Handle Password Change
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
      setPasswordNotice({ type: 'SUCCESS', message: 'Password updated successfully! Use your new password on next sign in.' });
      showToast('Account password updated successfully!', 'success');
    } else {
      setPasswordNotice({ type: 'ERROR', message: 'Failed to update password. Please try again.' });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {/* Dynamic Breadcrumbs based on Role */}
        <Breadcrumb 
          items={
            isAdmin 
              ? [{ label: 'Admin Console', to: '/admin' }, { label: 'Administrator Profile' }]
              : isRecruiter
              ? [{ label: 'Recruiter Console', to: '/admin' }, { label: 'Recruiter Profile' }]
              : [{ label: 'Candidate Dashboard', to: '/dashboard' }, { label: 'Candidate Profile' }]
          } 
        />

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: SYSTEM ADMINISTRATOR & RECRUITER PROFILE (NON-CANDIDATE) */}
        {/* ------------------------------------------------------------- */}
        {(isAdmin || isRecruiter) ? (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border ${
              isAdmin 
                ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-emerald-500/40' 
                : 'bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 border-indigo-500/40'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 ${
                  isAdmin 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40' 
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
                }`}>
                  {isAdmin ? <Shield className="w-8 h-8 text-amber-300" /> : <Briefcase className="w-8 h-8 text-indigo-300" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black">
                      {isAdmin ? 'System Administrator Profile' : 'Talent Acquisition & Recruiter Profile'}
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      isAdmin 
                        ? 'bg-amber-400 text-slate-950' 
                        : 'bg-indigo-400 text-slate-950'
                    }`}>
                      {isAdmin ? 'Administrator Governance Tier' : 'Talent Partner Tier'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 dark:text-gray-300 mt-1 max-w-2xl">
                    {isAdmin
                      ? 'System administrator credentials, platform governance authority, user access approvals, and candidate position promotion privileges.'
                      : 'Talent acquisition officer credentials, candidate evaluations, skill request auditing, and role position appointments.'}
                  </p>
                </div>
              </div>

              {/* Direct Link to Console */}
              <Link
                to="/admin"
                className={`px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isAdmin 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {isAdmin ? <Shield className="w-4 h-4 text-slate-950" /> : <Trophy className="w-4 h-4 text-slate-950" />}
                <span>{isAdmin ? 'Launch Admin Console →' : 'Launch Recruiter Console →'}</span>
              </Link>
            </div>

            {/* Admin / Recruiter Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Details Form */}
              <div className="lg:col-span-2 glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 dark:border-gray-800/60">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600 dark:text-emerald-400" />
                    <span>Executive Account Information</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-gray-500">
                    Role: {user?.role || (isAdmin ? 'ROLE_ADMIN' : 'ROLE_RECRUITER')}
                  </span>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <ProfilePhotoUploader
                    value={profile?.profileImageUrl || ''}
                    onChange={(url) => setProfile({ ...profile, profileImageUrl: url })}
                    fullName={profile?.fullName || (isAdmin ? 'Admin' : 'Recruiter')}
                    label="Official Photo"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-tech">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={profile?.fullName || ''}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Verified Corporate Email</label>
                      <input
                        type="email"
                        disabled
                        value={profile?.email || user?.email || ''}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-slate-900 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-tech">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Appointed Title & Position</label>
                      <input
                        type="text"
                        value={profile?.positionTitle || (isAdmin ? 'Platform Administrator & Governance Lead' : 'Senior Technical Recruiter')}
                        onChange={(e) => setProfile({ ...profile, positionTitle: e.target.value })}
                        placeholder="e.g. Senior Technical Recruiter"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Department / Division</label>
                      <input
                        type="text"
                        value={profile?.department || (isAdmin ? 'Enterprise Cloud Infrastructure' : 'Global Talent Acquisition')}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        placeholder="e.g. Global Talent Acquisition"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Executive Bio & Operational Scope</label>
                    <textarea
                      rows="3"
                      value={profile?.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Outline operational focus, recruiting specializations, and governance areas..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 text-xs font-bold text-white gradient-btn rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </form>
              </div>

              {/* Privileged Authority Overview */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" />
                  <span>Authority & Capabilities</span>
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Your account is granted high-privilege operational authority across the platform:
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 dark:text-white">Position Promotion Authority</strong>
                      <span className="text-gray-600 dark:text-gray-300">
                        Authorized to assign positions and appoint candidates to Recruiter role directly in the talent pool.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 dark:text-white">Skill Request Auditing</strong>
                      <span className="text-gray-600 dark:text-gray-300">
                        Review and approve candidate skill requests to add verified competencies to their profile.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 dark:text-white">Credential Verification</strong>
                      <span className="text-gray-600 dark:text-gray-300">
                        Audit candidate certificates, resumes, and interview telemetries across hiring pipelines.
                      </span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 space-y-2.5 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-amber-500" />
                        <strong className="text-gray-900 dark:text-white text-xs">Enterprise Master Data & Account Recovery</strong>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        Admin Only
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300">
                      Synchronize and recover all candidate profiles, test accounts, credentials, resumes, and interview telemetry for the Vercel cloud environment.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSyncModalOpen(true)}
                      disabled={syncingData}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300 active:scale-95"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-slate-950 ${syncingData ? 'animate-spin' : ''}`} />
                      <span>{syncingData ? 'Syncing...' : '⚡ Sync Data (Recover All Accounts)'}</span>
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/admin"
                    className="w-full py-2.5 px-4 rounded-xl text-center font-bold text-xs bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <span>Open Governance Console</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW 2: CANDIDATE PROFILE WITH SKILL REQUEST WORKFLOW          */
          /* ------------------------------------------------------------- */
          <div className="space-y-8">
            <div className="mb-2">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-7 h-7 text-indigo-600 dark:text-emerald-400" />
                <span>Candidate Profile & Competency Matrix</span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Maintain your verified technical competencies, request new skill endorsements, and track application telemetry.
              </p>
            </div>

            {/* Lock Notice Banner */}
            {profile?.isProfileLocked && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <strong>Profile Locked Following Submission:</strong> Your profile and competencies are verified. You can still submit <strong>Skill Requests</strong> below for recruiter/admin approval.
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Personal Info Form */}
              <div className="lg:col-span-2 glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Candidate Credentials & Specialization</h3>
                  {profile?.isProfileLocked && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <ProfilePhotoUploader
                    value={profile?.profileImageUrl || ''}
                    onChange={(url) => !isLocked && setProfile({ ...profile, profileImageUrl: url })}
                    fullName={profile?.fullName || 'Candidate'}
                    label="Professional Photo"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-tech">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-tech">
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
                      placeholder="Highlight core engineering disciplines, systems experience, and technical leadership..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm disabled:opacity-60"
                    />
                  </div>

                  {!isLocked && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 text-sm font-bold text-white gradient-btn rounded-xl shadow-md flex items-center space-x-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Persisting Profile...' : 'Save Profile & Preferences'}</span>
                    </button>
                  )}
                </form>
              </div>

              {/* Right Column: Manage Skill Inventory + Request New Skill */}
              <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-emerald-500" />
                    <span>Verified Skills ({profile?.skills?.length || 0})</span>
                  </h3>

                  {/* Skill Request Trigger */}
                  <button
                    type="button"
                    onClick={() => setShowSkillRequestModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Request a new skill to be approved by Recruiter/Admin"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Skill Request</span>
                  </button>
                </div>

                {/* Add Skill Directly (if not locked) */}
                {!isLocked ? (
                  <div className="space-y-3 p-4 rounded-2xl bg-white/40 dark:bg-darkcard/40 border border-gray-200/30 dark:border-gray-800/30 font-tech">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Include Competency from Catalog
                    </label>
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
                        placeholder="Years Exp"
                        className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs"
                      />
                    </div>

                    <button
                      onClick={handleAddSkill}
                      className="w-full py-2 text-xs font-bold text-white gradient-btn rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Include in Profile</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold text-center">
                    Direct additions locked. Use <strong>Skill Request</strong> to request additions from recruiters!
                  </div>
                )}

                {/* Existing Skills Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {profile?.skills?.map((s) => (
                    <SkillBadge
                      key={s.id || s.skillName}
                      name={s.skillName || s.name}
                      category={s.category}
                      level={s.proficiencyLevel || s.level}
                      years={s.yearsExperience || s.years}
                      onRemove={!isLocked ? () => handleRemoveSkill(s.skillId || s.id) : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* CANDIDATE SKILL REQUESTS TRACKING SECTION                     */}
            {/* ------------------------------------------------------------- */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/60 dark:border-gray-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
                      <span>Candidate Skill Endorsement Requests</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-mono">
                        {mySkillRequests.length}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Submit request to administrators and recruiters to approve and catalog new competencies in your verified profile.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSkillRequestModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Request New Skill</span>
                </button>
              </div>

              {/* Requests List */}
              {mySkillRequests.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">No active skill requests submitted yet.</p>
                  <p className="text-[11px] text-gray-400">
                    Acquired a new engineering proficiency or certification? Click "Request New Skill" to submit for recruiter audit.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mySkillRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-white/70 dark:bg-darkcard/70 border border-gray-200/60 dark:border-gray-800/60 shadow-xs space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                            {req.skillName}
                          </h4>
                          {req.status === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          )}
                          {req.status === 'PENDING_APPROVAL' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending Review
                            </span>
                          )}
                          {req.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              Rejected
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">{req.category}</span>
                          <span>&bull;</span>
                          <span className="font-bold text-indigo-600 dark:text-emerald-400">{req.proficiencyLevel}</span>
                          <span>&bull;</span>
                          <span>{req.yearsExperience} yrs</span>
                        </div>

                        {req.justification && (
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 italic line-clamp-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                            "{req.justification}"
                          </p>
                        )}
                      </div>

                      <div className="pt-2 text-[10px] text-gray-400 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                        <span>Submitted: {new Date(req.requestedAt).toLocaleDateString()}</span>
                        {req.approvedBy && (
                          <span className="text-emerald-600 font-bold">Verified by {req.approvedBy}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: CANDIDATE SUBMIT SKILL REQUEST MODAL                    */}
        {/* ------------------------------------------------------------- */}
        {showSkillRequestModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass max-w-lg w-full p-6 sm:p-7 rounded-3xl border border-indigo-200 dark:border-indigo-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-gray-900 dark:text-white">Submit Candidate Skill Request</h3>
                    <p className="text-xs text-gray-500">Request recruiter & administrator endorsement</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSkillRequestModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmitSkillRequest} className="space-y-3 font-tech">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Skill or Technology Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apache Kafka, Rust, Next.js 15, Terraform"
                    value={skillRequestForm.skillName}
                    onChange={(e) => setSkillRequestForm({ ...skillRequestForm, skillName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={skillRequestForm.category}
                      onChange={(e) => setSkillRequestForm({ ...skillRequestForm, category: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs"
                    >
                      {SKILL_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Proficiency</label>
                    <select
                      value={skillRequestForm.proficiencyLevel}
                      onChange={(e) => setSkillRequestForm({ ...skillRequestForm, proficiencyLevel: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs"
                    >
                      {PROFICIENCY_LEVELS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Experience (Yrs)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="25"
                      value={skillRequestForm.yearsExperience}
                      onChange={(e) => setSkillRequestForm({ ...skillRequestForm, yearsExperience: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Justification, Project Proof, or Certification Details
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Explain how and where you demonstrated this skill (e.g. project architected, GitHub repo, production deployment, course cert)..."
                    value={skillRequestForm.justification}
                    onChange={(e) => setSkillRequestForm({ ...skillRequestForm, justification: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowSkillRequestModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-btn shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request to Recruiters</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* COMMON: ACCOUNT SECURITY & PASSWORD MANAGEMENT CARD            */}
        {/* ------------------------------------------------------------- */}
        <div className="glass p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4 font-sans mt-8">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60 dark:border-gray-800/60">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-emerald-950/40 text-indigo-600 dark:text-emerald-400 flex items-center justify-center border border-indigo-200 dark:border-emerald-800">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900 dark:text-white">Account Security & Change Password</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update login credentials for <span className="font-mono font-bold text-indigo-600 dark:text-emerald-400">{profile?.email || user?.email}</span>
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
            {/* Sync Data Modal (Admin Only) */}
      {isAdmin && (
        <SyncDataModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;
