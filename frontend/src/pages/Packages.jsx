import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { Clock, Users, MapPin, ArrowRight, Star } from '../components/Icon';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDest, setSelectedDest] = useState('all');

    // Helper to ensure image URLs have leading slash and encode spaces
    const getImageUrl = (url) => {
        if (!url) return '';
        const path = url.startsWith('/') ? url : `/${url}`;
        // Replace spaces with %20 for CSS url() compatibility
        return path.replace(/ /g, '%20');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pkgData, destData] = await Promise.all([
                    api.getPackages(),
                    api.getDestinations()
                ]);
                setPackages(pkgData);
                setDestinations(destData);
            } catch (error) {
                console.error("Failed to load packages", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPackages = selectedDest === 'all'
        ? packages
        : packages.filter(p => p.destination_id === parseInt(selectedDest));

    return (
        <div style={{ background: 'var(--slate-50)', minHeight: '100vh' }}>
            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
                padding: 'var(--space-12) 0 var(--space-12)',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ marginBottom: 'var(--space-4)' }}>Tour Packages</h1>
                    <p style={{ color: 'white', fontSize: 'var(--text-xl)', maxWidth: '600px', margin: '0 auto' }}>
                        Choose from our carefully curated travel experiences
                    </p>
                </div>
            </div>

            <div className="container section" style={{ paddingTop: 'var(--space-8)' }}>
                {/* Filter Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-8)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)'
                }}>
                    <div>
                        <span style={{ color: 'var(--slate-500)', marginRight: 'var(--space-3)' }}>Filter by:</span>
                        <select
                            value={selectedDest}
                            onChange={e => setSelectedDest(e.target.value)}
                            style={{
                                padding: 'var(--space-2) var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid var(--slate-200)',
                                background: 'white',
                                fontSize: 'var(--text-base)',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Destinations</option>
                            {destinations.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <span style={{ color: 'var(--slate-500)' }}>
                        {filteredPackages.length} packages available
                    </span>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-2xl)' }} />
                        ))}
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-16)',
                        background: 'white',
                        borderRadius: 'var(--radius-2xl)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📦</div>
                        <h3>No Packages Found</h3>
                        <p style={{ color: 'var(--slate-500)' }}>Try selecting a different destination</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
                        {filteredPackages.map(pkg => {
                            const dest = destinations.find(d => d.id === pkg.destination_id);
                            return (
                                <div key={pkg.id} style={{
                                    background: 'white',
                                    borderRadius: 'var(--radius-2xl)',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-lg)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    }}
                                >
                                    {/* Image */}
                                    <div style={{
                                        height: '200px',
                                        background: pkg.image_url
                                            ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${getImageUrl(pkg.image_url)})`
                                            : dest?.image_url
                                            ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${getImageUrl(dest.image_url)})`
                                            : 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        padding: 'var(--space-4)'
                                    }}>
                                        <span style={{
                                            background: 'var(--accent-500)',
                                            color: 'var(--slate-900)',
                                            padding: 'var(--space-1) var(--space-3)',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {pkg.duration_days} Days
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: 'var(--space-6)' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            marginBottom: 'var(--space-2)',
                                            color: 'var(--slate-500)',
                                            fontSize: 'var(--text-sm)'
                                        }}>
                                            <MapPin size={14} />
                                            {dest?.name || 'Ethiopia'}
                                        </div>

                                        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>
                                            {pkg.name}
                                        </h3>

                                        <p style={{
                                            color: 'var(--slate-500)',
                                            fontSize: 'var(--text-sm)',
                                            marginBottom: 'var(--space-4)',
                                            lineHeight: 1.6
                                        }}>
                                            {pkg.description?.substring(0, 120)}...
                                        </p>

                                        {/* Features */}
                                        <div style={{
                                            display: 'flex',
                                            gap: 'var(--space-4)',
                                            marginBottom: 'var(--space-5)',
                                            color: 'var(--slate-600)',
                                            fontSize: 'var(--text-sm)'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                                <Clock size={14} /> {pkg.duration_days} Days
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                                <Users size={14} /> Small Group
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                                <Star size={14} fill="var(--accent-500)" color="var(--accent-500)" /> 4.9
                                            </span>
                                        </div>

                                        {/* Footer */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: 'var(--space-4)',
                                            borderTop: '1px solid var(--slate-100)'
                                        }}>
                                            <div>
                                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>From</span>
                                                <div style={{
                                                    fontSize: 'var(--text-2xl)',
                                                    fontWeight: 700,
                                                    color: 'var(--primary-700)'
                                                }}>
                                                    {formatPrice(pkg.price)}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <Link
                                                    to={`/book/${pkg.id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    Book Now
                                                </Link>
                                                <Link
                                                    to={`/destinations/${dest?.slug || ''}`}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packages;
