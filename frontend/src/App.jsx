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
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Certificates from './pages/Certificates';
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
                    <Route path="/courses" element={<Courses />} />

                    {/* Authenticated Candidate Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/advisor" element={<SkillGapAdvisor />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/certificates" element={<Certificates />} />
                    </Route>

                    {/* Admin Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER']} />}>
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
