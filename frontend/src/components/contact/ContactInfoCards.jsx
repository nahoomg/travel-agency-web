import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const contactInfo = [
    { icon: <Phone size={20} />, label: 'Phone', value: '+251 58 123 4567', subtext: 'Office: Mon-Fri 8am-6pm, Sat 9am-4pm' },
    { icon: <Phone size={20} />, label: 'Mobile', value: '+251 91 234 5678', subtext: 'Available 7 days a week' },
    { icon: <Mail size={20} />, label: 'Email', value: 'info@epsec.com', subtext: 'We reply within 24 hours' },
    { icon: <Mail size={20} />, label: 'Support', value: 'support@epsec.com', subtext: 'For booking assistance' },
    { icon: <MapPin size={20} />, label: 'Office', value: '123 Tourism Street, Bahir Dar', subtext: 'Postal Code: 1000' },
    { icon: <Clock size={20} />, label: 'Business Hours', value: 'Mon-Fri: 8:00 AM - 6:00 PM', subtext: 'Sat: 9:00 AM - 4:00 PM, Sun: Closed' }
];

const ContactInfoCards = () => (
    <div className="contact-cards-container">
        <div className="contact-cards">
            {contactInfo.map((info, i) => (
                <div key={i} className="contact-card">
                    <div className="card-icon">{info.icon}</div>
                    <div>
                        <div className="card-label">{info.label}</div>
                        <div className="card-value">{info.value}</div>
                        <div className="card-subtext">{info.subtext}</div>
                    </div>
                </div>
            ))}
        </div>
        <style>{`
            .contact-cards-container { margin-top: -60px; position: relative; z-index: 10; }
            .contact-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6); }
            .contact-card { background: white; padding: var(--space-6); border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl); display: flex; align-items: flex-start; gap: var(--space-4); }
            .card-icon { width: 48px; height: 48px; background: var(--primary-50); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: var(--primary-600); flex-shrink: 0; }
            .card-label { font-size: var(--text-sm); color: var(--slate-500); margin-bottom: var(--space-1); }
            .card-value { font-weight: 600; color: var(--slate-800); margin-bottom: var(--space-1); }
            .card-subtext { font-size: var(--text-sm); color: var(--slate-400); }
        `}</style>
    </div>
);

export default ContactInfoCards;
