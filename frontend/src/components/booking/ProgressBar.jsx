import React from 'react';
import { Check } from 'lucide-react';

const stepLabels = ['Trip Details', 'Accommodation', 'Services', 'Review'];

const ProgressBar = ({ step }) => {
    const progress = (step / 4) * 100;
    
    return (
        <div style={{ marginBottom: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                {stepLabels.map((label, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        color: step > i ? 'var(--primary-600)' : 'var(--slate-400)',
                        fontSize: 'var(--text-sm)'
                    }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: step > i ? 'var(--primary-500)' : step === i + 1 ? 'var(--primary-100)' : 'var(--slate-200)',
                            color: step > i ? 'white' : step === i + 1 ? 'var(--primary-600)' : 'var(--slate-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600
                        }}>
                            {step > i ? <Check size={14} /> : i + 1}
                        </div>
                        <span className="hide-mobile">{label}</span>
                    </div>
                ))}
            </div>
            <div style={{
                height: '4px',
                background: 'var(--slate-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--primary-500), var(--primary-600))',
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
};

export default ProgressBar;
