import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';
import DestinationCard from '../components/DestinationCard';
import { Search, Filter } from 'lucide-react';

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const location = useLocation();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await api.getDestinations();
                setDestinations(data);
            } catch (error) {
                console.error("Failed to load destinations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    // Extract unique categories
    const categories = ['All', ...new Set(destinations.map(d => d.category).filter(Boolean))];

    const filteredDestinations = destinations.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ background: 'var(--slate-50)', minHeight: '100vh' }}>
            {/* Hero Header with Background Image */}
            <div style={{
                background: `linear-gradient(rgba(6, 49, 49, 0.85), rgba(17, 112, 112, 0.8)), url('/assets/hero.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 'var(--space-16) 0 var(--space-10)',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative' }}>
                    <h1 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-4xl)' }}>Explore Ethiopia</h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-lg)', maxWidth: '500px', margin: '0 auto' }}>
                        Discover ancient wonders and vibrant cultures
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-12)' }}>
                {/* Search & Filter Bar */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-6)',
                    marginBottom: 'var(--space-8)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 'var(--space-4)'
                    }}>
                        {/* Search */}
                        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                            <Search size={18} style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--slate-400)'
                            }} />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    paddingLeft: '48px',
                                    background: 'white',
                                    boxShadow: 'var(--shadow-sm)',
                                    border: '1px solid var(--slate-200)'
                                }}
                            />
                        </div>

                        {/* Category Filters */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: 'var(--space-2) var(--space-4)',
                                        borderRadius: 'var(--radius-full)',
                                        border: '1px solid',
                                        borderColor: selectedCategory === cat ? 'var(--primary-600)' : 'var(--slate-200)',
                                        background: selectedCategory === cat ? 'var(--primary-600)' : 'white',
                                        color: selectedCategory === cat ? 'white' : 'var(--slate-600)',
                                        fontWeight: 500,
                                        fontSize: 'var(--text-sm)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: selectedCategory === cat ? 'var(--shadow-md)' : 'none'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>
                        Showing {filteredDestinations.length} destinations
                    </div>
                </div>

                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                        gap: 'var(--space-6)'
                    }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{ height: '420px', borderRadius: 'var(--radius-2xl)' }} />
                        ))}
                    </div>
                ) : filteredDestinations.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-16)',
                        background: 'white',
                        borderRadius: 'var(--radius-2xl)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🔍</div>
                        <h3>No Destinations Found</h3>
                        <p style={{ color: 'var(--slate-500)' }}>
                            {searchTerm
                                ? `No results for "${searchTerm}" in ${selectedCategory}`
                                : `No destinations found in ${selectedCategory}`}
                        </p>
                        <button
                            className="btn btn-outline"
                            style={{ marginTop: 'var(--space-4)' }}
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="destinations-grid">
                        {filteredDestinations.map(dest => (
                            <DestinationCard key={dest.id} destination={dest} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Destinations;
