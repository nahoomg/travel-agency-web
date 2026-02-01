import React from 'react';
import { AlertTriangle, X } from '../Icon';

const ConfirmModal = ({ 
    isOpen, 
    title = 'Confirm Action', 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    onConfirm, 
    onCancel,
    danger = true 
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 'var(--space-4)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                width: '100%',
                maxWidth: '450px',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: 'var(--space-5) var(--space-6)',
                    borderBottom: '1px solid var(--slate-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            background: danger ? 'var(--error-100)' : 'var(--warning-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: danger ? 'var(--error-600)' : 'var(--warning-600)'
                        }}>
                            <AlertTriangle size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: '600' }}>
                            {title}
                        </h3>
                    </div>
                    <button 
                        onClick={onCancel}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 'var(--space-2)',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--slate-400)'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: 'var(--space-6)' }}>
                    <p style={{ 
                        margin: 0, 
                        color: 'var(--slate-600)', 
                        fontSize: 'var(--text-base)',
                        lineHeight: '1.6'
                    }}>
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div style={{
                    padding: 'var(--space-4) var(--space-6)',
                    borderTop: '1px solid var(--slate-200)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--space-3)',
                    background: 'var(--slate-50)'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--slate-300)',
                            background: 'white',
                            color: 'var(--slate-700)',
                            fontWeight: '500',
                            cursor: 'pointer',
                            fontSize: 'var(--text-sm)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--slate-300)',
                            background: danger ? 'var(--error-100)' : 'var(--primary-100)',
                            color: 'var(--slate-800)',
                            fontWeight: '500',
                            cursor: 'pointer',
                            fontSize: 'var(--text-sm)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
