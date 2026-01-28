import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTABanner = () => (
    <section className="cta-section">
        <div className="container">
            <div className="cta-content">
                <h2>Ready to Explore Ethiopia?</h2>
                <p>Start planning your adventure today. Let us create memories that last a lifetime.</p>
                <div className="cta-buttons">
                    <Link to="/packages" className="btn btn-primary btn-lg">
                        View Packages <ArrowRight size={20} />
                    </Link>
                    <Link to="/contact" className="btn btn-outline btn-lg">Get in Touch</Link>
                </div>
            </div>
        </div>
        <style>{`
            .cta-section { padding: var(--space-20) 0; background: linear-gradient(135deg, var(--primary-600), var(--primary-800)); color: white; text-align: center; }
            .cta-content h2 { font-size: var(--text-4xl); font-family: var(--font-display); margin-bottom: var(--space-4); color: white; }
            .cta-content p { font-size: var(--text-lg); opacity: 0.9; max-width: 500px; margin: 0 auto var(--space-8); color: white; }
            .cta-buttons { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; }
            .cta-buttons .btn-primary { background: white; color: var(--primary-700); }
            .cta-buttons .btn-primary:hover { background: var(--slate-100); transform: translateY(-2px); }
            .cta-buttons .btn-outline { border: 2px solid white; color: white; }
            .cta-buttons .btn-outline:hover { background: rgba(255,255,255,0.1); }
        `}</style>
    </section>
);

export default CTABanner;
