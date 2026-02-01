import React from 'react';
import { Mail, Edit2 } from '../Icon';

const ProfileSidebar = ({ user, editMode, setEditMode, editForm, setEditForm, handleSaveProfile, saving }) => {
    return (
        <aside className="sidebar-container">
            <div className={`profile-card ${editMode ? 'editing' : ''}`}>
                <div className="avatar">{user?.firstName?.charAt(0)}</div>
                <h2>{user?.firstName} {user?.lastName}</h2>
                <span className={`role-badge ${user?.role}`}>
                    {user?.role === 'admin' ? '⭐ Administrator' : '🌍 Explorer'}
                </span>
                <hr />
                <div className="email-row"><Mail size={18} /><span>{user?.email}</span></div>
                <button className="btn btn-dark" style={{ width: '100%', marginTop: 'var(--space-4)' }} onClick={() => setEditMode(!editMode)}>
                    <Edit2 size={16} /> {editMode ? 'Cancel' : 'Edit Profile'}
                </button>

                {/* Edit form now inside the profile card for better positioning */}
                {editMode && (
                    <div className="edit-form-inline">
                        <hr />
                        <h3>Edit Profile</h3>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" className="input" value={editForm.firstName} onChange={e => setEditForm(prev => ({ ...prev, firstName: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" className="input" value={editForm.lastName} onChange={e => setEditForm(prev => ({ ...prev, lastName: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" className="input" value={editForm.phone} onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="+251 9XX XXX XXX" />
                        </div>
                        <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ width: '100%' }}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .sidebar-container { position: sticky; top: 100px; }
                .profile-card { background: white; border-radius: var(--radius-3xl); padding: var(--space-8); box-shadow: var(--shadow-lg); text-align: center; }
                .profile-card.editing { position: relative; }
                .avatar { width: 100px; height: 100px; margin: 0 auto var(--space-5); border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); display: flex; align-items: center; justify-content: center; font-size: var(--text-4xl); font-weight: 700; color: white; box-shadow: var(--shadow-lg); }
                .profile-card h2 { font-size: var(--text-2xl); margin-bottom: var(--space-1); }
                .role-badge { display: inline-block; padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .role-badge.admin { background: var(--accent-100); color: var(--accent-700); }
                .role-badge.user { background: var(--primary-50); color: var(--primary-700); }
                .profile-card hr { margin: var(--space-6) 0; border: none; border-top: 1px solid var(--slate-100); }
                .email-row { display: flex; align-items: center; gap: var(--space-3); color: var(--slate-600); text-align: left; }
                .email-row svg { color: var(--slate-400); }
                .email-row span { font-size: var(--text-sm); word-break: break-all; }
                .edit-form-inline { text-align: left; }
                .edit-form-inline h3 { margin-bottom: var(--space-4); font-size: var(--text-lg); color: var(--slate-800); text-align: center; }
                .form-group { margin-bottom: var(--space-4); text-align: left; }
                .form-group label { display: block; margin-bottom: var(--space-2); font-weight: 600; color: var(--slate-700); font-size: var(--text-sm); }
                .form-group input { width: 100%; padding: var(--space-3); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); font-size: var(--text-base); }
                .form-group input:focus { outline: none; border-color: var(--primary-500); box-shadow: 0 0 0 3px var(--primary-100); }
                @media (max-width: 968px) { .sidebar-container { position: static !important; } }
            `}</style>
        </aside>
    );
};

export default ProfileSidebar;
