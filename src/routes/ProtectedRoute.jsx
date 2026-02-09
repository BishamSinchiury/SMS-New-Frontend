import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading, checkAuthStatus } = useAuth();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(!user);

    useEffect(() => {
        if (!user) {
            checkAuthStatus().then(() => setIsVerifying(false));
        } else {
            setIsVerifying(false); // Ensure we stop verifying if user exists
        }
    }, []); // Check on mount

    if (loading || isVerifying) {
        return <div>Loading...</div>; // TODO: Replace with generic Spinner component
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check user approval status and redirect accordingly
    const approvalStatus = user.approval_status;
    const currentPath = location.pathname;

    // Prevent redirect loops by checking current path
    if (approvalStatus === 'PENDING_PROFILE' && currentPath !== '/profile-setup') {
        return <Navigate to="/profile-setup" replace />;
    }

    if ((approvalStatus === 'PENDING_APPROVAL' || approvalStatus === 'REJECTED') && currentPath !== '/status') {
        return <Navigate to="/status" replace />;
    }

    // Only APPROVED users can access protected routes
    if (approvalStatus !== 'APPROVED') {
        // If they're on profile-setup or status page, allow it
        if (currentPath === '/profile-setup' || currentPath === '/status') {
            return <Outlet />;
        }
        // Otherwise redirect to appropriate page
        if (approvalStatus === 'PENDING_PROFILE') {
            return <Navigate to="/profile-setup" replace />;
        }
        return <Navigate to="/status" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
