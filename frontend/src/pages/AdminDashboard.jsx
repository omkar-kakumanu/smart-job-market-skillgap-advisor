import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { jobService } from '../services/jobService';
import { 
  Shield, 
  Plus, 
  Briefcase, 
  Cpu, 
  Trash2, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink,
  Star, 
  Clock, 
  UserCheck,
  Trophy,
  Medal,
  Users,
  Lock,
  Unlock,
  Edit3,
  Filter,
  Eye,
  Sparkles,
  Bot,
  Mic,
  FileText,
  X,
  Check,
  ChevronRight,
  User,
  ArrowUpDown
} from 'lucide-react';
import { EXPERIENCE_LEVELS, SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../utils/constants';

const AdminDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('rankings'); // 'rankings', 'certificates', 'jobs', 'skills'
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certRequests, setCertRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states for Rankings
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('COMPOSITE');

  // Modal States
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Dossier modal
  const [editingCandidate, setEditingCandidate] = useState(null); // Admin edit modal
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    targetCareerRole: '',
    experienceLevel: 'ENTRY_LEVEL',
    bio: '',
    atsScore: 90,
    interviewScore: 85,
    voiceScore: 88,
    skills: []
  });
  const [newSkillItem, setNewSkillItem] = useState({
    skillName: '',
    category: 'Backend',
    proficiencyLevel: 'ADVANCED',
    yearsExperience: 2.0
  });

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Remote',
    experienceLevel: 'ENTRY_LEVEL',
    salaryRange: '$100,000 - $120,000',
    description: '',
  });

  // New Skill Form State
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'TECHNICAL',
    description: '',
    marketDemandScore: 85,
  });

  // Calculate composite ranking score
  const calculateCompositeScore = (cand) => {
    const ats = cand.atsScore || 85;
    const match = cand.skillMatchScore || (cand.skills?.length ? Math.min(98, 70 + cand.skills.length * 4) : 80);
    const interview = cand.interviewScore || 80;
    const voice = cand.voiceScore || 80;
    return Math.round((ats * 0.30) + (match * 0.30) + (interview * 0.20) + (voice * 0.20));
  };

  const loadCandidates = () => {
    try {
      let db = {};
      const stored = localStorage.getItem('skillgap_profiles_db');
      if (stored) {
        db = JSON.parse(stored);
      }

      // Seed realistic benchmark candidate roster for talent acquisition
      const seedCandidates = {
        'devansh.verma@example.com': {
          fullName: 'Devansh Verma',
          email: 'devansh.verma@example.com',
          targetCareerRole: 'Full Stack Java Developer',
          experienceLevel: 'SENIOR_LEVEL',
          bio: 'Senior Full Stack Engineer with 7+ years architecting reactive microservices with Java 21, Spring Boot 3, and React 19.',
          resumeName: 'Devansh_Verma_Enterprise_Architect.pdf',
          isProfileLocked: true,
          atsScore: 96,
          skillMatchScore: 94,
          interviewScore: 95,
          voiceScore: 92,
          skills: [
            { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'EXPERT', yearsExperience: 7 },
            { skillName: 'Spring Boot 3', category: 'Backend', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
            { skillName: 'React', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 5 },
            { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
            { skillName: 'Kubernetes', category: 'DevOps', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 3 },
            { skillName: 'PostgreSQL', category: 'Database', proficiencyLevel: 'ADVANCED', yearsExperience: 5 }
          ],
          submissionDate: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
          certStatus: 'APPROVED'
        },
        'sarah.jenkins@talentcorp.io': {
          fullName: 'Sarah Jenkins',
          email: 'sarah.jenkins@talentcorp.io',
          targetCareerRole: 'Cloud Native DevOps Engineer',
          experienceLevel: 'MID_LEVEL',
          bio: 'DevOps and Infrastructure Specialist with deep focus on Kubernetes orchestration, Terraform automation, and AWS architectures.',
          resumeName: 'Sarah_Jenkins_DevOps_Specialist.pdf',
          isProfileLocked: true,
          atsScore: 92,
          skillMatchScore: 91,
          interviewScore: 89,
          voiceScore: 94,
          skills: [
            { skillName: 'Kubernetes', category: 'DevOps', proficiencyLevel: 'EXPERT', yearsExperience: 4 },
            { skillName: 'AWS Cloud', category: 'Cloud', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
            { skillName: 'Terraform', category: 'DevOps', proficiencyLevel: 'ADVANCED', yearsExperience: 3 },
            { skillName: 'CI/CD Pipelines', category: 'DevOps', proficiencyLevel: 'EXPERT', yearsExperience: 4 },
            { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'EXPERT', yearsExperience: 4 }
          ],
          submissionDate: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
          certStatus: 'PENDING_APPROVAL'
        },
        'priya.sharma@aimodels.io': {
          fullName: 'Priya Sharma',
          email: 'priya.sharma@aimodels.io',
          targetCareerRole: 'MLOps & Machine Learning Systems Engineer',
          experienceLevel: 'SENIOR_LEVEL',
          bio: 'Machine Learning systems engineer specializing in LLM inference pipelines, PyTorch modeling, and scalable vector store infrastructure.',
          resumeName: 'Priya_Sharma_MLOps_Architect.pdf',
          isProfileLocked: true,
          atsScore: 95,
          skillMatchScore: 93,
          interviewScore: 92,
          voiceScore: 88,
          skills: [
            { skillName: 'Python', category: 'Data & AI', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
            { skillName: 'Machine Learning', category: 'Data & AI', proficiencyLevel: 'EXPERT', yearsExperience: 5 },
            { skillName: 'PyTorch', category: 'Data & AI', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
            { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
            { skillName: 'PostgreSQL', category: 'Database', proficiencyLevel: 'ADVANCED', yearsExperience: 4 }
          ],
          submissionDate: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
          certStatus: 'APPROVED'
        },
        'alex.vance@candidate.io': {
          fullName: 'Alex Vance',
          email: 'alex.vance@candidate.io',
          targetCareerRole: 'Frontend React Architect',
          experienceLevel: 'MID_LEVEL',
          bio: 'Specialist in modern frontend engineering, Next.js, reactive state modeling, and enterprise design systems.',
          resumeName: 'Alex_Vance_Frontend_Resume.pdf',
          isProfileLocked: false,
          atsScore: 86,
          skillMatchScore: 88,
          interviewScore: 84,
          voiceScore: 86,
          skills: [
            { skillName: 'React', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
            { skillName: 'TypeScript', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 3 },
            { skillName: 'Next.js', category: 'Frontend', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 2 },
            { skillName: 'Tailwind CSS', category: 'Frontend', proficiencyLevel: 'EXPERT', yearsExperience: 4 }
          ],
          submissionDate: new Date(Date.now() - 3600000 * 12).toISOString(),
          certStatus: 'NOT_REQUESTED'
        }
      };

      // Merge seed data with stored database
      let updatedDb = { ...seedCandidates };
      Object.keys(db).forEach(k => {
        updatedDb[k] = { ...(seedCandidates[k] || {}), ...db[k] };
      });

      // Synchronize active logged in user profile if exists
      if (user?.email) {
        const uEmail = user.email.toLowerCase().trim();
        const existing = updatedDb[uEmail] || {};
        updatedDb[uEmail] = {
          fullName: user.fullName || existing.fullName || 'Candidate Member',
          email: uEmail,
          targetCareerRole: user.targetCareerRole || existing.targetCareerRole || 'Full Stack Java Developer',
          experienceLevel: user.experienceLevel || existing.experienceLevel || 'ENTRY_LEVEL',
          bio: user.bio || existing.bio || 'Enterprise candidate undergoing skill gap and competency evaluation.',
          resumeName: user.resumeName || existing.resumeName || 'Candidate_Resume_Submission.pdf',
          isProfileLocked: user.isProfileLocked !== undefined ? user.isProfileLocked : Boolean(existing.isProfileLocked),
          atsScore: existing.atsScore || 91,
          skillMatchScore: existing.skillMatchScore || 89,
          interviewScore: existing.interviewScore || 88,
          voiceScore: existing.voiceScore || 90,
          skills: user.skills && user.skills.length > 0 ? user.skills : (existing.skills || [
            { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 3 }
          ]),
          submissionDate: existing.submissionDate || new Date().toISOString(),
          certStatus: existing.certStatus || 'PENDING_APPROVAL'
        };
      }

      localStorage.setItem('skillgap_profiles_db', JSON.stringify(updatedDb));
      const candList = Object.values(updatedDb);
      setCandidates(candList);
    } catch (e) {
      console.warn('Failed loading candidates', e);
    }
  };

  const loadCertificateRequests = () => {
    try {
      const stored = localStorage.getItem('skillgap_cert_requests');
      if (stored) {
        setCertRequests(JSON.parse(stored));
      } else {
        const seedRequests = [
          {
            id: 'cert-req-101',
            candidateName: 'John Doe',
            candidateEmail: 'user@skillgap.com',
            careerRole: 'Full Stack Java Developer',
            certTitle: 'Certified Skill Gap & Market Competency Certificate',
            skills: [
              { name: 'Java 21', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.5 },
              { name: 'Spring Boot 3', category: 'TECHNICAL', proficiency: 'INTERMEDIATE', years: 2.0 },
              { name: 'ReactJS', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.0 },
            ],
            themeStyle: 'gold',
            status: 'PENDING_APPROVAL',
            requestDate: new Date(Date.now() - 3600000 * 4).toISOString(),
            approvedDate: null,
            approvedBy: 'Pending Administrator Review',
            verificationCode: 'SKG-2026-PENDING-REVIEW',
            remarks: 'Submitted for verification of core microservices & cloud competency.'
          },
          {
            id: 'cert-req-102',
            candidateName: 'Sarah Jenkins',
            candidateEmail: 'sarah.jenkins@talentcorp.io',
            careerRole: 'Cloud Native DevOps Engineer',
            certTitle: 'Enterprise Kubernetes & Cloud Infrastructure Credential',
            skills: [
              { name: 'Kubernetes', category: 'TECHNICAL', proficiency: 'EXPERT', years: 4.0 },
              { name: 'AWS Cloud', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.5 },
              { name: 'Terraform', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 2.5 },
            ],
            themeStyle: 'emerald',
            status: 'PENDING_APPROVAL',
            requestDate: new Date(Date.now() - 3600000 * 18).toISOString(),
            approvedDate: null,
            approvedBy: 'Pending Administrator Review',
            verificationCode: 'SKG-2026-PENDING-REVIEW',
            remarks: 'Requires admin audit for multi-cluster production deployment credential.'
          }
        ];
        localStorage.setItem('skillgap_cert_requests', JSON.stringify(seedRequests));
        setCertRequests(seedRequests);
      }
    } catch (e) {
      console.warn('Failed loading cert requests', e);
    }
  };

  const fetchData = async () => {
    try {
      const [jRes, sRes] = await Promise.all([
        jobService.getJobs({ page: 0, size: 50 }).catch(() => ({ content: [] })),
        jobService.getAllSkills().catch(() => []),
      ]);

      const storedSkills = localStorage.getItem('skillgap_admin_skills');
      const customSkills = storedSkills ? JSON.parse(storedSkills) : [];
      const combinedSkills = [...(sRes || [])];
      customSkills.forEach(cs => {
        if (!combinedSkills.some(s => s.name?.toLowerCase() === cs.name?.toLowerCase())) {
          combinedSkills.push(cs);
        }
      });

      setJobs(jRes?.content || []);
      setSkills(combinedSkills);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    loadCertificateRequests();
    loadCandidates();
  }, []);

  // Admin Toggle Lock/Unlock Candidate Profile
  const handleToggleLock = (candidate) => {
    const newLockState = !candidate.isProfileLocked;
    const updatedCandidates = candidates.map(c => {
      if (c.email.toLowerCase() === candidate.email.toLowerCase()) {
        return { ...c, isProfileLocked: newLockState };
      }
      return c;
    });
    setCandidates(updatedCandidates);

    // Save in persistent db
    try {
      const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      const key = candidate.email.toLowerCase().trim();
      db[key] = {
        ...(db[key] || candidate),
        isProfileLocked: newLockState
      };
      localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));

      // If active user is this candidate, update active context
      if (user?.email && user.email.toLowerCase().trim() === key) {
        updateUserProfile({ ...user, isProfileLocked: newLockState });
      }
    } catch (err) {
      console.warn('Failed saving lock status', err);
    }

    showToast(
      newLockState 
        ? `Profile locked for ${candidate.fullName}. Candidate editing disabled.` 
        : `Administrator unlocked profile for ${candidate.fullName}. Candidate can now edit.`,
      'info'
    );
  };

  // Open Admin Edit Modal
  const handleOpenEditModal = (candidate) => {
    setEditingCandidate(candidate);
    setEditForm({
      fullName: candidate.fullName || '',
      email: candidate.email || '',
      targetCareerRole: candidate.targetCareerRole || '',
      experienceLevel: candidate.experienceLevel || 'ENTRY_LEVEL',
      bio: candidate.bio || '',
      atsScore: candidate.atsScore || 90,
      interviewScore: candidate.interviewScore || 85,
      voiceScore: candidate.voiceScore || 88,
      skills: Array.isArray(candidate.skills) ? [...candidate.skills] : []
    });
  };

  // Save Admin Candidate Edit
  const handleSaveCandidateEdit = (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim()) {
      showToast('Candidate name is required', 'error');
      return;
    }

    const updatedCand = {
      ...editingCandidate,
      fullName: editForm.fullName.trim(),
      targetCareerRole: editForm.targetCareerRole.trim(),
      experienceLevel: editForm.experienceLevel,
      bio: editForm.bio.trim(),
      atsScore: parseInt(editForm.atsScore) || 90,
      interviewScore: parseInt(editForm.interviewScore) || 85,
      voiceScore: parseInt(editForm.voiceScore) || 88,
      skills: editForm.skills
    };

    const updatedList = candidates.map(c => 
      c.email.toLowerCase() === editingCandidate.email.toLowerCase() ? updatedCand : c
    );
    setCandidates(updatedList);

    // Persist in localStorage
    try {
      const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      const key = editingCandidate.email.toLowerCase().trim();
      db[key] = {
        ...(db[key] || {}),
        ...updatedCand
      };
      localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));

      // If active user is this candidate, update context as well
      if (user?.email && user.email.toLowerCase().trim() === key) {
        updateUserProfile({ ...user, ...updatedCand });
      }
    } catch (err) {
      console.warn('Failed saving candidate profile edit', err);
    }

    setEditingCandidate(null);
    showToast(`Candidate profile for ${updatedCand.fullName} updated by Administrator!`, 'success');
  };

  // Add skill in Edit modal
  const handleAddSkillInEdit = () => {
    if (!newSkillItem.skillName.trim()) return;
    const item = {
      skillName: newSkillItem.skillName.trim(),
      category: newSkillItem.category,
      proficiencyLevel: newSkillItem.proficiencyLevel,
      yearsExperience: parseFloat(newSkillItem.yearsExperience) || 2.0
    };
    setEditForm(prev => ({
      ...prev,
      skills: [...prev.skills, item]
    }));
    setNewSkillItem({
      skillName: '',
      category: 'Backend',
      proficiencyLevel: 'ADVANCED',
      yearsExperience: 2.0
    });
  };

  // Remove skill in Edit modal
  const handleRemoveSkillInEdit = (idx) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx)
    }));
  };

  // Admin approves certificate
  const handleApproveCert = (reqId) => {
    const code = `SKG-2026-AUTH-${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = certRequests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'APPROVED',
          approvedDate: new Date().toISOString(),
          approvedBy: 'Platform System Administrator (Official Board)',
          verificationCode: code,
          remarks: 'Officially validated and authenticated by Platform Administrator.'
        };
      }
      return r;
    });

    setCertRequests(updated);
    localStorage.setItem('skillgap_cert_requests', JSON.stringify(updated));
    showToast(`Certificate approved! Verification Code: ${code}`, 'success');
  };

  // Admin rejects certificate
  const handleRejectCert = (reqId) => {
    const updated = certRequests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'REJECTED',
          approvedDate: null,
          approvedBy: 'Platform System Administrator (Declined)',
          remarks: 'Declined during administrative audit. Requires assessment re-evaluation.'
        };
      }
      return r;
    });

    setCertRequests(updated);
    localStorage.setItem('skillgap_cert_requests', JSON.stringify(updated));
    showToast('Certificate request rejected.', 'warning');
  };

  // Create Skill
  const handleCreateSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const skillItem = {
      id: `skill-${Date.now()}`,
      name: newSkill.name.trim(),
      category: newSkill.category,
      description: newSkill.description || `${newSkill.name} competency specification`,
      marketDemandScore: parseInt(newSkill.marketDemandScore) || 80,
    };

    const updatedSkills = [skillItem, ...skills];
    setSkills(updatedSkills);

    const stored = localStorage.getItem('skillgap_admin_skills');
    const custom = stored ? JSON.parse(stored) : [];
    localStorage.setItem('skillgap_admin_skills', JSON.stringify([skillItem, ...custom]));

    showToast(`Skill '${skillItem.name}' added to competency registry!`, 'success');
    setNewSkill({ name: '', category: 'TECHNICAL', description: '', marketDemandScore: 85 });
  };

  // Delete Skill
  const handleDeleteSkill = (skillId) => {
    const updated = skills.filter(s => s.id !== skillId);
    setSkills(updated);
    const stored = localStorage.getItem('skillgap_admin_skills');
    if (stored) {
      const custom = JSON.parse(stored).filter(s => s.id !== skillId);
      localStorage.setItem('skillgap_admin_skills', JSON.stringify(custom));
    }
    showToast('Competency removed from catalog', 'info');
  };

  // Create Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobService.createJob(newJob);
      showToast('Enterprise requisition published!', 'success');
      setNewJob({ title: '', company: '', location: 'Remote', experienceLevel: 'ENTRY_LEVEL', salaryRange: '$100,000 - $120,000', description: '' });
      fetchData();
    } catch (err) {
      showToast('Requisition published in local workspace mode!', 'success');
      const fallbackJob = {
        id: `job-${Date.now()}`,
        ...newJob
      };
      setJobs([fallbackJob, ...jobs]);
      setNewJob({ title: '', company: '', location: 'Remote', experienceLevel: 'ENTRY_LEVEL', salaryRange: '$100,000 - $120,000', description: '' });
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await jobService.deleteJob(id);
      showToast('Job posting removed', 'info');
      fetchData();
    } catch (err) {
      setJobs(jobs.filter(j => j.id !== id));
      showToast('Job posting removed', 'info');
    }
  };

  // Filtered and sorted candidate ranking list
  const rankedCandidates = candidates
    .map(c => ({
      ...c,
      compositeScore: calculateCompositeScore(c)
    }))
    .filter(c => {
      const matchesSearch = 
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.targetCareerRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.skills?.some(s => (s.skillName || s.name)?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === 'ALL' || c.targetCareerRole?.toLowerCase().includes(roleFilter.toLowerCase());
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'ATS') return (b.atsScore || 0) - (a.atsScore || 0);
      if (sortBy === 'INTERVIEW') return (b.interviewScore || 0) - (a.interviewScore || 0);
      if (sortBy === 'VOICE') return (b.voiceScore || 0) - (a.voiceScore || 0);
      return b.compositeScore - a.compositeScore;
    });

  const pendingApprovalsCount = certRequests.filter(r => r.status === 'PENDING_APPROVAL').length;
  const lockedCount = candidates.filter(c => c.isProfileLocked).length;
  const avgReadiness = candidates.length 
    ? Math.round(candidates.reduce((acc, c) => acc + calculateCompositeScore(c), 0) / candidates.length)
    : 88;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Executive Dashboard', to: '/dashboard' }, { label: 'Admin & Talent Console' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-emerald-950/40 text-indigo-700 dark:text-emerald-300 border border-indigo-200 dark:border-emerald-500/30 rounded-full text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Privileged Administrator & Talent Recruiter Governance</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>Candidate Leaderboard & Administrative Console</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Multi-dimensional candidate ranking leaderboard, candidate profile lock overrides, credential authentication, and requisition publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {/* Tab 1: Candidate Rankings */}
            <button
              onClick={() => setActiveTab('rankings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'rankings'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Candidate Rankings ({candidates.length})</span>
            </button>

            {/* Tab 2: Certificate Approvals */}
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
              {pendingApprovalsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] flex items-center justify-center font-black">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* Tab 3: Requisitions */}
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Requisitions ({jobs.length})</span>
            </button>

            {/* Tab 4: Skills Registry */}
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Skills Registry ({skills.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CANDIDATE RANKINGS & LEADERBOARD */}
        {activeTab === 'rankings' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Evaluated Candidates"
                value={candidates.length}
                icon={Users}
                color="indigo"
                subtitle="Active candidate dossiers"
              />
              <StatCard
                title="Avg Composite Readiness"
                value={`${avgReadiness}%`}
                icon={Trophy}
                color="emerald"
                subtitle="Across ATS, skills, interview, voice"
              />
              <StatCard
                title="Locked / Submitted"
                value={lockedCount}
                icon={Lock}
                color="purple"
                subtitle="Profiles sealed from candidate edit"
              />
              <StatCard
                title="Pending Certifications"
                value={pendingApprovalsCount}
                icon={Award}
                color="amber"
                subtitle="Awaiting administrative audit"
              />
            </div>

            {/* Privacy notice banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-emerald-950/20 border border-indigo-200/80 dark:border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-emerald-300 font-medium">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Recruiter Data Privacy Boundary Active:</strong> Standard candidates can strictly view only their own profile & credentials. Administrative users and recruiters hold cross-candidate talent access, scoring overrides, and profile lock controls.
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="glass p-5 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name, email, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                  >
                    <option value="ALL">All Engineering Disciplines</option>
                    <option value="Full Stack Java">Full Stack Java</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Machine Learning">Machine Learning / AI</option>
                    <option value="Frontend">Frontend React</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                  >
                    <option value="COMPOSITE">Sort: Highest Composite Rank</option>
                    <option value="ATS">Sort: ATS Resume Score</option>
                    <option value="INTERVIEW">Sort: Technical Interview Score</option>
                    <option value="VOICE">Sort: Voice Articulation Score</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Candidates Leaderboard Table / Cards */}
            <div className="space-y-4">
              {rankedCandidates.length === 0 ? (
                <div className="glass p-12 text-center rounded-3xl border border-gray-200/50 dark:border-gray-800/50">
                  <p className="text-gray-500 text-sm">No candidate matches the specified search filter criteria.</p>
                </div>
              ) : (
                rankedCandidates.map((cand, index) => {
                  const rank = index + 1;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;

                  return (
                    <div
                      key={cand.email}
                      className={`p-6 rounded-3xl glass border transition-all hover:shadow-lg space-y-5 ${
                        isTop1
                          ? 'border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent'
                          : isTop2
                          ? 'border-slate-300/80 dark:border-slate-600/60'
                          : isTop3
                          ? 'border-amber-700/40 dark:border-amber-600/40'
                          : 'border-gray-200/60 dark:border-gray-800/60'
                      }`}
                    >
                      {/* Top Row: Rank Badge + Candidate Information + Composite Score + Action Buttons */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          {/* Rank Medallion */}
                          <div
                            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md ${
                              isTop1
                                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 font-black'
                                : isTop2
                                ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-black'
                                : isTop3
                                ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white font-black'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isTop1 ? (
                              <>
                                <Trophy className="w-5 h-5 text-slate-950" />
                                <span className="text-[10px] uppercase font-black tracking-wider">#1</span>
                              </>
                            ) : isTop2 ? (
                              <>
                                <Medal className="w-5 h-5 text-slate-900" />
                                <span className="text-[10px] uppercase font-black tracking-wider">#2</span>
                              </>
                            ) : isTop3 ? (
                              <>
                                <Award className="w-5 h-5 text-white" />
                                <span className="text-[10px] uppercase font-black tracking-wider">#3</span>
                              </>
                            ) : (
                              <span className="font-mono text-base font-extrabold">#{rank}</span>
                            )}
                          </div>

                          {/* Candidate Identity */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                {cand.fullName}
                              </h3>
                              {/* Lock status pill */}
                              {cand.isProfileLocked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                  <Lock className="w-3 h-3" />
                                  <span>Locked Profile (Submitted)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                                  <Unlock className="w-3 h-3" />
                                  <span>Pre-Submission (Editable)</span>
                                </span>
                              )}

                              {isTop1 && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-sm uppercase tracking-wider">
                                  Top Recommendation
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                              {cand.targetCareerRole} &bull; <span className="text-gray-500 font-normal">{cand.email}</span>
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 max-w-2xl">
                              {cand.bio || 'Full stack competency evaluation with certified technical proficiencies.'}
                            </p>
                          </div>
                        </div>

                        {/* Composite Score & Actions */}
                        <div className="flex flex-wrap items-center gap-4 lg:self-center">
                          {/* Composite Score Circle / Badge */}
                          <div className="text-right">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                              Composite Score
                            </span>
                            <span className={`text-2xl font-black ${
                              cand.compositeScore >= 90 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : cand.compositeScore >= 80 
                                ? 'text-indigo-600 dark:text-indigo-400' 
                                : 'text-amber-600 dark:text-amber-400'
                            }`}>
                              {cand.compositeScore}%
                            </span>
                          </div>

                          {/* Action Toolbar */}
                          <div className="flex items-center gap-2">
                            {/* View Dossier */}
                            <button
                              onClick={() => setSelectedCandidate(cand)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition"
                              title="View full candidate telemetry dossier"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Dossier</span>
                            </button>

                            {/* Lock / Unlock Toggle */}
                            <button
                              onClick={() => handleToggleLock(cand)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                                cand.isProfileLocked
                                  ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300'
                                  : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                              }`}
                              title={cand.isProfileLocked ? "Admin: Unlock profile to permit candidate changes" : "Admin: Lock profile to freeze candidate submissions"}
                            >
                              {cand.isProfileLocked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Unlock Profile</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Lock Profile</span>
                                </>
                              )}
                            </button>

                            {/* Edit Candidate Profile (Admin Only) */}
                            <button
                              onClick={() => handleOpenEditModal(cand)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow flex items-center gap-1.5 transition"
                              title="Admin: Edit candidate skills, role, or evaluation"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Admin Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Multi-Dimensional Metrics Breakdown Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                        {/* ATS Score */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-indigo-500" />
                              <span>ATS Parse Match</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.atsScore || 90}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${cand.atsScore || 90}%` }} />
                          </div>
                        </div>

                        {/* Skill Match */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-500" />
                              <span>Competency Align</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.skillMatchScore || 88}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cand.skillMatchScore || 88}%` }} />
                          </div>
                        </div>

                        {/* AI Technical Interview */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <Bot className="w-3 h-3 text-purple-500" />
                              <span>AI Tech Interview</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.interviewScore || 85}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${cand.interviewScore || 85}%` }} />
                          </div>
                        </div>

                        {/* AI Voice Articulation */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <Mic className="w-3 h-3 text-amber-500" />
                              <span>Voice Articulation</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.voiceScore || 88}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cand.voiceScore || 88}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Technical Skills Inventory Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-gray-400 mr-1">Verified Skills:</span>
                        {cand.skills && cand.skills.length > 0 ? (
                          cand.skills.slice(0, 6).map((s, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                            >
                              {s.skillName || s.name} {s.proficiencyLevel ? `(${s.proficiencyLevel.slice(0, 3)})` : ''}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No skills registered</span>
                        )}
                        {cand.skills && cand.skills.length > 6 && (
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            +{cand.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATE APPROVALS */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-indigo-300/40 dark:border-indigo-800/50 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-500" />
                    <span>Candidate Competency Certificate Approval Queue</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Candidate certificates can only be officially validated upon administrator review and cryptographic seal approval.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                    {pendingApprovalsCount} Awaiting Review
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    {certRequests.filter(r => r.status === 'APPROVED').length} Authenticated
                  </span>
                </div>
              </div>

              {certRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No certificate requests submitted at this time.
                </div>
              ) : (
                <div className="space-y-4">
                  {certRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-white/60 dark:bg-darkcard/60 border border-gray-200/50 dark:border-gray-800/60 shadow-sm hover:shadow transition space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
                              {req.candidateName}
                            </h4>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                : req.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse'
                            }`}>
                              {req.status === 'APPROVED' ? 'Approved & Validated' : req.status === 'REJECTED' ? 'Rejected' : 'Pending Admin Approval'}
                            </span>
                          </div>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                            {req.careerRole} &bull; <span className="text-gray-500 font-normal">{req.candidateEmail}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Requested: {req.requestDate ? new Date(req.requestDate).toLocaleString() : 'Recent'} &bull; Verification Code: <strong className="font-mono text-gray-800 dark:text-gray-200">{req.verificationCode || 'PENDING'}</strong>
                          </p>
                        </div>

                        {/* Approval Actions */}
                        <div className="flex items-center gap-2">
                          {req.status !== 'APPROVED' ? (
                            <button
                              onClick={() => handleApproveCert(req.id)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow flex items-center gap-1.5 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Authorize & Seal Certificate</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-300">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Cryptographically Verified</span>
                            </div>
                          )}

                          {req.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleRejectCert(req.id)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Display Requested Skills */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/40">
                        {req.skills?.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                          >
                            {s.name} &bull; <strong className="text-indigo-600 dark:text-indigo-400">{s.proficiency}</strong> ({s.years} yrs)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ENTERPRISE REQUISITIONS */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Job Form */}
            <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <span>Publish Enterprise Requisition</span>
              </h3>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Position Title</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Senior Full Stack Java Developer"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      placeholder="TechCorp Solutions"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Work Location</label>
                    <input
                      type="text"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Seniority Level</label>
                    <select
                      value={newJob.experienceLevel}
                      onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    >
                      {EXPERIENCE_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Compensation Range</label>
                    <input
                      type="text"
                      value={newJob.salaryRange}
                      onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Requisition Description & Core Competencies</label>
                  <textarea
                    rows="3"
                    required
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Detailed position responsibilities, architectural duties, and core skills..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-sm font-bold text-white gradient-btn rounded-xl shadow-md flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Authorize & Publish Requisition</span>
                </button>
              </form>
            </div>

            {/* Active Job Postings List */}
            <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Enterprise Requisitions ({jobs.length})</h3>

              {loading ? (
                <SkeletonLoader count={3} />
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {jobs.map((j) => (
                    <div key={j.id} className="p-4 rounded-2xl bg-white/40 dark:bg-darkcard/40 border border-gray-200/30 dark:border-gray-800/30 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{j.title}</h4>
                        <p className="text-xs text-gray-500">{j.company} &bull; {j.location} &bull; {j.experienceLevel}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteJob(j.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MASTER SKILLS REGISTRY */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Master Skill */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <span>Register Technical Competency</span>
              </h3>
              <p className="text-xs text-gray-500">
                Skills registered here become available in candidate profiles, assessment simulations, and verified certificate audits.
              </p>

              <form onSubmit={handleCreateSkill} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js 15, Rust, Apache Kafka"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                    >
                      {SKILL_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Demand Index (1-100)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={newSkill.marketDemandScore}
                      onChange={(e) => setNewSkill({ ...newSkill, marketDemandScore: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white gradient-btn rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Competency</span>
                </button>
              </form>
            </div>

            {/* List of Registered Competencies */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                Active Master Skills Taxonomy ({skills.length})
              </h3>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {skills.map((s) => (
                  <div
                    key={s.id || s.name}
                    className="p-3 rounded-xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">{s.name}</h4>
                      <p className="text-[11px] text-gray-500">{s.category} &bull; Demand Score: {s.marketDemandScore || 85}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 transition"
                      title="Delete competency"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: CANDIDATE DOSSIER MODAL */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-gray-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow">
                    {selectedCandidate.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <span>{selectedCandidate.fullName}</span>
                      {selectedCandidate.isProfileLocked ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                          Profile Locked
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                          Pre-Submission
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      {selectedCandidate.targetCareerRole} &bull; <span className="text-gray-500 font-normal">{selectedCandidate.email}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Composite Score Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500">Talent Acquisition Composite Readiness</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-emerald-400">
                    {calculateCompositeScore(selectedCandidate)}% Overall Alignment
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500 space-y-0.5">
                  <p>ATS Match: <strong className="text-gray-900 dark:text-white">{selectedCandidate.atsScore || 90}%</strong></p>
                  <p>Tech Interview: <strong className="text-gray-900 dark:text-white">{selectedCandidate.interviewScore || 85}%</strong></p>
                  <p>Voice Articulation: <strong className="text-gray-900 dark:text-white">{selectedCandidate.voiceScore || 88}%</strong></p>
                </div>
              </div>

              {/* Bio & Document metadata */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Professional Dossier Overview</h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white/40 dark:bg-darkcard/40 p-3.5 rounded-xl border border-gray-200/40 dark:border-gray-800/40">
                  {selectedCandidate.bio || 'Enterprise candidate undergoing skill gap and competency evaluation.'}
                </p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Resume Ingestion File: <strong>{selectedCandidate.resumeName || 'Candidate_Resume.pdf'}</strong></span>
                </p>
              </div>

              {/* Technical Skills Inventory */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Technical Skills & Competency Metrics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCandidate.skills?.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/60 dark:bg-darkcard/60 border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between text-xs"
                    >
                      <span className="font-extrabold text-gray-900 dark:text-white">{s.skillName || s.name}</span>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-emerald-400 bg-indigo-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-emerald-500/30">
                        {s.proficiencyLevel || 'ADVANCED'} ({s.yearsExperience || 2} yrs)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
                <button
                  onClick={() => {
                    handleToggleLock(selectedCandidate);
                    setSelectedCandidate(prev => ({ ...prev, isProfileLocked: !prev.isProfileLocked }));
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5"
                >
                  {selectedCandidate.isProfileLocked ? (
                    <>
                      <Unlock className="w-4 h-4 text-amber-500" />
                      <span>Unlock Candidate Profile</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>Lock Candidate Profile</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-5 py-2 text-xs font-black text-white gradient-btn rounded-xl shadow"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: ADMIN EDIT CANDIDATE PROFILE MODAL */}
        {editingCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-indigo-300/60 dark:border-indigo-800/60 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-gray-800/60">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Administrator Profile Override: {editingCandidate.fullName}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    As an administrator or recruiter, you have privileged authority to update candidate attributes, role benchmarks, and skills.
                  </p>
                </div>
                <button
                  onClick={() => setEditingCandidate(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCandidateEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={editForm.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-slate-900 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Engineering Role</label>
                    <input
                      type="text"
                      required
                      value={editForm.targetCareerRole}
                      onChange={(e) => setEditForm({ ...editForm, targetCareerRole: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Seniority Experience Level</label>
                    <select
                      value={editForm.experienceLevel}
                      onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                    >
                      {EXPERIENCE_LEVELS.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Score Adjustments */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">ATS Score (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={editForm.atsScore}
                      onChange={(e) => setEditForm({ ...editForm, atsScore: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Interview Score (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={editForm.interviewScore}
                      onChange={(e) => setEditForm({ ...editForm, interviewScore: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Voice Score (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={editForm.voiceScore}
                      onChange={(e) => setEditForm({ ...editForm, voiceScore: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Executive Recruiter Notes & Bio</label>
                  <textarea
                    rows="2"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs"
                  />
                </div>

                {/* Candidate Skills Management */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Candidate Verified Skills ({editForm.skills.length})
                    </label>
                  </div>

                  {/* Skills pill list with remove button */}
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    {editForm.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-darkcard text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm"
                      >
                        <span>{s.skillName || s.name}</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400">({s.proficiencyLevel || 'ADVANCED'})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillInEdit(idx)}
                          className="text-rose-500 hover:text-rose-700 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add skill row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add technical skill..."
                      value={newSkillItem.skillName}
                      onChange={(e) => setNewSkillItem({ ...newSkillItem, skillName: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs sm:col-span-2"
                    />
                    <select
                      value={newSkillItem.proficiencyLevel}
                      onChange={(e) => setNewSkillItem({ ...newSkillItem, proficiencyLevel: e.target.value })}
                      className="px-2 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs"
                    >
                      {PROFICIENCY_LEVELS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSkillInEdit}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
                  <button
                    type="button"
                    onClick={() => setEditingCandidate(null)}
                    className="px-4 py-2.5 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-black text-white gradient-btn rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Candidate Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
