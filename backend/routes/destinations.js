const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

// Get all destinations
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const destinations = db.prepare(`
            SELECT id, name, slug, tagline, description, category, image_url, highlights, best_time_to_visit, featured
            FROM destinations
            ORDER BY featured DESC, name ASC
        `).all();

        // Parse JSON fields
        const parsed = destinations.map(d => ({
            ...d,
            highlights: d.highlights ? JSON.parse(d.highlights) : []
        }));

        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single destination by slug
router.get('/:slug', (req, res) => {
    try {
        const db = getDb();
        const destination = db.prepare(`
            SELECT * FROM destinations WHERE slug = ?
        `).get(req.params.slug);

        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        // Parse JSON fields
        destination.highlights = destination.highlights ? JSON.parse(destination.highlights) : [];
        destination.gallery_images = destination.gallery_images ? JSON.parse(destination.gallery_images) : [];

        // Get associated hotels
        const hotels = db.prepare(`
            SELECT * FROM hotels WHERE destination_id = ?
        `).all(destination.id);

        destination.hotels = hotels.map(h => ({
            ...h,
            amenities: h.amenities ? JSON.parse(h.amenities) : []
        }));

        // Get associated packages
        const packages = db.prepare(`
            SELECT * FROM tour_packages WHERE destination_id = ?
        `).all(destination.id);

        destination.packages = packages.map(p => ({
            ...p,
            includes: p.includes ? JSON.parse(p.includes) : []
        }));

        res.json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create destination (admin)
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { name, slug, tagline, description, image_url, highlights, best_time_to_visit, featured } = req.body;

        const result = db.prepare(`
            INSERT INTO destinations (name, slug, tagline, description, image_url, highlights, best_time_to_visit, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(name, slug, tagline, description, image_url, JSON.stringify(highlights || []), best_time_to_visit, featured ? 1 : 0);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Destination created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update destination (admin)
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { name, slug, tagline, description, image_url, highlights, best_time_to_visit, featured } = req.body;

        db.prepare(`
            UPDATE destinations 
            SET name = ?, slug = ?, tagline = ?, description = ?, image_url = ?, 
                highlights = ?, best_time_to_visit = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(name, slug, tagline, description, image_url, JSON.stringify(highlights || []), best_time_to_visit, featured ? 1 : 0, req.params.id);

        res.json({ message: 'Destination updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete destination (admin)
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        db.prepare('DELETE FROM destinations WHERE id = ?').run(req.params.id);
        res.json({ message: 'Destination deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
