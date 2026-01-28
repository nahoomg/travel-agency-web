import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/destinations', label: 'Destinations' },
        { path: '/packages', label: 'Packages' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link to="/" className="navbar-brand">
                    EPSEC Travel
                </Link>

                {/* Desktop Navigation */}
                <ul className={`navbar-nav ${isMobileOpen ? 'open' : ''}`}>
                    {/* Close button for mobile */}
                    <button
                        className="mobile-close"
                        onClick={() => setIsMobileOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: isMobileOpen ? 'block' : 'none'
                        }}
                    >
                        <X size={28} />
                    </button>

                    {navLinks.map(link => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={location.pathname === link.path ? 'active' : ''}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}

                    {/* Auth Section */}
                    {user ? (
                        <li style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: isScrolled ? 'var(--primary-50)' : 'rgba(255,255,255,0.15)',
                                    border: 'none',
                                    borderRadius: '999px',
                                    color: isScrolled ? 'var(--primary-700)' : 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: 500
                                }}
                            >
                                <User size={18} />
                                {user.firstName}
                                <ChevronDown size={16} style={{
                                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 0.2s ease'
                                }} />
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    background: 'white',
                                    borderRadius: '1rem',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                    padding: '0.5rem',
                                    minWidth: '180px',
                                    animation: 'fadeInDown 0.2s ease'
                                }}>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsDropdownOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            color: 'var(--slate-700)',
                                            borderRadius: '0.5rem',
                                            transition: 'background 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'var(--slate-50)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        <User size={18} /> My Profile
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsDropdownOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                color: 'var(--slate-700)',
                                                borderRadius: '0.5rem',
                                                transition: 'background 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--slate-50)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            ⚙️ Admin Panel
                                        </Link>
                                    )}
                                    <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--slate-100)' }} />
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            color: 'var(--error-500)',
                                            background: 'none',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            width: '100%',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            transition: 'background 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'var(--error-100)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <li>
                            <Link
                                to="/login"
                                style={{
                                    background: isScrolled ? 'var(--primary-600)' : 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '999px',
                                    fontWeight: 600,
                                    border: isScrolled ? 'none' : '1px solid rgba(255,255,255,0.3)'
                                }}
                            >
                                Sign In
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Mobile Toggle */}
                <button
                    className="navbar-toggle"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle navigation"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: -1
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar;
