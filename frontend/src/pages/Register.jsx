import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BenefitsPanel from '../components/auth/BenefitsPanel';
import AuthFormContainer from '../components/auth/AuthFormContainer';
import { AlertCircle, CheckCircle } from '../components/Icon';

/**
 * Register Page
 * User registration with validation and benefits panel display.
 * Uses shared auth components for consistent styling.
 */
const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Validation helpers
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
        return phone.length >= 10 && phoneRegex.test(phone);
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
                if (!value.trim()) return 'First name is required';
                if (value.trim().length < 2) return 'First name must be at least 2 characters';
                return '';
            case 'lastName':
                if (!value.trim()) return 'Last name is required';
                if (value.trim().length < 2) return 'Last name must be at least 2 characters';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address (e.g., name@example.com)';
                return '';
            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                if (!validatePhone(value)) return 'Please enter a valid phone number (e.g., +251 91 234 5678)';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                if (!/[A-Z]/.test(value)) return 'Password should contain at least one uppercase letter';
                if (!/[0-9]/.test(value)) return 'Password should contain at least one number';
                return '';
            case 'confirmPassword':
                if (!value) return 'Please confirm your password';
                if (value !== formData.password) return 'Passwords do not match';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        setGeneralError('');
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const validateAllFields = () => {
        const newErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        
        if (!validateAllFields()) {
            return;
        }

        setIsLoading(true);
        try {
            const { confirmPassword, ...data } = formData;
            await register(data);
            // Redirect to login with success message
            navigate('/login', { 
                state: { 
                    registrationSuccess: true,
                    message: 'Account created successfully! Please sign in to continue.' 
                } 
            });
        } catch (err) {
            setGeneralError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <BenefitsPanel />
            <AuthFormContainer
                title="Create Account"
                subtitle="Join us for your next adventure"
                error={generalError}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitText="Create Account"
                footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
            >
                <div className="form-row">
                    <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            required 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            onBlur={handleBlur}
                            placeholder="John" 
                            className={errors.firstName ? 'input-error' : ''}
                        />
                        {errors.firstName && <span className="error-message"><AlertCircle size={14} /> {errors.firstName}</span>}
                    </div>
                    <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            required 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            onBlur={handleBlur}
                            placeholder="Doe" 
                            className={errors.lastName ? 'input-error' : ''}
                        />
                        {errors.lastName && <span className="error-message"><AlertCircle size={14} /> {errors.lastName}</span>}
                    </div>
                </div>
                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        placeholder="you@example.com" 
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-message"><AlertCircle size={14} /> {errors.email}</span>}
                </div>
                <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                    <label>Phone Number</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        placeholder="+251 91 234 5678" 
                        className={errors.phone ? 'input-error' : ''}
                    />
                    {errors.phone && <span className="error-message"><AlertCircle size={14} /> {errors.phone}</span>}
                </div>
                <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                    <label>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        value={formData.password} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        placeholder="Min 6 chars, 1 uppercase, 1 number" 
                        className={errors.password ? 'input-error' : ''}
                    />
                    {errors.password && <span className="error-message"><AlertCircle size={14} /> {errors.password}</span>}
                </div>
                <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        required 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        placeholder="••••••••" 
                        className={errors.confirmPassword ? 'input-error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message"><AlertCircle size={14} /> {errors.confirmPassword}</span>}
                </div>
            </AuthFormContainer>
            <style>{`
                .auth-page { min-height: 100vh; display: flex; background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
                .form-group { margin-bottom: var(--space-4); position: relative; }
                .form-group label { display: block; margin-bottom: var(--space-2); font-weight: 500; color: var(--slate-700); }
                .form-group input { width: 100%; padding: var(--space-3) var(--space-4); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); font-size: var(--text-base); transition: border-color 0.2s, box-shadow 0.2s; }
                .form-group input:focus { outline: none; border-color: var(--primary-500); box-shadow: 0 0 0 3px var(--primary-100); }
                .form-group.has-error input, .form-group input.input-error { border-color: var(--error-500); background-color: var(--error-50, #fef2f2); }
                .form-group.has-error input:focus, .form-group input.input-error:focus { box-shadow: 0 0 0 3px var(--error-100, #fee2e2); }
                .error-message { display: flex; align-items: center; gap: var(--space-1); color: var(--error-500); font-size: var(--text-xs); margin-top: var(--space-1); }
                .error-message svg { flex-shrink: 0; }
                @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default Register;
