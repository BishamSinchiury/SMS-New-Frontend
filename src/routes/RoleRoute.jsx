import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkRoleAccess } from '@/utils/RedirectEngine';

const RoleRoute = ({ allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // Technically ProtectedRoute handles this, but safe fallback
        return <Navigate to="/" replace />;
    }

    const hasAccess = checkRoleAccess(user, allowedRoles);

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;
