import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from '../Icon';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        info: <AlertCircle size={20} />
    };

    const colors = {
        success: { bg: 'var(--success-50)', border: 'var(--success-200)', text: 'var(--success-700)', icon: 'var(--success-500)' },
        error: { bg: 'var(--error-50)', border: 'var(--error-200)', text: 'var(--error-700)', icon: 'var(--error-500)' },
        info: { bg: 'var(--info-50)', border: 'var(--info-200)', text: 'var(--info-700)', icon: 'var(--info-500)' }
    };

    const style = colors[type] || colors.info;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            background: style.bg,
            border: `1px solid ${style.border}`,
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            color: style.text,
            minWidth: '300px',
            maxWidth: '400px'
        }}>
            <span style={{ color: style.icon, flexShrink: 0 }}>{icons[type]}</span>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{message}</span>
            <button 
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 'var(--space-1)',
                    cursor: 'pointer',
                    color: style.text,
                    opacity: 0.7,
                    flexShrink: 0
                }}
            >
                <X size={16} />
            </button>
        </div>
    );
};

// Toast container component
const ToastContainer = ({ toasts, removeToast }) => {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 'var(--space-6)',
            right: 'var(--space-6)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
        }}>
            {toasts.map(toast => (
                <Toast 
                    key={toast.id} 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => removeToast(toast.id)} 
                />
            ))}
        </div>
    );
};

// Hook for using toast notifications
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message) => addToast(message, 'success'), [addToast]);
    const error = useCallback((message) => addToast(message, 'error'), [addToast]);
    const info = useCallback((message) => addToast(message, 'info'), [addToast]);

    // Return the ToastContainer as a component to render
    const ToastContainerComponent = useCallback(() => (
        <ToastContainer toasts={toasts} removeToast={removeToast} />
    ), [toasts, removeToast]);

    return {
        success,
        error,
        info,
        ToastContainer: ToastContainerComponent
    };
};

export { ToastContainer };
export default Toast;
