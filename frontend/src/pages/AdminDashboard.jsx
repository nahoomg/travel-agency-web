import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Users, Calendar, DollarSign, MessageSquare, RefreshCw, BarChart3, Shield } from '../components/Icon';

import AdminSidebar from '../components/admin/AdminSidebar';
import OverviewTab from '../components/admin/OverviewTab';
import BookingsTab from '../components/admin/BookingsTab';
import InquiriesTab from '../components/admin/InquiriesTab';
import AdminsTab from '../components/admin/AdminsTab';
import UsersTab from '../components/admin/UsersTab';
import { useToast } from '../components/admin/Toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
        { id: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
        { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={18} /> },
        { id: 'users', label: 'Users', icon: <Users size={18} /> },
        { id: 'admins', label: 'Administrators', icon: <Shield size={18} /> }
    ];

    const statCards = [
        { icon: <Users size={24} />, label: 'Total Users', value: stats?.users || 0, color: 'var(--info-500)', bg: 'var(--info-100)', trend: '+12%', up: true },
        { icon: <Calendar size={24} />, label: 'Total Bookings', value: stats?.totalBookings || 0, color: 'var(--success-500)', bg: 'var(--success-100)', trend: '+8%', up: true },
        { icon: <DollarSign size={24} />, label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'var(--success-600)', bg: 'var(--success-100)', trend: '+15%', up: true },
        { icon: <MessageSquare size={24} />, label: 'New Inquiries', value: stats?.newInquiries || 0, color: 'var(--accent-600)', bg: 'var(--accent-100)', trend: '+5%', up: true }
    ];

    useEffect(() => { fetchAllData(); }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch all data in parallel
            const [statsData, adminsData, bookingsData, inquiriesData] = await Promise.all([
                api.getStats().catch(err => {
                    console.error('Stats error:', err);
                    return { users: 0, totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, newInquiries: 0, destinations: 0, packages: 0, hotels: 0, recentBookings: [] };
                }),
                api.getAdmins().catch(err => {
                    console.error('Admins error:', err);
                    return [];
                }),
                api.getAllBookings().catch(err => {
                    console.error('Bookings error:', err);
                    return [];
                }),
                api.getAllInquiries().catch(err => {
                    console.error('Inquiries error:', err);
                    return [];
                })
            ]);
            
            setStats(statsData);
            setAdmins(adminsData);
            setBookings(bookingsData);
            setInquiries(inquiriesData);
        } catch (error) {
            console.error("Failed to load admin data", error);
            toast.error('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (id, status) => {
        try { 
            await api.updateBookingStatus(id, status); 
            // Update local state immediately for better UX
            setBookings(prevBookings => 
                prevBookings.map(b => b.id === id ? { ...b, status } : b)
            );
        }
        catch (err) { 
            console.error('Failed to update booking:', err);
            toast.error('Failed to update booking status: ' + err.message); 
        }
    };

    const handleAddAdmin = async (newAdmin, resetForm) => {
        try {
            await api.createAdmin(newAdmin);
            toast.success(`Admin "${newAdmin.firstName}" added successfully!`);
            resetForm();
            const updated = await api.getAdmins();
            setAdmins(updated);
        } catch (err) { toast.error('Failed: ' + err.message); }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-500)' }} />
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--slate-100)', minHeight: '100vh' }}>
            <toast.ToastContainer />
            <AdminSidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} navigate={navigate} />

            <div style={{ marginLeft: '250px', padding: 'var(--space-8)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                    <div>
                        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                        <p style={{ color: 'var(--slate-500)', marginBottom: 0 }}>Welcome back, Administrator</p>
                    </div>
                    <button onClick={fetchAllData} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>

                {activeTab === 'overview' && <OverviewTab stats={stats} statCards={statCards} />}
                {activeTab === 'bookings' && <BookingsTab bookings={bookings} updateBookingStatus={updateBookingStatus} />}
                {activeTab === 'inquiries' && <InquiriesTab inquiries={inquiries} />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'admins' && <AdminsTab admins={admins} onAddAdmin={handleAddAdmin} />}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 768px) { div[style*="margin-left: 250px"] { margin-left: 0 !important; } }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
