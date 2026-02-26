import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, checkAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
