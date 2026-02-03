import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRedirectTarget } from '@/utils/RedirectEngine';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // TODO: Replace with generic Spinner component
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    const redirectTarget = getRedirectTarget(user, location.pathname);

    if (redirectTarget) {
        return <Navigate to={redirectTarget} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
