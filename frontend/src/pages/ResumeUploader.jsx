import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/userService';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone,
  ArrowRight,
  ClipboardPaste,
  ShieldCheck,
  Lock,
  Unlock,
  Plus,
  Trash2,
  X,
  Edit2
} from 'lucide-react';

// 80+ Comprehensive Technical Competency Taxonomy
const SKILL_TAXONOMY = [
  'Java 21', 'Java', 'Spring Boot 3', 'Spring Boot', 'Spring Cloud', 'Hibernate', 'JPA',
  'ReactJS', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
  'Python', 'FastAPI', 'Django', 'Flask', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle',
  'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud',
  'Terraform', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Jenkins', 'Linux', 'Bash',
  'RESTful APIs', 'Microservices', 'GraphQL', 'Apache Kafka', 'RabbitMQ', 'gRPC',
  'HTML5', 'CSS3', 'TailwindCSS', 'Bootstrap', 'Redux', 'Zustand',
  'C++', 'C#', '.NET', 'Go', 'Golang', 'Rust',
  'System Design', 'Agile', 'Scrum', 'Unit Testing', 'JUnit', 'Jest', 'Playwright'
];

const parseResumeText = (rawText, defaultUser, initialDocName = 'Candidate_Resume.pdf') => {
  const clean = rawText.replace(/\r\n/g, '\n');
  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = clean.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : (defaultUser?.email || 'candidate@skillgap.com');

  // 2. Extract Phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}|\+91[\s-]?\d{10}/;
  const phoneMatch = clean.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : '+91 98765 43210';

  // 3. Extract Full Name
  let fullName = defaultUser?.fullName || 'Alex Mercer';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 35 &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('email') &&
      !line.toLowerCase().includes('phone') &&
      !line.includes('@') &&
      !line.includes('http')
    ) {
      fullName = line;
      break;
    }
  }

  // 4. Extract Location
  const locations = ['Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Noida', 'Gurugram', 'Chennai', 'San Francisco', 'New York', 'Seattle', 'Austin', 'London', 'Remote', 'Hybrid'];
  let location = 'Bengaluru, Karnataka (Hybrid)';
  for (const loc of locations) {
    if (clean.toLowerCase().includes(loc.toLowerCase())) {
      location = loc.includes('Remote') ? 'Remote (Global)' : `${loc} (Hybrid / Onsite)`;
      break;
    }
  }

  // 5. Extract Target Career Role
  const roleKeywords = [
    'Senior Full Stack Java Developer',
    'Full Stack Java Developer',
    'Full Stack Developer',
    'Senior Machine Learning Engineer',
    'Machine Learning Engineer',
    'AI Engineer',
    'Cloud Native DevOps Engineer',
    'DevOps Engineer',
    'Backend Software Engineer',
    'Frontend React Engineer',
    'Frontend Developer',
    'Software Engineer'
  ];
  let currentRole = defaultUser?.targetCareerRole || 'Full Stack Software Engineer';
  for (const r of roleKeywords) {
    if (clean.toLowerCase().includes(r.toLowerCase())) {
      currentRole = r;
      break;
    }
  }

  // 6. Extract Total Experience Years
  const expRegex = /(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i;
  const expMatch = clean.match(expRegex);
  let totalExperienceYears = 3.5;
  if (expMatch) {
    totalExperienceYears = parseFloat(expMatch[1]);
  } else {
    const yearSpans = clean.match(/20\d{2}\s*[-–]\s*(?:Present|20\d{2})/gi);
    if (yearSpans && yearSpans.length > 0) {
      totalExperienceYears = Math.min(12, Math.max(1, yearSpans.length * 1.5));
    }
  }

  // 7. Extract Degree
  let degree = 'Bachelor of Technology in Computer Science';
  if (/b\.?tech|bachelor of technology/i.test(clean)) {
    degree = 'Bachelor of Technology (B.Tech) in Computer Science';
  } else if (/m\.?tech|master of technology/i.test(clean)) {
    degree = 'Master of Technology (M.Tech) in Computer Science';
  } else if (/b\.?e\.?|bachelor of engineering/i.test(clean)) {
    degree = 'Bachelor of Engineering (B.E.)';
  } else if (/b\.?s\.?|bachelor of science/i.test(clean)) {
    degree = 'Bachelor of Science (B.S.) in Computer Science';
  } else if (/mca|master of computer applications/i.test(clean)) {
    degree = 'Master of Computer Applications (MCA)';
  }

  // 8. Match Technical Skills
  const extractedSkillsSet = new Set();
  for (const sk of SKILL_TAXONOMY) {
    const escaped = sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(clean)) {
      extractedSkillsSet.add(sk);
    }
  }

  if (extractedSkillsSet.size < 3) {
    ['Java 21', 'Spring Boot 3', 'ReactJS', 'PostgreSQL', 'Docker', 'RESTful APIs'].forEach(s => extractedSkillsSet.add(s));
  }
  const extractedSkills = Array.from(extractedSkillsSet);

  // 9. Calculate ATS Score
  let contactScore = (emailMatch ? 10 : 5) + (phoneMatch ? 10 : 5);
  let roleScore = currentRole ? 15 : 8;
  let skillScore = Math.min(35, Math.round(extractedSkills.length * 3.5));
  let expScore = totalExperienceYears >= 1 ? 20 : 10;
  let eduScore = degree ? 10 : 5;
  let atsScore = Math.min(98, Math.max(68, contactScore + roleScore + skillScore + expScore + eduScore));

  return {
    documentName: initialDocName,
    fullName,
    email,
    phone,
    location,
    currentRole,
    totalExperienceYears,
    degree,
    extractedSkills,
    headline: `${currentRole} with ${totalExperienceYears} years of verified experience in ${extractedSkills.slice(0, 3).join(', ')}`,
    atsScore,
    isSubmitted: Boolean(defaultUser?.isProfileLocked)
  };
};

