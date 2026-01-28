import React from 'react';
import { Check, X } from 'lucide-react';
import { formatDate } from '../../api';

const BookingsTab = ({ bookings, updateBookingStatus }) => {
    return (
        <div className="table-card">
            <table>
                <thead>
                    <tr>
                        <th>Reference</th><th>Customer</th><th>Destination</th><th>Date</th><th>Status</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 ? (
                        <tr><td colSpan="6" className="empty">No bookings yet</td></tr>
                    ) : bookings.map(booking => (
                        <tr key={booking.id}>
                            <td className="mono">{booking.booking_reference}</td>
                            <td><div className="name">{booking.full_name}</div><div className="sub">{booking.email}</div></td>
                            <td>{booking.package_name || booking.destination_name || 'Custom Trip'}</td>
                            <td className="date">{booking.travel_date ? formatDate(booking.travel_date) : 'Not set'}</td>
                            <td><span className={`badge ${booking.status}`}>{booking.status}</span></td>
                            <td>
                                <div className="actions">
                                    <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="action-btn confirm"><Check size={14} /></button>
                                    <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="action-btn cancel"><X size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style>{`
                .table-card { background: white; border-radius: var(--radius-2xl); box-shadow: var(--shadow-md); overflow: hidden; }
                table { width: 100%; border-collapse: collapse; }
                th { padding: var(--space-4); text-align: left; font-weight: 600; color: var(--slate-600); background: var(--slate-50); }
                td { padding: var(--space-4); border-top: 1px solid var(--slate-100); }
                .empty { text-align: center; color: var(--slate-500); padding: var(--space-8) !important; }
                .mono { font-family: monospace; font-size: var(--text-sm); }
                .name { font-weight: 500; } .sub { font-size: var(--text-sm); color: var(--slate-500); }
                .badge { padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 600; }
                .badge.confirmed { background: var(--success-100); color: var(--success-500); }
                .badge.cancelled { background: var(--error-100); color: var(--error-500); }
                .badge.pending { background: var(--warning-100); color: var(--warning-500); }
                .actions { display: flex; gap: var(--space-2); }
                .action-btn { padding: var(--space-2); border: none; border-radius: var(--radius-md); cursor: pointer; }
                .action-btn.confirm { background: var(--success-100); color: var(--success-500); }
                .action-btn.cancel { background: var(--error-100); color: var(--error-500); }
            `}</style>
        </div>
    );
};

export default BookingsTab;
