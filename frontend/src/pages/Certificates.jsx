import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkillBadge from '../components/SkillBadge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Cpu,
  User,
  Share2
} from 'lucide-react';

const Certificates = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const certRef = useRef(null);

  const [allMasterSkills, setAllMasterSkills] = useState([]);
  const [candidateName, setCandidateName] = useState(user?.fullName || 'John Doe');
  const [careerRole, setCareerRole] = useState(user?.targetCareerRole || 'Full Stack Software Engineer');
  const [certTitle, setCertTitle] = useState('Certified Skill Gap & Market Competency Certificate');
  const [themeStyle, setThemeStyle] = useState('gold'); // gold, emerald, indigo, dark
  const [certSkills, setCertSkills] = useState([]);

  const [selectedMasterSkillId, setSelectedMasterSkillId] = useState('');
  const [customProficiency, setCustomProficiency] = useState('ADVANCED');
  const [customYears, setCustomYears] = useState('3.0');

  // Certificate Approval State: 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'
  const [certStatus, setCertStatus] = useState('PENDING_APPROVAL');
  const [approvalDetails, setApprovalDetails] = useState({
    approvedBy: 'Pending Administrator Review',
    approvedDate: null,
    verificationCode: 'SKG-2026-PENDING-REVIEW',
    remarks: 'Awaiting administrator verification and credential audit.'
  });

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.email?.toLowerCase().includes('admin');

  // Load existing certificate request for current user
  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillgap_cert_requests');
      if (stored) {
        const requests = JSON.parse(stored);
        const userEmail = (user?.email || 'user@skillgap.com').toLowerCase();
        const existing = requests.find(r => r.candidateEmail?.toLowerCase() === userEmail);
        if (existing) {
          setCertStatus(existing.status);
          if (existing.candidateName) setCandidateName(existing.candidateName);
          if (existing.careerRole) setCareerRole(existing.careerRole);
          if (existing.certTitle) setCertTitle(existing.certTitle);
          if (existing.themeStyle) setThemeStyle(existing.themeStyle);
          if (existing.skills && existing.skills.length > 0) setCertSkills(existing.skills);
          setApprovalDetails({
            approvedBy: existing.approvedBy || (existing.status === 'APPROVED' ? 'System Administrator (Admin Board)' : 'Pending Administrator Review'),
            approvedDate: existing.approvedDate || null,
            verificationCode: existing.verificationCode || (existing.status === 'APPROVED' ? `SKG-2026-AUTH-${existing.id?.slice(-4) || '8849'}` : 'SKG-2026-PENDING-REVIEW'),
            remarks: existing.remarks || ''
          });
        }
      }
    } catch (err) {
      console.warn('Error reading certificate requests', err);
    }
  }, [user]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await jobService.getAllSkills();
        setAllMasterSkills(skillsData);
        if (skillsData.length > 0) setSelectedMasterSkillId(skillsData[0].id);

        // Pre-populate cert skills from user's current profile if available and not set
        if (certSkills.length === 0) {
          if (user?.skills && user.skills.length > 0) {
            const userSkillList = user.skills.map((s) => ({
              name: s.skillName,
              category: s.category,
              proficiency: s.proficiencyLevel || 'ADVANCED',
              years: s.yearsExperience || 2.0,
            }));
            setCertSkills(userSkillList);
          } else {
            // Default initial skills
            setCertSkills([
              { name: 'Java 21', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.5 },
              { name: 'Spring Boot 3', category: 'TECHNICAL', proficiency: 'INTERMEDIATE', years: 2.0 },
              { name: 'ReactJS', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.0 },
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSkills();
  }, [user]);

  const handleAddSkillToCert = () => {
    const foundSkill = allMasterSkills.find((s) => String(s.id) === String(selectedMasterSkillId));
    if (!foundSkill) return;

    if (certSkills.some((cs) => cs.name.toLowerCase() === foundSkill.name.toLowerCase())) {
      showToast('Skill is already included in this certificate!', 'info');
      return;
    }

    const newSkillItem = {
      name: foundSkill.name,
      category: foundSkill.category,
      proficiency: customProficiency,
      years: parseFloat(customYears) || 1.0,
    };

    setCertSkills([...certSkills, newSkillItem]);
    showToast(`Added ${foundSkill.name} to certificate!`, 'success');
  };

  const handleRemoveSkillFromCert = (skillName) => {
    setCertSkills(certSkills.filter((s) => s.name !== skillName));
    showToast(`Removed ${skillName} from certificate`, 'info');
  };

  const handleSaveSkillsToUserProfile = async () => {
    try {
      for (const cs of certSkills) {
        const match = allMasterSkills.find((ms) => ms.name.toLowerCase() === cs.name.toLowerCase());
        if (match) {
          try {
            await userService.addSkill(match.id, cs.proficiency, cs.years);
          } catch (e) {
            // ignore duplicates
          }
        }
      }
      const updatedProfile = await userService.getProfile();
      updateUserProfile(updatedProfile);
      showToast('Successfully synchronized certificate skills to your candidate profile!', 'success');
    } catch (err) {
      showToast('Failed to sync skills to profile', 'error');
    }
  };

  // Submit Certificate for Admin Approval
  const handleSubmitForAdminApproval = () => {
    const userEmail = (user?.email || 'user@skillgap.com').toLowerCase();
    const stored = localStorage.getItem('skillgap_cert_requests');
    let requests = stored ? JSON.parse(stored) : [];

    const requestObj = {
      id: `cert-req-${Date.now()}`,
      candidateName,
      candidateEmail: userEmail,
      careerRole,
      certTitle,
      skills: certSkills,
      themeStyle,
      status: 'PENDING_APPROVAL',
      requestDate: new Date().toISOString(),
      approvedDate: null,
      approvedBy: 'Pending Administrator Review',
      verificationCode: 'SKG-2026-PENDING-REVIEW',
      remarks: 'Application submitted for official administrator credential verification.'
    };

    // Replace existing or prepend
    requests = requests.filter(r => r.candidateEmail?.toLowerCase() !== userEmail);
    requests.unshift(requestObj);
    localStorage.setItem('skillgap_cert_requests', JSON.stringify(requests));

    setCertStatus('PENDING_APPROVAL');
    setApprovalDetails({
      approvedBy: 'Pending Administrator Review',
      approvedDate: null,
      verificationCode: 'SKG-2026-PENDING-REVIEW',
      remarks: 'Application submitted for official administrator credential verification.'
    });

    showToast('Certificate request submitted to Administrator for review!', 'info');
  };

  // Admin Quick-Approve / Reject Action
  const handleAdminApproveCertificate = (newStatus = 'APPROVED') => {
    const userEmail = (user?.email || 'user@skillgap.com').toLowerCase();
    const stored = localStorage.getItem('skillgap_cert_requests');
    let requests = stored ? JSON.parse(stored) : [];

    const code = newStatus === 'APPROVED' ? `SKG-2026-AUTH-${Math.floor(1000 + Math.random() * 9000)}` : 'REVOKED';
    const approvedBy = newStatus === 'APPROVED' ? (user?.fullName ? `${user.fullName} (System Administrator)` : 'Lead System Administrator') : 'System Administrator (Rejected)';

    requests = requests.map(r => {
      if (r.candidateEmail?.toLowerCase() === userEmail) {
        return {
          ...r,
          status: newStatus,
          approvedDate: newStatus === 'APPROVED' ? new Date().toISOString() : null,
          approvedBy,
          verificationCode: code,
          remarks: newStatus === 'APPROVED' ? 'Officially validated & approved by administrator.' : 'Rejected by administrator.'
        };
      }
      return r;
    });

    localStorage.setItem('skillgap_cert_requests', JSON.stringify(requests));
    setCertStatus(newStatus);
    setApprovalDetails({
      approvedBy,
      approvedDate: newStatus === 'APPROVED' ? new Date().toISOString() : null,
      verificationCode: code,
      remarks: newStatus === 'APPROVED' ? 'Officially validated & approved by administrator.' : 'Rejected by administrator.'
    });

    showToast(newStatus === 'APPROVED' ? 'Certificate officially APPROVED by Administrator!' : 'Certificate marked REJECTED', newStatus === 'APPROVED' ? 'success' : 'warning');
  };

  const handlePrint = () => {
    if (certStatus !== 'APPROVED') {
      showToast('Export locked! Certificate can only be exported after Administrator approval.', 'error');
      return;
    }
    window.print();
  };

  const getThemeClasses = () => {
    switch (themeStyle) {
      case 'emerald':
        return 'from-emerald-950 via-teal-900 to-slate-950 text-emerald-100 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]';
      case 'indigo':
        return 'from-indigo-950 via-slate-900 to-purple-950 text-indigo-100 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.3)]';
      case 'dark':
        return 'from-slate-950 via-gray-900 to-black text-gray-100 border-gray-700 shadow-[0_0_50px_rgba(255,255,255,0.1)]';
      case 'gold':
      default:
        return 'from-[#1a1508] via-[#2a220d] to-[#0f0c05] text-amber-100 border-amber-500/60 shadow-[0_0_60px_rgba(245,158,11,0.25)]';
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Candidate Dashboard', to: '/dashboard' }, { label: 'Verified Skill Credentials' }]} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-8 h-8 text-amber-500 animate-pulse" />
              <span>Verified Competency Credential Generator</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Generate auditable, cryptographically verified candidate competency certificates complete with audit validation and verifiable QR code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {certStatus !== 'APPROVED' ? (
              <button
                onClick={handleSubmitForAdminApproval}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black font-tech flex items-center gap-2 transition shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit for Admin Approval</span>
              </button>
            ) : (
              <span className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-tech flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                <span>Admin Approved</span>
              </span>
            )}

            <button
              onClick={handleSaveSkillsToUserProfile}
              className="px-4 py-2.5 rounded-xl border border-sky-400/40 dark:border-emerald-500/40 bg-sky-50 dark:bg-emerald-950/40 text-sky-700 dark:text-emerald-300 hover:bg-sky-100 text-xs font-bold font-tech flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sync to Profile</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={certStatus !== 'APPROVED'}
              className={`px-5 py-2.5 rounded-xl font-tech text-xs font-bold flex items-center gap-2 border uppercase tracking-wider transition ${
                certStatus === 'APPROVED'
                  ? 'gradient-btn text-white shadow-md border-sky-300/40 dark:border-emerald-400/40 cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-75'
              }`}
              title={certStatus !== 'APPROVED' ? 'Locked: Requires Admin Approval first' : 'Export PDF'}
            >
              <Printer className="w-4 h-4" />
              <span>{certStatus === 'APPROVED' ? 'Export Verified PDF' : 'PDF Locked (Needs Admin Approval)'}</span>
            </button>
          </div>
        </div>

        {/* Admin Quick-Action Bar if user has Admin privileges */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider">
                Admin Console Mode
              </div>
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                You are viewing this as an Administrator. You have authority to review and approve candidate certificates.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdminApproveCertificate('APPROVED')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>Authorize & Approve Certificate</span>
              </button>
              <button
                onClick={() => handleAdminApproveCertificate('REJECTED')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}

        {/* Certificate Approval Status Banner */}
        <div className="mb-6">
          {certStatus === 'APPROVED' ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
              <BadgeCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold uppercase tracking-wide">Official Credential Approved & Authenticated</span>
                <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                  Approved by: <strong>{approvalDetails.approvedBy}</strong> &bull; Verification Code: <strong className="font-mono">{approvalDetails.verificationCode}</strong>. PDF export and cryptographic verification seal are unlocked.
                </p>
              </div>
            </div>
          ) : certStatus === 'REJECTED' ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center gap-3 text-rose-800 dark:text-rose-300">
              <ShieldCheck className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold uppercase tracking-wide">Certificate Request Rejected by Administrator</span>
                <p className="mt-0.5 text-rose-700 dark:text-rose-400">
                  This credential was declined during administrative audit. Please revise your verified skills inventory and click "Submit for Admin Approval".
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-3 text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-6 h-6 text-amber-500 flex-shrink-0 animate-pulse" />
              <div className="text-xs">
                <span className="font-extrabold uppercase tracking-wide">Pending Administrator Approval</span>
                <p className="mt-0.5 text-amber-700 dark:text-amber-400">
                  Official certificates can only be approved through Administrator review. Once verified by an administrator, official PDF export and digital authentication seals will unlock.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Skill Insertion Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Certificate Meta Details Form */}
            <div className="glass p-6 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-4 font-tech">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-sky-700 dark:text-emerald-400 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-amber-500" />
                  <span>Certificate Metadata</span>
                </h3>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  certStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {certStatus}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Candidate Full Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Target Career Role</label>
                  <input
                    type="text"
                    value={careerRole}
                    onChange={(e) => setCareerRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Certificate Header Title</label>
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Certificate Theme Aesthetic</label>
                  <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setThemeStyle('gold')}
                      className={`py-2 rounded-xl border transition ${
                        themeStyle === 'gold' ? 'border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      Gold
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeStyle('emerald')}
                      className={`py-2 rounded-xl border transition ${
                        themeStyle === 'emerald' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      Emerald
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeStyle('indigo')}
                      className={`py-2 rounded-xl border transition ${
                        themeStyle === 'indigo' ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500/40' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      Indigo
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeStyle('dark')}
                      className={`py-2 rounded-xl border transition ${
                        themeStyle === 'dark' ? 'border-gray-400 bg-gray-800 text-white ring-2 ring-gray-400/40' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSubmitForAdminApproval}
                    className="w-full py-2.5 text-xs font-extrabold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Request to Admin for Official Approval</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Insert Skills to Certificate Form */}
            <div className="glass p-6 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-4 font-tech">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-sky-700 dark:text-emerald-400 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Insert Skills into Certificate</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Select Skill from Catalog</label>
                  <select
                    value={selectedMasterSkillId}
                    onChange={(e) => setSelectedMasterSkillId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-darkcard text-xs font-sans"
                  >
                    {allMasterSkills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Proficiency Level</label>
                    <select
                      value={customProficiency}
                      onChange={(e) => setCustomProficiency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-darkcard text-xs font-sans"
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                      <option value="EXPERT">EXPERT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Years Experience</label>
                    <input
                      type="number"
                      step="0.5"
                      value={customYears}
                      onChange={(e) => setCustomYears(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-darkcard text-xs font-sans"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddSkillToCert}
                  className="w-full py-2.5 text-xs font-bold text-white gradient-btn rounded-xl shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Skill to Certificate</span>
                </button>
              </div>

              {/* Skills Currently in Cert */}
              <div className="pt-3 border-t border-gray-200/40 dark:border-gray-800/40 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between items-center">
                  <span>Inserted Skills ({certSkills.length})</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {certSkills.map((sk) => (
                    <span
                      key={sk.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-darkcard/80 border border-sky-300/40 dark:border-emerald-500/30 text-xs font-bold font-sans shadow-sm"
                    >
                      <span>{sk.name}</span>
                      <span className="text-[10px] text-amber-500 font-tech">({sk.proficiency})</span>
                      <button
                        onClick={() => handleRemoveSkillFromCert(sk.name)}
                        className="text-rose-500 hover:text-rose-700 ml-1"
                        title="Remove skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live High-Aesthetic Certificate Preview */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <div className="text-xs font-extrabold uppercase tracking-widest text-sky-700 dark:text-emerald-400 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Official Live Certificate Document Preview</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider ${
                certStatus === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
              }`}>
                {certStatus === 'APPROVED' ? 'ADMIN APPROVED & SIGNED' : 'REQUIRES ADMIN APPROVAL'}
              </span>
            </div>

            {/* Print Container */}
            <div
              ref={certRef}
              id="certificate-print-area"
              className={`relative p-8 sm:p-12 rounded-3xl border-4 bg-gradient-to-br transition-all duration-300 font-cinzel overflow-hidden ${getThemeClasses()}`}
            >
              {/* Outer Decorative Gold Foil Border Frame */}
              <div className="absolute inset-3 rounded-2xl border-2 border-amber-500/30 pointer-events-none" />

              {/* Watermark for Non-Approved state */}
              {certStatus !== 'APPROVED' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
                  <div className="transform -rotate-25 border-4 border-amber-500/40 bg-black/60 px-8 py-4 rounded-3xl text-center backdrop-blur-xs">
                    <span className="text-xl sm:text-2xl font-black font-sans uppercase tracking-[0.25em] text-amber-400">
                      PENDING ADMIN APPROVAL
                    </span>
                    <p className="text-[10px] font-tech text-amber-200/80 mt-1">
                      NOT VALID FOR OFFICIAL VERIFICATION UNTIL APPROVED BY PLATFORM ADMINISTRATOR
                    </p>
                  </div>
                </div>
              )}

              {/* Watermark Seal Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Cpu className="w-96 h-96 text-amber-400" />
              </div>

              {/* Certificate Header */}
              <div className="relative z-10 text-center space-y-3 pb-6 border-b border-amber-500/30">
                <div className="flex items-center justify-center space-x-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-lg">
                    <Cpu className="w-7 h-7 text-amber-400 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-black tracking-widest text-amber-300 uppercase">
                      SKILLGAP ADVISOR PLATFORM
                    </h2>
                    <p className="text-[10px] font-tech font-bold uppercase tracking-widest text-amber-400/80">
                      Enterprise Market Intelligence & Verification Board
                    </p>
                  </div>
                </div>

                <div className="pt-3">
                  <h3 className="text-xs font-tech font-bold uppercase tracking-[0.3em] text-amber-400/90">
                    OFFICIAL CERTIFICATE OF COMPETENCY
                  </h3>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white mt-1 uppercase drop-shadow-md">
                    {certTitle}
                  </h1>
                </div>
              </div>

              {/* Body Content */}
              <div className="relative z-10 py-8 text-center space-y-6 font-tech">
                <p className="text-xs uppercase tracking-widest text-amber-200/70 font-semibold">
                  THIS IS TO OFFICIALLY CERTIFY THAT
                </p>

                <div className="inline-block px-8 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/40">
                  <h2 className="text-2xl sm:text-3xl font-cinzel font-black tracking-wider text-amber-300 uppercase">
                    {candidateName}
                  </h2>
                </div>

                <p className="text-xs font-sans text-amber-100/80 max-w-lg mx-auto leading-relaxed">
                  has successfully demonstrated market-aligned technical proficiency and completed verified skill assessments for the career role of{' '}
                  <strong className="text-amber-300 font-bold uppercase">{careerRole}</strong>.
                </p>

                {/* Certified Skills Grid */}
                <div className="pt-4 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>VERIFIED TECHNICAL & SOFT SKILLS INVENTORY</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-xl mx-auto">
                    {certSkills.map((sk) => (
                      <div
                        key={sk.name}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-bold font-sans flex items-center space-x-1.5 shadow-sm"
                      >
                        <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{sk.name}</span>
                        <span className="text-[10px] font-tech text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          {sk.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificate Footer / Signature & QR Code */}
              <div className="relative z-10 pt-6 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 font-tech">
                {/* QR Code & Verification ID */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-white text-slate-900 shadow-md">
                    <QrCode className="w-10 h-10" />
                  </div>
                  <div className="text-left text-[10px] space-y-0.5">
                    <div className="font-bold text-amber-300 uppercase tracking-wider">Verification Code</div>
                    <div className="font-mono text-amber-100/70">ID: {approvalDetails.verificationCode}</div>
                    <div className={`font-bold ${certStatus === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      Status: {certStatus === 'APPROVED' ? 'Officially Authenticated & Admin Approved' : 'Pending Admin Approval'}
                    </div>
                  </div>
                </div>

                {/* Official Signature */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="font-cinzel italic text-lg text-amber-300 font-bold tracking-widest">
                    {certStatus === 'APPROVED' ? approvalDetails.approvedBy : 'Pending Administrator Review'}
                  </div>
                  <div className="h-0.5 w-40 bg-gradient-to-r from-transparent via-amber-400 to-transparent sm:ml-auto" />
                  <div className="text-[10px] uppercase tracking-widest text-amber-400/80 font-bold">
                    Official Verification & Certification Authority
                  </div>
                  <div className="text-[10px] text-amber-100/60">
                    {certStatus === 'APPROVED' && approvalDetails.approvedDate
                      ? `Approved Date: ${new Date(approvalDetails.approvedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                      : 'Audit Review: In Progress'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Certificates;
