import React from 'react';
import { formatDate, formatPrice } from '../../api';

const getStatusStyle = (status) => {
    const styles = {
        confirmed: { bg: 'var(--success-100)', color: 'var(--success-500)' },
        pending: { bg: 'var(--warning-100)', color: 'var(--warning-500)' },
        cancelled: { bg: 'var(--error-100)', color: 'var(--error-500)' }
    };
    return styles[status] || styles.pending;
};

const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const status = getStatusStyle(booking.status);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Booking Details</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="modal-body">
                    <div className="ref-box">
                        <p className="label">Booking Reference</p>
                        <p className="ref">{booking.reference}</p>
                    </div>

                    <div className="field">
                        <p className="label">Package</p>
                        <p className="value">{booking.package_name || 'Custom Trip'}</p>
                    </div>

                    <div className="field">
                        <p className="label">Status</p>
                        <span className="status" style={{ background: status.bg, color: status.color }}>{booking.status}</span>
                    </div>

                    <div className="grid-2">
                        <div><p className="label">Travel Date</p><p>{formatDate(booking.booking_date)}</p></div>
                        <div><p className="label">Travelers</p><p>{booking.travelers} person(s)</p></div>
                    </div>

                    <div className="field">
                        <p className="label">Contact Information</p>
                        <p>{booking.full_name}</p>
                        <p className="sub">{booking.email}</p>
                        {booking.phone && <p className="sub">{booking.phone}</p>}
                    </div>

                    {booking.notes && (
                        <div className="field">
                            <p className="label">Special Requests / Notes</p>
                            <p className="notes">{booking.notes}</p>
                        </div>
                    )}

                    <div className="total-box">
                        <span>Total Price</span>
                        <span className="total">{formatPrice(booking.total_price)}</span>
                    </div>

                    <p className="booked-date">Booked on {formatDate(booking.created_at)}</p>
                </div>
            </div>

            <style>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: var(--space-4); }
                .modal-content { background: white; border-radius: var(--radius-2xl); padding: var(--space-8); max-width: 600px; width: 100%; max-height: 90vh; overflow: auto; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
                .close-btn { background: none; border: none; font-size: var(--text-2xl); cursor: pointer; color: var(--slate-400); }
                .modal-body { display: grid; gap: var(--space-4); }
                .ref-box { padding: var(--space-4); background: var(--slate-50); border-radius: var(--radius-lg); }
                .ref-box .ref { font-family: monospace; font-size: var(--text-xl); font-weight: 700; }
                .label { font-size: var(--text-sm); color: var(--slate-500); margin-bottom: var(--space-1); }
                .value { font-weight: 600; }
                .status { padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
                .sub { font-size: var(--text-sm); color: var(--slate-600); }
                .notes { font-size: var(--text-sm); color: var(--slate-600); line-height: 1.6; }
                .total-box { padding: var(--space-4); background: var(--primary-50); border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; font-size: var(--text-lg); font-weight: 600; }
                .total { font-size: var(--text-2xl); font-weight: 700; color: var(--primary-700); }
                .booked-date { font-size: var(--text-xs); color: var(--slate-400); text-align: center; }
            `}</style>
        </div>
    );
};

export default BookingDetailsModal;
