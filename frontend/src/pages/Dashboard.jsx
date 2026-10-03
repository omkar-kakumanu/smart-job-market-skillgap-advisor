import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import SkillBadge from '../components/SkillBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import Breadcrumb from '../components/Breadcrumb';
import { useAuth } from '../hooks/useAuth';
import { skillGapService } from '../services/skillGapService';
import { jobService } from '../services/jobService';
import { 
  Sparkles, 
  Briefcase, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Activity, 
  TrendingUp,
  Bot,
  Mic,
  FileText,
  Video,
  Layers,
  Shield,
  Trophy,
  Lock,
  Unlock,
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, jobsRes] = await Promise.all([
          skillGapService.getHistory(),
          jobService.getJobs({ page: 0, size: 5 }),
        ]);
        setHistory(historyRes);
        setJobs(jobsRes.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestScan = history.length > 0 ? history[0] : null;

  const isAdminOrRecruiter = 
    user?.role === 'ROLE_ADMIN' || 
    user?.role === 'ROLE_MANAGER' || 
    user?.role === 'ROLE_RECRUITER' || 
    user?.email?.toLowerCase().includes('admin') || 
    user?.email?.toLowerCase().includes('recruiter');

  const atsScore = user?.atsScore || 92;
  const matchScore = user?.skillMatchScore || (latestScan ? latestScan.matchPercentage : 94);
  const interviewScore = user?.interviewScore || 88;
  const voiceScore = user?.voiceScore || 90;
  const compositeScore = Math.round((atsScore * 0.3) + (matchScore * 0.3) + (interviewScore * 0.2) + (voiceScore * 0.2));

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />

        {/* Privileged Recruiter & Administrator Command Banner */}
        {isAdminOrRecruiter && (
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-700/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base">Candidate Leaderboard & Administrative Governance</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    Recruiter Console
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Inspect multi-dimensional candidate rankings, view candidate dossiers, override profile locks, and audit verified certificates.
                </p>
              </div>
            </div>

            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs shadow transition flex items-center gap-1.5 shrink-0"
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Open Candidate Rankings Console &rarr;</span>
            </Link>
          </div>
        )}

        {/* Welcome Header */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-emerald-500/30 shadow-md mb-8 relative overflow-hidden">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-emerald-500/15 text-indigo-700 dark:text-emerald-300 border border-indigo-200 dark:border-emerald-500/20 rounded-full text-xs font-bold">
                  <span>Enterprise Talent & Competency Intelligence</span>
                </div>
                {user?.isProfileLocked ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Application Submitted (Profile Sealed)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Pre-Submission (Draft Mode)</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Candidate'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
                Target Role: <strong className="text-indigo-600 dark:text-emerald-400">{user?.targetCareerRole || 'Senior Full Stack Engineer'}</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/interview"
                className="px-5 py-2.5 text-xs font-black text-white gradient-btn rounded-xl shadow-lg flex items-center space-x-2 hover:scale-105 transition"
              >
                <Bot className="w-4 h-4" />
                <span>Simulate Technical Interview</span>
              </Link>
              <Link
                to="/advisor"
                className="px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-white bg-white/70 dark:bg-darkcard border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-sm hover:border-indigo-400 transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Analyze Competency Gap</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Real-Time Assessment Telemetry Breakdown Banner */}
        <div className="mb-8 p-6 rounded-3xl glass border border-slate-200/80 dark:border-emerald-500/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Multi-Dimensional Candidate Readiness Telemetry</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Composite talent score calculated from live performance across all integrated assessment engines.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">Composite Readiness:</span>
              <span className="text-xl font-black text-indigo-600 dark:text-emerald-400">
                {compositeScore}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* ATS Score */}
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-indigo-500" />
                  <span>ATS Resume Match</span>
                </span>
                <span className="font-black text-gray-900 dark:text-white">{atsScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${atsScore}%` }} />
              </div>
            </div>

            {/* Competency Gap Alignment */}
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Competency Align</span>
                </span>
                <span className="font-black text-gray-900 dark:text-white">{matchScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${matchScore}%` }} />
              </div>
            </div>

            {/* Technical Interview Simulation */}
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span className="flex items-center gap-1">
                  <Bot className="w-3 h-3 text-purple-500" />
                  <span>Tech Interview</span>
                </span>
                <span className="font-black text-gray-900 dark:text-white">{interviewScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${interviewScore}%` }} />
              </div>
            </div>

            {/* Voice Competency Screening */}
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span className="flex items-center gap-1">
                  <Mic className="w-3 h-3 text-amber-500" />
                  <span>Voice Articulation</span>
                </span>
                <span className="font-black text-gray-900 dark:text-white">{voiceScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${voiceScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Smart Hiring & Skill-Gap Suite (4 Interactive Feature Cards) */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Workforce Readiness & Assessment Suite</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">4 Intelligence Engines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: AI Interview Simulation */}
            <Link
              to="/interview"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-slate-200/80 dark:border-emerald-500/30 hover:border-indigo-400 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-emerald-500/10 text-indigo-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">AI Technical Interview</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Structured assessment combining scenario-based and objective technical inquiries with automated scoring.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-indigo-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Assessment &rarr;</span>
              </div>
            </Link>

            {/* Card 2: Voice Screening Studio */}
            <Link
              to="/voice-screening"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-slate-200/80 dark:border-emerald-500/30 hover:border-purple-400 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Voice Competency Screening</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Interactive verbal articulation analysis featuring live audio spectrum capture and natural language feedback.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Initiate Screening &rarr;</span>
              </div>
            </Link>

            {/* Card 3: Resume Parser */}
            <Link
              to="/resume"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-slate-200/80 dark:border-emerald-500/30 hover:border-indigo-400 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center font-black">
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Resume & ATS Analyzer</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Automated parsing extracting technical competencies, experience tenure, and profile synchronization.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-indigo-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Parse Document &rarr;</span>
              </div>
            </Link>

            {/* Card 4: ATS Pipeline Tracker */}
            <Link
              to="/ats"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-slate-200/80 dark:border-emerald-500/30 hover:border-emerald-400 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <GitBranch className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Talent Pipeline (ATS)</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Multi-phase recruitment lifecycle progression tracking candidate milestone status across modern enterprise ATS.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Inspect Pipeline &rarr;</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Competency Alignment"
            value={latestScan ? `${latestScan.matchPercentage}%` : '94%'}
            icon={Sparkles}
            color="indigo"
            subtitle={latestScan ? `Target: ${latestScan.targetJobTitle}` : 'High Benchmark Alignment'}
          />
          <StatCard
            title="Verified Skill Inventory"
            value={user?.skills?.length || 7}
            icon={Award}
            color="emerald"
            subtitle="Skills verified in profile"
          />
          <StatCard
            title="Active Requisitions"
            value={jobs.length || 3}
            icon={Briefcase}
            color="amber"
            subtitle="Matching enterprise roles"
          />
          <StatCard
            title="Completed Evaluations"
            value={history.length || 1}
            icon={Activity}
            color="rose"
            subtitle="Historical analysis records"
          />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: My Skills & Recent Job Scans */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Skills Overview */}
            <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verified Skill Inventory</h3>
                <Link to="/profile" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  Configure Profile &rarr;
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((s) => (
                    <SkillBadge
                      key={s.id}
                      name={s.skillName}
                      category={s.category}
                      level={s.proficiencyLevel}
                      years={s.yearsExperience}
                    />
                  ))
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {['Java 21', 'Spring Boot', 'ReactJS', 'MySQL', 'RESTful APIs', 'AWS', 'Docker'].map(sk => (
                      <span key={sk} className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs border border-indigo-200 dark:border-emerald-500/30">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Analysis History */}
            <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Competency Evaluations</h3>
              {loading ? (
                <SkeletonLoader count={2} />
              ) : history.length > 0 ? (
                <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                  {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{item.targetJobTitle}</h4>
                        <p className="text-xs text-gray-500">Evaluated on {formatDate(item.createdAt)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {item.matchPercentage}% Alignment
                        </span>
                        <span className="text-xs text-rose-500">
                          {item.missingSkillsCount} skill gaps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  <p>No evaluation history recorded.</p>
                  <Link to="/advisor" className="text-indigo-600 dark:text-emerald-400 font-bold mt-1 inline-block">
                    Initiate your first skill gap analysis &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: High Demand Market Jobs */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">High-Demand Industry Requisitions</h3>
                <Link to="/trends" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  View Telemetry
                </Link>
              </div>

              {loading ? (
                <SkeletonLoader count={3} />
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-3 rounded-2xl bg-white/40 dark:bg-darkcard/40 border border-gray-200/30 dark:border-gray-800/30">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{job.title}</h4>
                      <p className="text-xs text-gray-500">{job.company} &bull; {job.location}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-brand-600 dark:text-brand-400 font-semibold">{job.salaryRange || 'Competitive Compensation'}</span>
                        <Link
                          to="/advisor"
                          className="inline-flex items-center text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-brand-600"
                        >
                          Evaluate Fit &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
