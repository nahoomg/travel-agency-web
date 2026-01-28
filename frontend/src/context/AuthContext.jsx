import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const userData = await api.getProfile();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.login(email, password);
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        return response;
    };

    const register = async (userData) => {
        const response = await api.register(userData);
        // Don't auto-login after registration - user should sign in manually
        return response;
    };

    const logout = async () => {
        try {
            await request('/auth/logout', { method: 'POST' });
        } catch (e) {
            // Ignore error
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Helper just to clear state (for api client callback)
    const clearAuth = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Needed for api.js to access logout? 
// Actually api.js is external.
