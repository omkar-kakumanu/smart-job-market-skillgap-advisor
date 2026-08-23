import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkillBadge from '../components/SkillBadge';
import SkillGapChart from '../components/SkillGapChart';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../hooks/useToast';
import { skillGapService } from '../services/skillGapService';
import { jobService } from '../services/jobService';
import { Sparkles, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';

const SkillGapAdvisor = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [result, setResult] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getJobs({ page: 0, size: 50 });
        setJobs(res.content || []);
        if (res.content?.length > 0) {
          setSelectedJobId(res.content[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const payload = selectedJobId
        ? { jobPostingId: Number(selectedJobId) }
        : { targetJobTitle: customRole };

      const res = await skillGapService.analyzeGap(payload);
      setResult(res);
      showToast('Skill gap analysis completed successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed. Make sure you have selected a valid role.';
      showToast(msg, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Skill Gap Advisor' }]} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-amber-500" />
              <span>AI Skill Gap Advisor</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Compare your current profile skills with active industry job requirements.
            </p>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md mb-8">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Select Target Job Posting
                </label>
                {loadingJobs ? (
                  <SkeletonLoader height="h-11" />
                ) : (
                  <select
                    value={selectedJobId}
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      setCustomRole('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="">-- Choose From Active Industry Jobs --</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.company})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Or Type Target Career Title
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => {
                    setCustomRole(e.target.value);
                    setSelectedJobId('');
                  }}
                  placeholder="e.g. Senior Java Engineer"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={analyzing || (!selectedJobId && !customRole)}
              className="w-full py-4 text-base font-bold text-white gradient-btn rounded-2xl shadow-xl flex items-center justify-center space-x-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Computing Skill Matrix & Gap Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Analyze Skill Gap & Generate Roadmap</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results View */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Score Card */}
            <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-2 md:col-span-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Target Role: {result.targetJobTitle}
                </span>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                  Skill Match: <span className="gradient-text">{result.matchPercentage}%</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Matched <strong className="text-emerald-500">{result.matchedSkillsCount} skills</strong> out of required skills. Missed <strong className="text-rose-500">{result.missingSkillsCount} skills</strong>.
                </p>
              </div>
              <div>
                <SkillGapChart
                  matchedCount={result.matchedSkillsCount}
                  missingCount={result.missingSkillsCount}
                />
              </div>
            </div>

            {/* Missing Skills & Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Missing Skills List */}
              <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>Identified Skill Gaps</span>
                </h3>
                <div className="space-y-3">
                  {result.missingSkills.map((ms, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-rose-700 dark:text-rose-300">{ms.skillName}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200">
                          Weight: {ms.importanceWeight}/10
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{ms.recommendedAction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Courses */}
              <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-brand-500" />
                  <span>Recommended Learning Courses</span>
                </h3>
                <div className="space-y-3">
                  {result.recommendedCourses.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/40 dark:bg-darkcard/40 border border-gray-200/30 dark:border-gray-800/30 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{c.title}</h4>
                        <p className="text-xs text-gray-500">{c.provider} &bull; {c.difficulty} &bull; Rating: {c.rating}⭐</p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                          Bridges: {c.primarySkillName}
                        </span>
                      </div>
                      <a
                        href={c.courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SkillGapAdvisor;
