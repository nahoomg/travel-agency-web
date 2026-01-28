import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

/**
 * Reusable form container for auth pages (Login/Register)
 */
const AuthFormContainer = ({ title, subtitle, error, onSubmit, isLoading, submitText, children, footer }) => (
    <div className="auth-form-panel">
        <div className="auth-form-content">
            <div className="auth-header">
                <Link to="/" className="brand">
                    <Compass size={24} /> EPSEC Travel
                </Link>
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <form onSubmit={onSubmit}>
                {children}
                <button type="submit" disabled={isLoading} className="btn btn-primary submit-btn">
                    {isLoading ? 'Please wait...' : <>{submitText} <ArrowRight size={18} /></>}
                </button>
            </form>

            {footer && <div className="auth-footer">{footer}</div>}
        </div>
        <style>{`
            .auth-form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: var(--space-8); background: white; border-radius: var(--radius-3xl) 0 0 var(--radius-3xl); }
            .auth-form-content { width: 100%; max-width: 440px; }
            .auth-header { text-align: center; margin-bottom: var(--space-8); }
            .auth-header .brand { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--primary-700); font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-6); text-decoration: none; }
            .auth-header h2 { font-size: var(--text-3xl); margin-bottom: var(--space-2); }
            .auth-header p { color: var(--slate-500); margin: 0; }
            .auth-error { background: var(--error-100); color: var(--error-500); padding: var(--space-4); border-radius: var(--radius-xl); margin-bottom: var(--space-6); font-size: var(--text-sm); }
            .submit-btn { width: 100%; justify-content: center; margin-top: var(--space-2); }
            .auth-footer { margin-top: var(--space-6); text-align: center; color: var(--slate-500); }
            .auth-footer a { color: var(--primary-600); font-weight: 600; }
        `}</style>
    </div>
);

export default AuthFormContainer;
