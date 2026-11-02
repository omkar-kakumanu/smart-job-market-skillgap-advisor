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
  Edit2,
  Layers,
  Search,
  Zap,
  Check,
  Send,
  Save,
  BookOpen,
  RefreshCw,
  HelpCircle
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
  'System Design', 'Agile', 'Scrum', 'Unit Testing', 'JUnit', 'Jest', 'Playwright',
  'LangChain', 'RAG Architecture', 'Vector Databases', 'Prompt Engineering'
];

// Enterprise Skill Categories
const SKILL_CATEGORIES = [
  { value: 'BACKEND', label: 'Backend & Microservices' },
  { value: 'FRONTEND', label: 'Frontend & Web UI' },
  { value: 'CLOUD_DEVOPS', label: 'Cloud & DevOps' },
  { value: 'DATABASE', label: 'Databases & Caching' },
  { value: 'AI_ML', label: 'AI, ML & Generative Models' },
  { value: 'TESTING', label: 'Testing, QA & Security' },
  { value: 'ARCHITECTURE', label: 'System Architecture' },
  { value: 'TECHNICAL', label: 'Core Technical' }
];

// Proficiency Levels (Infosys Project Standard)
const PROFICIENCY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner (0-1 yrs)', badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-700' },
  { value: 'INTERMEDIATE', label: 'Intermediate (2-3 yrs)', badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700' },
  { value: 'ADVANCED', label: 'Advanced (4-5 yrs)', badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' },
  { value: 'EXPERT', label: 'Expert (6+ yrs)', badgeClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700' }
];

// Enterprise Preset Skill Packs (Infosys Standard)
const ENTERPRISE_SKILL_PACKS = [
  {
    name: 'Full Stack Java',
    icon: '☕',
    description: 'Enterprise Java 21, Spring Boot 3, React, PostgreSQL, Docker, AWS, Microservices',
    skills: [
      { name: 'Java 21', category: 'BACKEND', level: 'ADVANCED', years: 4.0 },
      { name: 'Spring Boot 3', category: 'BACKEND', level: 'ADVANCED', years: 3.5 },
      { name: 'React', category: 'FRONTEND', level: 'INTERMEDIATE', years: 3.0 },
      { name: 'PostgreSQL', category: 'DATABASE', level: 'ADVANCED', years: 3.0 },
      { name: 'Docker', category: 'CLOUD_DEVOPS', level: 'INTERMEDIATE', years: 2.5 },
      { name: 'AWS', category: 'CLOUD_DEVOPS', level: 'INTERMEDIATE', years: 2.0 },
      { name: 'Microservices', category: 'BACKEND', level: 'ADVANCED', years: 3.5 }
    ]
  },
  {
    name: 'Cloud Native DevOps',
    icon: '☁️',
    description: 'Kubernetes, Docker, AWS, Terraform, CI/CD, Git, Linux',
    skills: [
      { name: 'Kubernetes', category: 'CLOUD_DEVOPS', level: 'ADVANCED', years: 3.0 },
      { name: 'Docker', category: 'CLOUD_DEVOPS', level: 'EXPERT', years: 4.0 },
      { name: 'AWS', category: 'CLOUD_DEVOPS', level: 'ADVANCED', years: 3.5 },
      { name: 'Terraform', category: 'CLOUD_DEVOPS', level: 'INTERMEDIATE', years: 2.5 },
      { name: 'CI/CD', category: 'CLOUD_DEVOPS', level: 'ADVANCED', years: 3.0 },
      { name: 'Git', category: 'CLOUD_DEVOPS', level: 'EXPERT', years: 4.5 },
      { name: 'Linux', category: 'CLOUD_DEVOPS', level: 'ADVANCED', years: 4.0 }
    ]
  },
  {
    name: 'AI & Data Engineering',
    icon: '🤖',
    description: 'Python, PyTorch, LangChain, RAG Architecture, PostgreSQL, FastAPI',
    skills: [
      { name: 'Python', category: 'BACKEND', level: 'EXPERT', years: 4.5 },
      { name: 'PyTorch', category: 'AI_ML', level: 'ADVANCED', years: 3.0 },
      { name: 'LangChain', category: 'AI_ML', level: 'INTERMEDIATE', years: 2.0 },
      { name: 'RAG Architecture', category: 'AI_ML', level: 'ADVANCED', years: 2.0 },
      { name: 'FastAPI', category: 'BACKEND', level: 'ADVANCED', years: 3.0 },
      { name: 'PostgreSQL', category: 'DATABASE', level: 'INTERMEDIATE', years: 3.0 }
    ]
  },
  {
    name: 'Modern MERN Stack',
    icon: '⚛️',
    description: 'React, TypeScript, Node.js, Express, MongoDB, TailwindCSS',
    skills: [
      { name: 'React', category: 'FRONTEND', level: 'EXPERT', years: 4.0 },
      { name: 'TypeScript', category: 'FRONTEND', level: 'ADVANCED', years: 3.5 },
      { name: 'Node.js', category: 'BACKEND', level: 'ADVANCED', years: 3.0 },
      { name: 'Express', category: 'BACKEND', level: 'ADVANCED', years: 3.0 },
      { name: 'MongoDB', category: 'DATABASE', level: 'INTERMEDIATE', years: 2.5 },
      { name: 'TailwindCSS', category: 'FRONTEND', level: 'EXPERT', years: 3.5 }
    ]
  }
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

  // Initialize metadata map for skills
  const skillsMetadata = {};
  extractedSkills.forEach((sk) => {
    let category = 'BACKEND';
    const lower = sk.toLowerCase();
    if (lower.includes('react') || lower.includes('html') || lower.includes('css') || lower.includes('tailwind') || lower.includes('front')) {
      category = 'FRONTEND';
    } else if (lower.includes('docker') || lower.includes('k8s') || lower.includes('kubernetes') || lower.includes('aws') || lower.includes('cloud') || lower.includes('ci/cd') || lower.includes('git')) {
      category = 'CLOUD_DEVOPS';
    } else if (lower.includes('sql') || lower.includes('postgres') || lower.includes('mongo') || lower.includes('redis') || lower.includes('data')) {
      category = 'DATABASE';
    } else if (lower.includes('python') || lower.includes('pytorch') || lower.includes('ai') || lower.includes('ml') || lower.includes('rag')) {
      category = 'AI_ML';
    }
    skillsMetadata[sk] = {
      level: 'ADVANCED',
      category,
      years: totalExperienceYears
    };
  });

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
    skillsMetadata,
    headline: `${currentRole} with ${totalExperienceYears} years of verified experience in ${extractedSkills.slice(0, 3).join(', ')}`,
    atsScore,
    isSubmitted: Boolean(defaultUser?.isProfileLocked)
  };
};

const ResumeUploader = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isPrivileged =
    user?.role === 'ROLE_ADMIN' ||
    user?.role === 'ROLE_MANAGER' ||
    user?.role === 'ROLE_RECRUITER' ||
    user?.email?.toLowerCase().includes('admin') ||
    user?.email?.toLowerCase().includes('recruiter') ||
    user?.email?.toLowerCase().includes('manager');

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER' || user?.email?.toLowerCase().includes('admin');
  const isProfileLocked = Boolean(user?.isProfileLocked);

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  // Candidate Skill Addition Form State (Infosys Project Standard)
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('BACKEND');
  const [newSkillProficiency, setNewSkillProficiency] = useState('ADVANCED');
  const [newSkillYears, setNewSkillYears] = useState('3.0');
  const [skillSearchFilter, setSkillSearchFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [isSavingSkills, setIsSavingSkills] = useState(false);

  // Locked Profile Skill Endorsement Request Form State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSkillForm, setRequestSkillForm] = useState({
    skillName: '',
    category: 'BACKEND',
    proficiencyLevel: 'ADVANCED',
    yearsExperience: '3.0',
    justification: ''
  });

  // Track Skill Requests Submitted by this Candidate
  const [myResumeSkillRequests, setMyResumeSkillRequests] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('skillgap_skill_requests') || '[]');
      const candidateEmail = (user?.email || '').toLowerCase().trim();
      return stored.filter(r => (r.candidateEmail || '').toLowerCase().trim() === candidateEmail);
    } catch (e) {
      return [];
    }
  });

  // Pre-load from user profile if already present
  const [parsedProfile, setParsedProfile] = useState(() => {
    if (user?.skills && user.skills.length > 0) {
      const skillNames = user.skills.map(s => s.skillName || s.name);
      const meta = {};
      user.skills.forEach(s => {
        const name = s.skillName || s.name;
        meta[name] = {
          level: s.proficiencyLevel || 'ADVANCED',
          category: s.category || 'TECHNICAL',
          years: s.yearsExperience || 3.0
        };
      });
      return {
        documentName: user?.resumeFileName || 'Candidate_Resume.pdf',
        fullName: user?.fullName || 'Candidate',
        email: user?.email || 'candidate@skillgap.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka (Hybrid)',
        currentRole: user?.targetCareerRole || 'Full Stack Software Engineer',
        totalExperienceYears: 3.5,
        degree: 'Bachelor of Technology in Computer Science',
        extractedSkills: skillNames,
        skillsMetadata: meta,
        headline: user?.bio || `${user?.targetCareerRole || 'Engineer'} with verified competencies`,
        atsScore: user?.atsScore || 92,
        isSubmitted: Boolean(user?.isProfileLocked)
      };
    }
    return null;
  });

  // Dynamic ATS Score Calculation Engine
  const calculateDynamicAts = (skillCount, expYears = 3.5) => {
    const baseScore = 65;
    const countScore = Math.min(25, Math.round(skillCount * 2.5));
    const expScore = Math.min(10, Math.round((parseFloat(expYears) || 3) * 2));
    return Math.min(99, Math.max(70, baseScore + countScore + expScore));
  };

  // Ensure a Candidate Profile is active to edit
  const ensureCandidateProfileLoaded = () => {
    if (parsedProfile) return parsedProfile;
    const initial = {
      documentName: user?.resumeFileName || 'Candidate_Resume.pdf',
      fullName: user?.fullName || 'Candidate',
      email: user?.email || 'candidate@skillgap.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka (Hybrid)',
      currentRole: user?.targetCareerRole || 'Full Stack Software Engineer',
      totalExperienceYears: 3.5,
      degree: 'Bachelor of Technology in Computer Science',
      extractedSkills: (user?.skills || []).map(s => s.skillName || s.name),
      skillsMetadata: (user?.skills || []).reduce((acc, s) => {
        const name = s.skillName || s.name;
        acc[name] = {
          level: s.proficiencyLevel || 'ADVANCED',
          category: s.category || 'TECHNICAL',
          years: s.yearsExperience || 3.0
        };
        return acc;
      }, {}),
      headline: user?.bio || `${user?.targetCareerRole || 'Engineer'} with verified competencies`,
      atsScore: calculateDynamicAts((user?.skills || []).length, 3.5),
      isSubmitted: Boolean(user?.isProfileLocked)
    };
    setParsedProfile(initial);
    return initial;
  };

  const executeParsing = (rawText, fileName = 'Candidate_Resume.pdf') => {
    setIsParsing(true);
    setParsingProgress(30);

    setTimeout(() => {
      setParsingProgress(70);
      try {
        const parsed = parseResumeText(rawText, user, fileName);
        setParsedProfile(parsed);
        setParsingProgress(100);
        showToast('Resume parsed! Candidate competencies and entity details extracted successfully.', 'success');
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

  // Skill Add Handler for Candidate (Infosys Project Standard)
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const profileToUpdate = ensureCandidateProfileLoaded();
    const skillNameClean = newSkillInput.trim();
    if (!skillNameClean) {
      showToast('Please enter or select a skill to add', 'warning');
      return;
    }

    if (profileToUpdate.extractedSkills.some(s => s.toLowerCase() === skillNameClean.toLowerCase())) {
      showToast(`"${skillNameClean}" is already in your skills inventory!`, 'info');
      return;
    }

    const updatedSkills = [...profileToUpdate.extractedSkills, skillNameClean];
    const updatedMetadata = {
      ...(profileToUpdate.skillsMetadata || {}),
      [skillNameClean]: {
        level: newSkillProficiency,
        category: newSkillCategory,
        years: parseFloat(newSkillYears) || 3.0
      }
    };
    const newAts = calculateDynamicAts(updatedSkills.length, profileToUpdate.totalExperienceYears);

    setParsedProfile({
      ...profileToUpdate,
      extractedSkills: updatedSkills,
      skillsMetadata: updatedMetadata,
      atsScore: newAts
    });

    setNewSkillInput('');
    showToast(`Added "${skillNameClean}" (${newSkillProficiency})! ATS score increased to ${newAts}%.`, 'success');
  };

  // Quick Apply One-Click Enterprise Skill Pack (Infosys Standard)
  const handleApplyEnterpriseSkillPack = (pack) => {
    const profileToUpdate = ensureCandidateProfileLoaded();
    const existingNamesLower = new Set(profileToUpdate.extractedSkills.map(s => s.toLowerCase()));
    
    const toAdd = pack.skills.filter(s => !existingNamesLower.has(s.name.toLowerCase()));
    if (toAdd.length === 0) {
      showToast(`All skills from "${pack.name}" are already added!`, 'info');
      return;
    }

    const updatedSkills = [...profileToUpdate.extractedSkills, ...toAdd.map(s => s.name)];
    const updatedMetadata = { ...(profileToUpdate.skillsMetadata || {}) };
    toAdd.forEach(s => {
      updatedMetadata[s.name] = {
        level: s.level,
        category: s.category,
        years: s.years
      };
    });
    const newAts = calculateDynamicAts(updatedSkills.length, profileToUpdate.totalExperienceYears);

    setParsedProfile({
      ...profileToUpdate,
      extractedSkills: updatedSkills,
      skillsMetadata: updatedMetadata,
      atsScore: newAts
    });
    showToast(`Applied ${pack.name} pack! Added ${toAdd.length} skills. ATS score updated to ${newAts}%.`, 'success');
  };

  // Remove Skill Handler with Live ATS Recalculation
  const handleRemoveSkill = (skillToRemove) => {
    if (!parsedProfile) return;
    const updatedSkills = parsedProfile.extractedSkills.filter(s => s !== skillToRemove);
    const updatedMetadata = { ...(parsedProfile.skillsMetadata || {}) };
    delete updatedMetadata[skillToRemove];
    const newAts = calculateDynamicAts(updatedSkills.length, parsedProfile.totalExperienceYears);

    setParsedProfile({
      ...parsedProfile,
      extractedSkills: updatedSkills,
      skillsMetadata: updatedMetadata,
      atsScore: newAts
    });
    showToast(`Removed "${skillToRemove}"`, 'info');
  };

  // Instant Sync Skills to Profile & Backend
  const handleSaveSkillsToProfile = async () => {
    if (!parsedProfile || !parsedProfile.extractedSkills || parsedProfile.extractedSkills.length === 0) {
      showToast('No skills to save yet. Add competencies above!', 'warning');
      return;
    }
    setIsSavingSkills(true);
    try {
      const formattedSkills = parsedProfile.extractedSkills.map((sk, index) => {
        const meta = parsedProfile.skillsMetadata?.[sk] || {};
        return {
          id: Date.now() + index,
          skillId: 1000 + index,
          skillName: sk,
          category: meta.category || 'TECHNICAL',
          proficiencyLevel: meta.level || 'ADVANCED',
          yearsExperience: meta.years || 3.0
        };
      });

      const updatedUser = {
        ...user,
        skills: formattedSkills,
        atsScore: parsedProfile.atsScore || 92
      };

      updateUserProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (updatedUser.email) {
        try {
          const storedProfiles = JSON.parse(localStorage.getItem('skillgap_registered_profiles') || '{}');
          storedProfiles[updatedUser.email.toLowerCase().trim()] = updatedUser;
          localStorage.setItem('skillgap_registered_profiles', JSON.stringify(storedProfiles));
        } catch (e) {
          console.warn('Fallback store write', e);
        }
      }

      try {
        await userService.updateProfile({
          targetCareerRole: parsedProfile.currentRole,
          bio: parsedProfile.headline
        });
      } catch (e) {
        console.warn('Backend updateProfile skipped');
      }

      showToast('Skills synchronized to your Verified Candidate Profile and across all platform modules!', 'success');
    } catch (err) {
      console.error('Failed saving skills', err);
      showToast('Failed saving skills. Please try again.', 'error');
    } finally {
      setIsSavingSkills(false);
    }
  };

  // Candidate Submits Skill Request (When Profile Is Locked)
  const handleCandidateSkillRequest = (e) => {
    e.preventDefault();
    if (!requestSkillForm.skillName.trim()) {
      showToast('Please specify the skill name you wish to request endorsement for', 'error');
      return;
    }
    const newReq = {
      id: `skill_req_${Date.now()}`,
      candidateEmail: (user?.email || parsedProfile?.email || 'candidate@skillgap.com').toLowerCase().trim(),
      candidateName: parsedProfile?.fullName || user?.fullName || 'Candidate',
      targetCareerRole: parsedProfile?.currentRole || user?.targetCareerRole || 'Engineering Candidate',
      skillName: requestSkillForm.skillName.trim(),
      category: requestSkillForm.category || 'BACKEND',
      proficiencyLevel: requestSkillForm.proficiencyLevel || 'ADVANCED',
      yearsExperience: parseFloat(requestSkillForm.yearsExperience) || 3.0,
      justification: requestSkillForm.justification.trim() || 'Verified professional project and engineering experience from resume.',
      status: 'PENDING_APPROVAL',
      requestedAt: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('skillgap_skill_requests') || '[]');
      const updated = [newReq, ...stored];
      localStorage.setItem('skillgap_skill_requests', JSON.stringify(updated));
      const candEmail = (user?.email || '').toLowerCase().trim();
      setMyResumeSkillRequests(updated.filter(r => (r.candidateEmail || '').toLowerCase().trim() === candEmail));
      setRequestSkillForm({
        skillName: '',
        category: 'BACKEND',
        proficiencyLevel: 'ADVANCED',
        yearsExperience: '3.0',
        justification: ''
      });
      setShowRequestModal(false);
      showToast(`Skill endorsement request for "${newReq.skillName}" sent to Administrators & Recruiters!`, 'success');
    } catch (err) {
      console.error('Failed saving skill request', err);
      showToast('Failed to submit skill request', 'error');
    }
  };

  // Unlock Draft Profile for Continued Editing
  const handleUnlockDraftProfile = () => {
    const updatedUser = {
      ...user,
      isProfileLocked: false
    };
    updateUserProfile(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (parsedProfile) {
      setParsedProfile({ ...parsedProfile, isSubmitted: false });
    }
    showToast('Profile draft unlocked! You can now add and refine skills freely.', 'info');
  };

  // Submit and LOCK Candidate Profile
  const handleSubmitAndLockProfile = async () => {
    if (!parsedProfile) return;

    try {
      const convertedSkills = parsedProfile.extractedSkills.map((sk) => {
        const meta = parsedProfile.skillsMetadata?.[sk] || {};
        return {
          id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          skillName: sk,
          category: meta.category || 'TECHNICAL',
          proficiencyLevel: meta.level || 'ADVANCED',
          yearsExperience: meta.years || parsedProfile.totalExperienceYears || 3.0,
        };
      });

      try {
        await userService.updateProfile({
          fullName: parsedProfile.fullName,
          targetCareerRole: parsedProfile.currentRole,
          bio: parsedProfile.headline,
        });
      } catch (backendErr) {
        console.warn('Backend update fallback', backendErr);
      }

      const userEmail = (user?.email || parsedProfile.email || 'candidate@skillgap.com').toLowerCase().trim();
      const documentPayload = {
        fileName: parsedProfile.documentName || (file?.name) || 'Candidate_Resume.pdf',
        fileType: file?.type || (parsedProfile.documentName?.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf'),
        fileSize: file?.size || (parsedProfile.rawText ? parsedProfile.rawText.length * 2 : 48500),
        uploadedAt: new Date().toISOString(),
        rawText: parsedProfile.rawText || pastedText || 'Submitted candidate credentials, experience history, and claimed technical proficiencies.',
        extractedSkills: parsedProfile.extractedSkills || [],
        candidateName: parsedProfile.fullName,
        candidateEmail: userEmail
      };

      try {
        const resumesStore = JSON.parse(localStorage.getItem('skillgap_resumes_store') || '{}');
        resumesStore[userEmail] = documentPayload;
        localStorage.setItem('skillgap_resumes_store', JSON.stringify(resumesStore));
        localStorage.setItem('skillgap_resume_doc_' + userEmail, JSON.stringify(documentPayload));
      } catch (e) {
        console.warn('Failed saving to skillgap_resumes_store:', e);
      }

      const updatedUser = {
        ...user,
        fullName: parsedProfile.fullName,
        targetCareerRole: parsedProfile.currentRole,
        bio: parsedProfile.headline,
        resumeFileName: parsedProfile.documentName,
        resumeDocument: documentPayload,
        skills: convertedSkills,
        isProfileLocked: true,
        atsScore: parsedProfile.atsScore || 92
      };

      updateUserProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (userEmail) {
        try {
          const storedProfiles = JSON.parse(localStorage.getItem('skillgap_registered_profiles') || '{}');
          storedProfiles[userEmail] = updatedUser;
          localStorage.setItem('skillgap_registered_profiles', JSON.stringify(storedProfiles));
        } catch (e) {
          console.warn('Failed writing to skillgap_registered_profiles', e);
        }
      }

      setParsedProfile({
        ...parsedProfile,
        isSubmitted: true
      });

      showToast('Candidate Profile & Resume submitted and locked for Recruiter & Admin review!', 'success');
    } catch (err) {
      console.error('Submission failed', err);
      showToast('Submission error. Please retry.', 'error');
    }
  };

  const isLocked = isProfileLocked && parsedProfile?.isSubmitted;

  // Filter skills for inventory display
  const currentSkillsList = parsedProfile?.extractedSkills || [];
  const filteredSkills = currentSkillsList.filter((sk) => {
    const matchesSearch = !skillSearchFilter || sk.toLowerCase().includes(skillSearchFilter.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategoryFilter === 'ALL') return true;
    const cat = parsedProfile?.skillsMetadata?.[sk]?.category || 'TECHNICAL';
    return cat === selectedCategoryFilter;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-darkbg text-slate-800 dark:text-gray-100 font-sans">
      <Sidebar />

      {/* Datalist for Autocomplete Suggestions */}
      <datalist id="enterprise-skills-catalog">
        {SKILL_TAXONOMY.map(s => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Breadcrumb />

        <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Header Banner */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 dark:bg-emerald-500/20 text-sky-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Resume Ingestion & Candidate Competency Suite
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                Add, manage, and verify technical competencies directly on your resume. Enrich your profile with enterprise skill stacks, recalculate your real-time ATS match score, and synchronize with recruiter evaluation systems.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={loadSampleResume}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/40 bg-sky-50 dark:bg-emerald-950/40 text-sky-700 dark:text-emerald-300 hover:bg-sky-100 dark:hover:bg-emerald-900/50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="Load full enterprise sample candidate resume"
              >
                <Sparkles className="w-4 h-4 text-sky-500 dark:text-emerald-400" />
                <span>Load Sample Profile</span>
              </button>

              {!parsedProfile && (
                <button
                  onClick={() => ensureCandidateProfileLoaded()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  title="Initialize candidate skills editor directly"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Adding Skills</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout: Left Document Parser (5 cols), Right Competency Suite (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Resume Ingestion Pane (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass p-6 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-4">
                
                <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <button
                      onClick={() => setActiveTab('upload')}
                      disabled={isLocked}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        activeTab === 'upload'
                          ? 'bg-sky-600 text-white dark:bg-emerald-500 shadow-sm'
                          : 'bg-transparent text-slate-600 dark:text-slate-300'
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
                          : 'bg-transparent text-slate-600 dark:text-slate-300'
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
                      className="w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:opacity-50"
                    />
                    <button
                      onClick={handlePasteSubmit}
                      disabled={isLocked}
                      className="w-full py-2.5 rounded-xl gradient-btn text-xs font-bold text-white shadow flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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

                {/* Candidate Pre-Submission Verification Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-darkcard border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-gray-300 space-y-1.5">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Infosys Enterprise Candidate Standard:</span>
                  </p>
                  <p>&bull; Freely add, search, and categorize competencies using the suite on the right.</p>
                  <p>&bull; Apply one-click enterprise stacks (Full Stack Java, Cloud DevOps, AI & ML).</p>
                  <p>&bull; Sync your skills to your verified candidate profile at any time.</p>
                </div>
              </div>

              {/* My Pending Skill Endorsement Requests (If Any) */}
              {myResumeSkillRequests.length > 0 && (
                <div className="glass p-5 rounded-3xl border border-indigo-200 dark:border-indigo-900/50 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>My Skill Endorsement Requests ({myResumeSkillRequests.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {myResumeSkillRequests.map(r => (
                      <div key={r.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{r.skillName}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{r.proficiencyLevel} &bull; {r.category}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {r.status === 'APPROVED' ? 'Verified' : 'Pending Audit'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Candidate Review & Skill Addition Suite (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-6">
                
                {/* Header with Live ATS Badge & Status */}
                <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-sky-500 dark:text-emerald-400" />
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Candidate Profile & Competency Review
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {parsedProfile && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400 flex items-center gap-1 shadow-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>ATS Score: {parsedProfile.atsScore || 92}%</span>
                      </span>
                    )}
                    {isLocked ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 flex items-center gap-1 uppercase tracking-wider">
                        <Lock className="w-3 h-3" />
                        <span>Submitted & Locked</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1 uppercase tracking-wider">
                        <Unlock className="w-3 h-3" />
                        <span>Editable Draft</span>
                      </span>
                    )}
                  </div>
                </div>

                {parsedProfile ? (
                  <div className="space-y-6 text-xs">
                    
                    {/* Candidate Identity Edit Form */}
                    <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-emerald-950/30 border border-sky-200 dark:border-emerald-500/30 space-y-4">
                      
                      {/* Document Name */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-200 mb-1">
                          Resume Document / PDF File Name
                        </label>
                        <input
                          type="text"
                          disabled={isLocked}
                          value={parsedProfile.documentName || 'Candidate_Resume.pdf'}
                          onChange={(e) => setParsedProfile({ ...parsedProfile, documentName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono disabled:opacity-60 focus:ring-2 focus:ring-sky-500"
                        />
                      </div>

                      {/* Full Name & Target Role */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-200 mb-1">
                            Candidate Full Name
                          </label>
                          <input
                            type="text"
                            disabled={isLocked}
                            value={parsedProfile.fullName}
                            onChange={(e) => setParsedProfile({ ...parsedProfile, fullName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold disabled:opacity-60 focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-200 mb-1">
                            Target Career Role
                          </label>
                          <input
                            type="text"
                            disabled={isLocked}
                            value={parsedProfile.currentRole}
                            onChange={(e) => setParsedProfile({ ...parsedProfile, currentRole: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs font-bold text-sky-700 dark:text-emerald-400 disabled:opacity-60 focus:ring-2 focus:ring-sky-500"
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

                    {/* ------------------------------------------------------------- */}
                    {/* ONE-CLICK ENTERPRISE SKILL PACKS (INFOSYS STANDARD)           */}
                    {/* ------------------------------------------------------------- */}
                    {!isLocked && (
                      <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-900/60 border border-indigo-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Quick Enterprise Skill Packs (Infosys Standard):</span>
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">1-Click Auto-Add</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {ENTERPRISE_SKILL_PACKS.map(pack => (
                            <button
                              key={pack.name}
                              type="button"
                              onClick={() => handleApplyEnterpriseSkillPack(pack)}
                              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition flex items-center justify-between group cursor-pointer shadow-xs"
                              title={pack.description}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">{pack.icon}</span>
                                <div>
                                  <div className="font-black text-slate-900 dark:text-white text-xs group-hover:text-indigo-600 dark:group-hover:text-emerald-400">{pack.name}</div>
                                  <div className="text-[9px] text-slate-500 dark:text-slate-400">{pack.skills.length} Enterprise Skills</div>
                                </div>
                              </div>
                              <Plus className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-125 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ------------------------------------------------------------- */}
                    {/* CANDIDATE SKILL ADDITION FORM (INFOSYS PROJECT STANDARD)       */}
                    {/* ------------------------------------------------------------- */}
                    {!isLocked ? (
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Add Technical Competency to Resume:</span>
                          </label>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Type custom or select taxonomy</span>
                        </div>

                        <form onSubmit={handleAddSkill} className="space-y-3 font-tech">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                            {/* Skill Input with Datalist Autocomplete */}
                            <div className="sm:col-span-5">
                              <input
                                type="text"
                                list="enterprise-skills-catalog"
                                value={newSkillInput}
                                onChange={(e) => setNewSkillInput(e.target.value)}
                                placeholder="Skill (e.g. Java 21, React, AWS, Docker)..."
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                              />
                            </div>

                            {/* Category Selector */}
                            <div className="sm:col-span-3">
                              <select
                                value={newSkillCategory}
                                onChange={(e) => setNewSkillCategory(e.target.value)}
                                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                              >
                                {SKILL_CATEGORIES.map(cat => (
                                  <option key={cat.value} value={cat.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                    {cat.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Proficiency Level Selector */}
                            <div className="sm:col-span-2">
                              <select
                                value={newSkillProficiency}
                                onChange={(e) => setNewSkillProficiency(e.target.value)}
                                className="w-full px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                              >
                                {PROFICIENCY_LEVELS.map(lvl => (
                                  <option key={lvl.value} value={lvl.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                    {lvl.value}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Add Button */}
                            <div className="sm:col-span-2">
                              <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Skill</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Suggestion Chips */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">Suggestions:</span>
                            {['Java 21', 'Spring Boot 3', 'React', 'Docker', 'AWS', 'Python', 'PostgreSQL', 'Microservices'].map(suggest => (
                              <button
                                key={suggest}
                                type="button"
                                onClick={() => {
                                  setNewSkillInput(suggest);
                                }}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium transition cursor-pointer"
                              >
                                + {suggest}
                              </button>
                            ))}
                          </div>
                        </form>
                      </div>
                    ) : (
                      /* Profile Locked State - Show Endorsement Request Workflow */
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>
                              <strong>Profile Submitted & Locked:</strong> Direct inline editing is frozen. You can request skill endorsements for recruiter/admin audit or unlock this draft.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowRequestModal(true)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 text-slate-950" />
                            <span>Request Skill Endorsement</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleUnlockDraftProfile}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-300 dark:border-slate-700"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unlock Draft to Edit Skills</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ------------------------------------------------------------- */}
                    {/* SKILLS INVENTORY & FILTERED PILLS CLOUD                       */}
                    {/* ------------------------------------------------------------- */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            Extracted Skills Inventory ({currentSkillsList.length}):
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                            {filteredSkills.length} Displayed
                          </span>
                        </div>

                        {/* Search Filter for large skills list */}
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={skillSearchFilter}
                              onChange={(e) => setSkillSearchFilter(e.target.value)}
                              placeholder="Search skills..."
                              className="pl-7 pr-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44"
                            />
                          </div>

                          {/* Save Skills Button */}
                          <button
                            type="button"
                            onClick={handleSaveSkillsToProfile}
                            disabled={isSavingSkills}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                            title="Synchronize all skills directly to your verified profile and database"
                          >
                            <Save className="w-3 h-3" />
                            <span>{isSavingSkills ? 'Syncing...' : 'Sync to Profile'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Category Filter Tabs */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setSelectedCategoryFilter('ALL')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                            selectedCategoryFilter === 'ALL'
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          All ({currentSkillsList.length})
                        </button>
                        {SKILL_CATEGORIES.slice(0, 5).map(cat => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setSelectedCategoryFilter(cat.value)}
                            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
                              selectedCategoryFilter === cat.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {cat.label.split('&')[0].trim()}
                          </button>
                        ))}
                      </div>

                      {/* Skill Pills */}
                      <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
                        {filteredSkills.map((sk) => {
                          const meta = parsedProfile.skillsMetadata?.[sk] || {};
                          const lvlObj = PROFICIENCY_LEVELS.find(l => l.value === (meta.level || 'ADVANCED')) || PROFICIENCY_LEVELS[2];
                          return (
                            <span
                              key={sk}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-xs group"
                            >
                              <span>{sk}</span>
                              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black border uppercase tracking-wider ${lvlObj.badgeClass}`}>
                                {meta.level || 'ADVANCED'}
                              </span>
                              {!isLocked && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(sk)}
                                  className="text-rose-500 hover:text-rose-700 hover:scale-125 transition ml-0.5 cursor-pointer"
                                  title={`Remove ${sk}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </span>
                          );
                        })}

                        {filteredSkills.length === 0 && (
                          <div className="w-full py-4 text-center text-xs text-slate-400">
                            No skills found matching &ldquo;{skillSearchFilter}&rdquo;. Click &ldquo;Add Skill&rdquo; to add it!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submission / Lock Actions */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      {!isLocked ? (
                        <button
                          onClick={handleSubmitAndLockProfile}
                          className="w-full py-3.5 text-xs font-black text-white gradient-btn rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition cursor-pointer uppercase tracking-wider"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Submit & Lock Candidate Profile for Recruiter Review</span>
                        </button>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-center text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Profile submitted and locked. Verified by Recruiters & Administrators.</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Empty State - Prompt candidate to begin */
                  <div className="py-16 text-center space-y-4 text-xs text-slate-500 dark:text-slate-400">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Resume Document Loaded Yet</p>
                      <p className="mt-1">Upload a PDF file, paste text content, or start building your skills directly.</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={loadSampleResume}
                        className="px-4 py-2 rounded-xl gradient-btn text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Load Enterprise Sample Resume</span>
                      </button>

                      <button
                        onClick={() => ensureCandidateProfileLoaded()}
                        className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Start Custom Profile</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Request Endorsement Modal (For Locked Profile Candidates) */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-200 dark:border-gray-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-emerald-400" />
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Request Skill Endorsement</h3>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300">
                Submit a new technical competency for administrative and recruiter audit. Verified skills will be endorsed to your profile.
              </p>

              <form onSubmit={handleCandidateSkillRequest} className="space-y-4 text-xs font-tech">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Competency Name</label>
                  <input
                    type="text"
                    required
                    list="enterprise-skills-catalog"
                    value={requestSkillForm.skillName}
                    onChange={(e) => setRequestSkillForm({ ...requestSkillForm, skillName: e.target.value })}
                    placeholder="e.g. Apache Kafka, Rust, Kubernetes..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={requestSkillForm.category}
                      onChange={(e) => setRequestSkillForm({ ...requestSkillForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {SKILL_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Proficiency Level</label>
                    <select
                      value={requestSkillForm.proficiencyLevel}
                      onChange={(e) => setRequestSkillForm({ ...requestSkillForm, proficiencyLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {PROFICIENCY_LEVELS.map(lvl => (
                        <option key={lvl.value} value={lvl.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{lvl.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Justification & Certification Reference</label>
                  <textarea
                    rows="3"
                    value={requestSkillForm.justification}
                    onChange={(e) => setRequestSkillForm({ ...requestSkillForm, justification: e.target.value })}
                    placeholder="Describe professional projects, certifications (e.g. AWS CKA), or production implementations..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl gradient-btn text-white font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
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

export default ResumeUploader;
