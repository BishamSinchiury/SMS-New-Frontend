import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PublicRoute = () => {
    const { loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // TODO: Replace with generic Spinner component
    }

    // Allow access to public routes regardless of authentication status
    // Individual pages will handle their own redirect logic if needed
    return <Outlet />;
};

export default PublicRoute;
