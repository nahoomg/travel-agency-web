import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from './Toast';
import { api } from '../../api';

const AdminsTab = ({ admins: initialAdmins, onRefresh }) => {
    const [admins, setAdmins] = useState(initialAdmins || []);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    // Sync admins when props change
    React.useEffect(() => {
        if (initialAdmins) setAdmins(initialAdmins);
    }, [initialAdmins]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            await api.createAdmin(newAdmin);
            toast.success(`Admin "${newAdmin.firstName}" added successfully!`);
            setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
            setShowAddAdmin(false);
            
            // Refresh admins list
            const updated = await api.getAdmins();
            setAdmins(updated);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Failed to create admin:', error);
            toast.error('Failed to create admin: ' + (error.message || 'Unknown error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admins-card">
            <toast.ToastContainer />
            <div className="header">
                <h3>Administrator Accounts</h3>
                <button onClick={() => setShowAddAdmin(!showAddAdmin)} className="btn btn-primary">
                    <Plus size={16} /> Add Admin
                </button>
            </div>

            {showAddAdmin && (
                <form onSubmit={handleSubmit} className="add-form">
                    <h4>New Administrator</h4>
                    <div className="form-grid">
                        <div><label>First Name</label><input type="text" required value={newAdmin.firstName} onChange={e => setNewAdmin({...newAdmin, firstName: e.target.value})} /></div>
                        <div><label>Last Name</label><input type="text" required value={newAdmin.lastName} onChange={e => setNewAdmin({...newAdmin, lastName: e.target.value})} /></div>
                        <div><label>Email</label><input type="email" required value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} /></div>
                        <div><label>Password</label><input type="password" required minLength={6} value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} /></div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : 'Create Admin'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => setShowAddAdmin(false)} disabled={submitting}>Cancel</button>
                    </div>
                </form>
            )}

            <div className="admin-list">
                {admins.map(admin => (
                    <div key={admin.id} className="admin-item">
                        <div className="admin-info">
                            <div className="avatar">{admin.first_name?.charAt(0) || admin.email?.charAt(0).toUpperCase()}</div>
                            <div>
                                <div className="name">{admin.first_name} {admin.last_name}</div>
                                <div className="email">{admin.email}</div>
                            </div>
                        </div>
                        <span className="role-badge">Administrator</span>
                    </div>
                ))}
            </div>

            <style>{`
                .admins-card { background: white; border-radius: var(--radius-2xl); box-shadow: var(--shadow-md); padding: var(--space-6); }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
                .header h3 { margin-bottom: 0; }
                .add-form { padding: var(--space-6); background: var(--slate-50); border-radius: var(--radius-xl); margin-bottom: var(--space-6); }
                .add-form h4 { margin-bottom: var(--space-4); }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-4); }
                .form-actions { display: flex; gap: var(--space-3); }
                .admin-list { display: flex; flex-direction: column; gap: var(--space-3); }
                .admin-item { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); background: var(--slate-50); border-radius: var(--radius-lg); }
                .admin-info { display: flex; align-items: center; gap: var(--space-3); }
                .avatar { width: 44px; height: 44px; background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; }
                .name { font-weight: 500; } .email { font-size: var(--text-sm); color: var(--slate-500); }
                .role-badge { padding: var(--space-1) var(--space-3); background: var(--primary-100); color: var(--primary-700); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 600; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .form-grid input { width: 100%; padding: var(--space-3); border: 1px solid var(--slate-300); border-radius: var(--radius-lg); font-size: var(--text-base); }
                .form-grid label { display: block; margin-bottom: var(--space-1); font-weight: 500; color: var(--slate-700); }
            `}</style>
        </div>
    );
};

export default AdminsTab;
