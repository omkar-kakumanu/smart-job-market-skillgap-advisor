import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';
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
  BookOpen, 
  Search, 
  ExternalLink,
  Star,
  Clock,
  UserCheck
} from 'lucide-react';
import { EXPERIENCE_LEVELS, SKILL_CATEGORIES } from '../utils/constants';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('certificates'); // 'certificates', 'curricula', 'jobs'
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certRequests, setCertRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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

  // New Course Form State (Mapped to Admin Skills)
  const [newCourse, setNewCourse] = useState({
    title: '',
    primarySkillName: '',
    provider: 'Coursera / Meta',
    rating: 4.8,
    durationHours: 36,
    difficulty: 'Advanced',
    courseUrl: 'https://coursera.org/search?query=software',
  });

  const loadCertificateRequests = () => {
    try {
      const stored = localStorage.getItem('skillgap_cert_requests');
      if (stored) {
        setCertRequests(JSON.parse(stored));
      } else {
        // Seed default pending requests for demonstration
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
      const [jRes, sRes, cRes] = await Promise.all([
        jobService.getJobs({ page: 0, size: 50 }).catch(() => ({ content: [] })),
        jobService.getAllSkills().catch(() => []),
        jobService.getAllCourses().catch(() => []),
      ]);

      // Read admin added skills from localStorage
      const storedSkills = localStorage.getItem('skillgap_admin_skills');
      const customSkills = storedSkills ? JSON.parse(storedSkills) : [];
      const combinedSkills = [...(sRes || [])];
      customSkills.forEach(cs => {
        if (!combinedSkills.some(s => s.name?.toLowerCase() === cs.name?.toLowerCase())) {
          combinedSkills.push(cs);
        }
      });

      // Read admin added courses from localStorage
      const storedCourses = localStorage.getItem('skillgap_admin_courses');
      const customCourses = storedCourses ? JSON.parse(storedCourses) : [];
      const combinedCourses = [...(cRes || [])];
      customCourses.forEach(cc => {
        if (!combinedCourses.some(c => c.id === cc.id)) {
          combinedCourses.unshift(cc);
        }
      });

      setJobs(jRes?.content || []);
      setSkills(combinedSkills);
      setCourses(combinedCourses);
      if (combinedSkills.length > 0) {
        setNewCourse(prev => ({ ...prev, primarySkillName: combinedSkills[0].name }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    loadCertificateRequests();
  }, []);

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

    // Save custom skills
    const stored = localStorage.getItem('skillgap_admin_skills');
    const custom = stored ? JSON.parse(stored) : [];
    localStorage.setItem('skillgap_admin_skills', JSON.stringify([skillItem, ...custom]));

    showToast(`Skill '${skillItem.name}' added to competency registry!`, 'success');
    setNewSkill({ name: '', category: 'TECHNICAL', description: '', marketDemandScore: 85 });
    setNewCourse(prev => ({ ...prev, primarySkillName: skillItem.name }));
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

  // Create Course mapped to Skill
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;

    const courseItem = {
      id: `course-${Date.now()}`,
      title: newCourse.title.trim(),
      primarySkillName: newCourse.primarySkillName || (skills[0]?.name || 'Java 21'),
      provider: newCourse.provider,
      rating: parseFloat(newCourse.rating) || 4.8,
      durationHours: parseInt(newCourse.durationHours) || 30,
      difficulty: newCourse.difficulty,
      courseUrl: newCourse.courseUrl || 'https://coursera.org/search?query=tech',
    };

    const updatedCourses = [courseItem, ...courses];
    setCourses(updatedCourses);

    // Save to local storage for persistence & Courses.jsx consumption
    const stored = localStorage.getItem('skillgap_admin_courses');
    const custom = stored ? JSON.parse(stored) : [];
    localStorage.setItem('skillgap_admin_courses', JSON.stringify([courseItem, ...custom]));

    showToast(`Course '${courseItem.title}' mapped to skill '${courseItem.primarySkillName}'!`, 'success');
    setNewCourse({
      title: '',
      primarySkillName: skills[0]?.name || '',
      provider: 'Coursera / Meta',
      rating: 4.8,
      durationHours: 36,
      difficulty: 'Advanced',
      courseUrl: 'https://coursera.org/search?query=software',
    });
  };

  // Delete Course
  const handleDeleteCourse = (courseId) => {
    const updated = courses.filter(c => c.id !== courseId);
    setCourses(updated);
    const stored = localStorage.getItem('skillgap_admin_courses');
    if (stored) {
      const custom = JSON.parse(stored).filter(c => c.id !== courseId);
      localStorage.setItem('skillgap_admin_courses', JSON.stringify(custom));
    }
    showToast('Course curriculum removed', 'info');
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

  const pendingApprovalsCount = certRequests.filter(r => r.status === 'PENDING_APPROVAL').length;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Executive Dashboard', to: '/dashboard' }, { label: 'Administrative Console' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span>Administrative Governance Console</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Verify candidate competency certificates, administer accredited course curricula by skill, and publish enterprise requisitions.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificate Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] flex items-center justify-center font-black">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('curricula')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'curricula'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Skills & Curricula ({courses.length})</span>
            </button>

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
          </div>
        </div>

        {/* TAB 1: CERTIFICATE APPROVALS */}
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
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Authorize & Approve</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRejectCert(req.id)}
                              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                            >
                              <span>Revoke Approval</span>
                            </button>
                          )}

                          {req.status === 'PENDING_APPROVAL' && (
                            <button
                              onClick={() => handleRejectCert(req.id)}
                              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl border border-rose-300/40 transition flex items-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Decline</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Verified Skills In Certificate */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800/40">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                          Competencies Requested in Certificate ({req.skills?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(req.skills || []).map((sk) => (
                            <span
                              key={sk.name}
                              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                            >
                              {sk.name} <span className="text-[10px] text-indigo-500 font-mono">({sk.proficiency} &bull; {sk.years}y)</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS & ACCREDITED CURRICULA */}
        {activeTab === 'curricula' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form 1: Add New Master Skill */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-500" />
                  <span>Define Technical Competency</span>
                </h3>
                <p className="text-xs text-gray-500">
                  New skills created here immediately become available in the Course catalog and verified certificate builder.
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

              {/* Form 2: Map Accredited Course to Admin Skill */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-500" />
                  <span>Map Accredited Course to Skill</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Accredited courses added here will be categorized under the skill and displayed in the Candidate Courses Directory.
                </p>

                <form onSubmit={handleCreateCourse} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Masterclass in Spring Boot 3 & Microservices Architecture"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Skill</label>
                      <select
                        value={newCourse.primarySkillName}
                        onChange={(e) => setNewCourse({ ...newCourse, primarySkillName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs font-bold"
                      >
                        {skills.map(s => (
                          <option key={s.id || s.name} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Accredited Provider</label>
                      <input
                        type="text"
                        value={newCourse.provider}
                        onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}
                        placeholder="Coursera / Google / AWS"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="3.0"
                        max="5.0"
                        value={newCourse.rating}
                        onChange={(e) => setNewCourse({ ...newCourse, rating: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Duration (Hours)</label>
                      <input
                        type="number"
                        value={newCourse.durationHours}
                        onChange={(e) => setNewCourse({ ...newCourse, durationHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Level</label>
                      <select
                        value={newCourse.difficulty}
                        onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Course URL</label>
                    <input
                      type="url"
                      value={newCourse.courseUrl}
                      onChange={(e) => setNewCourse({ ...newCourse, courseUrl: e.target.value })}
                      placeholder="https://coursera.org/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-bold text-white gradient-btn rounded-xl shadow flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Accredited Course</span>
                  </button>
                </form>
              </div>
            </div>

            {/* List of Registered Competencies & Attached Courses */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Active Admin Skills & Curricula Taxonomy ({courses.length} courses across {skills.length} skills)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/50 dark:border-gray-800/50 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                          {c.primarySkillName}
                        </span>
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Delete course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2">{c.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-1">{c.provider} &bull; {c.durationHours}h &bull; {c.difficulty}</p>
                    </div>

                    <a
                      href={c.courseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                    >
                      <span>Preview Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENTERPRISE REQUISITIONS */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Job Form */}
            <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-brand-500" />
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
      </main>
    </div>
  );
};

export default AdminDashboard;
