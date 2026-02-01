import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Users, CheckCircle } from './Icon';

const BookingModal = ({ pkg, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        travelers: 1,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.createBooking({
                package_id: pkg.id,
                travelers: formData.travelers,
                booking_date: formData.date,
                notes: formData.notes
            });
            // Show success state
            setSuccess(true);
            setTimeout(() => {
                onClose();
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="modal-overlay" style={overlayStyle} onClick={onClose}>
                <div className="modal-content" style={modalStyle} onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} style={closeBtnStyle}><X /></button>
                    <h2>Please Login</h2>
                    <p>You need to be logged in to book a trip.</p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
                        <button onClick={() => navigate('/register')} className="btn btn-outline">Register</button>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="modal-overlay" style={overlayStyle} onClick={onClose}>
                <div className="modal-content" style={{ ...modalStyle, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        background: 'var(--success-100)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto var(--space-4)'
                    }}>
                        <CheckCircle size={40} style={{ color: 'var(--success-600)' }} />
                    </div>
                    <h2 style={{ color: 'var(--success-700)', marginBottom: 'var(--space-2)' }}>Booking Successful!</h2>
                    <p style={{ color: 'var(--slate-600)' }}>Check your email for confirmation details.</p>
                    <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>Redirecting to your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" style={overlayStyle} onClick={onClose}>
            <div className="modal-content" style={modalStyle} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={closeBtnStyle}><X /></button>
                <h2 style={{ marginBottom: '0.5rem' }}>Book: {pkg.name}</h2>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>Start your adventure!</p>

                {error && <div className="text-error" style={{ marginBottom: '1rem', padding: 'var(--space-3)', background: 'var(--error-50)', border: '1px solid var(--error-200)', borderRadius: 'var(--radius-md)', color: 'var(--error-700)' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Travel Date</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} style={iconStyle} />
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                style={inputStyle}
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Number of Travelers</label>
                        <div style={{ position: 'relative' }}>
                            <Users size={18} style={iconStyle} />
                            <input
                                type="number"
                                required
                                min="1"
                                max="20"
                                style={inputStyle}
                                value={formData.travelers}
                                onChange={e => setFormData({ ...formData, travelers: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Special Requests (Optional)</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '80px', paddingLeft: '0.75rem' }}
                            placeholder="Dietary restrictions, etc."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Simple inline styles for modal
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 2000,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const modalStyle = {
    background: 'white', padding: '2rem', borderRadius: '1rem',
    width: '90%', maxWidth: '500px', position: 'relative',
    maxHeight: '90vh', overflowY: 'auto'
};

const closeBtnStyle = {
    position: 'absolute', top: '1rem', right: '1rem',
    background: 'none', border: 'none', cursor: 'pointer'
};

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 500 };
const inputStyle = { width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #ddd' };
const iconStyle = { position: 'absolute', left: '10px', top: '35%', color: '#999' };

export default BookingModal;
