import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Compass, CheckCircle, AlertCircle } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    // Check for registration success message
    useEffect(() => {
        if (location.state?.registrationSuccess) {
            setSuccessMessage(location.state.message || 'Account created successfully! Please sign in.');
            // Clear the state so message doesn't show again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
        setGeneralError('');
        setSuccessMessage('');
    };

    const handleBlur = (field, value) => {
        const error = validateField(field, value);
        setErrors({ ...errors, [field]: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        setSuccessMessage('');

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

        setIsLoading(true);

        try {
            const response = await login(formData.email, formData.password);
            
            // Check if user is admin and redirect accordingly
            if (response.user?.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setGeneralError(err.message || 'Login failed. Please check your email and password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%)',
            padding: 'var(--space-8)'
        }}>
            {/* Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(214,167,47,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                borderRadius: '50%'
            }} />

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                background: 'white',
                padding: 'var(--space-10)',
                borderRadius: 'var(--radius-3xl)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        color: 'var(--primary-700)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 700,
                        marginBottom: 'var(--space-6)'
                    }}>
                        <Compass size={24} /> EPSEC Travel
                    </Link>
                    <h2 style={{
                        fontSize: 'var(--text-3xl)',
                        color: 'var(--slate-900)',
                        marginBottom: 'var(--space-2)'
                    }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: 'var(--slate-500)', marginBottom: 0 }}>
                        Sign in to continue your journey
                    </p>
                </div>

                {/* Success Message - shows after registration */}
                {successMessage && (
                    <div style={{
                        background: 'var(--success-100, #dcfce7)',
                        color: 'var(--success-600, #16a34a)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 'var(--space-6)',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                    }}>
                        <CheckCircle size={18} /> {successMessage}
                    </div>
                )}

                {/* General Error Message */}
                {generalError && (
                    <div style={{
                        background: 'var(--error-100)',
                        color: 'var(--error-500)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 'var(--space-6)',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                    }}>
                        <AlertCircle size={18} /> {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--space-5)' }}>
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: errors.email ? 'var(--error-500)' : 'var(--slate-400)'
                            }} />
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={(e) => handleBlur('email', e.target.value)}
                                style={{ 
                                    paddingLeft: '48px',
                                    borderColor: errors.email ? 'var(--error-500)' : undefined,
                                    backgroundColor: errors.email ? 'var(--error-50, #fef2f2)' : undefined
                                }}
                            />
                        </div>
                        {errors.email && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-1)',
                                color: 'var(--error-500)',
                                fontSize: 'var(--text-xs)',
                                marginTop: 'var(--space-1)'
                            }}>
                                <AlertCircle size={14} /> {errors.email}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: errors.password ? 'var(--error-500)' : 'var(--slate-400)'
                            }} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                onBlur={(e) => handleBlur('password', e.target.value)}
                                style={{ 
                                    paddingLeft: '48px',
                                    borderColor: errors.password ? 'var(--error-500)' : undefined,
                                    backgroundColor: errors.password ? 'var(--error-50, #fef2f2)' : undefined
                                }}
                            />
                        </div>
                        {errors.password && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-1)',
                                color: 'var(--error-500)',
                                fontSize: 'var(--text-xs)',
                                marginTop: 'var(--space-1)'
                            }}>
                                <AlertCircle size={14} /> {errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)'
                        }}
                    >
                        {isLoading ? (
                            'Signing In...'
                        ) : (
                            <>Sign In <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <p style={{
                    marginTop: 'var(--space-8)',
                    textAlign: 'center',
                    color: 'var(--slate-500)',
                    marginBottom: 0
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
