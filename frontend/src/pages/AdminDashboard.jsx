import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../hooks/useToast';
import { jobService } from '../services/jobService';
import { Shield, Plus, Briefcase, Cpu, Trash2 } from 'lucide-react';
import { EXPERIENCE_LEVELS, SKILL_CATEGORIES } from '../utils/constants';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
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
    marketDemandScore: 80,
  });

  const fetchData = async () => {
    try {
      const [jRes, sRes] = await Promise.all([
        jobService.getJobs({ page: 0, size: 50 }),
        jobService.getAllSkills(),
      ]);
      setJobs(jRes.content || []);
      setSkills(sRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobService.createJob(newJob);
      showToast('Job posting created!', 'success');
      setNewJob({ title: '', company: '', location: 'Remote', experienceLevel: 'ENTRY_LEVEL', salaryRange: '$100,000 - $120,000', description: '' });
      fetchData();
    } catch (err) {
      showToast('Failed to create job posting', 'error');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await jobService.deleteJob(id);
      showToast('Job posting removed', 'info');
      fetchData();
    } catch (err) {
      showToast('Failed to delete job posting', 'error');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Admin Portal' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            <span>Administrator Portal</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Manage global job postings, technical skill catalog, and learning resources.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Job Form */}
          <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-brand-500" />
              <span>Post New Industry Job</span>
            </h3>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
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
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company</label>
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
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
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
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience Level</label>
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
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJob.salaryRange}
                    onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Job Description & Requirements</label>
                <textarea
                  rows="3"
                  required
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Detailed position responsibilities..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-bold text-white gradient-btn rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Job Posting</span>
              </button>
            </form>
          </div>

          {/* Active Job Postings List */}
          <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Published Job Postings ({jobs.length})</h3>

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
      </main>
    </div>
  );
};

export default AdminDashboard;
