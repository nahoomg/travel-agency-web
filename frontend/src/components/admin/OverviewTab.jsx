import React from 'react';
import { ArrowUpRight, ArrowDownRight, MapPin, Package, Hotel } from 'lucide-react';

const OverviewTab = ({ stats, statCards }) => {
    return (
        <>
            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
                            <span className={`stat-trend ${stat.up ? 'up' : 'down'}`}>
                                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{stat.trend}
                            </span>
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="overview-grid">
                <div className="card">
                    <h3>Recent Bookings</h3>
                    <div className="list">
                        {stats?.recentBookings?.slice(0, 5).map((booking, i) => (
                            <div key={i} className="list-item">
                                <div>
                                    <div className="name">{booking.full_name}</div>
                                    <div className="sub">{booking.destination || 'Custom Booking'}</div>
                                </div>
                                <span className={`badge ${booking.status}`}>{booking.status}</span>
                            </div>
                        )) || <p className="empty">No recent bookings</p>}
                    </div>
                </div>
                <div className="card">
                    <h3>Quick Stats</h3>
                    <div className="list">
                        {[{ label: 'Destinations', value: stats?.destinations || 0, icon: <MapPin size={16} /> },
                          { label: 'Packages', value: stats?.packages || 0, icon: <Package size={16} /> },
                          { label: 'Hotels', value: stats?.hotels || 0, icon: <Hotel size={16} /> }
                        ].map((item, i) => (
                            <div key={i} className="list-item">
                                <span className="icon-label">{item.icon} {item.label}</span>
                                <span className="value">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); margin-bottom: var(--space-8); }
                .stat-card { background: white; padding: var(--space-6); border-radius: var(--radius-2xl); box-shadow: var(--shadow-md); }
                .stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); }
                .stat-icon { width: 48px; height: 48px; border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; }
                .stat-trend { display: flex; align-items: center; gap: 2px; font-size: var(--text-sm); font-weight: 500; }
                .stat-trend.up { color: var(--success-500); } .stat-trend.down { color: var(--error-500); }
                .stat-value { font-size: var(--text-3xl); font-weight: 700; color: var(--slate-900); margin-bottom: var(--space-1); }
                .stat-label { font-size: var(--text-sm); color: var(--slate-500); }
                .overview-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6); }
                .card { background: white; padding: var(--space-6); border-radius: var(--radius-2xl); box-shadow: var(--shadow-md); }
                .card h3 { margin-bottom: var(--space-4); }
                .list { display: flex; flex-direction: column; gap: var(--space-3); }
                .list-item { display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--slate-50); border-radius: var(--radius-lg); }
                .list-item .name { font-weight: 500; margin-bottom: 2px; } .list-item .sub { font-size: var(--text-sm); color: var(--slate-500); }
                .badge { padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 600; }
                .badge.confirmed { background: var(--success-100); color: var(--success-500); }
                .badge.pending { background: var(--warning-100); color: var(--warning-500); }
                .icon-label { display: flex; align-items: center; gap: var(--space-2); color: var(--slate-600); }
                .value { font-weight: 600; } .empty { color: var(--slate-500); }
                @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 768px) { .overview-grid { grid-template-columns: 1fr; } }
            `}</style>
        </>
    );
};

export default OverviewTab;
