import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle } from '../components/Icon';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import BookingsList from '../components/profile/BookingsList';
import BookingDetailsModal from '../components/profile/BookingDetailsModal';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) setEditForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' });
    }, [user]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await api.getMyBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const updatedUser = await api.updateProfile(editForm);
            // Update user context with new data
            if (setUser && updatedUser) {
                setUser(prev => ({ ...prev, ...editForm }));
            }
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditMode(false);
            // Auto-hide success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ background: 'var(--slate-50)', minHeight: '100vh', paddingTop: '100px' }}>
            <div className="container section" style={{ paddingTop: 'var(--space-8)' }}>
                {/* Success/Error Message */}
                {message.text && (
                    <div style={{
                        background: message.type === 'success' ? 'var(--success-100, #dcfce7)' : 'var(--error-100)',
                        color: message.type === 'success' ? 'var(--success-600, #16a34a)' : 'var(--error-500)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 'var(--space-6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                    }}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}

                <div className="profile-grid">
                    <ProfileSidebar 
                        user={user} editMode={editMode} setEditMode={setEditMode}
                        editForm={editForm} setEditForm={setEditForm}
                        handleSaveProfile={handleSaveProfile} saving={saving}
                    />

                    <main>
                        <div className="bookings-header">
                            <h2>My Bookings</h2>
                            <Link to="/destinations" className="btn btn-sm btn-primary">Book New Trip</Link>
                        </div>
                        <BookingsList bookings={bookings} loading={loading} setSelectedBooking={setSelectedBooking} />
                    </main>
                </div>

                <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
            </div>

            <style>{`
                .profile-grid { display: grid; grid-template-columns: 320px 1fr; gap: var(--space-8); align-items: start; }
                .bookings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
                .bookings-header h2 { font-size: var(--text-3xl); }
                @media (max-width: 968px) { .profile-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default Profile;
