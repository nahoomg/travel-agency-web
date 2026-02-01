import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { Calendar, ArrowRight } from '../components/Icon';
import { destinationExtras } from '../data/destinationExtras';

// Components
import GallerySection from '../components/destination/GallerySection';
import ActivitiesSection from '../components/destination/ActivitiesSection';
import PackagesSection from '../components/destination/PackagesSection';
import Lightbox from '../components/destination/Lightbox';

const DestinationDetail = () => {
    const { slug } = useParams();
    const [destination, setDestination] = useState(null);
    const [packages, setPackages] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const staticExtras = destinationExtras[slug] || { gallery: [], activities: [] };

    const getImageUrl = (url) => {
        if (!url) return '';
        const path = url.startsWith('/') ? url : `/${url}`;
        // Split by '/' and encode each segment to handle spaces and special chars
        const parts = path.split('/');
        return parts.map((part, index) => 
            index === 0 ? part : encodeURIComponent(part)
        ).join('/');
    };

    // Build gallery from database or fallback to static
    const buildGallery = () => {
        // If database has gallery_images, use them
        if (destination?.gallery_images && destination.gallery_images.length > 0) {
            return destination.gallery_images.map((img, i) => ({
                image: getImageUrl(img),
                title: `${destination.name} Photo ${i + 1}`
            }));
        }
        // Otherwise use static gallery data
        return staticExtras.gallery;
    };

    const normalizeActivities = (raw) => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string') {
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        if (typeof raw === 'object') return [raw];
        return [];
    };

    // Build activities from database activities field or fallback to static
    const buildActivities = () => {
        const activitiesFromDb = normalizeActivities(destination?.activities);
        if (activitiesFromDb.length > 0) {
            return activitiesFromDb
                .filter(a => a?.title && a.title.trim())
                .map(a => ({
                    title: a.title,
                    image: a.image ? getImageUrl(a.image) : null,
                    items: Array.isArray(a.items) ? a.items : []
                }));
        }
        // Otherwise use static activities data
        return staticExtras.activities;
    };

    const gallery = destination ? buildGallery() : [];
    const activities = destination ? buildActivities() : [];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dest = await api.getDestination(slug);
                setDestination(dest);
                if (dest) {
                    const [pkgs, htls] = await Promise.all([api.getPackages(), api.getHotelsByDestination(dest.id)]);
                    setPackages(pkgs.filter(p => p.destination_id === dest.id));
                    setHotels(htls);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen || gallery.length === 0) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') { setLightboxOpen(false); document.body.style.overflow = ''; }
            if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % gallery.length);
            if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, gallery.length]);

    const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true); document.body.style.overflow = 'hidden'; };
    const closeLightbox = () => { setLightboxOpen(false); document.body.style.overflow = ''; };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="skeleton" style={{ width: '200px', height: '24px' }} /></div>;
    }

    if (!destination) {
        return (
            <div className="container section text-center" style={{ paddingTop: '150px' }}>
                <h2>Destination Not Found</h2>
                <Link to="/destinations" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>View All Destinations</Link>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--slate-50)' }}>
            {/* Hero Banner */}
            <div style={{
                height: '70vh',
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("${getImageUrl(destination.image_url)}")`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center'
            }}>
                <div className="container">
                    <span className="hero-badge">{destination.category}</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: 'var(--space-4)', color: 'white' }}>{destination.name}</h1>
                    <p style={{ fontSize: 'var(--text-xl)', opacity: 0.9, maxWidth: '600px', margin: '0 auto', color: 'white' }}>{destination.tagline}</p>
                </div>
            </div>

            {/* Intro Section */}
            <section className="container" style={{ padding: 'var(--space-10) 0' }}>
                <div className="intro-grid">
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-6)' }}>Discover {destination.name}</h2>
                        <p style={{ lineHeight: 1.8, fontSize: 'var(--text-lg)', color: 'var(--slate-600)', marginBottom: 'var(--space-6)' }}>{destination.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--slate-500)' }}>
                            <Calendar size={18} /><span>Best: {destination.best_time_to_visit}</span>
                        </div>
                    </div>
                    {gallery[0] && (
                        <div style={{ borderRadius: 'var(--radius-3xl)', overflow: 'hidden', boxShadow: 'var(--shadow-2xl)' }}>
                            <img src={gallery[0].image} alt={gallery[0].title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>
            </section>

            <GallerySection gallery={gallery} destination={destination} openLightbox={openLightbox} />
            <ActivitiesSection activities={activities} destination={destination} />
            <PackagesSection packages={packages} destination={destination} slug={slug} getImageUrl={getImageUrl} />

            {/* Hotels & CTA */}
            <section className="container" style={{ padding: 'var(--space-10) 0' }}>
                <div className="hotels-grid">
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-6)' }}>Plan Your Visit</h2>
                        <p style={{ color: 'var(--slate-600)', lineHeight: 1.8 }}>
                            Ready to explore {destination.name}? Our expert team can help you create the perfect itinerary.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
                            <Link to={`/custom-book/${slug}`} className="btn btn-primary">Book Custom Trip <ArrowRight size={16} /></Link>
                            <Link to="/contact" className="btn btn-outline">Get Quote</Link>
                        </div>
                    </div>
                    <aside className="hotels-sidebar">
                        <h3 style={{ marginBottom: 'var(--space-4)' }}>Where to Stay</h3>
                        {hotels.length === 0 ? (
                            <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>No hotels listed yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {hotels.map(hotel => (
                                    <div key={hotel.id} className="hotel-card">
                                        <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{hotel.name}</h4>
                                        <div style={{ color: '#f59e0b', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{'★'.repeat(hotel.star_rating || 4)}</div>
                                        <div style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                                            {formatPrice(hotel.price_per_night)} <span style={{ fontWeight: 400, color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>/ night</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            <Lightbox 
                gallery={gallery} 
                lightboxOpen={lightboxOpen} 
                lightboxIndex={lightboxIndex}
                closeLightbox={closeLightbox}
                prevImage={() => setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                nextImage={() => setLightboxIndex((prev) => (prev + 1) % gallery.length)}
            />

            <style>{`
                .hero-badge { display: inline-block; padding: var(--space-2) var(--space-4); background: rgba(255,255,255,0.2); border-radius: var(--radius-full); font-size: var(--text-sm); margin-bottom: var(--space-4); backdrop-filter: blur(10px); color: white; }
                .intro-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-12); align-items: center; }
                .hotels-grid { display: grid; grid-template-columns: 1fr 350px; gap: var(--space-8); }
                .hotels-sidebar { background: white; padding: var(--space-6); border-radius: var(--radius-2xl); box-shadow: var(--shadow-lg); height: fit-content; }
                .hotel-card { padding: var(--space-4); background: var(--slate-50); border-radius: var(--radius-lg); }
                @media (max-width: 968px) {
                    .intro-grid, .hotels-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default DestinationDetail;
