import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkeletonLoader from '../components/SkeletonLoader';
import { jobService } from '../services/jobService';
import { BookOpen, ExternalLink, Star, Search, Clock } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await jobService.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const formatUrl = (url) => {
    if (!url) return '#';
    let formatted = url;
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    return formatted.replace('coursera.org/courses?', 'coursera.org/search?');
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.primarySkillName.toLowerCase().includes(search.toLowerCase()) ||
    c.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Courses Directory' }]} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-brand-600 dark:text-brand-400" />
              <span>Learning & Skill Bridge Courses</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Curated Masterclasses and certifications to bridge identified skill gaps.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill or title..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={4} height="h-28" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <div key={c.id} className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                      Skill: {c.primarySkillName}
                    </span>
                    <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {c.rating}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2">{c.title}</h3>
                  <p className="text-xs text-gray-500">Provider: <strong className="text-gray-700 dark:text-gray-300">{c.provider}</strong></p>
                </div>

                <div className="pt-2 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.durationHours} hrs &bull; {c.difficulty}</span>
                  </div>
                  <a
                    href={formatUrl(c.courseUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl font-bold text-white gradient-btn shadow flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
