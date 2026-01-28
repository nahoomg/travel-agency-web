const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { v4: uuidv4 } = require('uuid');

// Generate booking reference
function generateBookingRef() {
    const prefix = 'ETH';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// Import auth middleware
const authRouter = require('./auth');
const { authenticateToken } = authRouter;

// Optional auth middleware - extracts user if logged in but doesn't require it
function optionalAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        req.user = null;
        return next();
    }

    const db = getDb();
    const session = db.prepare(`
        SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.role
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
    `).get(token);

    if (session) {
        req.user = {
            id: session.user_id,
            email: session.email,
            firstName: session.first_name,
            lastName: session.last_name,
            role: session.role
        };
    } else {
        req.user = null;
    }

    next();
}

// Get all bookings (admin)
router.get('/', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const bookings = db.prepare(`
            SELECT b.*, 
                   d.name as destination_name,
                   p.name as package_name,
                   h.name as hotel_name,
                   g.name as guide_name
            FROM bookings b
            LEFT JOIN destinations d ON b.destination_id = d.id
            LEFT JOIN tour_packages p ON b.package_id = p.id
            LEFT JOIN hotels h ON b.hotel_id = h.id
            LEFT JOIN guides g ON b.guide_id = g.id
            ORDER BY b.created_at DESC
        `).all();

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single booking
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const booking = db.prepare(`
            SELECT b.*, 
                   d.name as destination_name,
                   p.name as package_name, p.price as package_price,
                   h.name as hotel_name, h.price_per_night as hotel_price,
                   g.name as guide_name, g.price_per_day as guide_price
            FROM bookings b
            LEFT JOIN destinations d ON b.destination_id = d.id
            LEFT JOIN tour_packages p ON b.package_id = p.id
            LEFT JOIN hotels h ON b.hotel_id = h.id
            LEFT JOIN guides g ON b.guide_id = g.id
            WHERE b.id = ? OR b.booking_reference = ?
        `).get(req.params.id, req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        booking.additional_services = booking.additional_services ? JSON.parse(booking.additional_services) : [];

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create booking - now includes user_id if authenticated
router.post('/', optionalAuth, (req, res) => {
    try {
        const db = getDb();
        const {
            destination_id,
            package_id,
            hotel_id,
            guide_id,
            full_name,
            email,
            phone,
            travel_date,
            end_date,
            num_travelers,
            room_type,
            car_type,
            additional_services,
            total_price,
            notes
        } = req.body;

        // Validate required fields
        if (!full_name || !email) {
            return res.status(400).json({ error: 'Full name and email are required' });
        }

        const booking_reference = generateBookingRef();

        // Get user_id from authenticated user if available
        const user_id = req.user?.id || null;

        const result = db.prepare(`
            INSERT INTO bookings (
                booking_reference, user_id, destination_id, package_id, hotel_id, guide_id,
                full_name, email, phone, travel_date, end_date, num_travelers,
                room_type, car_type, additional_services, total_price, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            booking_reference,
            user_id,
            destination_id || null,
            package_id || null,
            hotel_id || null,
            guide_id || null,
            full_name,
            email,
            phone || null,
            travel_date || null,
            end_date || null,
            num_travelers || 1,
            room_type || null,
            car_type || null,
            JSON.stringify(additional_services || []),
            total_price || 0,
            notes || null
        );

        res.status(201).json({
            id: result.lastInsertRowid,
            booking_reference,
            message: 'Booking created successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update booking status (admin)
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { status, notes } = req.body;

        // Check if booking exists
        const booking = db.prepare('SELECT id FROM bookings WHERE id = ?').get(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Update only status if notes not provided
        if (notes !== undefined) {
            db.prepare(`
                UPDATE bookings SET status = ?, notes = ? WHERE id = ?
            `).run(status, notes, req.params.id);
        } else {
            db.prepare(`
                UPDATE bookings SET status = ? WHERE id = ?
            `).run(status, req.params.id);
        }

        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete booking (admin)
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
