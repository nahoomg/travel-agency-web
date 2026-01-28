import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const images = [
    '/assets/Lalibela-G6.avif',
    '/assets/Bahr_download (1).jpg',
    '/assets/Harra intro.jpg',
    '/assets/Axum-2160089328-612x612.jpg'
];

const HeroSection = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [nextImage, setNextImage] = useState(1);
    const [fadeState, setFadeState] = useState('show');

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeState('hide');
            setTimeout(() => {
                setCurrentImage((prev) => (prev + 1) % images.length);
                setNextImage((prev) => (prev + 1) % images.length);
                setFadeState('show');
            }, 1000);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero" id="home">
            <div className="hero-slides">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`hero-slide ${idx === currentImage ? 'active' : ''}`}
                        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${img}')` }}
                    />
                ))}
            </div>
            <div className="hero-banner">
                <div className="hero-text-container">
                    <div className="hero-text-box">
                        <h2 className="text-xx">Explore Ethiopia</h2>
                        <p className="text">Discover new places and experience unforgettable adventures with our travel agency.</p>
                        <Link className="btn btn-full" to="/destinations">Discover More</Link>
                    </div>
                </div>
            </div>
            <style>{`
                .hero { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; margin-top: -80px; padding-top: 80px; }
                .hero-slides { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                .hero-slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-position: center; background-size: cover; background-repeat: no-repeat; opacity: 0; transition: opacity 1.5s ease-in-out; }
                .hero-slide.active { opacity: 1; z-index: 1; }
                .hero-banner { position: relative; z-index: 2; width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                .hero-text-container { width: 100%; max-width: 1200px; padding: 0 var(--space-8); }
                .hero-text-box { text-align: center; color: white; }
                .text-xx { font-size: 4rem; font-weight: 700; margin-bottom: var(--space-4); color: white; text-shadow: 2px 2px 8px rgba(0,0,0,0.5); }
                .text { font-size: 1.25rem; margin: -10px auto var(--space-8); max-width: 600px; color: white; text-shadow: 1px 1px 4px rgba(0,0,0,0.5); }
                .btn-full { display: inline-block; padding: var(--space-4) var(--space-10); background: var(--primary-600); color: white; text-decoration: none; border-radius: var(--radius-lg); font-weight: 600; font-size: 1.125rem; transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .btn-full:hover { background: var(--primary-700); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
                @media (max-width: 768px) { .text-xx { font-size: 2.5rem; } .text { font-size: 1rem; } }
            `}</style>
        </section>
    );
};

export default HeroSection;
