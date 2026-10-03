import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkeletonLoader from '../components/SkeletonLoader';
import { jobService } from '../services/jobService';
import { BookOpen, ExternalLink, Star, Search, Clock, Award, Filter, Sparkles } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndSkills = async () => {
      try {
        const [courseData, skillData] = await Promise.all([
          jobService.getAllCourses().catch(() => []),
          jobService.getAllSkills().catch(() => [])
        ]);

        // Load custom courses added by admin
        const storedAdminCourses = localStorage.getItem('skillgap_admin_courses');
        const customCourses = storedAdminCourses ? JSON.parse(storedAdminCourses) : [];

        // Load custom skills defined by admin
        const storedAdminSkills = localStorage.getItem('skillgap_admin_skills');
        const customSkills = storedAdminSkills ? JSON.parse(storedAdminSkills) : [];

        // Combine courses
        const combinedCourses = [...customCourses, ...(courseData || [])];
        
        // Remove duplicates by ID or title
        const uniqueCourses = [];
        const seen = new Set();
        for (const c of combinedCourses) {
          const key = (c.id || c.title).toString().toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            uniqueCourses.push(c);
          }
        }

        // Build list of skills given by admin
        const skillNames = new Set();
        (skillData || []).forEach(s => skillNames.add(s.name));
        customSkills.forEach(s => skillNames.add(s.name));
        uniqueCourses.forEach(c => {
          if (c.primarySkillName) skillNames.add(c.primarySkillName);
        });

        setCourses(uniqueCourses);
        setSkillsList(Array.from(skillNames));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesAndSkills();
  }, []);

  const formatUrl = (url) => {
    if (!url) return '#';
    let formatted = url;
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    return formatted.replace('coursera.org/courses?', 'coursera.org/search?');
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.primarySkillName && c.primarySkillName.toLowerCase().includes(search.toLowerCase())) ||
      (c.provider && c.provider.toLowerCase().includes(search.toLowerCase()));

    const matchesSkill =
      selectedSkill === 'ALL' ||
      (c.primarySkillName && c.primarySkillName.toLowerCase() === selectedSkill.toLowerCase());

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Accredited Curricula' }]} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              <span>Accredited Skill & Upskilling Curricula</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Industry-certified masterclasses and accredited curricula mapped strictly to technical competencies administered by the platform board.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by competency, title, or provider..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Admin Skills Filter Tags Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-brand-500" />
              <span>Administering Curricula by Verified Skill:</span>
            </span>
            <span className="text-[11px] font-mono text-gray-500">
              Showing {filteredCourses.length} accredited {filteredCourses.length === 1 ? 'course' : 'courses'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedSkill('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedSkill === 'ALL'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 ring-2 ring-brand-500/40'
                  : 'bg-white/70 dark:bg-darkcard/70 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              All Competencies ({courses.length})
            </button>

            {skillsList.map((skillName) => {
              const skillCount = courses.filter(
                (c) => c.primarySkillName?.toLowerCase() === skillName.toLowerCase()
              ).length;

              return (
                <button
                  key={skillName}
                  onClick={() => setSelectedSkill(skillName)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedSkill.toLowerCase() === skillName.toLowerCase()
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                      : 'bg-white/70 dark:bg-darkcard/70 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{skillName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    selectedSkill.toLowerCase() === skillName.toLowerCase()
                      ? 'bg-indigo-800 text-indigo-100'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {skillCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Cards Grid */}
        {loading ? (
          <SkeletonLoader count={6} height="h-32" />
        ) : filteredCourses.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              No Curricula Found for "{selectedSkill}"
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              There are currently no accredited courses mapped to this skill. Administrators can publish curriculum assets directly from the Administrative Management Console.
            </p>
            <button
              onClick={() => { setSelectedSkill('ALL'); setSearch(''); }}
              className="px-4 py-2 rounded-xl gradient-btn text-xs font-bold text-white shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                      Skill: {c.primarySkillName}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {c.rating || 4.8}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Accreditation: <strong className="text-gray-700 dark:text-gray-300 font-semibold">{c.provider}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-gray-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.durationHours} hrs &bull; {c.difficulty || 'Advanced'}</span>
                  </div>
                  <a
                    href={formatUrl(c.courseUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl font-bold text-white gradient-btn shadow flex items-center space-x-1.5 hover:scale-105 transition-transform"
                  >
                    <span>Access Curricula</span>
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
