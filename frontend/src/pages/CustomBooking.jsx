import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, Loader, Check, MapPin, AlertCircle } from '../components/Icon';
import { roomTypes, carOptions, additionalServices } from '../data/bookingOptions';

// Step Components
import TripDetailsStep from '../components/booking/TripDetailsStep';
import AccommodationStep from '../components/booking/AccommodationStep';
import ServicesStep from '../components/booking/ServicesStep';
import ReviewStep from '../components/booking/ReviewStep';
import BookingSuccess from '../components/booking/BookingSuccess';
import ProgressBar from '../components/booking/ProgressBar';

const CustomBooking = () => {
    const { destinationSlug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [bookingRef, setBookingRef] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [destination, setDestination] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [guides, setGuides] = useState([]);
    const [error, setError] = useState('');

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const getImageUrl = (url) => {
        if (!url) return '';
        const path = url.startsWith('/') ? url : `/${url}`;
        return path.replace(/ /g, '%20');
    };

    const [formData, setFormData] = useState({
        startDate: '', endDate: '', travelers: 1, hotelId: null, roomType: 'single',
        guideId: null, preferredLanguage: 'English', carRental: null,
        services: ['insurance'], specialRequests: '', fullName: '', email: '', phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phone || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dest = await api.getDestination(destinationSlug);
                if (!dest) { navigate('/destinations'); return; }
                setDestination(dest);
                const [guidesData, hotelData] = await Promise.all([
                    api.getGuides(), api.getHotelsByDestination(dest.id)
                ]);
                setGuides(guidesData);
                setHotels(hotelData);
            } catch (error) {
                console.error("Error fetching booking data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [destinationSlug, navigate]);

    const calculateDays = () => {
        if (!formData.startDate || !formData.endDate) return 1;
        const diff = Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };

    const calculateTotal = () => {
        const days = calculateDays();
        let total = 0;
        const room = roomTypes.find(r => r.id === formData.roomType);
        if (room) total += room.price * days;
        if (formData.carRental) {
            const car = carOptions.find(c => c.id === formData.carRental);
            if (car) total += car.price * days;
        }
        if (formData.guideId) {
            const guide = guides.find(g => g.id === formData.guideId);
            if (guide) total += guide.price_per_day * days;
        }
        formData.services.forEach(svcId => {
            const svc = additionalServices.find(s => s.id === svcId);
            if (svc) total += svc.price * formData.travelers;
        });
        return total;
    };

    const handleNext = () => {
        setError('');
        if (step === 1 && (!formData.startDate || !formData.endDate || !formData.fullName || !formData.email)) {
            setError('Please fill in all required fields before proceeding');
            return;
        }
        if (step === 1 && new Date(formData.endDate) <= new Date(formData.startDate)) {
            setError('End date must be after start date');
            return;
        }
        setStep(s => s + 1);
    };

    const toggleService = (svcId) => {
        if (svcId === 'insurance') return;
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(svcId)
                ? prev.services.filter(s => s !== svcId)
                : [...prev.services, svcId]
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const selectedGuide = guides.find(g => g.id === formData.guideId);
            const selectedCar = carOptions.find(c => c.id === formData.carRental);
            const selectedRoom = roomTypes.find(r => r.id === formData.roomType);
            const bookingData = {
                package_id: null,
                destination_id: destination.id,
                hotel_id: formData.hotelId,
                guide_id: formData.guideId,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                travel_date: formData.startDate,
                end_date: formData.endDate,
                num_travelers: formData.travelers,
                room_type: formData.roomType,
                car_type: formData.carRental,
                additional_services: formData.services,
                total_price: calculateTotal(),
                notes: `CUSTOM BOOKING - ${destination.name}. Duration: ${calculateDays()} days. Room: ${selectedRoom?.name || 'N/A'}, Guide: ${selectedGuide?.name || 'N/A'}, Car: ${selectedCar?.name || 'None'}, Language: ${formData.preferredLanguage}. ${formData.specialRequests || ''}`
            };
            const result = await api.createBooking(bookingData);
            setBookingRef(result.booking_reference);
            setStep(5);
        } catch (err) {
            console.error(err);
            setError("Booking failed: " + (err.message || 'Please try again or contact support.'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader size={48} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!destination) return <div className="section text-center">Destination not found</div>;
    if (step === 5) {
        return (
            <BookingSuccess 
                bookingRef={bookingRef}
                destination={destination}
                formData={formData}
                total={calculateTotal()}
                isCustomBooking={true}
            />
        );
    }

    return (
        <div style={{ background: 'var(--slate-50)', minHeight: '100vh', paddingTop: '100px' }}>
            <div className="container" style={{ maxWidth: '900px', padding: 'var(--space-8)' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <span className="badge"><MapPin size={16} /> Custom Trip</span>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Plan Your Trip to {destination.name}</h1>
                    <p style={{ color: 'var(--slate-600)' }}>Create your perfect personalized experience</p>
                </div>

                <ProgressBar steps={['Trip Details', 'Accommodation', 'Services', 'Review']} currentStep={step} />

                {/* Step Content */}
                <div className="card" style={{ padding: 'var(--space-8)' }}>
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

                    {step === 1 && <TripDetailsStep formData={formData} setFormData={setFormData} destination={destination} />}
                    {step === 2 && <AccommodationStep formData={formData} setFormData={setFormData} hotels={hotels} />}
                    {step === 3 && <ServicesStep formData={formData} setFormData={setFormData} guides={guides} toggleService={toggleService} />}
                    {step === 4 && (
                        <ReviewStep 
                            formData={formData} 
                            destination={destination}
                            guides={guides} 
                            calculateDays={calculateDays} 
                            total={calculateTotal()}
                            onBack={() => setStep(3)}
                            onSubmit={handleSubmit}
                            submitting={submitting}
                            isCustomBooking={true}
                        />
                    )}

                    {/* Navigation - only show for steps 1-3, step 4 has its own buttons */}
                    {step < 4 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--slate-200)' }}>
                            {step > 1 ? (
                                <button onClick={() => setStep(s => s - 1)} className="btn btn-outline"><ArrowLeft size={18} /> Back</button>
                            ) : (
                                <Link to={`/destinations/${destinationSlug}`} className="btn btn-outline"><ArrowLeft size={18} /> Cancel</Link>
                            )}
                            <button onClick={handleNext} className="btn btn-primary">Continue <ArrowRight size={18} /></button>
                        </div>
                    )}
                </div>

                {/* Floating Price */}
                <div className="floating-price">
                    <div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>Estimated Total</p>
                        <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--primary-700)' }}>{formatPrice(calculateTotal())}</p>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>{calculateDays()} days • {formData.travelers} traveler(s)</div>
                </div>
            </div>
        </div>
    );
};

export default CustomBooking;
