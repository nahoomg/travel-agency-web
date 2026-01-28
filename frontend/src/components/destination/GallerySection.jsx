import React from 'react';

const GallerySection = ({ gallery, destination, openLightbox }) => {
    if (!gallery || gallery.length <= 1) return null;
    
    return (
        <section style={{ background: 'white', padding: 'var(--space-10) 0' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Visual Journey</h2>
                <p style={{ textAlign: 'center', color: 'var(--slate-500)', marginBottom: 'var(--space-6)' }}>
                    Explore the beauty of {destination.name} through our gallery
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                    {gallery.map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => openLightbox(i)}
                            className="gallery-item"
                            style={{
                                position: 'relative',
                                borderRadius: 'var(--radius-2xl)',
                                overflow: 'hidden',
                                aspectRatio: '4/3',
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: 'var(--space-4)',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                color: 'white'
                            }}>
                                <h4 style={{ marginBottom: 0, color: 'white' }}>{item.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
