import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Calendar } from '../Icon';
import { formatPrice } from '../../api';

const PackagesSection = ({ packages, destination, slug, getImageUrl }) => {
    return (
        <section style={{ background: 'white', padding: 'var(--space-10) 0' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Available Tour Packages</h2>
                <p style={{ textAlign: 'center', color: 'var(--slate-500)', marginBottom: 'var(--space-6)' }}>
                    Choose from our curated experiences
                </p>

                {packages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--slate-500)' }}>
                        <p>No packages available for this destination yet. Contact us for custom tours.</p>
                        <Link to="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Contact Us</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                        {packages.map(pkg => (
                            <div key={pkg.id} className="package-row" style={{
                                display: 'grid',
                                gridTemplateColumns: '200px 1fr auto',
                                gap: 'var(--space-6)',
                                background: 'var(--slate-50)',
                                padding: 'var(--space-6)',
                                borderRadius: 'var(--radius-2xl)',
                                alignItems: 'center'
                            }}>
                                <div style={{ width: '200px', height: '150px', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                                    <img src={getImageUrl(pkg.image_url || destination.image_url)} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: 'var(--space-2)' }}>{pkg.name}</h3>
                                    <p style={{ color: 'var(--slate-600)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>{pkg.description}</p>
                                    <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>
                                        <span><Clock size={14} style={{ marginRight: '4px' }} />{pkg.duration_days} Days</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--primary-700)', marginBottom: 'var(--space-3)' }}>
                                        {formatPrice(pkg.price)}
                                    </div>
                                    <Link to={`/book/${pkg.id}`} className="btn btn-primary">Book Now <ArrowRight size={16} /></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Booking Option */}
                <div style={{
                    marginTop: 'var(--space-8)',
                    padding: 'var(--space-8)',
                    background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                    borderRadius: 'var(--radius-2xl)',
                    textAlign: 'center',
                    border: '2px dashed var(--primary-300)'
                }}>
                    <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--primary-800)' }}>Want a Personalized Experience?</h3>
                    <p style={{ color: 'var(--primary-700)', marginBottom: 'var(--space-4)', maxWidth: '500px', margin: '0 auto var(--space-4)' }}>
                        Create your own custom trip to {destination.name}. Choose your dates, accommodation, and services.
                    </p>
                    <Link to={`/custom-book/${slug}`} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
                        <Calendar size={18} /> Book Custom Trip
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PackagesSection;
