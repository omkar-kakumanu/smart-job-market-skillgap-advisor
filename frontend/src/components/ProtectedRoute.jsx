import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SkeletonLoader from './SkeletonLoader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Candidates pending administrator review cannot enter the website
  if (user?.role === 'ROLE_USER' && (user?.approvalStatus === 'PENDING_APPROVAL' || user?.isApproved === false)) {
    return <Navigate to="/login?pendingApproval=true" replace />;
  }

  if (allowedRoles) {
    const userRole = user?.role || '';
    const cleanRole = userRole.startsWith('ROLE_') ? userRole : `ROLE_${userRole}`;
    const email = user?.email?.toLowerCase() || '';
    const isEmailPrivileged = email.includes('admin') || email.includes('recruiter') || email.includes('manager');
    const isRoleAllowed = allowedRoles.includes(userRole) || allowedRoles.includes(cleanRole);
    if (!isRoleAllowed && !isEmailPrivileged) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
