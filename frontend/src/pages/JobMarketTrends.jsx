import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { analyticsService } from '../services/analyticsService';
import { TrendingUp, Briefcase, Users, Cpu, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const JobMarketTrends = () => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await analyticsService.getMarketTrends();
        setTrends(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const chartData = trends?.topDemandedSkills?.map((s) => ({
    name: s.name,
    demandScore: s.marketDemandScore,
  })) || [];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Market Trends' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            <span>Job Market Skills & Demand Trends</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Real-time analytics on top requested technical skills, candidate supply, and experience levels.
          </p>
        </div>

        {loading ? (
          <SkeletonLoader count={4} height="h-24" />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Active Jobs Tracked" value={trends?.totalActiveJobs || 0} icon={Briefcase} color="indigo" />
              <StatCard title="Registered Candidates" value={trends?.totalRegisteredCandidates || 0} icon={Users} color="emerald" />
              <StatCard title="Total Skills Catalog" value={trends?.totalSkillsTracked || 0} icon={Cpu} color="amber" />
              <StatCard title="Top Demanded Skill" value={trends?.topDemandedSkills?.[0]?.name || 'Java 21'} icon={Award} color="rose" />
            </div>

            {/* Demand Chart */}
            <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top 10 Most Demanded Skills (Market Score /100)</h3>
              <div className="w-full h-80 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} interval={0} angle={-25} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }} />
                    <Bar dataKey="demandScore" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobMarketTrends;
