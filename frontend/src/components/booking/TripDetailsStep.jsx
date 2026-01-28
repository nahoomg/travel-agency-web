import React, { useState } from 'react';
import { Calendar, User, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';

const TripDetailsStep = ({ formData, updateForm, setFormData, pkg, destination, onNext }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Support both updateForm and setFormData patterns
    const handleChange = (field, value) => {
        if (updateForm) {
            updateForm(field, value);
        } else if (setFormData) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
        return phone.length >= 10 && phoneRegex.test(phone);
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'startDate':
                if (!value) return 'Start date is required';
                if (new Date(value) < new Date().setHours(0, 0, 0, 0)) return 'Start date cannot be in the past';
                return '';
            case 'endDate':
                if (!value) return 'End date is required';
                if (formData.startDate && new Date(value) <= new Date(formData.startDate)) 
                    return 'End date must be after start date';
                return '';
            case 'travelers':
                if (!value || value < 1) return 'At least 1 traveler is required';
                if (value > 20) return 'Maximum 20 travelers per booking. Contact us for larger groups';
                return '';
            case 'fullName':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Please enter your full name';
                if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Name can only contain letters, spaces, hyphens and apostrophes';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address (e.g., you@example.com)';
                return '';
            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                if (!validatePhone(value)) return 'Please enter a valid phone number (at least 10 digits)';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, formData[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const validateAllFields = () => {
        const fieldsToValidate = ['startDate', 'fullName', 'email', 'phone'];
        if (isCustomBooking) fieldsToValidate.push('endDate');
        
        const newErrors = {};
        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        setTouched(fieldsToValidate.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateAllFields() && onNext) {
            onNext();
        }
    };

    const isCustomBooking = !pkg && destination;
    
    // Validation logic
    let canProceed = formData.startDate && formData.travelers >= 1 && formData.fullName && formData.email && formData.phone;
    if (isCustomBooking && !formData.endDate) {
        canProceed = false;
    }

    const getInputStyle = (field) => ({
        width: '100%',
        padding: 'var(--space-3)',
        border: `1px solid ${errors[field] && touched[field] ? 'var(--error-500)' : 'var(--slate-300)'}`,
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-base)',
        backgroundColor: errors[field] && touched[field] ? 'var(--error-50, #fef2f2)' : 'white',
        transition: 'border-color 0.2s, background-color 0.2s'
    });

    const ErrorMessage = ({ field }) => (
        errors[field] && touched[field] ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--error-500)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                <AlertCircle size={14} /> {errors[field]}
            </div>
        ) : null
    );

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '1.75rem' }}>
                <Calendar size={28} /> Trip Details
            </h2>
            <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-8)' }}>
                Tell us about your travel plans
            </p>

            {pkg && (
                <div style={{ background: 'var(--primary-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--primary-500)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>{pkg.name}</h3>
                    <p style={{ color: 'var(--slate-600)', fontSize: 'var(--text-sm)' }}>Duration: {pkg.duration_days} days</p>
                </div>
            )}

            {destination && !pkg && (
                <div style={{ background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', border: '2px solid var(--primary-200)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)', color: 'var(--primary-900)' }}>Custom Trip to {destination.name}</h3>
                    <p style={{ color: 'var(--slate-700)', fontSize: 'var(--text-sm)' }}>Design your perfect personalized experience</p>
                </div>
            )}

            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                {/* Date Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: isCustomBooking ? '1fr 1fr' : '1fr', gap: 'var(--space-4)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--slate-700)' }}>
                            <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            Start Date *
                        </label>
                        <input
                            type="date"
                            style={getInputStyle('startDate')}
                            value={formData.startDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => handleChange('startDate', e.target.value)}
                            onBlur={() => handleBlur('startDate')}
                            required
                        />
                        <ErrorMessage field="startDate" />
                    </div>
                    {isCustomBooking && (
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--slate-700)' }}>
                                <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                                End Date *
                            </label>
                            <input
                                type="date"
                                style={getInputStyle('endDate')}
                                value={formData.endDate}
                                min={formData.startDate || new Date().toISOString().split('T')[0]}
                                onChange={e => handleChange('endDate', e.target.value)}
                                onBlur={() => handleBlur('endDate')}
                                required
                            />
                            <ErrorMessage field="endDate" />
                        </div>
                    )}
                </div>

                {/* Traveler Count */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--slate-700)' }}>
                        <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Number of Travelers <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', fontWeight: 400 }}>(max 20)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <button
                            type="button"
                            onClick={() => {
                                const newValue = Math.max(1, formData.travelers - 1);
                                handleChange('travelers', newValue);
                            }}
                            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-300)', background: 'white', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.target.style.background = 'var(--slate-100)'}
                            onMouseLeave={e => e.target.style.background = 'white'}
                        >−</button>
                        <span style={{ fontSize: '1.5rem', fontWeight: 600, minWidth: '60px', textAlign: 'center' }}>
                            {formData.travelers}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                const newValue = Math.min(20, formData.travelers + 1);
                                handleChange('travelers', newValue);
                                if (formData.travelers >= 20) {
                                    setErrors(prev => ({ ...prev, travelers: 'Maximum 20 travelers per booking' }));
                                    setTouched(prev => ({ ...prev, travelers: true }));
                                }
                            }}
                            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-300)', background: 'white', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.target.style.background = 'var(--slate-100)'}
                            onMouseLeave={e => e.target.style.background = 'white'}
                        >+</button>
                    </div>
                    <ErrorMessage field="travelers" />
                </div>

                {/* Name */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--slate-700)' }}>
                        <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Full Name *
                    </label>
                    <input
                        type="text"
                        style={getInputStyle('fullName')}
                        value={formData.fullName}
                        onChange={e => handleChange('fullName', e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                        placeholder="Enter your full name"
                        required
                    />
                    <ErrorMessage field="fullName" />
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--slate-700)' }}>
                            <Mail size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            Email *
                        </label>
                        <input
                            type="email"
                            style={getInputStyle('email')}
                            value={formData.email}
                            onChange={e => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            placeholder="you@example.com"
                            required
                        />
                        <ErrorMessage field="email" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--slate-700)' }}>
                            <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            Phone *
                        </label>
                        <input
                            type="tel"
                            style={getInputStyle('phone')}
                            value={formData.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            placeholder="+251 91 234 5678"
                            required
                        />
                        <ErrorMessage field="phone" />
                    </div>
                </div>
            </div>

            {/* Navigation - only show if onNext callback provided (for BookingWizard, not CustomBooking) */}
            {onNext && (
                <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed}
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

export default TripDetailsStep;
