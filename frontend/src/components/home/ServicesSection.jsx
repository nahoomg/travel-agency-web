import React from 'react';

const services = [
    { icon: '🏨', title: 'Hotel Booking', desc: 'Choose from top-rated hotels with flexible and refundable bookings managed by our support team.' },
    { icon: '🧭', title: 'Tour Guide', desc: 'Travel confidently with our knowledgeable local guides who ensure you explore every destination deeply.' },
    { icon: '🚗', title: 'Car Rental', desc: 'Rent safe, comfortable cars with trusted drivers and enjoy a seamless travel experience.' }
];

const ServicesSection = () => (
    <section className="services-section" id="services">
        <div className="container">
            <div className="services-header">
                <h2>Our Services</h2>
                <p>We offer trusted and convenient travel-related services to make your journey smooth and unforgettable.</p>
            </div>
            <div className="services-grid">
                {services.map((s, i) => (
                    <div key={i} className="service-box">
                        <span className="service-icon">{s.icon}</span>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
        <style>{`
            .services-section { padding: var(--space-20) 0; background: white; }
            .services-header { text-align: center; margin-bottom: var(--space-12); }
            .services-header h2 { font-size: 2rem; margin-bottom: var(--space-3); color: var(--slate-800); }
            .services-header p { color: var(--slate-600); max-width: 600px; margin: 0 auto; line-height: 1.6; }
            .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-8); }
            .service-box { background: var(--slate-50); padding: var(--space-8); border-radius: var(--radius-2xl); text-align: center; transition: transform 0.3s, box-shadow 0.3s; }
            .service-box:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .service-icon { font-size: 3.5rem; display: block; margin-bottom: var(--space-4); }
            .service-box h3 { font-size: 1.25rem; margin-bottom: var(--space-3); color: var(--slate-800); }
            .service-box p { color: var(--slate-600); line-height: 1.6; font-size: 0.95rem; }
        `}</style>
    </section>
);

export default ServicesSection;