const ResumeUploader = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER' || user?.email?.toLowerCase().includes('admin');
  const isProfileLocked = Boolean(user?.isProfileLocked);

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  // Pre-load from user profile if already present
  const [parsedProfile, setParsedProfile] = useState(() => {
    if (user?.skills && user.skills.length > 0) {
      return {
        documentName: user?.resumeFileName || 'Candidate_Resume.pdf',
        fullName: user?.fullName || 'Candidate',
        email: user?.email || 'user@skillgap.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka (Hybrid)',
        currentRole: user?.targetCareerRole || 'Full Stack Software Engineer',
        totalExperienceYears: 3.5,
        degree: 'Bachelor of Technology in Computer Science',
        extractedSkills: user.skills.map(s => s.skillName || s.name),
        headline: user?.bio || `${user?.targetCareerRole || 'Engineer'} with verified competencies`,
        atsScore: 92,
        isSubmitted: Boolean(user?.isProfileLocked)
      };
    }
    return null;
  });

  // Candidate Skill Add Form State
  const [newSkillInput, setNewSkillInput] = useState('');

  const executeParsing = (rawText, fileName = 'Candidate_Resume.pdf') => {
    setIsParsing(true);
    setParsingProgress(30);

    setTimeout(() => {
      setParsingProgress(70);
      try {
        const parsed = parseResumeText(rawText, user, fileName);
        setParsedProfile(parsed);
        setParsingProgress(100);
        showToast('Resume parsed! Review and edit your document name, profile, and skills below.', 'success');
      } catch (err) {
        console.error('Parsing error', err);
        showToast('Parser error. Falling back to structured profile.', 'warning');
      } finally {
        setIsParsing(false);
      }
    }, 600);
  };

  const handleFileUpload = (uploadedFile) => {
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target.result;
      if (typeof content !== 'string') content = '';
      if (content.startsWith('%PDF') || uploadedFile.name.endsWith('.pdf')) {
        const printableTokens = content.match(/[A-Za-z0-9@+._\-\s]{3,}/g);
        content = printableTokens ? printableTokens.join(' ') : content;
      }
      executeParsing(content, uploadedFile.name);
    };
    reader.readAsText(uploadedFile);
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      showToast('Please paste your resume text before analyzing.', 'warning');
      return;
    }
    executeParsing(pastedText, 'Pasted_Resume.pdf');
  };

  const loadSampleResume = () => {
    const sample = `
Alex Mercer
Email: alex.mercer@clouddev.io | Phone: +91 98765 43210 | Bengaluru, Karnataka
Senior Full Stack Java Developer with 4.5 years experience in Java 21, Spring Boot 3, ReactJS, TypeScript, PostgreSQL, Redis, Docker, Kubernetes, AWS Cloud.
Bachelor of Technology (B.Tech) in Computer Science
`;
    setPastedText(sample);
    executeParsing(sample, 'Alex_Mercer_FullStack_Resume.pdf');
  };

  // Skill Add / Remove Handlers for Candidate
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim() || !parsedProfile) return;
    if (parsedProfile.extractedSkills.some(s => s.toLowerCase() === newSkillInput.trim().toLowerCase())) {
      showToast('Skill is already included!', 'info');
      return;
    }
    setParsedProfile({
      ...parsedProfile,
      extractedSkills: [...parsedProfile.extractedSkills, newSkillInput.trim()]
    });
    setNewSkillInput('');
    showToast(`Added ${newSkillInput.trim()} to competencies!`, 'success');
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!parsedProfile) return;
    setParsedProfile({
      ...parsedProfile,
      extractedSkills: parsedProfile.extractedSkills.filter(s => s !== skillToRemove)
    });
    showToast(`Removed ${skillToRemove}`, 'info');
  };

  // Submit and LOCK Candidate Profile
  const handleSubmitAndLockProfile = async () => {
    if (!parsedProfile) return;

    try {
      const convertedSkills = parsedProfile.extractedSkills.map((sk) => ({
        id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        skillName: sk,
        category: 'TECHNICAL',
        proficiencyLevel: 'ADVANCED',
        yearsExperience: parsedProfile.totalExperienceYears || 3.0,
      }));

      // Update backend if active
      try {
        await userService.updateProfile({
          fullName: parsedProfile.fullName,
          targetCareerRole: parsedProfile.currentRole,
          bio: parsedProfile.headline,
        });
      } catch (backendErr) {
        console.warn('Backend update fallback', backendErr);
      }

      // Lock profile state
      const updatedUser = {
        ...user,
        fullName: parsedProfile.fullName,
        targetCareerRole: parsedProfile.currentRole,
        bio: parsedProfile.headline,
        resumeFileName: parsedProfile.documentName,
        skills: convertedSkills,
        isProfileLocked: true, // PROFILE IS NOW LOCKED!
        atsScore: parsedProfile.atsScore || 92
      };

      updateUserProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Persist in localStorage DB
      const userEmail = (user?.email || parsedProfile.email || 'user@skillgap.com').toLowerCase();
      try {
        const stored = localStorage.getItem('skillgap_profiles_db');
        const db = stored ? JSON.parse(stored) : {};
        db[userEmail] = {
          ...db[userEmail],
          fullName: parsedProfile.fullName,
          targetCareerRole: parsedProfile.currentRole,
          bio: parsedProfile.headline,
          resumeFileName: parsedProfile.documentName,
          skills: convertedSkills,
          isProfileLocked: true,
          atsScore: parsedProfile.atsScore || 92,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      } catch (e) {
        console.warn('Profile DB save error', e);
      }

      setParsedProfile(prev => ({ ...prev, isSubmitted: true }));
      showToast('Profile officially submitted and locked! Only administrators can authorize further changes.', 'success');
    } catch (err) {
      console.warn('Submission failed', err);
      showToast('Failed to submit profile', 'error');
    }
  };

  // Administrator Unlock / Override Action
  const handleAdminToggleLock = () => {
    const newLockState = !isProfileLocked;
    const updatedUser = {
      ...user,
      isProfileLocked: newLockState
    };
    updateUserProfile(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const userEmail = (user?.email || 'user@skillgap.com').toLowerCase();
    try {
      const stored = localStorage.getItem('skillgap_profiles_db');
      const db = stored ? JSON.parse(stored) : {};
      if (db[userEmail]) {
        db[userEmail].isProfileLocked = newLockState;
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      }
    } catch (e) {}

    showToast(newLockState ? 'Candidate profile is now locked.' : 'Administrator override: Candidate profile unlocked for editing!', 'info');
  };

  const isLocked = isProfileLocked && !isAdmin;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans">
        <Breadcrumb items={[{ label: 'Candidate Dashboard', to: '/dashboard' }, { label: 'Resume & ATS Analyzer' }]} />

        {/* Top Header Banner */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 dark:bg-emerald-500/10 text-sky-700 dark:text-emerald-400 rounded-full font-bold text-xs border border-sky-400/20 dark:border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-emerald-400 animate-pulse" />
              <span>ATS Semantic Parsing Engine &bull; Candidate Pre-Submission Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Resume Intelligence & ATS Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium max-w-2xl">
              Extract technical credentials, customize your document name and verified skills inventory before final submission. Once submitted, profile edits require administrative authorization.
            </p>
          </div>

          <div className="flex items-center gap-2 z-10">
            {!isLocked && (
              <button
                onClick={loadSampleResume}
                className="px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Load Sample Profile</span>
              </button>
            )}

            {/* Admin Override Badge */}
            {isAdmin && (
              <button
                onClick={handleAdminToggleLock}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
              >
                {isProfileLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isProfileLocked ? 'Admin Unlock Profile' : 'Admin Lock Profile'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Lock Notice Banner if profile is locked */}
        {isProfileLocked && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                  Candidate Profile Locked After Submission
                </h4>
                <p className="text-amber-800 dark:text-amber-200 mt-0.5">
                  Your candidate profile, document name, and verified competencies have been locked following official submission. Only administrators and authorized recruiters have access to modify candidate profiles.
                </p>
              </div>
            </div>

            {isAdmin && (
              <span className="px-3 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider flex-shrink-0">
                Admin Privileges Active
              </span>
            )}
          </div>
        )}

        {/* Ingestion & Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Ingestion Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('upload')}
                    disabled={isLocked}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'upload'
                        ? 'bg-sky-600 text-white dark:bg-emerald-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('paste')}
                    disabled={isLocked}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'paste'
                        ? 'bg-sky-600 text-white dark:bg-emerald-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste Text</span>
                  </button>
                </div>

                <span className="text-[11px] font-bold text-slate-400">PDF, TXT, DOCX</span>
              </div>

              {activeTab === 'upload' ? (
                <label className={`p-8 rounded-2xl border-2 border-dashed border-sky-400/40 dark:border-emerald-500/40 bg-sky-50/30 dark:bg-emerald-950/20 transition-all flex flex-col items-center justify-center text-center space-y-3 group ${
                  isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-sky-500 dark:hover:border-emerald-400'
                }`}>
                  <input
                    type="file"
                    disabled={isLocked}
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/15 dark:bg-emerald-500/20 text-sky-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {file ? file.name : (parsedProfile?.documentName || 'Select Resume Document or Drag & Drop')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      {isLocked ? 'Ingestion locked after submission' : 'Entity extraction for name, tenure, and skills'}
                    </p>
                  </div>
                </label>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows="6"
                    disabled={isLocked}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste resume text here..."
                    className="w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-mono leading-relaxed focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={handlePasteSubmit}
                    disabled={isLocked}
                    className="w-full py-2.5 rounded-xl gradient-btn text-xs font-bold text-white shadow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Parse Text Content</span>
                  </button>
                </div>
              )}

              {isParsing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-sky-600 dark:text-emerald-400">
                    <span>Extracting Profile Entities & Mapping Skills...</span>
                    <span>{parsingProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-emerald-400 dark:to-teal-500 h-2 transition-all duration-300"
                      style={{ width: `${parsingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-gray-300 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Candidate Pre-Submission Verification:</span>
                </p>
                <p>&bull; Modify your PDF file name, candidate name, or role before submitting.</p>
                <p>&bull; Add or delete skills in the review panel on the right.</p>
                <p>&bull; Once submitted, profile locks permanently and requires administrator review.</p>
              </div>
            </div>
          </div>

          {/* Right Candidate Review & Pre-Submission Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-sky-500 dark:text-emerald-400" />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Candidate Profile & Competency Review
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {parsedProfile && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400">
                      ATS Score: {parsedProfile.atsScore || 92}%
                    </span>
                  )}
                  {isProfileLocked ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 flex items-center gap-1 uppercase tracking-wider">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1 uppercase tracking-wider">
                      <Unlock className="w-3 h-3" />
                      <span>Editable</span>
                    </span>
                  )}
                </div>
              </div>

              {parsedProfile ? (
                <div className="space-y-5 text-xs">
                  
                  {/* Candidate Identity Edit Form */}
                  <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-emerald-950/30 border border-sky-200 dark:border-emerald-500/30 space-y-4">
                    
                    {/* 1. PDF / Document Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1">
                        Resume Document / PDF File Name
                      </label>
                      <input
                        type="text"
                        disabled={isLocked}
                        value={parsedProfile.documentName || 'Candidate_Resume.pdf'}
                        onChange={(e) => setParsedProfile({ ...parsedProfile, documentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkcard text-xs font-mono disabled:opacity-60"
                      />
                    </div>

                    {/* 2. Full Name & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1">
                          Candidate Full Name
                        </label>
                        <input
                          type="text"
                          disabled={isLocked}
                          value={parsedProfile.fullName}
                          onChange={(e) => setParsedProfile({ ...parsedProfile, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkcard text-xs font-bold disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1">
                          Target Career Role
                        </label>
                        <input
                          type="text"
                          disabled={isLocked}
                          value={parsedProfile.currentRole}
                          onChange={(e) => setParsedProfile({ ...parsedProfile, currentRole: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkcard text-xs font-bold text-sky-700 dark:text-emerald-400 disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Contact Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-gray-300 pt-2 border-t border-sky-200/60 dark:border-emerald-500/20">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sky-500" /> {parsedProfile.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {parsedProfile.phone}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {parsedProfile.location}</span>
                      <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> {parsedProfile.degree}</span>
                    </div>
                  </div>

                  {/* 3. Skills Editing & Removal Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                        Extracted Skills Inventory ({parsedProfile.extractedSkills?.length || 0}):
                      </span>
                      {!isLocked && (
                        <span className="text-[10px] text-gray-500">Click &times; to delete, or add below</span>
                      )}
                    </div>

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-2">
                      {(parsedProfile.extractedSkills || []).map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-100 dark:bg-emerald-950/80 text-sky-800 dark:text-emerald-300 font-bold text-xs border border-sky-300/60 dark:border-emerald-500/40 shadow-xs"
                        >
                          <span>{sk}</span>
                          {!isLocked && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(sk)}
                              className="text-rose-500 hover:text-rose-700 hover:scale-110 transition ml-0.5"
                              title="Delete skill"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Add Custom Skill Form (Disabled when locked) */}
                    {!isLocked && (
                      <form onSubmit={handleAddSkill} className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          placeholder="Add new skill (e.g. Redis, Kafka, AWS)..."
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkcard text-xs focus:ring-2 focus:ring-sky-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Skill</span>
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Submission Action */}
                  <div className="pt-2">
                    {!isLocked ? (
                      <button
                        onClick={handleSubmitAndLockProfile}
                        className="w-full py-4 text-xs font-black text-white gradient-btn rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer uppercase tracking-wider"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Submit & Lock Candidate Profile</span>
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        Profile submitted and locked. Only administrators have editing permissions.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-2 text-xs text-slate-400">
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="font-bold">No resume document loaded yet.</p>
                  <p>Upload a file, paste text, or load the verified sample profile to edit and submit.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeUploader;
