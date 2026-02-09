import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthApi from '../services/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkAuthStatus = async () => {
        setLoading(true);
        try {
            const response = await AuthApi.getCurrentUser();
            setUser(response.data);
            return response.data;
        } catch (err) {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await AuthApi.login(email, password);
            await checkAuthStatus(); // Refresh user data after login
            return true;
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await AuthApi.logout();
            setUser(null);
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
