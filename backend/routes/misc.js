const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

// Get all hotels
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const hotels = db.prepare(`
            SELECT h.*, d.name as destination_name
            FROM hotels h
            LEFT JOIN destinations d ON h.destination_id = d.id
            ORDER BY h.star_rating DESC
        `).all();

        const parsed = hotels.map(h => ({
            ...h,
            amenities: h.amenities ? JSON.parse(h.amenities) : []
        }));

        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get hotels by destination
router.get('/destination/:destId', (req, res) => {
    try {
        const db = getDb();
        const hotels = db.prepare(`
            SELECT * FROM hotels WHERE destination_id = ?
        `).all(req.params.destId);

        const parsed = hotels.map(h => ({
            ...h,
            amenities: h.amenities ? JSON.parse(h.amenities) : []
        }));

        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all guides
router.get('/guides', (req, res) => {
    try {
        const db = getDb();
        const guides = db.prepare('SELECT * FROM guides ORDER BY experience_years DESC').all();

        const parsed = guides.map(g => ({
            ...g,
            languages: g.languages ? JSON.parse(g.languages) : [],
            specializations: g.specializations ? JSON.parse(g.specializations) : []
        }));

        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all testimonials
router.get('/testimonials', (req, res) => {
    try {
        const db = getDb();
        const testimonials = db.prepare(`
            SELECT * FROM testimonials WHERE featured = 1 ORDER BY created_at DESC
        `).all();

        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create testimonial (admin)
router.post('/testimonials', (req, res) => {
    try {
        const db = getDb();
        const { name, role, message, rating, image_url, featured } = req.body;

        const result = db.prepare(`
            INSERT INTO testimonials (name, role, message, rating, image_url, featured)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(name, role, message, rating || 5, image_url || null, featured ? 1 : 0);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Testimonial created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get stats (admin)
router.get('/stats', (req, res) => {
    try {
        const db = getDb();
        // Get basic stats
        const stats = {
            users: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = \'user\'').get().count,
            totalBookings: db.prepare('SELECT COUNT(*) as count FROM bookings').get().count,
            pendingBookings: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = \'pending\'').get().count,
            confirmedBookings: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = \'confirmed\'').get().count,
            newInquiries: db.prepare('SELECT COUNT(*) as count FROM inquiries WHERE status = \'new\'').get().count,
            destinations: db.prepare('SELECT COUNT(*) as count FROM destinations').get().count,
            packages: db.prepare('SELECT COUNT(*) as count FROM tour_packages').get().count,
            hotels: db.prepare('SELECT COUNT(*) as count FROM hotels').get().count,
            totalRevenue: db.prepare('SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = \'confirmed\'').get().total
        };

        // Get recent bookings
        const recentBookings = db.prepare(`
            SELECT b.*, 
                   d.name as destination_name,
                   p.name as package_name
            FROM bookings b
            LEFT JOIN destinations d ON b.destination_id = d.id
            LEFT JOIN tour_packages p ON b.package_id = p.id
            ORDER BY b.created_at DESC
            LIMIT 10
        `).all();

        stats.recentBookings = recentBookings.map(booking => ({
            ...booking,
            destination: booking.package_name || booking.destination_name || 'Custom'
        }));

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
