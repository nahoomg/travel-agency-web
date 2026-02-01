import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Users, Mail, DollarSign } from '../Icon';
import { formatPrice } from '../../api';

const BookingSuccess = ({ bookingRef, pkg, destination, formData, total, isCustomBooking }) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const tripName = pkg ? pkg.name : destination ? `Custom Trip to ${destination.name}` : 'Your Trip';
    const tripType = pkg ? 'Package' : 'Custom Trip';

    return (
        <div style={{ 
            minHeight: '70vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 'var(--space-8) 0'
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-10)',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
                {/* Success Icon */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-6)',
                    animation: 'successPulse 1.5s ease-in-out'
                }}>
                    <CheckCircle size={50} color="white" strokeWidth={3} />
                </div>

                {/* Title */}
                <h1 style={{ 
                    fontSize: '2rem', 
                    marginBottom: 'var(--space-3)',
                    color: 'var(--slate-900)',
                    fontWeight: 700
                }}>
                    Booking Confirmed!
                </h1>
                <p style={{ 
                    color: 'var(--slate-600)', 
                    marginBottom: 'var(--space-8)',
                    fontSize: '1.125rem'
                }}>
                    Your trip to Ethiopia has been successfully booked. We've sent a confirmation email to <strong>{formData.email}</strong>
                </p>

                {/* Booking Reference */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--space-8)',
                    border: '2px solid var(--primary-200)'
                }}>
                    <p style={{ 
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--slate-600)', 
                        marginBottom: 'var(--space-2)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Booking Reference Number
                    </p>
                    <p style={{ 
                        fontSize: '2rem', 
                        fontWeight: 700, 
                        color: 'var(--primary-700)',
                        fontFamily: 'monospace',
                        letterSpacing: '2px'
                    }}>
                        {bookingRef}
                    </p>
                </div>

                {/* Booking Summary */}
                <div style={{
                    background: 'var(--slate-50)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--space-8)',
                    textAlign: 'left'
                }}>
                    <h3 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: 'var(--space-4)',
                        color: 'var(--slate-800)'
                    }}>
                        Booking Summary
                    </h3>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                background: 'var(--primary-100)', 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Calendar size={20} color="var(--primary-600)" />
                            </div>
                            <div>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>{tripType}</p>
                                <p style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{tripName}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                background: 'var(--primary-100)', 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Users size={20} color="var(--primary-600)" />
                            </div>
                            <div>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>Travelers</p>
                                <p style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{formData.travelers} person(s)</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                background: 'var(--primary-100)', 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Calendar size={20} color="var(--primary-600)" />
                            </div>
                            <div>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>Start Date</p>
                                <p style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{formData.startDate}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                background: '#10b981', 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <DollarSign size={20} color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>Total Amount</p>
                                <p style={{ fontWeight: 700, color: '#10b981', fontSize: '1.25rem' }}>{formatPrice(total)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps Info */}
                <div style={{
                    background: 'var(--primary-50)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-8)',
                    textAlign: 'left',
                    border: '1px solid var(--primary-200)'
                }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-2)', color: 'var(--primary-900)' }}>What's Next?</h4>
                    <ul style={{ paddingLeft: 'var(--space-5)', color: 'var(--slate-700)', fontSize: 'var(--text-sm)' }}>
                        <li style={{ marginBottom: 'var(--space-1)' }}>Check your email for booking confirmation and payment details</li>
                        <li style={{ marginBottom: 'var(--space-1)' }}>Our team will contact you within 24 hours</li>
                        <li style={{ marginBottom: 'var(--space-1)' }}>Complete payment to secure your booking</li>
                        <li>Prepare for an amazing Ethiopian adventure!</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-3)', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Link 
                        to="/profile" 
                        className="btn btn-primary"
                        style={{ padding: 'var(--space-3) var(--space-6)' }}
                    >
                        View My Bookings
                    </Link>
                    <Link 
                        to="/packages" 
                        className="btn btn-outline"
                        style={{ padding: 'var(--space-3) var(--space-6)' }}
                    >
                        Browse More Packages
                    </Link>
                    <Link 
                        to="/" 
                        className="btn btn-outline"
                        style={{ padding: 'var(--space-3) var(--space-6)' }}
                    >
                        Back to Home
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes successPulse {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default BookingSuccess;
