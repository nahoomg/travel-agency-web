import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    { name: 'Hewan Adam', role: 'Travel Enthusiast', text: 'The trip was absolutely amazing! The team organized everything perfectly, making it an unforgettable experience. Highly recommended!', rating: 5, avatar: '👩' },
    { name: 'Ketema Hussen', role: 'Business Traveler', text: 'Professional service, easy transportation, and excellent support. My travel experience was smooth and enjoyable.', rating: 5, avatar: '👨' },
    { name: 'Alem Tesfalem', role: 'Adventure Seeker', text: 'Loved every moment! The destinations were breathtaking, and the guides were knowledgeable and friendly.', rating: 5, avatar: '🧑' }
];

const TestimonialsSection = () => (
    <section className="testimonials-section" id="testimonials">
        <div className="container">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="testimonials-grid">
                {testimonials.map((t, i) => (
                    <div key={i} className="testimonial-card">
                        <div className="profile-img">{t.avatar}</div>
                        <h3>{t.name}</h3>
                        <p className="role">{t.role}</p>
                        <p className="message">{t.text}</p>
                        <div className="stars">
                            {[...Array(t.rating)].map((_, j) => <span key={j}>★</span>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <style>{`
            .testimonials-section { padding: var(--space-20) 0; background: #f9fafb; }
            .section-title { text-align: center; font-size: 2rem; margin-bottom: var(--space-12); color: var(--slate-800); }
            .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-8); }
            .testimonial-card { background: white; padding: var(--space-8); border-radius: var(--radius-2xl); box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; transition: transform 0.3s; }
            .testimonial-card:hover { transform: translateY(-5px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
            .profile-img { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-500), var(--accent-500)); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto var(--space-4); }
            .testimonial-card h3 { font-size: 1.25rem; margin-bottom: var(--space-1); color: var(--slate-800); }
            .testimonial-card .role { font-size: 0.875rem; color: var(--primary-600); margin-bottom: var(--space-4); font-weight: 500; }
            .testimonial-card .message { color: var(--slate-600); line-height: 1.7; margin-bottom: var(--space-4); font-style: italic; }
            .stars { color: #fbbf24; font-size: 1.25rem; }
        `}</style>
    </section>
);

export default TestimonialsSection;
