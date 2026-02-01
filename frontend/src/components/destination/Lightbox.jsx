import React from 'react';
import { X, ChevronLeft, ChevronRight } from '../Icon';

const Lightbox = ({ gallery, lightboxOpen, lightboxIndex, closeLightbox, prevImage, nextImage }) => {
    if (!lightboxOpen || !gallery || gallery.length === 0) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onClick={closeLightbox}
        >
            {/* Close Button */}
            <button
                onClick={closeLightbox}
                className="lightbox-btn"
                style={{ position: 'absolute', top: '20px', right: '20px' }}
            >
                <X size={28} />
            </button>

            {/* Previous Button */}
            <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="lightbox-btn"
                style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}
            >
                <ChevronLeft size={32} />
            </button>

            {/* Image Container */}
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <img
                    src={gallery[lightboxIndex].image}
                    alt={gallery[lightboxIndex].title}
                    style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }}
                />
                <div style={{ color: 'white', marginTop: 'var(--space-4)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>{gallery[lightboxIndex].title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)' }}>
                        {lightboxIndex + 1} of {gallery.length}
                    </p>
                </div>
            </div>

            {/* Next Button */}
            <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="lightbox-btn"
                style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}
            >
                <ChevronRight size={32} />
            </button>

            <style>{`
                .lightbox-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                }
                .lightbox-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
};

export default Lightbox;
