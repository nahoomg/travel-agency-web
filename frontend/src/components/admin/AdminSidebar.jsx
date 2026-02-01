import React from 'react';
import { LogOut } from '../Icon';

const AdminSidebar = ({ tabs, activeTab, setActiveTab, logout, navigate }) => {
    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>Admin Panel</h3>
                <p>EPSEC Dashboard</p>
            </div>

            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}

            <div className="sidebar-footer">
                <button onClick={() => { logout(); navigate('/login'); }} className="sidebar-btn logout">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <style>{`
                .admin-sidebar {
                    position: fixed; left: 0; top: 0; bottom: 0; width: 250px;
                    background: #1e293b; padding: var(--space-6);
                    display: flex; flex-direction: column; gap: var(--space-2);
                    z-index: 100; box-shadow: var(--shadow-xl);
                }
                .sidebar-header {
                    padding: var(--space-4); margin-bottom: var(--space-4);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .sidebar-header h3 { color: white; margin-bottom: var(--space-1); font-size: var(--text-lg); }
                .sidebar-header p { color: rgba(255,255,255,0.6); font-size: var(--text-sm); margin-bottom: 0; }
                .sidebar-btn {
                    display: flex; align-items: center; gap: var(--space-3);
                    padding: var(--space-3) var(--space-4); background: transparent;
                    color: rgba(255,255,255,0.7); border: none; border-radius: var(--radius-lg);
                    font-size: var(--text-sm); font-weight: 500; cursor: pointer;
                    transition: all 0.2s; text-align: left; width: 100%;
                }
                .sidebar-btn:hover { background: rgba(255,255,255,0.1); color: white; }
                .sidebar-btn.active { background: var(--primary-600); color: white; }
                .sidebar-btn.logout:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
                .sidebar-footer { margin-top: auto; padding-top: var(--space-4); border-top: 1px solid rgba(255,255,255,0.1); }
                @media (max-width: 768px) { .admin-sidebar { display: none; } }
            `}</style>
        </div>
    );
};

export default AdminSidebar;
