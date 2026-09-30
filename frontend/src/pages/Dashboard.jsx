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
  GitBranch,
  Video,
  Layers
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />

        {/* Welcome Header */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md mb-8 relative overflow-hidden">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/10 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/15 dark:bg-emerald-500/15 text-sky-700 dark:text-emerald-300 rounded-full text-xs font-bold mb-2">
                <span>Enterprise Talent & Skill Intelligence</span>
                <span>•</span>
                <span>Java 21 Spring Boot Backend</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Candidate'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
                Target Role: <strong className="text-sky-600 dark:text-emerald-400">{user?.targetCareerRole || 'Full Stack Java Developer'}</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/interview"
                className="px-5 py-2.5 text-xs font-black text-white gradient-btn rounded-xl shadow-lg flex items-center space-x-2 hover:scale-105 transition"
              >
                <Bot className="w-4 h-4" />
                <span>AI Interview Practice</span>
              </Link>
              <Link
                to="/advisor"
                className="px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-white bg-white/70 dark:bg-darkcard border border-sky-400/30 dark:border-emerald-500/30 rounded-xl shadow-sm hover:border-sky-500 transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Skill Gap Analysis</span>
              </Link>
            </div>
          </div>
        </div>

        {/* AI Smart Hiring & Skill-Gap Suite (4 Interactive Feature Cards) */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Smart Hiring & Interview Preparation Suite</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">4 Active Modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: AI Interview Simulation */}
            <Link
              to="/interview"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-sky-300/40 dark:border-emerald-500/30 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-emerald-500/10 text-sky-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">AI Interview Simulator</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  10 questions (descriptive + objective MCQs) with attempt tracking and automated grading.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-sky-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Start Practice &rarr;</span>
              </div>
            </Link>

            {/* Card 2: Voice Screening Studio */}
            <Link
              to="/voice-screening"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-sky-300/40 dark:border-emerald-500/30 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Voice Screening Studio</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Live Web Audio microphone recording with animated waveform and Speech-to-Text scoring.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Record Speech &rarr;</span>
              </div>
            </Link>

            {/* Card 3: Resume Parser */}
            <Link
              to="/resume"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-sky-300/40 dark:border-emerald-500/30 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Resume Parser & Profiler</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Upload PDF/DOCX to extract skills, experience, and sync directly to your skill inventory.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Upload Resume &rarr;</span>
              </div>
            </Link>

            {/* Card 4: ATS Pipeline Tracker */}
            <Link
              to="/ats"
              className="p-5 rounded-2xl glass hover:scale-[1.02] border border-sky-300/40 dark:border-emerald-500/30 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <GitBranch className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Application ATS Tracker</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                  5-stage recruitment progress stepper and live sync with Greenhouse, Lever, and Workday.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>View Pipeline &rarr;</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Skill Readiness Match"
            value={latestScan ? `${latestScan.matchPercentage}%` : '94%'}
            icon={Sparkles}
            color="indigo"
            subtitle={latestScan ? `Target: ${latestScan.targetJobTitle}` : 'High Compatibility'}
          />
          <StatCard
            title="Active My Skills"
            value={user?.skills?.length || 7}
            icon={Award}
            color="emerald"
            subtitle="Skills in profile inventory"
          />
          <StatCard
            title="Target Jobs Active"
            value={jobs.length || 3}
            icon={Briefcase}
            color="amber"
            subtitle="Matching open positions"
          />
          <StatCard
            title="Gap Scans Run"
            value={history.length || 1}
            icon={Activity}
            color="rose"
            subtitle="Total historical scans"
          />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: My Skills & Recent Job Scans */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Skills Overview */}
            <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Skill Inventory</h3>
                <Link to="/profile" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  Manage Skills &rarr;
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
                      <span key={sk} className="px-3 py-1 rounded-xl bg-sky-100 text-sky-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs border border-sky-300/50 dark:border-emerald-500/30">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Analysis History */}
            <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Skill Gap Scans</h3>
              {loading ? (
                <SkeletonLoader count={2} />
              ) : history.length > 0 ? (
                <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                  {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{item.targetJobTitle}</h4>
                        <p className="text-xs text-gray-500">Scanned on {formatDate(item.createdAt)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {item.matchPercentage}% Match
                        </span>
                        <span className="text-xs text-rose-500">
                          {item.missingSkillsCount} missing
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  <p>No scans run yet.</p>
                  <Link to="/advisor" className="text-sky-600 dark:text-emerald-400 font-bold mt-1 inline-block">
                    Run your first scan now &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: High Demand Market Jobs */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Market Roles</h3>
                <Link to="/trends" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  View Trends
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
                        <span className="text-brand-600 dark:text-brand-400 font-semibold">{job.salaryRange || 'Competitive'}</span>
                        <Link
                          to="/advisor"
                          className="inline-flex items-center text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-brand-600"
                        >
                          Check Match &rarr;
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
