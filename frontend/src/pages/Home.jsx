import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import ServicesSection from '../components/home/ServicesSection';
import DestinationsPreview from '../components/home/DestinationsPreview';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTABanner from '../components/home/CTABanner';

/**
 * Home Page Component
 * 
 * The landing page for the Ethiopia Travel Agency.
 * Composed of multiple section components for maintainability.
 * 
 * Components:
 * - HeroSection: Main banner with title and CTA buttons
 * - StatsBar: Company statistics display
 * - ServicesSection: Why travel with us features
 * - DestinationsPreview: Featured destinations grid
 * - TestimonialsSection: Customer reviews
 * - CTABanner: Final call-to-action
 */
const Home = () => {
    return (
        <div className="home-page">
            <HeroSection />
            <StatsBar />
            <ServicesSection />
            <DestinationsPreview />
            <TestimonialsSection />
            <CTABanner />
            
            <style>{`
                .home-page {
                    min-height: 100vh;
                }
                
                /* Shared section header styles */
                .section-header {
                    text-align: center;
                    margin-bottom: var(--space-12);
                }
                
                .section-header .badge {
                    display: inline-block;
                    background: var(--primary-100);
                    color: var(--primary-700);
                    padding: var(--space-2) var(--space-4);
                    border-radius: 50px;
                    font-size: var(--text-sm);
                    font-weight: 600;
                    margin-bottom: var(--space-4);
                }
                
                .section-header h2 {
                    font-size: var(--text-4xl);
                    font-family: var(--font-display);
                    margin-bottom: var(--space-3);
                }
                
                .section-header p {
                    color: var(--slate-500);
                    max-width: 500px;
                    margin: 0 auto;
                }
            `}</style>
        </div>
    );
};

export default Home;
