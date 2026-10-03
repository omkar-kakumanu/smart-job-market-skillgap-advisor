import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SidebarProvider } from './context/SidebarContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SkillGapAdvisor from './pages/SkillGapAdvisor';
import JobMarketTrends from './pages/JobMarketTrends';
import Profile from './pages/Profile';
import Certificates from './pages/Certificates';
import InterviewSimulation from './pages/InterviewSimulation';
import VoiceScreening from './pages/VoiceScreening';
import ResumeUploader from './pages/ResumeUploader';
import AtsPipeline from './pages/AtsPipeline';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <SidebarProvider>
              <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
                <div>
                  <Navbar />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/trends" element={<JobMarketTrends />} />

                    {/* Authenticated Candidate & Engineering Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/advisor" element={<SkillGapAdvisor />} />
                      <Route path="/interview" element={<InterviewSimulation />} />
                      <Route path="/voice-screening" element={<VoiceScreening />} />
                      <Route path="/resume" element={<ResumeUploader />} />
                      <Route path="/ats" element={<AtsPipeline />} />
                      <Route path="/certificates" element={<Certificates />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Admin & Recruiter Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECRUITER']} />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    {/* Catch All 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </SidebarProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
