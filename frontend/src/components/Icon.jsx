/**
 * Icon Component - Replaces lucide-react with inline SVGs
 * This provides the same icons without external dependencies
 */

const icons = {
    // Navigation & UI
    Menu: (
        <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    X: (
        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    ChevronDown: (
        <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    ChevronLeft: (
        <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    ChevronRight: (
        <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    ArrowRight: (
        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    ArrowLeft: (
        <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),

    // User & Auth
    User: (
        <>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Users: (
        <>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    LogOut: (
        <>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Shield: (
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),

    // Location & Travel
    MapPin: (
        <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Globe: (
        <>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),

    // Time & Calendar
    Calendar: (
        <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Clock: (
        <>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),

    // Communication
    Mail: (
        <>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 6l-10 7L2 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Phone: (
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    MessageSquare: (
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    Send: (
        <>
            <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22l-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),

    // Status & Feedback
    Check: (
        <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    CheckCircle: (
        <>
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    AlertCircle: (
        <>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    AlertTriangle: (
        <>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 9v4M12 17h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Loader: (
        <>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    RefreshCw: (
        <>
            <path d="M23 4v6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 20v-6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),

    // Finance & Stats
    DollarSign: (
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    BarChart3: (
        <>
            <path d="M18 20V10M12 20V4M6 20v-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),

    // Social Media
    Instagram: (
        <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.5 6.5h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Facebook: (
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    Twitter: (
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    Youtube: (
        <>
            <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),

    // Additional Icons
    Search: (
        <>
            <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Filter: (
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    Lock: (
        <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Compass: (
        <>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Hotel: (
        <>
            <path d="M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Car: (
        <>
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6.5" cy="16.5" r="2.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16.5" cy="16.5" r="2.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Package: (
        <>
            <path d="M16.5 9.4l-9-5.19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Star: (
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    Quote: (
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    Info: (
        <>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Edit2: (
        <>
            <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Plus: (
        <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    Trash2: (
        <>
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    Loader2: (
        <path d="M21 12a9 9 0 11-6.219-8.56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    XCircle: (
        <>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    ArrowUpRight: (
        <path d="M7 17L17 7M7 7h10v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    ArrowDownRight: (
        <path d="M7 7l10 10M17 7v10H7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )
};

export function Icon({ name, size = 24, color = 'currentColor', className = '', ...props }) {
    const iconPath = icons[name];

    if (!iconPath) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            className={className}
            {...props}
        >
            {iconPath}
        </svg>
    );
}

// Named exports for backward compatibility with lucide-react imports
export const Menu = (props) => <Icon name="Menu" {...props} />;
export const X = (props) => <Icon name="X" {...props} />;
export const ChevronDown = (props) => <Icon name="ChevronDown" {...props} />;
export const ChevronLeft = (props) => <Icon name="ChevronLeft" {...props} />;
export const ChevronRight = (props) => <Icon name="ChevronRight" {...props} />;
export const ArrowRight = (props) => <Icon name="ArrowRight" {...props} />;
export const ArrowLeft = (props) => <Icon name="ArrowLeft" {...props} />;
export const User = (props) => <Icon name="User" {...props} />;
export const Users = (props) => <Icon name="Users" {...props} />;
export const LogOut = (props) => <Icon name="LogOut" {...props} />;
export const Shield = (props) => <Icon name="Shield" {...props} />;
export const MapPin = (props) => <Icon name="MapPin" {...props} />;
export const Globe = (props) => <Icon name="Globe" {...props} />;
export const Calendar = (props) => <Icon name="Calendar" {...props} />;
export const Clock = (props) => <Icon name="Clock" {...props} />;
export const Mail = (props) => <Icon name="Mail" {...props} />;
export const Phone = (props) => <Icon name="Phone" {...props} />;
export const MessageSquare = (props) => <Icon name="MessageSquare" {...props} />;
export const Send = (props) => <Icon name="Send" {...props} />;
export const Check = (props) => <Icon name="Check" {...props} />;
export const CheckCircle = (props) => <Icon name="CheckCircle" {...props} />;
export const AlertCircle = (props) => <Icon name="AlertCircle" {...props} />;
export const AlertTriangle = (props) => <Icon name="AlertTriangle" {...props} />;
export const Loader = (props) => <Icon name="Loader" {...props} />;
export const RefreshCw = (props) => <Icon name="RefreshCw" {...props} />;
export const DollarSign = (props) => <Icon name="DollarSign" {...props} />;
export const BarChart3 = (props) => <Icon name="BarChart3" {...props} />;
export const Instagram = (props) => <Icon name="Instagram" {...props} />;
export const Facebook = (props) => <Icon name="Facebook" {...props} />;
export const Twitter = (props) => <Icon name="Twitter" {...props} />;
export const Youtube = (props) => <Icon name="Youtube" {...props} />;
export const Search = (props) => <Icon name="Search" {...props} />;
export const Filter = (props) => <Icon name="Filter" {...props} />;
export const Lock = (props) => <Icon name="Lock" {...props} />;
export const Compass = (props) => <Icon name="Compass" {...props} />;
export const Hotel = (props) => <Icon name="Hotel" {...props} />;
export const Car = (props) => <Icon name="Car" {...props} />;
export const Package = (props) => <Icon name="Package" {...props} />;
export const Star = (props) => <Icon name="Star" {...props} />;
export const Quote = (props) => <Icon name="Quote" {...props} />;
export const Info = (props) => <Icon name="Info" {...props} />;
export const Edit2 = (props) => <Icon name="Edit2" {...props} />;
export const Plus = (props) => <Icon name="Plus" {...props} />;
export const Trash2 = (props) => <Icon name="Trash2" {...props} />;
export const Loader2 = (props) => <Icon name="Loader2" {...props} />;
export const XCircle = (props) => <Icon name="XCircle" {...props} />;
export const ArrowUpRight = (props) => <Icon name="ArrowUpRight" {...props} />;
export const ArrowDownRight = (props) => <Icon name="ArrowDownRight" {...props} />;

export default Icon;
