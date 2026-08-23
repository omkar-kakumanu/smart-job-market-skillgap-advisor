import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';
import { Mail, Lock, LogIn, Cpu } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { loginUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await authService.login(data);
      loginUser(response);
      showToast('Authenticated successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials provided';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-8 rounded-3xl border border-sky-400/40 dark:border-emerald-500/40 shadow-sky-glow dark:shadow-emerald-glow space-y-6">
        <div className="text-center space-y-2 font-tech">
          <div className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center mx-auto shadow-sky-glow dark:shadow-emerald-glow border border-sky-400/40 dark:border-emerald-400/40">
            <Cpu className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-cinzel font-black text-slate-900 dark:text-white">WELCOME BACK</h2>
          <p className="text-xs uppercase tracking-widest text-sky-600 dark:text-emerald-400 font-bold">
            Sign in to your Skill-Gap Advisor account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-tech">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-sky-500 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/30 bg-white/90 dark:bg-[#0d1714] text-slate-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-sky-500 dark:focus:ring-emerald-400 focus:outline-none font-sans font-medium"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base font-bold text-white gradient-btn rounded-xl shadow-sky-glow dark:shadow-emerald-glow flex items-center justify-center space-x-2 border border-sky-300/40 dark:border-emerald-400/40 uppercase tracking-widest"
          >
            {isSubmitting ? <span>Authenticating...</span> : (
              <>
                <span>Sign In</span>
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-tech text-slate-600 dark:text-gray-400 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-amber-600 dark:text-amber-400 hover:underline uppercase tracking-wider">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
