import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../api';
import { MapPin, ArrowRight } from 'lucide-react';

// Helper to encode image URLs with special characters
const encodeImageUrl = (url) => {
    if (!url) return '';
    // Ensure leading slash
    let path = url.startsWith('/') ? url : `/${url}`;
    // Split path into segments and encode each part properly
    const parts = path.split('/');
    return parts.map((part, index) => 
        index === 0 ? part : encodeURIComponent(part)
    ).join('/');
};

const DestinationCard = ({ destination }) => {
    const imageUrl = encodeImageUrl(destination.image_url);
    
    return (
        <article className="destination-card">
            <div className="destination-card-image">
                <img
                    src={imageUrl}
                    alt={destination.name}
                    loading="lazy"
                />
                <div className="destination-card-overlay">
                    <span className="destination-card-tag">{destination.category || 'Popular'}</span>
                </div>
            </div>
            <div className="destination-card-content">
                <h3>{destination.name}</h3>
                <p>{destination.tagline || destination.description?.substring(0, 80)}...</p>
                <div className="destination-card-footer">
                    <span className="destination-price">
                        From {formatPrice(5000)} <span>/person</span>
                    </span>
                    <Link
                        to={`/destinations/${destination.slug}`}
                        className="btn btn-sm btn-dark"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        Explore <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default DestinationCard;
