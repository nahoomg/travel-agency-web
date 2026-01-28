import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { roomTypes, carOptions, additionalServices } from '../data/bookingOptions';
import { AlertCircle } from 'lucide-react';
import ProgressBar from '../components/booking/ProgressBar';
import TripDetailsStep from '../components/booking/TripDetailsStep';
import AccommodationStep from '../components/booking/AccommodationStep';
import ServicesStep from '../components/booking/ServicesStep';
import ReviewStep from '../components/booking/ReviewStep';
import BookingSuccess from '../components/booking/BookingSuccess';

/**
 * BookingWizard Component
 * 
 * Multi-step booking flow for tour packages.
 * Steps: Trip Details → Accommodation → Services → Review → Success
 */
const BookingWizard = () => {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [bookingRef, setBookingRef] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [pkg, setPkg] = useState(null);
    const [guides, setGuides] = useState([]);

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const [formData, setFormData] = useState({
        startDate: '', travelers: 1, roomType: 'single', guideId: null,
        preferredLanguage: 'English', carRental: null, services: ['insurance'],
        specialRequests: '', fullName: '', email: '', phone: ''
    });

    // Prefill user info
    useEffect(() => {
        if (user) setFormData(p => ({ ...p, fullName: `${user.firstName} ${user.lastName}`, email: user.email, phone: user.phone || '' }));
    }, [user]);

    // Fetch package and guides
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [packages, guidesData] = await Promise.all([api.getPackages(), api.getGuides()]);
                const found = packages.find(p => p.id === parseInt(packageId));
                if (!found) { navigate('/packages'); return; }
                setPkg(found);
                setGuides(guidesData);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [packageId, navigate]);

    // Calculate total price
    const calculateTotal = () => {
        let total = (pkg?.price || 0) * formData.travelers;
        const room = roomTypes.find(r => r.id === formData.roomType);
        if (room && pkg) total += room.price * pkg.duration_days;
        if (formData.carRental && pkg) {
            const car = carOptions.find(c => c.id === formData.carRental);
            if (car) total += car.price * pkg.duration_days;
        }
        formData.services.forEach(sid => {
            const svc = additionalServices.find(s => s.id === sid);
            if (svc) total += svc.price * formData.travelers;
        });
        return total;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const bookingData = {
                package_id: pkg.id,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                travel_date: formData.startDate,
                num_travelers: formData.travelers,
                room_type: formData.roomType,
                car_type: formData.carRental,
                additional_services: formData.services,
                guide_id: formData.guideId,
                total_price: calculateTotal(),
                notes: `Package: ${pkg.name}. Language: ${formData.preferredLanguage}. ${formData.specialRequests || ''}`
            };
            const res = await api.createBooking(bookingData);
            setBookingRef(res.booking_reference);
            setStep(5);
        } catch (err) {
            console.error(err);
            setError('Booking failed: ' + (err.message || 'Please try again or contact support.'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading package...</p></div>;
    if (!pkg) return null;

    const updateForm = (field, value) => setFormData(p => ({ ...p, [field]: value }));
    const steps = ['Trip Details', 'Accommodation', 'Services', 'Review'];
    const stepProps = { formData, updateForm, pkg, guides };

    return (
        <div className="booking-wizard">
            <div className="booking-header">
                <div className="container">
                    <h1 style={{ color: '#000', fontWeight: 700 }}>Complete Your Booking</h1>
                    <p style={{ color: 'white', opacity: 1 }}>Just a few steps to book your dream Ethiopian adventure</p>
                </div>
            </div>
            
            {step < 5 && (
                <div className="container" style={{ marginTop: 'var(--space-8)' }}>
                    <ProgressBar steps={steps} currentStep={step} />
                </div>
            )}
            
            <div className="container wizard-content">
                <div className="wizard-card">
                    {/* Error Message */}
                    {error && (
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
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {step === 1 && <TripDetailsStep {...stepProps} onNext={() => setStep(2)} />}
                    {step === 2 && <AccommodationStep {...stepProps} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
                    {step === 3 && <ServicesStep {...stepProps} onBack={() => setStep(2)} onNext={() => setStep(4)} />}
                    {step === 4 && <ReviewStep {...stepProps} total={calculateTotal()} onBack={() => setStep(3)} onSubmit={handleSubmit} submitting={submitting} />}
                    {step === 5 && <BookingSuccess bookingRef={bookingRef} pkg={pkg} formData={formData} total={calculateTotal()} />}
                </div>
            </div>
            <style>{`
                .booking-wizard { min-height: 100vh; background: var(--slate-50); padding-top: 80px; padding-bottom: var(--space-16); }
                .booking-header { background: linear-gradient(135deg, var(--primary-700), var(--primary-900)); padding: var(--space-12) 0; text-align: center; }
                .booking-header h1 { font-size: 2.5rem; margin-bottom: var(--space-2); color: #000; font-weight: 700; }
                .booking-header p { font-size: 1.125rem; color: white; }
                .wizard-content { max-width: 900px; margin-top: var(--space-8); }
                .wizard-card { background: white; border-radius: var(--radius-2xl); padding: var(--space-10); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: var(--space-4); }
                .spinner { width: 48px; height: 48px; border: 4px solid var(--slate-200); border-top-color: var(--primary-500); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) { 
                    .booking-header h1 { font-size: 2rem; }
                    .wizard-card { padding: var(--space-6); }
                }
            `}</style>
        </div>
    );
};

export default BookingWizard;
