import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';
import { EXPERIENCE_LEVELS } from '../utils/constants';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';
import { User, Mail, Lock, Briefcase, UserPlus, Cpu } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const { loginUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const fullNameValue = watch('fullName');

  const onSubmit = async (data) => {
    try {
      const response = await authService.register({ ...data, profileImageUrl });
      loginUser(response);
      showToast('Account registered successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 my-6">
      <div className="glass max-w-xl w-full p-8 rounded-3xl border border-sky-400/40 dark:border-emerald-500/40 shadow-sky-glow dark:shadow-emerald-glow space-y-6">
        <div className="text-center space-y-2 font-tech">
          <div className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center mx-auto shadow-sky-glow dark:shadow-emerald-glow border border-sky-400/40 dark:border-emerald-400/40">
            <Cpu className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-cinzel font-black text-slate-900 dark:text-white">CREATE ACCOUNT</h2>
          <p className="text-xs uppercase tracking-widest text-sky-600 dark:text-emerald-400 font-bold">
            Join the Smart Job Market Skill-Gap Advisor Platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-tech">
          <ProfilePhotoUploader
            value={profileImageUrl}
            onChange={setProfileImageUrl}
            fullName={fullNameValue || 'Candidate'}
            label="Candidate Profile Photo"
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/30 bg-white/90 dark:bg-[#0d1714] text-slate-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-sans font-medium"
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/30 bg-white/90 dark:bg-[#0d1714] text-slate-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-sans font-medium"
                placeholder="john.doe@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Target Career Role</label>
            <div className="relative">
              <Briefcase className="w-5 h-5 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('targetCareerRole', { required: 'Target role is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/30 bg-white/90 dark:bg-[#0d1714] text-slate-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-sans font-medium"
                placeholder="Full Stack Java Developer"
              />
            </div>
            {errors.targetCareerRole && <p className="text-xs text-rose-500 mt-1">{errors.targetCareerRole.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Experience Level</label>
              <select
                {...register('experienceLevel')}
                className="w-full px-3 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/30 bg-white/90 dark:bg-[#0d1714] text-slate-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-sans font-medium"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 chars' } })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/30 bg-white/90 dark:bg-[#0d1714] text-slate-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-sans font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base font-bold text-white gradient-btn rounded-xl shadow-sky-glow dark:shadow-emerald-glow flex items-center justify-center space-x-2 border border-sky-300/40 dark:border-emerald-400/40 uppercase tracking-widest"
          >
            {isSubmitting ? <span>Creating Account...</span> : (
              <>
                <span>Create Account</span>
                <UserPlus className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-tech text-slate-600 dark:text-gray-400 font-semibold">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-amber-600 dark:text-amber-400 hover:underline uppercase tracking-wider">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
