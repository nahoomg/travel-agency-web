// API Configuration
const API_BASE_URL = '/api';

// Helper for authenticated requests
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Allow component to handle redirection
        }
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
}

// API Client
export const api = {
    // Auth
    async login(email, password) {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async register(userData) {
        return request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async createAdmin(userData) {
        return request('/auth/register-admin', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async getProfile() {
        return request('/auth/me');
    },

    async updateProfile(getData) {
        return request('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(getData)
        });
    },

    async changePassword(passwordData) {
        return request('/auth/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    },

    // Destinations
    async getDestinations() {
        return request('/destinations');
    },

    async getDestination(slug) {
        return request(`/destinations/${slug}`);
    },

    // Packages
    async getPackages() {
        return request('/packages');
    },

    async getPackage(id) {
        return request(`/packages/${id}`);
    },

    // Hotels
    async getHotels() {
        return request('/hotels');
    },

    async getHotelsByDestination(destId) {
        return request(`/hotels/destination/${destId}`);
    },

    // Guides
    async getGuides() {
        return request('/guides');
    },

    // Testimonials
    async getTestimonials() {
        return request('/testimonials');
    },

    // Bookings
    async createBooking(bookingData) {
        return request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    },

    async getMyBookings() {
        return request('/auth/bookings');
    },

    async getAllBookings() {
        return request('/bookings');
    },

    async getBooking(reference) {
        return request(`/bookings/${reference}`);
    },

    // Admin: Get all bookings
    async getAllBookings() {
        return request('/bookings');
    },

    // Admin: Update booking status
    async updateBookingStatus(id, status) {
        return request(`/bookings/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    // Inquiries
    async submitInquiry(inquiryData) {
        return request('/inquiries', {
            method: 'POST',
            body: JSON.stringify(inquiryData)
        });
    },

    // Admin: Get all inquiries
    async getAllInquiries() {
        return request('/inquiries');
    },

    // Favorites
    async getFavorites() {
        return request('/auth/favorites');
    },

    async addFavorite(destId) {
        return request(`/auth/favorites/${destId}`, { method: 'POST' });
    },

    async removeFavorite(destId) {
        return request(`/auth/favorites/${destId}`, { method: 'DELETE' });
    },

    // Stats (admin)
    async getStats() {
        return request('/stats');
    },

    async getAdmins() {
        return request('/auth/admins');
    },

    // User Management (Admin only)
    async getAllUsers() {
        return request('/auth/users');
    },

    async deleteUser(userId) {
        return request(`/auth/users/${userId}`, {
            method: 'DELETE'
        });
    },

    async getUserRevenue() {
        return request('/auth/revenue');
    }
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ET', {
        style: 'decimal',
        minimumFractionDigits: 0
    }).format(price) + ' Birr';
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
