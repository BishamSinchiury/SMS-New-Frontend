import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getRedirectTarget } from '@/utils/RedirectEngine';

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // TODO: Replace with generic Spinner component
    }

    if (user) {
        // User is already logged in, redirect them to the appropriate place
        const target = getRedirectTarget(user, '/'); // Simulate root access to get standard redirect
        return <Navigate to={target || '/dashboard'} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
