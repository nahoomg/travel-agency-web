import React, { useState, useMemo } from 'react';
import { CheckCircle, ArrowLeft, AlertTriangle } from '../Icon';
import { formatPrice } from '../../api';
import { roomTypes, carOptions, additionalServices, languageOptions } from '../../data/bookingOptions';

const ReviewStep = ({ formData, pkg, destination, guides, total, calculateDays, onBack, onSubmit, submitting, isCustomBooking }) => {
    const [validationError, setValidationError] = useState('');
    
    const selectedRoom = roomTypes.find(r => r.id === formData.roomType);
    const selectedGuide = guides?.find(g => g.id === formData.guideId);
    const selectedCar = carOptions.find(c => c.id === formData.carRental);
    const selectedServices = formData.services?.map(id => additionalServices.find(s => s.id === id)).filter(Boolean) || [];
    
    const days = isCustomBooking && calculateDays ? calculateDays() : pkg?.duration_days || 1;

    // Validate all required fields
    const missingFields = useMemo(() => {
        const missing = [];
        if (!formData.startDate) missing.push('Start Date');
        if (isCustomBooking && !formData.endDate) missing.push('End Date');
        if (!formData.fullName?.trim()) missing.push('Full Name');
        if (!formData.email?.trim()) missing.push('Email');
        if (!formData.phone?.trim()) missing.push('Phone');
        if (!formData.roomType) missing.push('Room Type');
        if (!formData.preferredLanguage) missing.push('Preferred Language');
        return missing;
    }, [formData, isCustomBooking]);

    const handleSubmit = () => {
        if (missingFields.length > 0) {
            setValidationError(`Please complete the following: ${missingFields.join(', ')}`);
            return;
        }
        setValidationError('');
        if (onSubmit) onSubmit();
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '1.75rem' }}>
                <CheckCircle size={28} /> Review Your Booking
            </h2>
            <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-8)' }}>
                Please review your booking details before confirmation
            </p>

            {/* Package or Destination Summary */}
            <div style={{ 
                background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', 
                padding: 'var(--space-6)', 
                borderRadius: 'var(--radius-xl)',
                marginBottom: 'var(--space-6)',
                border: '2px solid var(--primary-200)'
            }}>
                {pkg ? (
                    <>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)', color: 'var(--primary-900)' }}>{pkg.name}</h3>
                        <p style={{ color: 'var(--slate-700)', marginBottom: 'var(--space-4)' }}>{pkg.description}</p>
                    </>
                ) : destination ? (
                    <>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)', color: 'var(--primary-900)' }}>Custom Trip to {destination.name}</h3>
                        <p style={{ color: 'var(--slate-700)', marginBottom: 'var(--space-4)' }}>Personalized travel experience</p>
                    </>
                ) : null}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
                    <div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>Duration</p>
                        <p style={{ fontWeight: 600, color: 'var(--primary-800)' }}>{days} Days</p>
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>Start Date</p>
                        <p style={{ fontWeight: 600, color: 'var(--primary-800)' }}>{formData.startDate}</p>
                    </div>
                    {isCustomBooking && formData.endDate && (
                        <div>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>End Date</p>
                            <p style={{ fontWeight: 600, color: 'var(--primary-800)' }}>{formData.endDate}</p>
                        </div>
                    )}
                    <div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>Travelers</p>
                        <p style={{ fontWeight: 600, color: 'var(--primary-800)' }}>{formData.travelers} person(s)</p>
                    </div>
                </div>
            </div>

            {/* Booking Details */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.125rem' }}>Booking Details</h3>
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    <div style={{ padding: 'var(--space-4)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-1)' }}>Accommodation</p>
                        <p style={{ fontWeight: 600 }}>{selectedRoom?.name}</p>
                    </div>
                    {selectedGuide && (
                        <div style={{ padding: 'var(--space-4)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-1)' }}>Tour Guide</p>
                            <p style={{ fontWeight: 600 }}>{selectedGuide.name}</p>
                        </div>
                    )}
                    <div style={{ padding: 'var(--space-4)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-1)' }}>Preferred Language</p>
                        <p style={{ fontWeight: 600 }}>{formData.preferredLanguage || 'English'}</p>
                    </div>
                    {selectedCar && (
                        <div style={{ padding: 'var(--space-4)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-1)' }}>Car Rental</p>
                            <p style={{ fontWeight: 600 }}>{selectedCar.name} ({selectedCar.capacity})</p>
                        </div>
                    )}
                    {selectedServices.length > 0 && (
                        <div style={{ padding: 'var(--space-4)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-2)' }}>Additional Services</p>
                            <ul style={{ paddingLeft: 'var(--space-5)' }}>
                                {selectedServices.map(svc => (
                                    <li key={svc.id} style={{ fontWeight: 500, marginBottom: 'var(--space-1)' }}>{svc.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ border: '2px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
                <div style={{ padding: 'var(--space-4)', background: 'var(--slate-100)', borderBottom: '2px solid var(--slate-200)' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Price Breakdown</h3>
                </div>
                <div style={{ padding: 'var(--space-4)' }}>
                    {pkg && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--slate-100)' }}>
                            <span style={{ fontSize: 'var(--text-base)' }}>Package ({days} days × {formData.travelers} travelers)</span>
                            <span style={{ fontWeight: 500 }}>{formatPrice(pkg.price * formData.travelers)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--slate-100)' }}>
                        <span style={{ fontSize: 'var(--text-base)' }}>Accommodation ({selectedRoom?.name})</span>
                        <span style={{ fontWeight: 500 }}>{formatPrice(selectedRoom?.price * days)}</span>
                    </div>
                    {selectedGuide && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--slate-100)' }}>
                            <span style={{ fontSize: 'var(--text-base)' }}>Tour Guide ({days} days)</span>
                            <span style={{ fontWeight: 500 }}>{formatPrice((selectedGuide.price_per_day || 500) * days)}</span>
                        </div>
                    )}
                    {selectedCar && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--slate-100)' }}>
                            <span style={{ fontSize: 'var(--text-base)' }}>Car Rental ({days} days)</span>
                            <span style={{ fontWeight: 500 }}>{formatPrice(selectedCar.price * days)}</span>
                        </div>
                    )}
                    {selectedServices.map(svc => (
                        <div key={svc.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--slate-100)' }}>
                            <span style={{ fontSize: 'var(--text-base)' }}>{svc.name} ({formData.travelers} travelers)</span>
                            <span style={{ fontWeight: 500 }}>{formatPrice(svc.price * formData.travelers)}</span>
                        </div>
                    ))}
                    <div style={{ 
                        display: 'flex', justifyContent: 'space-between', 
                        paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)',
                        fontSize: '1.5rem', fontWeight: 700
                    }}>
                        <span>Total Amount</span>
                        <span style={{ color: 'var(--primary-700)' }}>{formatPrice(total)}</span>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div style={{ padding: 'var(--space-5)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', marginBottom: 'var(--space-8)' }}>
                <h3 style={{ marginBottom: 'var(--space-3)', fontSize: '1.125rem' }}>Contact Information</h3>
                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                </div>
            </div>

            {/* Terms & Conditions */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--primary-50)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', border: '1px solid var(--primary-200)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-700)' }}>
                    By confirming this booking, you agree to our terms and conditions. You will receive a confirmation email with your booking details and payment instructions.
                </p>
            </div>

            {/* Validation Error */}
            {validationError && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'var(--space-3)', 
                    padding: 'var(--space-4)',
                    background: 'var(--error-50, #fef2f2)', 
                    border: '1px solid var(--error-200, #fecaca)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-6)',
                    color: 'var(--error-700, #b91c1c)'
                }}>
                    <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Missing Required Information</p>
                        <p style={{ fontSize: 'var(--text-sm)' }}>{validationError}</p>
                    </div>
                </div>
            )}

            {/* Missing Fields Warning */}
            {missingFields.length > 0 && !validationError && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'var(--space-3)', 
                    padding: 'var(--space-4)',
                    background: 'var(--warning-50, #fffbeb)', 
                    border: '1px solid var(--warning-200, #fde68a)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-6)',
                    color: 'var(--warning-700, #b45309)'
                }}>
                    <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Some information is missing</p>
                        <p style={{ fontSize: 'var(--text-sm)' }}>Please go back and complete: {missingFields.join(', ')}</p>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                <button
                    onClick={onBack}
                    className="btn btn-outline"
                    disabled={submitting}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-6)' }}
                >
                    <ArrowLeft size={18} /> Previous
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)', 
                        padding: 'var(--space-3) var(--space-8)',
                        fontSize: '1.125rem',
                        fontWeight: 600
                    }}
                >
                    {submitting ? (
                        <>
                            <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} /> Confirm Booking
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReviewStep;
