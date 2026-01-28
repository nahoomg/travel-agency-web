const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

// Get all inquiries (admin)
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const inquiries = db.prepare(`
            SELECT * FROM inquiries ORDER BY created_at DESC
        `).all();

        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single inquiry
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create inquiry (contact form submission)
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { first_name, last_name, email, phone, subject, message, rating } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !message) {
            return res.status(400).json({ error: 'First name, last name, email, and message are required' });
        }

        const result = db.prepare(`
            INSERT INTO inquiries (first_name, last_name, email, phone, subject, message, rating)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(first_name, last_name, email, phone || null, subject || null, message, rating || null);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Inquiry submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update inquiry status (admin)
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { status } = req.body;

        db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);

        res.json({ message: 'Inquiry updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete inquiry (admin)
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
