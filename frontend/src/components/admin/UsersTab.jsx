import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, Calendar, DollarSign, Trash2, Search, Filter } from '../Icon';
import { api } from '../../api';
import { useToast } from './Toast';
import ConfirmModal from './ConfirmModal';

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [userStats, setUserStats] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, filterRole]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersData = await api.getAllUsers();
            const revenueData = await api.getUserRevenue();
            
            setUsers(usersData);
            setTotalRevenue(revenueData.total);
            setUserStats(revenueData.userStats);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users data');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by role
        if (filterRole !== 'all') {
            filtered = filtered.filter(user => user.role === filterRole);
        }

        setFilteredUsers(filtered);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        
        try {
            await api.deleteUser(userToDelete.id);
            // Remove user from local state immediately
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
            toast.success(`User "${userToDelete.first_name} ${userToDelete.last_name}" has been deleted successfully.`);
        } catch (error) {
            console.error('Failed to delete user:', error);
            // Still try to refresh the list to reflect actual state
            fetchUsers();
            toast.error('Failed to delete user: ' + error.message);
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-4)', border: '4px solid var(--slate-200)', borderTopColor: 'var(--primary-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Revenue Overview */}
            <div style={{ 
                background: 'white', 
                padding: 'var(--space-6)', 
                borderRadius: 'var(--radius-2xl)', 
                marginBottom: 'var(--space-6)', 
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--slate-200)'
            }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', marginBottom: 'var(--space-2)' }}>
                    Total Revenue Generated
                </div>
                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: '700', color: 'var(--success-600)' }}>
                    {formatPrice(totalRevenue)}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: 'var(--space-2)' }}>
                    From {users.filter(u => u.role !== 'admin').length} registered users
                </div>
            </div>

            {/* Controls */}
            <div style={{ 
                display: 'flex', 
                gap: 'var(--space-4)', 
                marginBottom: 'var(--space-6)', 
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: '1', minWidth: '250px' }}>
                    <Search size={20} style={{ color: 'var(--slate-400)' }} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: 'var(--space-3)',
                            border: '1px solid var(--slate-300)',
                            borderRadius: 'var(--radius-lg)',
                            flex: '1',
                            outline: 'none'
                        }}
                    />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Filter size={20} style={{ color: 'var(--slate-400)' }} />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{
                            padding: 'var(--space-3)',
                            border: '1px solid var(--slate-300)',
                            borderRadius: 'var(--radius-lg)',
                            outline: 'none'
                        }}
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users List */}
            <div style={{ 
                background: 'white', 
                borderRadius: 'var(--radius-2xl)', 
                overflow: 'hidden', 
                boxShadow: 'var(--shadow-sm)' 
            }}>
                {filteredUsers.length === 0 ? (
                    <div style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
                        <Users size={48} style={{ color: 'var(--slate-300)', margin: '0 auto var(--space-4)' }} />
                        <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--slate-600)' }}>No users found</h3>
                        <p style={{ color: 'var(--slate-500)' }}>
                            {searchTerm || filterRole !== 'all' ? 'Try adjusting your filters' : 'No users registered yet'}
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                                <tr>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        User
                                    </th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Contact
                                    </th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Role
                                    </th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Joined
                                    </th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Revenue
                                    </th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'center', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr 
                                        key={user.id}
                                        style={{ 
                                            borderBottom: index < filteredUsers.length - 1 ? '1px solid var(--slate-100)' : 'none'
                                        }}
                                    >
                                        <td style={{ padding: 'var(--space-4)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: 'var(--primary-100)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '600',
                                                    color: 'var(--primary-600)'
                                                }}>
                                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500', color: 'var(--slate-900)' }}>
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <Mail size={14} style={{ color: 'var(--slate-400)' }} />
                                                    <span style={{ fontSize: 'var(--text-sm)' }}>{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <Phone size={14} style={{ color: 'var(--slate-400)' }} />
                                                        <span style={{ fontSize: 'var(--text-sm)' }}>{user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4)' }}>
                                            <span style={{
                                                padding: 'var(--space-1) var(--space-3)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: '500',
                                                background: user.role === 'admin' ? 'var(--warning-100)' : 'var(--info-100)',
                                                color: user.role === 'admin' ? 'var(--warning-700)' : 'var(--info-700)'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--space-4)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <Calendar size={14} style={{ color: 'var(--slate-400)' }} />
                                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>
                                                    {formatDate(user.created_at)}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <DollarSign size={14} style={{ color: 'var(--success-500)' }} />
                                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--success-600)' }}>
                                                    {formatPrice(userStats[user.id] || 0)}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: 'var(--space-2)',
                                                        borderRadius: 'var(--radius-md)',
                                                        color: 'var(--red-500)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = 'var(--red-50)';
                                                        e.target.style.color = 'var(--red-600)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'none';
                                                        e.target.style.color = 'var(--red-500)';
                                                    }}
                                                    title="Delete user"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <toast.ToastContainer />
            
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete User"
                message={`Are you sure you want to delete "${userToDelete?.first_name} ${userToDelete?.last_name}"? This will also delete all their bookings and inquiries. This action cannot be undone.`}
                confirmText="Delete User"
                onConfirm={handleDeleteUser}
                onCancel={() => { setShowDeleteModal(false); setUserToDelete(null); }}
            />

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default UsersTab;