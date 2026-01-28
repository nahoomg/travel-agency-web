const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

// Get all packages
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const packages = db.prepare(`
            SELECT p.*, d.name as destination_name, d.slug as destination_slug
            FROM tour_packages p
            LEFT JOIN destinations d ON p.destination_id = d.id
            ORDER BY p.featured DESC, p.name ASC
        `).all();

        const parsed = packages.map(p => ({
            ...p,
            includes: p.includes ? JSON.parse(p.includes) : []
        }));

        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single package
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const pkg = db.prepare(`
            SELECT p.*, d.name as destination_name, d.slug as destination_slug
            FROM tour_packages p
            LEFT JOIN destinations d ON p.destination_id = d.id
            WHERE p.id = ?
        `).get(req.params.id);

        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }

        pkg.includes = pkg.includes ? JSON.parse(pkg.includes) : [];
        pkg.itinerary = pkg.itinerary ? JSON.parse(pkg.itinerary) : [];

        res.json(pkg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create package (admin)
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { destination_id, name, description, duration_days, price, includes, itinerary, max_group_size, image_url, featured } = req.body;

        const result = db.prepare(`
            INSERT INTO tour_packages (destination_id, name, description, duration_days, price, includes, itinerary, max_group_size, image_url, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(destination_id, name, description, duration_days, price, JSON.stringify(includes || []), JSON.stringify(itinerary || []), max_group_size || 10, image_url, featured ? 1 : 0);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Package created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update package (admin)
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { destination_id, name, description, duration_days, price, includes, itinerary, max_group_size, image_url, featured } = req.body;

        db.prepare(`
            UPDATE tour_packages 
            SET destination_id = ?, name = ?, description = ?, duration_days = ?, price = ?, 
                includes = ?, itinerary = ?, max_group_size = ?, image_url = ?, featured = ?
            WHERE id = ?
        `).run(destination_id, name, description, duration_days, price, JSON.stringify(includes || []), JSON.stringify(itinerary || []), max_group_size || 10, image_url, featured ? 1 : 0, req.params.id);

        res.json({ message: 'Package updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete package (admin)
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        db.prepare('DELETE FROM tour_packages WHERE id = ?').run(req.params.id);
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
