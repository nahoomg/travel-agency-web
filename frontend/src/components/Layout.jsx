import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const isAdminRoute = location.pathname.startsWith('/admin');

    // Don't show navbar/footer on admin routes or for admin users
    if (isAdminRoute || user?.role === 'admin') {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
