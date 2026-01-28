import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { api } from '../../api';

// Helper to encode image URLs with special characters (spaces, parentheses, etc.)
const encodeImageUrl = (url) => {
    if (!url) return '/assets/Placeholders/default.jpg';
    const path = url.startsWith('/') ? url : `/${url}`;
    const parts = path.split('/');
    return parts.map((part, index) => 
        index === 0 ? part : encodeURIComponent(part)
    ).join('/');
};

const DestinationsPreview = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDestinations()
            .then(res => setDestinations(res.slice(0, 4)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <section className="destinations-preview"><div className="container"><p>Loading destinations...</p></div></section>;

    return (
        <section className="destinations-preview">
            <div className="container">
                <div className="section-header">
                    <span className="badge">Explore</span>
                    <h2>Popular Destinations</h2>
                    <p>Discover Ethiopia's most breathtaking locations</p>
                </div>
                <div className="destinations-grid">
                    {destinations.map(d => (
                        <Link key={d.id} to={`/destinations/${d.slug}`} className="destination-card">
                            <div className="card-image">
                                <img src={encodeImageUrl(d.image_url)} alt={d.name} loading="lazy" />
                                <div className="overlay" />
                            </div>
                            <div className="card-content">
                                <h3>{d.name}</h3>
                                <p>{d.tagline || d.description?.slice(0, 80)}...</p>
                                <span className="explore-btn">Explore Now</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="view-all">
                    <Link to="/destinations" className="btn btn-outline">
                        View All Destinations <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
            <style>{`
                .destinations-preview { padding: var(--space-20) 0; background: white; }
                .destinations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); margin-bottom: var(--space-10); max-width: 1200px; margin-left: auto; margin-right: auto; }
                @media (max-width: 1024px) { .destinations-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .destinations-grid { grid-template-columns: 1fr; } }
                .destination-card { border-radius: var(--radius-2xl); overflow: hidden; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s; text-decoration: none; color: inherit; display: block; }
                .destination-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
                .card-image { height: 240px; position: relative; overflow: hidden; }
                .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; display: block; }
                .destination-card:hover .card-image img { transform: scale(1.1); }
                .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); }
                .card-content { padding: var(--space-6); text-align: center; }
                .card-content h3 { font-size: 1.5rem; margin-bottom: var(--space-3); color: var(--slate-800); font-weight: 600; }
                .card-content p { color: var(--slate-600); font-size: var(--text-base); line-height: 1.6; margin-bottom: var(--space-4); }
                .explore-btn { display: inline-block; padding: var(--space-2) var(--space-6); background: var(--primary-600); color: white; border-radius: var(--radius-lg); font-weight: 500; transition: background 0.3s; }
                .destination-card:hover .explore-btn { background: var(--primary-700); }
                .view-all { text-align: center; }
            `}</style>
        </section>
    );
};

export default DestinationsPreview;
