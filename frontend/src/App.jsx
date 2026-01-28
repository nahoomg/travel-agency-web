import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Packages from './pages/Packages';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import StaticPage from './pages/StaticPage';
import BookingWizard from './pages/BookingWizard';
import CustomBooking from './pages/CustomBooking';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect admins to admin panel on login and prevent access to regular pages
  useEffect(() => {
    if (user?.role === 'admin') {
      // List of paths admins cannot access
      const restrictedPaths = ['/', '/destinations', '/packages', '/contact', '/about', '/faq', '/terms', '/book', '/custom-book'];
      const isRestricted = restrictedPaths.some(path => 
        location.pathname === path || location.pathname.startsWith(path + '/')
      );
      
      if (isRestricted) {
        navigate('/admin');
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/contact" element={<Contact />} />

        {/* Static Pages */}
        <Route path="/about" element={<StaticPage />} />
        <Route path="/faq" element={<StaticPage />} />
        <Route path="/terms" element={<StaticPage />} />

        {/* Protected Routes */}
        <Route path="/book/:packageId" element={
          <ProtectedRoute>
            <BookingWizard />
          </ProtectedRoute>
        } />

        <Route path="/custom-book/:destinationSlug" element={
          <ProtectedRoute>
            <CustomBooking />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
