import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from './Icon';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div>
                        <div className="footer-brand">EPSEC Travel</div>
                        <p className="footer-description">
                            Ethiopian Premier Safari & Experience Company — Your trusted partner for unforgettable
                            travel experiences. Discover the ancient wonders and rich heritage of Ethiopia.
                        </p>
                        <div className="footer-social" style={{ marginTop: '1.5rem' }}>
                            <a href="https://facebook.com/epsec" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
                            <a href="https://instagram.com/epsec" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
                            <a href="https://twitter.com/epsec" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={18} /></a>
                            <a href="https://youtube.com/epsec" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4>Explore</h4>
                        <ul className="footer-links">
                            <li><Link to="/destinations">All Destinations</Link></li>
                            <li><Link to="/packages">Tour Packages</Link></li>
                            <li><Link to="/destinations/lalibela">Lalibela</Link></li>
                            <li><Link to="/destinations/simien-mountains">Simien Mountains</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4>Contact Us</h4>
                        <ul className="footer-links">
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <MapPin size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
                                <span>Addis Ababa, Ethiopia</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Phone size={16} />
                                <a href="tel:+251929480450" style={{ color: 'inherit' }}>+251 929 480 450</a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Mail size={16} />
                                <a href="mailto:support@epsec.com" style={{ color: 'inherit' }}>support@epsec.com</a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Clock size={16} />
                                <span>Mon-Fri: 8AM-6PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>© {currentYear} EPSEC — Ethiopian Premier Safari & Experience Company. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                        <Link to="/terms" style={{ color: 'var(--slate-500)' }}>Privacy Policy</Link>
                        <Link to="/terms" style={{ color: 'var(--slate-500)' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
