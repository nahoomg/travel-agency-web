import React, { useState } from 'react';
import { Send, CheckCircle, Clock, Globe, AlertCircle } from '../Icon';
import { api } from '../../api';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [generalError, setGeneralError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Please enter your full name';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                return '';
            case 'subject':
                if (!value.trim()) return 'Subject is required';
                if (value.trim().length < 3) return 'Please provide a more descriptive subject';
                return '';
            case 'message':
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Please provide more details (at least 10 characters)';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (field, value) => {
        const error = validateField(field, value);
        setErrors({ ...errors, [field]: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setStatus('sending');
        try {
            const nameParts = formData.name.trim().split(' ');
            await api.submitInquiry({
                first_name: nameParts[0] || '',
                last_name: nameParts.slice(1).join(' ') || nameParts[0],
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setErrors({});
        } catch (error) {
            console.error(error);
            setStatus('error');
            setGeneralError('Failed to send message. Please try again or contact us directly.');
        }
    };

    const updateField = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
        setGeneralError('');
    };

    return (
        <div className="contact-form-section">
            <div className="form-info">
                <h2>Send Us a Message</h2>
                <p>Whether you're looking for travel advice, custom tour packages, or just want to say hello, we're here to help.</p>
                <div className="info-items">
                    <div className="info-item"><Clock size={18} /> Quick response within 24 hours</div>
                    <div className="info-item"><Globe size={18} /> Available in English & Amharic</div>
                    <div className="info-item"><CheckCircle size={18} /> Free consultation for trip planning</div>
                </div>
            </div>

            <div className="form-container">
                {status === 'success' ? (
                    <div className="success-message">
                        <div className="success-icon"><CheckCircle size={40} /></div>
                        <h3>Message Sent!</h3>
                        <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                        <button onClick={() => setStatus('')} className="btn btn-dark">Send Another Message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {generalError && (
                            <div className="form-error">
                                <AlertCircle size={18} /> {generalError}
                            </div>
                        )}
                        <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                            <label>Your Name</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="John Doe" 
                                value={formData.name} 
                                onChange={updateField('name')} 
                                onBlur={(e) => handleBlur('name', e.target.value)}
                                className={errors.name ? 'input-error' : ''}
                            />
                            {errors.name && <span className="error-message"><AlertCircle size={14} /> {errors.name}</span>}
                        </div>
                        <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                required 
                                placeholder="you@example.com" 
                                value={formData.email} 
                                onChange={updateField('email')} 
                                onBlur={(e) => handleBlur('email', e.target.value)}
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="error-message"><AlertCircle size={14} /> {errors.email}</span>}
                        </div>
                        <div className={`form-group ${errors.subject ? 'has-error' : ''}`}>
                            <label>Subject</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="e.g., Custom Tour Inquiry" 
                                value={formData.subject} 
                                onChange={updateField('subject')} 
                                onBlur={(e) => handleBlur('subject', e.target.value)}
                                className={errors.subject ? 'input-error' : ''}
                            />
                            {errors.subject && <span className="error-message"><AlertCircle size={14} /> {errors.subject}</span>}
                        </div>
                        <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                            <label>Message</label>
                            <textarea 
                                required 
                                rows="4" 
                                placeholder="Tell us about your travel plans..." 
                                value={formData.message} 
                                onChange={updateField('message')} 
                                onBlur={(e) => handleBlur('message', e.target.value)}
                                className={errors.message ? 'input-error' : ''}
                            />
                            {errors.message && <span className="error-message"><AlertCircle size={14} /> {errors.message}</span>}
                        </div>
                        <button type="submit" disabled={status === 'sending'} className="btn btn-primary submit-btn">
                            {status === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
                        </button>
                    </form>
                )}
            </div>
            <style>{`
                .contact-form-section { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); align-items: center; padding: var(--space-16) 0; }
                .form-info h2 { margin-bottom: var(--space-4); }
                .form-info p { color: var(--slate-500); margin-bottom: var(--space-8); line-height: 1.8; }
                .info-items { display: flex; flex-direction: column; gap: var(--space-4); }
                .info-item { display: flex; align-items: center; gap: var(--space-3); color: var(--slate-600); }
                .info-item svg { color: var(--primary-500); }
                .form-container { background: white; padding: var(--space-10); border-radius: var(--radius-3xl); box-shadow: var(--shadow-xl); }
                .form-group { margin-bottom: var(--space-5); position: relative; }
                .form-group label { display: block; margin-bottom: var(--space-2); font-weight: 500; }
                .form-group input, .form-group textarea { width: 100%; padding: var(--space-3); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); transition: border-color 0.2s, box-shadow 0.2s; }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary-500); box-shadow: 0 0 0 3px var(--primary-100); }
                .form-group.has-error input, .form-group.has-error textarea, .form-group input.input-error, .form-group textarea.input-error { border-color: var(--error-500); background-color: var(--error-50, #fef2f2); }
                .form-group.has-error input:focus, .form-group.has-error textarea:focus { box-shadow: 0 0 0 3px var(--error-100, #fee2e2); }
                .error-message { display: flex; align-items: center; gap: var(--space-1); color: var(--error-500); font-size: var(--text-xs); margin-top: var(--space-1); }
                .error-message svg { flex-shrink: 0; }
                .form-error { background: var(--error-100); color: var(--error-500); padding: var(--space-4); border-radius: var(--radius-xl); margin-bottom: var(--space-6); font-size: var(--text-sm); display: flex; align-items: center; gap: var(--space-2); }
                .submit-btn { width: 100%; justify-content: center; }
                .success-message { text-align: center; padding: var(--space-8); }
                .success-icon { width: 80px; height: 80px; margin: 0 auto var(--space-6); background: var(--success-100); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--success-500); }
                @media (max-width: 968px) { .contact-form-section { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default ContactForm;
