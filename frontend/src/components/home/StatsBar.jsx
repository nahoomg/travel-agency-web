import React from 'react';

const stats = [
    { value: '500+', label: 'Happy Travelers' },
    { value: '15+', label: 'Destinations' },
    { value: '10+', label: 'Years Experience' },
    { value: '4.9', label: 'Average Rating', icon: '⭐' }
];

const StatsBar = () => (
    <section className="stats-bar">
        <div className="container">
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-item">
                        <div className="stat-value">{stat.icon || ''}{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
        <style>{`
            .stats-bar { background: white; padding: var(--space-10) 0; position: relative; z-index: 10; border-radius: var(--radius-3xl) var(--radius-3xl) 0 0; box-shadow: 0 -20px 60px rgba(0,0,0,0.1); }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-8); text-align: center; }
            .stat-value { font-size: var(--text-4xl); font-weight: 700; font-family: var(--font-display); color: var(--primary-700); margin-bottom: var(--space-1); }
            .stat-label { color: var(--slate-500); font-size: var(--text-sm); }
        `}</style>
    </section>
);

export default StatsBar;
