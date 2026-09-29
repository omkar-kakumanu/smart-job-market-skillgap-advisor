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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await jobService.getAllSkills();
        setAllMasterSkills(skillsData);
        if (skillsData.length > 0) setSelectedMasterSkillId(skillsData[0].id);

        // Pre-populate cert skills from user's current profile if available
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
      // Find skill IDs for certSkills that match master skills
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

  const handlePrint = () => {
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
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Skill Certificate Generator' }]} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-8 h-8 text-amber-500 animate-pulse" />
              <span>Verified Skill Certificate Generator</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Insert your technical & soft skills into an official verified certificate and export/sync to your profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveSkillsToUserProfile}
              className="px-4 py-2.5 rounded-xl border border-sky-400/40 dark:border-emerald-500/40 bg-sky-50 dark:bg-emerald-950/40 text-sky-700 dark:text-emerald-300 hover:bg-sky-100 text-xs font-bold font-tech flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sync Skills to Profile</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl gradient-btn font-tech text-xs font-bold text-white shadow-md flex items-center gap-2 border border-sky-300/40 dark:border-emerald-400/40 uppercase tracking-wider"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Skill Insertion Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Certificate Meta Details Form */}
            <div className="glass p-6 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-4 font-tech">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-sky-700 dark:text-emerald-400 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-amber-500" />
                <span>Certificate Metadata</span>
              </h3>

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
            <div className="text-xs font-extrabold uppercase tracking-widest text-sky-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Official Live Certificate Document Preview</span>
            </div>

            {/* Print Container */}
            <div
              ref={certRef}
              id="certificate-print-area"
              className={`relative p-8 sm:p-12 rounded-3xl border-4 bg-gradient-to-br transition-all duration-300 font-cinzel ${getThemeClasses()}`}
            >
              {/* Outer Decorative Gold Foil Border Frame */}
              <div className="absolute inset-3 rounded-2xl border-2 border-amber-500/30 pointer-events-none" />

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
                    <div className="font-mono text-amber-100/70">ID: SKG-2026-8849-VERIFIED</div>
                    <div className="text-emerald-400 font-bold">Status: Officially Authenticated</div>
                  </div>
                </div>

                {/* Official Signature */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="font-cinzel italic text-lg text-amber-300 font-bold tracking-widest">
                    Dr. Omkar Technical Board
                  </div>
                  <div className="h-0.5 w-40 bg-gradient-to-r from-transparent via-amber-400 to-transparent sm:ml-auto" />
                  <div className="text-[10px] uppercase tracking-widest text-amber-400/80 font-bold">
                    Lead Skill Gap Evaluator & Verification Board
                  </div>
                  <div className="text-[10px] text-amber-100/60">
                    Issued Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
