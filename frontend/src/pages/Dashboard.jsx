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
import { Sparkles, Briefcase, Award, CheckCircle, ArrowRight, Activity, TrendingUp } from 'lucide-react';
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
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />

        {/* Welcome Header */}
        <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md mb-8 relative overflow-hidden">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                Welcome back, {user?.fullName?.split(' ')[0]}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Target Career Role: <span className="font-semibold text-brand-600 dark:text-brand-400">{user?.targetCareerRole || 'Software Engineer'}</span>
              </p>
            </div>
            <Link
              to="/advisor"
              className="px-6 py-3 text-sm font-bold text-white gradient-btn rounded-xl shadow-lg flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run Skill Gap Analysis</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Skill Readiness Match"
            value={latestScan ? `${latestScan.matchPercentage}%` : 'N/A'}
            icon={Sparkles}
            color="indigo"
            subtitle={latestScan ? `Target: ${latestScan.targetJobTitle}` : 'Run scan to assess'}
          />
          <StatCard
            title="Active My Skills"
            value={user?.skills?.length || 0}
            icon={Award}
            color="emerald"
            subtitle="Skills in profile"
          />
          <StatCard
            title="Target Jobs Active"
            value={jobs.length}
            icon={Briefcase}
            color="amber"
            subtitle="Matching open positions"
          />
          <StatCard
            title="Gap Scans Run"
            value={history.length}
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
                  <p className="text-xs text-gray-500 italic">No skills added yet. Visit profile to add skills.</p>
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
                <p className="text-xs text-gray-500 italic">No analysis scans run yet.</p>
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
