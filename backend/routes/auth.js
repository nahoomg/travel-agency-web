const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getDb, hashPassword, verifyPassword } = require('../database');

// Generate session token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Middleware to verify token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const db = getDb();
    const session = db.prepare(`
        SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.role
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
    `).get(token);

    if (!session) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = {
        id: session.user_id,
        email: session.email,
        firstName: session.first_name,
        lastName: session.last_name,
        role: session.role
    };

    next();
}

// Admin check middleware
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// Register new user
router.post('/register', (req, res) => {
    try {
        const db = getDb();
        const { email, password, firstName, lastName, phone } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if email already exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const { salt, hash } = hashPassword(password);

        // Create user
        const result = db.prepare(`
            INSERT INTO users (email, password_hash, password_salt, first_name, last_name, phone)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(email, hash, salt, firstName, lastName, phone || null);

        // Create session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

        db.prepare(`
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (?, ?, ?)
        `).run(result.lastInsertRowid, token, expiresAt);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: result.lastInsertRowid,
                email,
                firstName,
                lastName,
                role: 'user'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new admin (Protected)
router.post('/register-admin', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const { email, password, firstName, lastName, phone } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const { salt, hash } = hashPassword(password);

        db.prepare(`
            INSERT INTO users (email, password_hash, password_salt, first_name, last_name, phone, role)
            VALUES (?, ?, ?, ?, ?, ?, 'admin')
        `).run(email, hash, salt, firstName, lastName, phone || null);

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', (req, res) => {
    try {
        const db = getDb();
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        if (!verifyPassword(password, user.password_hash, user.password_salt)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        db.prepare(`
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (?, ?, ?)
        `).run(user.id, token, expiresAt);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const token = req.headers.authorization?.replace('Bearer ', '');
        db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all admins (Protected)
router.get('/admins', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const admins = db.prepare(`
            SELECT id, email, first_name, last_name, phone, created_at 
            FROM users WHERE role = 'admin'
        `).all();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const user = db.prepare(`
            SELECT id, email, first_name, last_name, phone, role, profile_image, created_at
            FROM users WHERE id = ?
        `).get(req.user.id);

        res.json({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            role: user.role,
            profileImage: user.profile_image,
            createdAt: user.created_at
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/me', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const { firstName, lastName, phone } = req.body;

        db.prepare(`
            UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(firstName, lastName, phone, req.user.id);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change password
router.put('/password', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        // Get current user
        const user = db.prepare('SELECT password_hash, password_salt FROM users WHERE id = ?').get(req.user.id);

        // Verify current password
        if (!verifyPassword(currentPassword, user.password_hash, user.password_salt)) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const { salt, hash } = hashPassword(newPassword);

        db.prepare(`
            UPDATE users SET password_hash = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(hash, salt, req.user.id);

        // Invalidate all other sessions
        db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(
            req.user.id,
            req.headers.authorization?.replace('Bearer ', '')
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's bookings
router.get('/bookings', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const bookings = db.prepare(`
            SELECT 
                b.id,
                b.booking_reference as reference,
                b.travel_date as booking_date,
                b.num_travelers as travelers,
                b.total_price,
                b.status,
                b.created_at,
                b.notes,
                d.name as destination_name, 
                p.name as package_name, 
                h.name as hotel_name
            FROM bookings b
            LEFT JOIN destinations d ON b.destination_id = d.id
            LEFT JOIN tour_packages p ON b.package_id = p.id
            LEFT JOIN hotels h ON b.hotel_id = h.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `).all(req.user.id);

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's favorites
router.get('/favorites', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const favorites = db.prepare(`
            SELECT d.* FROM user_favorites uf
            JOIN destinations d ON uf.destination_id = d.id
            WHERE uf.user_id = ?
            ORDER BY uf.created_at DESC
        `).all(req.user.id);

        res.json(favorites.map(d => ({
            ...d,
            highlights: d.highlights ? JSON.parse(d.highlights) : []
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add favorite
router.post('/favorites/:destId', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        db.prepare(`
            INSERT OR IGNORE INTO user_favorites (user_id, destination_id)
            VALUES (?, ?)
        `).run(req.user.id, req.params.destId);

        res.json({ message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove favorite
router.delete('/favorites/:destId', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        db.prepare('DELETE FROM user_favorites WHERE user_id = ? AND destination_id = ?').run(
            req.user.id, req.params.destId
        );
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users (Admin only)
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const users = db.prepare(`
            SELECT id, email, first_name, last_name, phone, role, created_at
            FROM users
            ORDER BY created_at DESC
        `).all();

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user (Admin only)
router.delete('/users/:userId', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const userId = parseInt(req.params.userId);

        // Validate userId
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Don't allow deleting admin users
        const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }

        // Delete user's related data first, then the user
        // Delete user's sessions first
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
        
        // Delete user's bookings
        db.prepare('DELETE FROM bookings WHERE user_id = ?').run(userId);
        
        // Delete user's inquiries
        db.prepare('DELETE FROM inquiries WHERE user_id = ?').run(userId);
        
        // Delete user's favorites
        db.prepare('DELETE FROM user_favorites WHERE user_id = ?').run(userId);
        
        // Delete the user
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get revenue data (Admin only)
router.get('/revenue', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        
        // Get total revenue
        const totalRevenue = db.prepare(`
            SELECT COALESCE(SUM(total_price), 0) as total
            FROM bookings
            WHERE status = 'confirmed'
        `).get();

        // Get revenue by user
        const userRevenue = db.prepare(`
            SELECT user_id, COALESCE(SUM(total_price), 0) as revenue
            FROM bookings
            WHERE status = 'confirmed'
            GROUP BY user_id
        `).all();

        // Convert to object format
        const userStats = {};
        userRevenue.forEach(row => {
            userStats[row.user_id] = row.revenue;
        });

        res.json({
            total: totalRevenue.total,
            userStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export middleware for use in other routes
router.authenticateToken = authenticateToken;
router.requireAdmin = requireAdmin;

module.exports = router;
module.exports.authenticateToken = authenticateToken;
module.exports.requireAdmin = requireAdmin;
