import React from 'react';
import { Check } from 'lucide-react';

const benefits = [
    'Access exclusive tour packages',
    'Save your favorite destinations',
    'Manage bookings easily',
    'Get personalized recommendations'
];

const BenefitsPanel = () => (
    <div className="benefits-panel hide-mobile">
        <div className="glow" />
        <h2>Start Your Ethiopian Adventure</h2>
        <p>Join thousands of travelers who have discovered the magic of Ethiopia with us.</p>
        <ul>
            {benefits.map((b, i) => (
                <li key={i}>
                    <span className="check-icon"><Check size={16} /></span>
                    {b}
                </li>
            ))}
        </ul>
        <style>{`
            .benefits-panel { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: var(--space-16); color: white; position: relative; overflow: hidden; }
            .benefits-panel .glow { position: absolute; top: 20%; right: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(214,167,47,0.15) 0%, transparent 70%); border-radius: 50%; }
            .benefits-panel h2 { font-size: var(--text-4xl); margin-bottom: var(--space-6); position: relative; }
            .benefits-panel p { font-size: var(--text-lg); opacity: 0.85; margin-bottom: var(--space-10); max-width: 400px; line-height: 1.8; }
            .benefits-panel ul { list-style: none; padding: 0; margin: 0; }
            .benefits-panel li { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); font-size: var(--text-lg); }
            .check-icon { width: 28px; height: 28px; background: rgba(255,255,255,0.15); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--accent-400); }
            @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        `}</style>
    </div>
);

export default BenefitsPanel;
