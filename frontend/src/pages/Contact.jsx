import React from 'react';
import ContactInfoCards from '../components/contact/ContactInfoCards';
import ContactForm from '../components/contact/ContactForm';

/**
 * Contact Page
 * 
 * Displays company contact information, an embedded map,
 * and a contact form for user inquiries.
 * 
 * Components:
 * - ContactInfoCards: Grid of contact details (phone, email, address)
 * - ContactForm: Inquiry submission form with success state
 */
const Contact = () => {
    return (
        <div className="contact-page">
            {/* Hero Header */}
            <div className="contact-hero">
                <div className="glow" />
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>Have questions? We'd love to help you plan your perfect Ethiopian adventure.</p>
                </div>
            </div>

            {/* Contact Cards */}
            <div className="container">
                <ContactInfoCards />
            </div>

            {/* Map Section */}
            <div className="container">
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126432.61066755606!2d38.718042459039396!3d9.009756195328221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1709400000000!5m2!1sen!2set"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="EPSEC Office Location"
                    />
                </div>
            </div>

            {/* Contact Form */}
            <div className="container">
                <ContactForm />
            </div>

            <style>{`
                .contact-hero { background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%); padding: var(--space-16) 0 var(--space-20); color: white; text-align: center; position: relative; overflow: hidden; }
                .contact-hero .glow { position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%; }
                .contact-hero h1 { margin-bottom: var(--space-4); position: relative; }
                .contact-hero p { color: white; font-size: var(--text-xl); max-width: 500px; margin: 0 auto; position: relative; }
                .map-container { margin-top: var(--space-12); border-radius: var(--radius-3xl); overflow: hidden; box-shadow: var(--shadow-xl); height: 400px; }
            `}</style>
        </div>
    );
};

export default Contact;
