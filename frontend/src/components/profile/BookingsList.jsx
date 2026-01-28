import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { formatDate, formatPrice } from '../../api';

const getStatusStyle = (status) => {
    const styles = {
        confirmed: { bg: 'var(--success-100)', color: 'var(--success-500)' },
        pending: { bg: 'var(--warning-100)', color: 'var(--warning-500)' },
        cancelled: { bg: 'var(--error-100)', color: 'var(--error-500)' }
    };
    return styles[status] || styles.pending;
};

const BookingsList = ({ bookings, loading, setSelectedBooking }) => {
    if (loading) {
        return (
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '150px', borderRadius: 'var(--radius-2xl)' }} />)}
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="empty-state">
                <div className="emoji">🧳</div>
                <h3>No Trips Yet</h3>
                <p>Start planning your Ethiopian adventure today!</p>
                <Link to="/destinations" className="btn btn-primary">Explore Destinations</Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            {bookings.map(booking => {
                const status = getStatusStyle(booking.status);
                return (
                    <div key={booking.reference} className="booking-card">
                        <div>
                            <div className="booking-header">
                                <h4>{booking.package_name}</h4>
                                <span className="status-badge" style={{ background: status.bg, color: status.color }}>{booking.status}</span>
                            </div>
                            <div className="booking-meta">
                                <span><Calendar size={14} /> {formatDate(booking.booking_date)}</span>
                                <span><Users size={14} /> {booking.travelers} travelers</span>
                                <span className="ref">#{booking.reference}</span>
                            </div>
                        </div>
                        <div className="booking-actions">
                            <div className="price">{formatPrice(booking.total_price)}</div>
                            <button className="btn btn-sm btn-dark" onClick={() => setSelectedBooking(booking)}>
                                View Details <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                );
            })}

            <style>{`
                .empty-state { background: white; border-radius: var(--radius-3xl); padding: var(--space-16); text-align: center; box-shadow: var(--shadow-sm); }
                .empty-state .emoji { font-size: 4rem; margin-bottom: var(--space-4); }
                .empty-state h3 { margin-bottom: var(--space-2); }
                .empty-state p { color: var(--slate-500); margin-bottom: var(--space-6); }
                .booking-card { background: white; border-radius: var(--radius-2xl); padding: var(--space-6); box-shadow: var(--shadow-md); display: grid; grid-template-columns: 1fr auto; gap: var(--space-4); align-items: center; }
                .booking-header { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3); }
                .booking-header h4 { margin-bottom: 0; }
                .status-badge { padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; }
                .booking-meta { display: flex; gap: var(--space-6); color: var(--slate-500); font-size: var(--text-sm); }
                .booking-meta span { display: flex; align-items: center; gap: var(--space-2); }
                .booking-meta .ref { font-family: monospace; color: var(--slate-400); }
                .booking-actions { text-align: right; }
                .price { font-size: var(--text-2xl); font-weight: 700; color: var(--primary-700); margin-bottom: var(--space-2); }
            `}</style>
        </div>
    );
};

export default BookingsList;
