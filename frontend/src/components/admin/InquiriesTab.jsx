import React from 'react';
import { formatDate } from '../../api';

const InquiriesTab = ({ inquiries }) => {
    return (
        <div className="inquiries-card">
            <h3>Customer Inquiries</h3>
            {inquiries.length === 0 ? (
                <p className="empty">No inquiries yet</p>
            ) : (
                <div className="inquiry-list">
                    {inquiries.map(inquiry => (
                        <div key={inquiry.id} className={`inquiry-item ${inquiry.status}`}>
                            <div className="inquiry-header">
                                <strong>{inquiry.first_name} {inquiry.last_name}</strong>
                                <span className="date">{formatDate(inquiry.created_at)}</span>
                            </div>
                            <div className="email">{inquiry.email}</div>
                            <p className="message">{inquiry.message}</p>
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                .inquiries-card { background: white; border-radius: var(--radius-2xl); box-shadow: var(--shadow-md); padding: var(--space-6); }
                .inquiries-card h3 { margin-bottom: var(--space-4); }
                .empty { color: var(--slate-500); text-align: center; padding: var(--space-8); }
                .inquiry-list { display: flex; flex-direction: column; gap: var(--space-4); }
                .inquiry-item { padding: var(--space-4); background: var(--slate-50); border-radius: var(--radius-lg); border-left: 4px solid var(--success-500); }
                .inquiry-item.new { border-left-color: var(--warning-500); }
                .inquiry-header { display: flex; justify-content: space-between; margin-bottom: var(--space-2); }
                .date { font-size: var(--text-sm); color: var(--slate-500); }
                .email { font-size: var(--text-sm); color: var(--slate-500); margin-bottom: var(--space-2); }
                .message { margin-bottom: 0; }
            `}</style>
        </div>
    );
};

export default InquiriesTab;
