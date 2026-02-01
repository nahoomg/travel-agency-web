import React, { useState } from 'react';
import { Hotel, ArrowRight, ArrowLeft, AlertCircle } from '../Icon';
import { formatPrice } from '../../api';
import { roomTypes } from '../../data/bookingOptions';

const AccommodationStep = ({ formData, updateForm, setFormData, pkg, hotels, onBack, onNext }) => {
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    // Support both updateForm and setFormData patterns
    const handleChange = (field, value) => {
        if (updateForm) {
            updateForm(field, value);
        } else if (setFormData) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        // Clear error when user selects
        if (error) setError('');
    };

    const handleNext = () => {
        setTouched(true);
        if (!formData.roomType) {
            setError('Please select a room type to continue');
            return;
        }
        if (onNext) onNext();
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '1.75rem' }}>
                <Hotel size={28} /> Accommodation
            </h2>
            <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-8)' }}>
                Choose your preferred room type
            </p>
            
            {/* Error Message */}
            {error && touched && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-2)', 
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--error-50, #fef2f2)', 
                    border: '1px solid var(--error-200, #fecaca)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-4)',
                    color: 'var(--error-700, #b91c1c)'
                }}>
                    <AlertCircle size={18} />
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{error}</span>
                </div>
            )}
            
            {/* Room Types */}
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.125rem', color: 'var(--slate-700)' }}>
                Room Type <span style={{ color: 'var(--error-500)' }}>*</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {roomTypes.map(room => (
                    <div
                        key={room.id}
                        onClick={() => handleChange('roomType', room.id)}
                        style={{
                            border: formData.roomType === room.id ? '2px solid var(--primary-500)' : '1px solid var(--slate-200)',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: formData.roomType === room.id ? 'var(--primary-50)' : 'white'
                        }}
                        onMouseEnter={e => { if (formData.roomType !== room.id) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <img src={room.image} alt={room.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                        <div style={{ padding: 'var(--space-4)' }}>
                            <h4 style={{ marginBottom: 'var(--space-1)', fontSize: '1.125rem' }}>{room.name}</h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', marginBottom: 'var(--space-2)', lineHeight: 1.5 }}>
                                {room.description}
                            </p>
                            <p style={{ fontWeight: 600, color: 'var(--primary-600)', fontSize: '1.125rem' }}>{formatPrice(room.price)}/night</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation - only show if callbacks provided (for BookingWizard, not CustomBooking) */}
            {onBack && onNext && (
                <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        onClick={onBack}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-6)' }}
                    >
                        <ArrowLeft size={18} /> Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-6)' }}
                    >
                        Next Step <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccommodationStep;
