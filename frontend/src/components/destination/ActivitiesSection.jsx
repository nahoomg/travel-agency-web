import React from 'react';
import { ChevronRight } from 'lucide-react';

const ActivitiesSection = ({ activities, destination }) => {
    if (!activities || activities.length === 0) return null;

    // Placeholder image for activities without images
    const placeholderGradient = 'linear-gradient(135deg, var(--primary-400), var(--primary-600))';
    
    return (
        <section className="container" style={{ padding: 'var(--space-10) 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Things to Do</h2>
            <p style={{ textAlign: 'center', color: 'var(--slate-500)', marginBottom: 'var(--space-6)' }}>
                Activities and experiences in {destination.name}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
                {activities.map((activity, i) => (
                    <div key={i} className="activity-card" style={{
                        background: 'white',
                        borderRadius: 'var(--radius-2xl)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-2xl)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                    >
                        <div style={{ 
                            height: '180px', 
                            overflow: 'hidden',
                            background: activity.image ? 'none' : placeholderGradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {activity.image ? (
                                <img src={activity.image} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: 'white', fontSize: 'var(--text-3xl)', fontWeight: 'bold' }}>{i + 1}</span>
                            )}
                        </div>
                        <div style={{ padding: 'var(--space-6)' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>{activity.title}</h3>
                            {activity.items && activity.items.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {activity.items.map((item, j) => (
                                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--slate-600)', fontSize: 'var(--text-sm)' }}>
                                            <ChevronRight size={14} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ActivitiesSection;
