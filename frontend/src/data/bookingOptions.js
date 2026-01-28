// Room types with images
export const roomTypes = [
    { id: 'single', name: 'Single Room', description: 'Perfect for solo travelers. One comfortable bed.', price: 8000, image: '/assets/hotel-1bd.jpg' },
    { id: 'double', name: 'Two-Bedroom Suite', description: 'Ideal for couples or families of four. Privacy and space.', price: 12000, image: '/assets/hotel-2bd.jpg' },
    { id: 'family', name: 'Family Suite (3+ Beds)', description: 'Our largest option, includes kitchen and living area.', price: 15000, image: '/assets/hotel-luxury.jpg' }
];

// Car rental options
export const carOptions = [
    { id: 'economy', name: 'Economy Car', description: 'Best for city parking and fuel efficiency.', price: 1000, image: '/assets/car-rent1.jpg' },
    { id: 'suv', name: 'Mid-size SUV', description: 'Comfort and space for luggage and passengers.', price: 1500, image: '/assets/car-rent2.jpeg' },
    { id: 'luxury', name: 'Luxury Sedan', description: 'Travel in style with premium features.', price: 2000, image: '/assets/car-rent3.webp' }
];

// Language options
export const languageOptions = ['English', 'Amharic', 'French', 'German', 'Arabic'];

// Additional services
export const additionalServices = [
    { id: 'insurance', name: 'Travel Insurance', description: 'Full coverage for cancellations, delays, and medical emergencies.', price: 500, mandatory: true },
    { id: 'sim', name: 'Local SIM Card', description: 'Pre-loaded data and calls for easy navigation.', price: 200, mandatory: false },
    { id: 'meetgreet', name: 'Airport Meet & Greet', description: 'Personalized assistance upon arrival and transfer to hotel.', price: 1500, mandatory: false }
];
