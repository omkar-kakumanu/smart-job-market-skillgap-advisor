import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  X, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  Shield, 
  Zap, 
  Check, 
  LogIn, 
  UserPlus 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../hooks/useTheme';
import { authService } from '../services/authService';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';
import { EXPERIENCE_LEVELS } from '../utils/constants';

const GoogleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C1.2 8.7.8 10.3.8 12s.4 3.3 1.1 4.7l3.7-2.9z" />
    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
  </svg>
);

const StepItem = ({ number, text, subtext, active, onClick }) => (
  <div
    onClick={onClick}
    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
      active
        ? 'bg-sky-500/25 border-sky-400/60 shadow-lg shadow-sky-500/10'
        : 'bg-white/5 border-white/10 hover:bg-white/10'
    }`}
  >
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
        active ? 'bg-sky-500 text-white shadow-sm' : 'bg-white/10 text-white/70'
      }`}
    >
      {number}
    </div>
    <div className="space-y-0.5 text-left">
      <div className={`text-xs font-bold ${active ? 'text-white' : 'text-white/80'}`}>{text}</div>
      <div className="text-[11px] text-white/60 leading-tight">{subtext}</div>
    </div>
  </div>
);

const Login = ({ initialMode = 'RECRUITER' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Mode: 'RECRUITER' | 'CANDIDATE' | 'ADMIN' | 'SIGN_UP'
  const [mode, setMode] = useState(() => {
    if (location.pathname === '/register') return 'SIGN_UP';
    return initialMode;
  });

  // Credentials State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('recruiter@copilot.com');
  const [password, setPassword] = useState('recruiter123');
  const [targetRole, setTargetRole] = useState('Full Stack Java Developer');
  const [experienceLevel, setExperienceLevel] = useState('ENTRY_LEVEL');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Status Banner
  const [statusNotice, setStatusNotice] = useState(null);

  // Google SSO Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Left Column Active Step
  const [activeStep, setActiveStep] = useState(1);

  // Sync mode changes with prefilled credentials
  const handleSelectMode = (newMode) => {
    setMode(newMode);
    setStatusNotice(null);
    if (newMode === 'RECRUITER') {
      setEmail('recruiter@copilot.com');
      setPassword('recruiter123');
    } else if (newMode === 'CANDIDATE') {
      setEmail('candidate@copilot.com');
      setPassword('candidate123');
    } else if (newMode === 'ADMIN') {
      setEmail('admin@copilot.com');
      setPassword('admin123');
    } else if (newMode === 'SIGN_UP') {
      setEmail('');
      setPassword('');
    }
  };

  // Quick Demo Autofill handler
  const handleQuickDemoFill = (roleMode) => {
    setStatusNotice(null);
    if (roleMode === 'RECRUITER') {
      setEmail('recruiter@copilot.com');
      setPassword('recruiter123');
      showToast('Loaded Demo Recruiter Credentials (recruiter@copilot.com)', 'info');
    } else if (roleMode === 'CANDIDATE') {
      setEmail('candidate@copilot.com');
      setPassword('candidate123');
      showToast('Loaded Demo Candidate Credentials (candidate@copilot.com)', 'info');
    } else if (roleMode === 'ADMIN') {
      setEmail('admin@copilot.com');
      setPassword('admin123');
      showToast('Loaded Demo Admin Credentials (admin@copilot.com)', 'info');
    }
  };

  // Google SSO Authentication
  const handleGoogleSelect = async (selectedEmail, selectedName, userRole) => {
    setGoogleSubmitting(true);
    setStatusNotice(null);
    try {
      const response = await authService.googleSso({
        email: selectedEmail,
        name: selectedName,
        role: userRole,
        profileImageUrl: ''
      });
      loginUser(response);
      showToast(`Welcome back, ${selectedName}!`, 'success');
      setShowGoogleModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google SSO Error:', err);
      const msg = err.response?.data?.message || 'Google SSO authentication failed. Please try credentials login.';
      setStatusNotice({ type: 'ERROR', message: msg });
      showToast(msg, 'error');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleCustomGmailSubmit = (e) => {
    e.preventDefault();
    if (!customGmail.trim() || !customGmail.includes('@')) {
      showToast('Please enter a valid Gmail / Google address', 'error');
      return;
    }
    const clean = customGmail.trim().toLowerCase();
    const namePart = clean.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ') || 'Applicant';

    handleGoogleSelect(clean, formattedName, 'Candidate Applicant');
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusNotice(null);
    setSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (mode === 'SIGN_UP') {
        const fullName = `${firstName} ${lastName}`.trim();
        if (!fullName) {
          setStatusNotice({ type: 'ERROR', message: 'Please enter your first and last name.' });
          setSubmitting(false);
          return;
        }
        if (!cleanEmail || !cleanEmail.includes('@')) {
          setStatusNotice({ type: 'ERROR', message: 'Please enter a valid email address.' });
          setSubmitting(false);
          return;
        }
        if (!password || password.length < 6) {
          setStatusNotice({ type: 'ERROR', message: 'Password must be at least 6 characters long.' });
          setSubmitting(false);
          return;
        }

        // Call register API
        const response = await authService.register({
          fullName,
          email: cleanEmail,
          password,
          targetCareerRole: targetRole || 'Full Stack Java Developer',
          experienceLevel: experienceLevel || 'ENTRY_LEVEL',
          profileImageUrl: profileImageUrl || null
        });

        loginUser(response);
        showToast('Account registered successfully! Welcome to the platform.', 'success');
        navigate('/dashboard');
      } else {
        // Mode is RECRUITER | CANDIDATE | ADMIN
        if (!cleanEmail || !password) {
          setStatusNotice({ type: 'ERROR', message: 'Please provide both email and password.' });
          setSubmitting(false);
          return;
        }

        const response = await authService.login({
          email: cleanEmail,
          password
        });

        loginUser(response);
        showToast(`Signed in successfully as ${response.user.fullName}!`, 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.message || (mode === 'SIGN_UP' ? 'Registration failed. Please try again.' : 'Invalid credentials provided. Please verify email and password.');
      setStatusNotice({ type: 'ERROR', message: msg });
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-gray-100 font-sans transition-colors duration-300 p-2 sm:p-4 lg:p-6 items-center justify-center">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch justify-center">
        
        {/* ================= LEFT COLUMN: HERO, LIVE METRICS & VIDEO BACKGROUND ================= */}
        <div className="w-full lg:w-[48%] xl:w-[50%] hidden lg:flex relative flex-col items-center justify-between p-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/10 bg-slate-950 text-white min-h-[660px]">
          {/* Ambient Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
              type="video/mp4"
            />
          </video>
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80 pointer-events-none" />

          {/* Top Header Bar over Video */}
          <div className="z-10 w-full flex items-center justify-between">
            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center tracking-wider shadow-md shadow-sky-500/40">
                RC
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-white block leading-none font-display">AI Recruitment Copilot</span>
                <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider font-tech">Enterprise Hiring Engine</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-bold font-tech shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AI Engine v3.4 Online
            </div>
          </div>

          {/* Center Glassmorphic AI Showcase Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="z-10 w-full max-w-lg space-y-4 flex flex-col items-center text-center bg-slate-900/75 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 shadow-2xl my-auto"
          >
            {/* Feature Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold font-tech">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              AI-Driven Candidate Screening & Matching
            </motion.div>

            {/* Main Title & Subtitle */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight font-display">
                Next-Gen Talent Acquisition
              </h1>
              <p className="text-white/75 text-xs leading-relaxed px-2 font-sans">
                Accelerate hiring decisions with automated resume parsing, skill-gap analysis, and AI interview simulations.
              </p>
            </motion.div>

            {/* Live AI Platform Metrics */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2.5 w-full pt-1 font-tech">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="text-base font-black text-white block">98.4%</span>
                <span className="text-[10px] text-white/60 font-semibold block leading-tight">Skill Match Accuracy</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="text-base font-black text-sky-400 block">1,420+</span>
                <span className="text-[10px] text-white/60 font-semibold block leading-tight">Resumes Parsed</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="text-base font-black text-emerald-400 block">10+ Roles</span>
                <span className="text-[10px] text-white/60 font-semibold block leading-tight">Interview Question Banks</span>
              </div>
            </motion.div>

            {/* 3 Step Interactive Guidance Tabs */}
            <motion.div variants={itemVariants} className="w-full space-y-2 text-left pt-2 font-tech">
              <StepItem
                number={1}
                text="Identity Verification & Portal Login"
                subtext="Role-based access security & DPDP compliance"
                active={activeStep === 1}
                onClick={() => setActiveStep(1)}
              />
              <StepItem
                number={2}
                text="Skill-Gap Matching & ATS Pipelines"
                subtext="Weighted semantic match & Indian tech benchmarks"
                active={activeStep === 2}
                onClick={() => setActiveStep(2)}
              />
              <StepItem
                number={3}
                text="Role-Specific AI Interview Evaluation"
                subtext="Real-time speech clarity & technical relevance scoring"
                active={activeStep === 3}
                onClick={() => setActiveStep(3)}
              />
            </motion.div>
          </motion.div>

          <div className="z-10 text-[11px] text-white/50 text-center font-tech">
            Empowered by Deep NLP & Spring Boot 3.2 Security Framework
          </div>
        </div>

        {/* ================= RIGHT COLUMN: 4 LOGIN PORTALS & REGISTRATION FORM ================= */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white dark:bg-darkcard border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
          >
            {/* Top Bar: 4 Portal Selector Pills + Theme Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-800 gap-2 font-tech">
              <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-darkbg p-1 rounded-2xl flex-1 border border-slate-200/60 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => handleSelectMode('RECRUITER')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all text-center truncate cursor-pointer ${
                    mode === 'RECRUITER'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  1. Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('CANDIDATE')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all text-center truncate cursor-pointer ${
                    mode === 'CANDIDATE'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  2. Candidate
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('ADMIN')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all text-center truncate cursor-pointer ${
                    mode === 'ADMIN'
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  3. Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('SIGN_UP')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all text-center truncate cursor-pointer ${
                    mode === 'SIGN_UP'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  4. Request
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 bg-slate-100 dark:bg-darkbg text-slate-700 dark:text-gray-300 transition-all cursor-pointer shrink-0 font-bold text-sm shadow-sm"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Portal Header */}
            <div className="space-y-1 font-tech">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                {mode === 'RECRUITER'
                  ? 'Recruiter Gateway'
                  : mode === 'CANDIDATE'
                  ? 'Candidate Applicant Portal'
                  : mode === 'ADMIN'
                  ? 'Administrator Governance'
                  : 'Create Candidate Account & Request Access'}
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-medium">
                {mode === 'RECRUITER'
                  ? 'Sign in with your approved recruiter credentials or Google SSO.'
                  : mode === 'CANDIDATE'
                  ? 'Sign in to view your candidate resume, application status, and match reports.'
                  : mode === 'ADMIN'
                  ? 'System administrator access & access control governance console.'
                  : 'Submit your registration details for candidate access or enterprise review.'}
              </p>
            </div>

            {/* Status Notice Alert */}
            {statusNotice && (
              <div
                className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                  statusNotice.type === 'PENDING'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300'
                    : statusNotice.type === 'SUCCESS'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-300'
                }`}
              >
                {statusNotice.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block mb-0.5">
                    {statusNotice.type === 'PENDING'
                      ? 'Access Pending Review'
                      : statusNotice.type === 'SUCCESS'
                      ? 'Success'
                      : 'Authentication Alert'}
                  </span>
                  {statusNotice.message}
                </div>
              </div>
            )}

            {/* Google / Gmail Primary SSO Button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="flex items-center justify-center gap-3 w-full h-11 bg-white dark:bg-darkbg border border-slate-300 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-500 active:scale-[0.98] rounded-2xl text-xs font-bold text-slate-800 dark:text-gray-100 shadow-sm transition-all cursor-pointer group"
            >
              <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Sign in with Google / Gmail</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center font-tech">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-gray-800" />
              </div>
              <div className="relative bg-white dark:bg-darkcard px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Or Continue With Credentials
              </div>
            </div>

            {/* Quick Demo Fill Buttons (Roles 1-3) */}
            {mode !== 'SIGN_UP' && (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-darkbg border border-slate-200/80 dark:border-gray-800 font-tech">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-gray-300">
                  <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Demo Credentials:</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill(mode)}
                  className="px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  ⚡ Autofill {mode === 'RECRUITER' ? 'Recruiter' : mode === 'CANDIDATE' ? 'Candidate' : 'Admin'}
                </button>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4 font-tech">
              {mode === 'SIGN_UP' && (
                <>
                  <ProfilePhotoUploader
                    value={profileImageUrl}
                    onChange={setProfileImageUrl}
                    fullName={`${firstName} ${lastName}`.trim() || 'Candidate'}
                    label="Candidate Profile Photo"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">First Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="David"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-300/60 dark:border-emerald-500/40 bg-white dark:bg-darkbg text-slate-900 dark:text-gray-100 text-xs font-sans focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Last Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Miller"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-300/60 dark:border-emerald-500/40 bg-white dark:bg-darkbg text-slate-900 dark:text-gray-100 text-xs font-sans focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Target Career Role</label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder="Full Stack Java Developer"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-300/60 dark:border-emerald-500/40 bg-white dark:bg-darkbg text-slate-900 dark:text-gray-100 text-xs font-sans focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Experience Level</label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-sky-300/60 dark:border-emerald-500/40 bg-white dark:bg-darkbg text-slate-900 dark:text-gray-100 text-xs font-sans focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none"
                      >
                        {EXPERIENCE_LEVELS.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">
                  {mode === 'SIGN_UP' ? 'Email Address' : mode === 'ADMIN' ? 'Admin Email' : mode === 'RECRUITER' ? 'Recruiter Work Email' : 'Candidate Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      mode === 'ADMIN'
                        ? 'admin@copilot.com'
                        : mode === 'RECRUITER'
                        ? 'recruiter@copilot.com'
                        : mode === 'CANDIDATE'
                        ? 'candidate@copilot.com'
                        : 'david.miller@example.com'
                    }
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-300/60 dark:border-emerald-500/40 bg-white dark:bg-darkbg text-slate-900 dark:text-gray-100 text-xs font-sans focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-sky-300/60 dark:border-emerald-500/40 bg-white dark:bg-darkbg text-slate-900 dark:text-gray-100 text-xs font-sans focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'SIGN_UP' && (
                  <p className="text-[10px] text-gray-400 mt-1">Must be at least 6 characters.</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full h-11 text-white font-bold rounded-xl text-xs shadow-lg transition-all mt-3 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] uppercase tracking-wider ${
                  mode === 'ADMIN'
                    ? 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-slate-900/30'
                    : mode === 'SIGN_UP'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : mode === 'CANDIDATE'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
                    : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/30'
                }`}
              >
                {submitting ? (
                  <span>Processing...</span>
                ) : mode === 'SIGN_UP' ? (
                  <>
                    <span>Create Account & Register</span>
                    <UserPlus className="w-4 h-4" />
                  </>
                ) : mode === 'RECRUITER' ? (
                  <>
                    <span>Log In to Recruiter Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : mode === 'CANDIDATE' ? (
                  <>
                    <span>Log In as Candidate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Log In to Admin Console</span>
                    <Shield className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Toggle Link */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-gray-800 font-tech">
              {mode === 'SIGN_UP' ? (
                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => handleSelectMode('RECRUITER')}
                    className="text-sky-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    Log In Here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                  Need a candidate account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSelectMode('SIGN_UP')}
                    className="text-sky-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    Register / Sign Up Here
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= GOOGLE / GMAIL SSO MODAL ================= */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darkcard border border-slate-200 dark:border-emerald-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6 relative text-slate-900 dark:text-gray-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-darkbg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-darkbg flex items-center justify-center mx-auto border border-slate-200 dark:border-gray-700">
                  <GoogleIcon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">Sign in with Google</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium font-sans">
                  Choose a verified account or enter your Gmail address to access <span className="font-bold text-slate-800 dark:text-gray-200">AI Recruitment Copilot</span>
                </p>
              </div>

              {/* Predefined Account Chooser */}
              <div className="space-y-2.5 font-tech">
                <button
                  type="button"
                  disabled={googleSubmitting}
                  onClick={() => handleGoogleSelect('sarah.jenkins@gmail.com', 'Sarah Jenkins', 'Talent Acquisition Lead')}
                  className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-gray-700 rounded-2xl hover:border-sky-500 dark:hover:border-emerald-500 hover:bg-sky-50/50 dark:hover:bg-emerald-950/20 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      SJ
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-sky-600 dark:group-hover:text-emerald-400">Sarah Jenkins (Recruiter)</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">sarah.jenkins@gmail.com</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  type="button"
                  disabled={googleSubmitting}
                  onClick={() => handleGoogleSelect('sarah.johnson@example.com', 'Sarah Johnson', 'Candidate Applicant')}
                  className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-gray-700 rounded-2xl hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      SJ
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-purple-600 dark:group-hover:text-purple-400">Sarah Johnson (Candidate)</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">sarah.johnson@example.com</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  type="button"
                  disabled={googleSubmitting}
                  onClick={() => handleGoogleSelect('j.manju.raghvin@gmail.com', 'J Manju Raghvin', 'System Administrator & Hiring Director')}
                  className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-gray-700 rounded-2xl hover:border-slate-800 dark:hover:border-emerald-500 hover:bg-slate-100 dark:hover:bg-emerald-950/20 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      JM
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-slate-900 dark:group-hover:text-emerald-300">J Manju Raghvin (Admin)</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">j.manju.raghvin@gmail.com</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* Or Custom Gmail */}
              <div className="pt-2 border-t border-slate-100 dark:border-gray-800 font-tech">
                <form onSubmit={handleCustomGmailSubmit} className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                    Or Enter Any Custom Gmail / Google Account:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={customGmail}
                      onChange={(e) => setCustomGmail(e.target.value)}
                      placeholder="your.name@gmail.com"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-emerald-400"
                    />
                    <button
                      type="submit"
                      disabled={googleSubmitting}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      {googleSubmitting ? 'Verifying...' : 'Sign In →'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
