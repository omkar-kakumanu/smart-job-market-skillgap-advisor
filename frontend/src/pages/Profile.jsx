import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkillBadge from '../components/SkillBadge';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { User, Plus, Trash2, Save, Award } from 'lucide-react';
import { PROFICIENCY_LEVELS, EXPERIENCE_LEVELS } from '../utils/constants';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(user);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [years, setYears] = useState('2.0');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [p, skills] = await Promise.all([
          userService.getProfile(),
          jobService.getAllSkills(),
        ]);
        setProfile(p);
        updateUserProfile(p);
        setAllSkills(skills);
        if (skills.length > 0) setSelectedSkillId(skills[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateProfile(profile);
      setProfile(updated);
      updateUserProfile(updated);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;
    try {
      await userService.addSkill(selectedSkillId, proficiency, years);
      const updatedP = await userService.getProfile();
      setProfile(updatedP);
      updateUserProfile(updatedP);
      showToast('Skill added to your inventory!', 'success');
    } catch (err) {
      showToast('Failed to add skill', 'error');
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await userService.removeSkill(skillId);
      const updatedP = await userService.getProfile();
      setProfile(updatedP);
      updateUserProfile(updatedP);
      showToast('Skill removed', 'info');
    } catch (err) {
      showToast('Failed to remove skill', 'error');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'User Profile' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            <span>Candidate Profile & Skill Inventory</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Keep your skills and target role updated for accurate AI gap matching.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Info Form */}
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Profile Photo Uploader */}
              <ProfilePhotoUploader
                value={profile?.profileImageUrl || ''}
                onChange={(url) => setProfile({ ...profile, profileImageUrl: url })}
                fullName={profile?.fullName || 'Candidate'}
                label="Profile Avatar"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile?.fullName || ''}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm opacity-70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Career Role</label>
                  <input
                    type="text"
                    value={profile?.targetCareerRole || ''}
                    onChange={(e) => setProfile({ ...profile, targetCareerRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience Level</label>
                  <select
                    value={profile?.experienceLevel || 'ENTRY_LEVEL'}
                    onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  >
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio / Profile Summary</label>
                <textarea
                  rows="3"
                  value={profile?.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Summary of experience, technical interests, and goals..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white gradient-btn rounded-xl shadow-md flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Manage Skill Inventory */}
          <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span>Skill Inventory ({profile?.skills?.length || 0})</span>
            </h3>

            {/* Add Skill Controls */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/40 dark:bg-darkcard/40 border border-gray-200/30 dark:border-gray-800/30">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Add Skill</label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs"
              >
                {allSkills.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs"
                >
                  {PROFICIENCY_LEVELS.map((pl) => (
                    <option key={pl.value} value={pl.value}>{pl.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.5"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="Years Exp"
                  className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-xs"
                />
              </div>

              <button
                onClick={handleAddSkill}
                className="w-full py-2 text-xs font-bold text-white gradient-btn rounded-xl flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add To Profile</span>
              </button>
            </div>

            {/* Existing Skills Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {profile?.skills?.map((s) => (
                <SkillBadge
                  key={s.id}
                  name={s.skillName}
                  category={s.category}
                  level={s.proficiencyLevel}
                  years={s.yearsExperience}
                  onRemove={() => handleRemoveSkill(s.skillId)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
