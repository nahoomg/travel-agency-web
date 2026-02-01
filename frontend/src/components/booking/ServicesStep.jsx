import React, { useState } from 'react';
import { User, Car, Shield, Check, ArrowRight, ArrowLeft, AlertCircle, Info } from '../Icon';
import { formatPrice } from '../../api';
import { carOptions, additionalServices, languageOptions } from '../../data/bookingOptions';

const ServicesStep = ({ formData, updateForm, setFormData, guides, toggleService, onBack, onNext }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(false);

    // Support both updateForm and setFormData patterns
    const handleChange = (field, value) => {
        if (updateForm) {
            updateForm(field, value);
        } else if (setFormData) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        // Clear error when user selects
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle service toggling
    const handleToggleService = (serviceId) => {
        if (toggleService) {
            // Use provided toggleService function (for CustomBooking)
            toggleService(serviceId);
        } else {
            // Use built-in logic (for BookingWizard)
            const service = additionalServices.find(s => s.id === serviceId);
            if (service?.mandatory) return;
            
            const currentServices = formData.services || [];
            const newServices = currentServices.includes(serviceId)
                ? currentServices.filter(id => id !== serviceId)
                : [...currentServices, serviceId];
            handleChange('services', newServices);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.preferredLanguage) {
            newErrors.preferredLanguage = 'Please select your preferred language';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        setTouched(true);
        if (validateForm() && onNext) {
            onNext();
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '1.75rem' }}>
                <Shield size={28} /> Additional Services
            </h2>
            <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-8)' }}>
                Enhance your trip with our additional services
            </p>

            {/* Guide Selection */}
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.125rem', color: 'var(--slate-700)' }}>Tour Guide (Optional)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {guides && guides.length > 0 ? guides.map(guide => (
                    <div
                        key={guide.id}
                        onClick={() => handleChange('guideId', formData.guideId === guide.id ? null : guide.id)}
                        style={{
                            padding: 'var(--space-4)',
                            border: formData.guideId === guide.id ? '2px solid var(--primary-500)' : '1px solid var(--slate-200)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            background: formData.guideId === guide.id ? 'var(--primary-50)' : 'white',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'var(--primary-100)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3)'
                        }}>
                            <User size={24} color="var(--primary-600)" />
                        </div>
                        <h4 style={{ marginBottom: 'var(--space-1)' }}>{guide.name}</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-2)' }}>{guide.languages || 'Multilingual'}</p>
                        <p style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
                            {formatPrice(guide.price_per_day || 500)}/day
                        </p>
                    </div>
                )) : <p style={{ color: 'var(--slate-500)', gridColumn: '1 / -1' }}>No guides available</p>}
            </div>

            {/* Language Preference */}
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.125rem', color: 'var(--slate-700)' }}>
                Preferred Language <span style={{ color: 'var(--error-500)' }}>*</span>
            </h3>
            {errors.preferredLanguage && touched && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-2)', 
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--error-50, #fef2f2)', 
                    border: '1px solid var(--error-200, #fecaca)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-3)',
                    color: 'var(--error-700, #b91c1c)'
                }}>
                    <AlertCircle size={16} />
                    <span style={{ fontSize: 'var(--text-sm)' }}>{errors.preferredLanguage}</span>
                </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
                {languageOptions.map(lang => (
                    <button
                        key={lang}
                        onClick={() => handleChange('preferredLanguage', lang)}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            border: formData.preferredLanguage === lang ? '2px solid var(--primary-500)' : '1px solid var(--slate-300)',
                            borderRadius: 'var(--radius-lg)',
                            background: formData.preferredLanguage === lang ? 'var(--primary-50)' : 'white',
                            cursor: 'pointer',
                            fontSize: 'var(--text-base)',
                            fontWeight: formData.preferredLanguage === lang ? 600 : 400,
                            color: formData.preferredLanguage === lang ? 'var(--primary-700)' : 'var(--slate-700)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {/* Car Rental */}
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.125rem', color: 'var(--slate-700)' }}>
                <Car size={18} style={{ display: 'inline', marginRight: '8px' }} />
                Car Rental (Optional)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {carOptions.map(car => (
                    <div
                        key={car.id}
                        onClick={() => handleChange('carRental', formData.carRental === car.id ? null : car.id)}
                        style={{
                            border: formData.carRental === car.id ? '2px solid var(--primary-500)' : '1px solid var(--slate-200)',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: formData.carRental === car.id ? 'var(--primary-50)' : 'white',
                            transition: 'all 0.2s'
                        }}
                    >
                        <img src={car.image} alt={car.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                        <div style={{ padding: 'var(--space-3)' }}>
                            <h4 style={{ marginBottom: 'var(--space-1)' }}>{car.name}</h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', marginBottom: 'var(--space-2)' }}>{car.capacity}</p>
                            <p style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{formatPrice(car.price)}/day</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Extra Services */}
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.125rem', color: 'var(--slate-700)' }}>Extra Services</h3>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--info-50, #eff6ff)', 
                border: '1px solid var(--info-200, #bfdbfe)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-3)',
                color: 'var(--info-700, #1d4ed8)'
            }}>
                <Info size={16} />
                <span style={{ fontSize: 'var(--text-sm)' }}>These services are optional. Required services are pre-selected.</span>
            </div>
            <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                {additionalServices.map(svc => (
                    <div
                        key={svc.id}
                        onClick={() => handleToggleService(svc.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                            padding: 'var(--space-4)',
                            border: formData.services?.includes(svc.id) ? '2px solid var(--primary-500)' : '1px solid var(--slate-200)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: svc.mandatory ? 'default' : 'pointer',
                            opacity: svc.mandatory ? 0.9 : 1,
                            background: formData.services?.includes(svc.id) ? 'var(--primary-50)' : 'white'
                        }}
                    >
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '4px',
                            border: '2px solid var(--primary-500)',
                            background: formData.services?.includes(svc.id) ? 'var(--primary-500)' : 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {formData.services?.includes(svc.id) && <Check size={16} color="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ marginBottom: 'var(--space-1)' }}>
                                {svc.name} {svc.mandatory && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>(Required)</span>}
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>{svc.description}</p>
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--primary-600)', fontSize: '1.125rem' }}>
                            {formatPrice(svc.price)}/person
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
                        Review Booking <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServicesStep;
