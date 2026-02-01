import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from '../components/Icon';

const StaticPage = () => {
    const location = useLocation();

    // Determine content based on path
    let title = "Page Not Found";
    let content = <p>The page you are looking for does not exist.</p>;
    let emoji = "❓";

    if (location.pathname === '/about') {
        title = "About EPSEC";
        emoji = "🌍";
        content = (
            <div>
                <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>
                    Welcome to <strong>EPSEC — Ethiopian Premier Safari & Experience Company</strong>, your trusted partner
                    for unforgettable travel experiences in the Horn of Africa. Since our founding, we have been
                    dedicated to sharing the rich history, diverse culture, and stunning landscapes of Ethiopia with the world.
                </p>

                <h3>Our Mission</h3>
                <p>
                    To provide exceptional travel experiences that support local communities, promote sustainable tourism,
                    and create lasting memories for every traveler who explores Ethiopia with us.
                </p>

                <h3>Why Choose EPSEC?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                    {[
                        { icon: '🧭', title: 'Expert Local Guides', desc: 'Knowledgeable guides who bring history to life' },
                        { icon: '✨', title: 'Tailor-made Itineraries', desc: 'Custom trips designed for your interests' },
                        { icon: '📞', title: '24/7 Support', desc: 'Always available when you need us' },
                        { icon: '🎭', title: 'Authentic Experiences', desc: 'Real cultural immersion, not tourist traps' }
                    ].map((item, i) => (
                        <div key={i} style={{ background: 'var(--slate-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{item.icon}</div>
                            <h4 style={{ marginBottom: 'var(--space-1)' }}>{item.title}</h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', marginBottom: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <h3 style={{ marginTop: 'var(--space-8)' }}>Our Services</h3>
                <ul>
                    <li><strong>Hotel Booking</strong> — Choose from top-rated hotels with flexible bookings</li>
                    <li><strong>Tour Guides</strong> — Travel with knowledgeable local experts</li>
                    <li><strong>Car Rental</strong> — Safe, comfortable vehicles with trusted drivers</li>
                    <li><strong>Airport Meet & Greet</strong> — Personalized assistance upon arrival</li>
                    <li><strong>Travel Insurance</strong> — Full coverage for peace of mind</li>
                </ul>

                <div style={{ background: 'var(--primary-50)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', marginTop: 'var(--space-8)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>Contact Information</h4>
                    <p style={{ marginBottom: 'var(--space-1)' }}>📍 Addis Ababa, Ethiopia</p>
                    <p style={{ marginBottom: 'var(--space-1)' }}>📞 +251 929 480 450</p>
                    <p style={{ marginBottom: 0 }}>✉️ support@epsec.com</p>
                </div>
            </div>
        );
    } else if (location.pathname === '/faq') {
        title = "Frequently Asked Questions";
        emoji = "💡";
        content = (
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                {[
                    { q: "Is it safe to travel to Ethiopia?", a: "Yes, Ethiopia is generally safe for tourists. We constantly monitor safety situations and plan routes through secure areas. Our experienced guides ensure you have a worry-free experience." },
                    { q: "What is the best time to visit?", a: "The best time is usually from October to March when the weather is dry and sunny. September is also excellent after the rains when the landscape is lush and green." },
                    { q: "Do I need a visa?", a: "Most visitors require a visa. E-visas are available for many nationalities and can be obtained online before your trip. We can assist with the application process." },
                    { q: "What currency should I use?", a: "The local currency is the Ethiopian Birr (ETB). US Dollars are widely accepted for exchange at banks and hotels. Credit cards are accepted at major hotels and some restaurants in cities." },
                    { q: "What vaccinations do I need?", a: "Yellow fever vaccination is required if coming from an endemic area. We recommend consulting your doctor about hepatitis, typhoid, and malaria prophylaxis depending on your itinerary." },
                    { q: "What should I pack?", a: "Comfortable walking shoes, layers for varying temperatures, sunscreen, a hat, and modest clothing for visiting religious sites. Ethiopian highlands can be cool, so bring a light jacket." },
                    { q: "Is travel insurance mandatory?", a: "Yes, comprehensive travel insurance is mandatory for all our tours. It covers cancellations, delays, and medical emergencies." },
                    { q: "How do I book a tour?", a: "You can book directly through our website by selecting a package and completing the booking wizard. Our team will confirm your reservation within 24 hours." }
                ].map((item, i) => (
                    <div key={i} style={{ padding: 'var(--space-5)', background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                        <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--primary-700)' }}>{item.q}</h4>
                        <p style={{ color: 'var(--slate-600)', marginBottom: 0, lineHeight: 1.7 }}>{item.a}</p>
                    </div>
                ))}
            </div>
        );
    } else if (location.pathname === '/terms') {
        title = "Terms & Conditions";
        emoji = "📜";
        content = (
            <div>
                <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-6)' }}>
                    Last updated: January 2025. Please read these terms carefully before booking with EPSEC.
                </p>

                <h3>1. Booking & Payments</h3>
                <p>A 30% deposit is required to secure your booking. The remaining balance is due 30 days before your arrival date. We accept bank transfers, credit cards, and mobile payments.</p>

                <h3>2. Cancellations & Refunds</h3>
                <ul>
                    <li>More than 60 days before departure: Full refund minus 5% service fee</li>
                    <li>30-60 days before departure: 70% refund</li>
                    <li>15-30 days before departure: 50% refund</li>
                    <li>Less than 15 days: No refund</li>
                </ul>

                <h3>3. Travel Insurance</h3>
                <p>Comprehensive travel insurance is <strong>mandatory</strong> for all our tours. This must cover trip cancellation, medical expenses, and emergency evacuation. Proof of insurance is required before departure.</p>

                <h3>4. Health & Safety</h3>
                <p>Travelers are responsible for ensuring they have appropriate vaccinations and meet health requirements. We reserve the right to refuse participation to anyone who appears unfit for the activities planned.</p>

                <h3>5. Changes to Itinerary</h3>
                <p>While we strive to follow planned itineraries, changes may be necessary due to weather, road conditions, or other unforeseen circumstances. Alternative arrangements of similar quality will be provided.</p>

                <h3>6. Liability</h3>
                <p>EPSEC acts as an agent for hotels, airlines, and other service providers. We are not liable for any injury, damage, or loss caused by these third parties. Our liability is limited to the cost of your booking.</p>

                <h3>7. Privacy Policy</h3>
                <p>We collect personal information solely for booking purposes. Your data is securely stored and never shared with third parties except as necessary to fulfill your booking.</p>

                <div style={{ background: 'var(--warning-100)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-6)' }}>
                    <p style={{ marginBottom: 0, fontWeight: 500 }}>
                        By booking with EPSEC, you acknowledge that you have read, understood, and agree to these terms and conditions.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '80vh', background: 'var(--slate-50)', paddingBottom: 'var(--space-20)' }}>
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
                color: 'white',
                padding: 'var(--space-16) 0',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{emoji}</div>
                <h1>{title}</h1>
            </div>
            <div className="container section" style={{ maxWidth: '800px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <div style={{
                    background: 'white',
                    padding: 'var(--space-10)',
                    borderRadius: 'var(--radius-3xl)',
                    boxShadow: 'var(--shadow-xl)'
                }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'black', marginBottom: 'var(--space-6)' }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <div className="typography">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaticPage;
