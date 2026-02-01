const crypto = require('crypto');
const { getDb, hashPassword, verifyPassword } = require('../database');

// Generate session token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Helper to match routes
function matchRoute(pattern, pathname) {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');

    if (patternParts.length !== pathParts.length) {
        return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
            return null;
        }
    }

    return params;
}

// Authenticate token middleware
function authenticateToken(ctx) {
    const authHeader = ctx.req.headers.authorization;
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
        return { error: 'Authentication required', status: 401 };
    }

    const db = getDb();
    const session = db.prepare(`
        SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.role
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
    `).get(token);

    if (!session) {
        return { error: 'Invalid or expired token', status: 401 };
    }

    return {
        user: {
            id: session.user_id,
            email: session.email,
            firstName: session.first_name,
            lastName: session.last_name,
            role: session.role
        }
    };
}

// Main handler
async function authHandler(ctx) {
    const { method, pathname, body } = ctx;
    const basePath = '/api/auth';

    try {
        // POST /api/auth/register
        if (pathname === `${basePath}/register` && method === 'POST') {
            const db = getDb();
            const { email, password, firstName, lastName, phone } = body;

            if (!email || !password || !firstName || !lastName) {
                return ctx.sendError(400, 'Email, password, first name, and last name are required');
            }

            if (password.length < 6) {
                return ctx.sendError(400, 'Password must be at least 6 characters');
            }

            const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (existing) {
                return ctx.sendError(400, 'Email already registered');
            }

            const { salt, hash } = hashPassword(password);

            const result = db.prepare(`
                INSERT INTO users (email, password_hash, password_salt, first_name, last_name, phone)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(email, hash, salt, firstName, lastName, phone || null);

            const token = generateToken();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

            db.prepare(`
                INSERT INTO sessions (user_id, token, expires_at)
                VALUES (?, ?, ?)
            `).run(result.lastInsertRowid, token, expiresAt);

            return ctx.sendJson(201, {
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
        }

        // POST /api/auth/register-admin
        if (pathname === `${basePath}/register-admin` && method === 'POST') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);
            if (auth.user.role !== 'admin') return ctx.sendError(403, 'Admin access required');

            const db = getDb();
            const { email, password, firstName, lastName, phone } = body;

            if (!email || !password || !firstName || !lastName) {
                return ctx.sendError(400, 'All fields are required');
            }

            const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (existing) {
                return ctx.sendError(400, 'Email already registered');
            }

            const { salt, hash } = hashPassword(password);

            db.prepare(`
                INSERT INTO users (email, password_hash, password_salt, first_name, last_name, phone, role)
                VALUES (?, ?, ?, ?, ?, ?, 'admin')
            `).run(email, hash, salt, firstName, lastName, phone || null);

            return ctx.sendJson(201, { message: 'Admin created successfully' });
        }

        // POST /api/auth/login
        if (pathname === `${basePath}/login` && method === 'POST') {
            const db = getDb();
            const { email, password } = body;

            if (!email || !password) {
                return ctx.sendError(400, 'Email and password are required');
            }

            const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

            if (!user) {
                return ctx.sendError(401, 'Invalid email or password');
            }

            if (!verifyPassword(password, user.password_hash, user.password_salt)) {
                return ctx.sendError(401, 'Invalid email or password');
            }

            const token = generateToken();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

            db.prepare(`
                INSERT INTO sessions (user_id, token, expires_at)
                VALUES (?, ?, ?)
            `).run(user.id, token, expiresAt);

            return ctx.sendJson(200, {
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
        }

        // POST /api/auth/logout
        if (pathname === `${basePath}/logout` && method === 'POST') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

            const db = getDb();
            const token = ctx.req.headers.authorization?.replace('Bearer ', '');
            db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
            return ctx.sendJson(200, { message: 'Logged out successfully' });
        }

        // GET /api/auth/me
        if (pathname === `${basePath}/me` && method === 'GET') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

            const db = getDb();
            const user = db.prepare(`
                SELECT id, email, first_name, last_name, phone, role, profile_image, created_at
                FROM users WHERE id = ?
            `).get(auth.user.id);

            return ctx.sendJson(200, {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                role: user.role,
                profileImage: user.profile_image,
                createdAt: user.created_at
            });
        }

        // PUT /api/auth/me
        if (pathname === `${basePath}/me` && method === 'PUT') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

            const db = getDb();
            const { firstName, lastName, phone } = body;

            db.prepare(`
                UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(firstName, lastName, phone, auth.user.id);

            return ctx.sendJson(200, { message: 'Profile updated successfully' });
        }

        // PUT /api/auth/password
        if (pathname === `${basePath}/password` && method === 'PUT') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

            const db = getDb();
            const { currentPassword, newPassword } = body;

            if (!currentPassword || !newPassword) {
                return ctx.sendError(400, 'Current and new password are required');
            }

            if (newPassword.length < 6) {
                return ctx.sendError(400, 'New password must be at least 6 characters');
            }

            const user = db.prepare('SELECT password_hash, password_salt FROM users WHERE id = ?').get(auth.user.id);

            if (!verifyPassword(currentPassword, user.password_hash, user.password_salt)) {
                return ctx.sendError(401, 'Current password is incorrect');
            }

            const { salt, hash } = hashPassword(newPassword);

            db.prepare(`
                UPDATE users SET password_hash = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(hash, salt, auth.user.id);

            db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(
                auth.user.id,
                ctx.req.headers.authorization?.replace('Bearer ', '')
            );

            return ctx.sendJson(200, { message: 'Password changed successfully' });
        }

        // GET /api/auth/admins
        if (pathname === `${basePath}/admins` && method === 'GET') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);
            if (auth.user.role !== 'admin') return ctx.sendError(403, 'Admin access required');

            const db = getDb();
            const admins = db.prepare(`
                SELECT id, email, first_name, last_name, phone, created_at 
                FROM users WHERE role = 'admin'
            `).all();
            return ctx.sendJson(200, admins);
        }

        // GET /api/auth/bookings
        if (pathname === `${basePath}/bookings` && method === 'GET') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

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
            `).all(auth.user.id);

            return ctx.sendJson(200, bookings);
        }

        // GET /api/auth/favorites
        if (pathname === `${basePath}/favorites` && method === 'GET') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

            const db = getDb();
            const favorites = db.prepare(`
                SELECT d.* FROM user_favorites uf
                JOIN destinations d ON uf.destination_id = d.id
                WHERE uf.user_id = ?
                ORDER BY uf.created_at DESC
            `).all(auth.user.id);

            return ctx.sendJson(200, favorites.map(d => ({
                ...d,
                highlights: d.highlights ? JSON.parse(d.highlights) : []
            })));
        }

        // POST /api/auth/favorites/:destId
        let params = matchRoute(`${basePath}/favorites/:destId`, pathname);
        if (params && method === 'POST') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

            const db = getDb();
            db.prepare(`
                INSERT OR IGNORE INTO user_favorites (user_id, destination_id)
                VALUES (?, ?)
            `).run(auth.user.id, params.destId);

            return ctx.sendJson(200, { message: 'Added to favorites' });
        }

        // DELETE /api/auth/favorites/:destId
        params = matchRoute(`${basePath}/favorites/:destId`, pathname);
        if (params && method === 'DELETE') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

            const db = getDb();
            db.prepare('DELETE FROM user_favorites WHERE user_id = ? AND destination_id = ?').run(
                auth.user.id, params.destId
            );
            return ctx.sendJson(200, { message: 'Removed from favorites' });
        }

        // GET /api/auth/users
        if (pathname === `${basePath}/users` && method === 'GET') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);
            if (auth.user.role !== 'admin') return ctx.sendError(403, 'Admin access required');

            const db = getDb();
            const users = db.prepare(`
                SELECT id, email, first_name, last_name, phone, role, created_at
                FROM users
                ORDER BY created_at DESC
            `).all();

            return ctx.sendJson(200, users);
        }

        // DELETE /api/auth/users/:userId
        params = matchRoute(`${basePath}/users/:userId`, pathname);
        if (params && method === 'DELETE') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);
            if (auth.user.role !== 'admin') return ctx.sendError(403, 'Admin access required');

            const db = getDb();
            const userId = parseInt(params.userId);

            if (isNaN(userId)) {
                return ctx.sendError(400, 'Invalid user ID');
            }

            const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId);
            if (!user) {
                return ctx.sendError(404, 'User not found');
            }

            if (user.role === 'admin') {
                return ctx.sendError(403, 'Cannot delete admin users');
            }

            db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM bookings WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM inquiries WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM user_favorites WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM users WHERE id = ?').run(userId);

            return ctx.sendJson(200, { message: 'User deleted successfully' });
        }

        // GET /api/auth/revenue
        if (pathname === `${basePath}/revenue` && method === 'GET') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);
            if (auth.user.role !== 'admin') return ctx.sendError(403, 'Admin access required');

            const db = getDb();
            
            const totalRevenue = db.prepare(`
                SELECT COALESCE(SUM(total_price), 0) as total
                FROM bookings
                WHERE status = 'confirmed'
            `).get();

            const userRevenue = db.prepare(`
                SELECT user_id, COALESCE(SUM(total_price), 0) as revenue
                FROM bookings
                WHERE status = 'confirmed'
                GROUP BY user_id
            `).all();

            const userStats = {};
            userRevenue.forEach(row => {
                userStats[row.user_id] = row.revenue;
            });

            return ctx.sendJson(200, {
                total: totalRevenue.total,
                userStats
            });
        }

        // Route not found
        return ctx.sendError(404, 'Not found');

    } catch (error) {
        console.error('Auth error:', error);
        return ctx.sendError(500, error.message);
    }
}

// Export handler and auth functions
module.exports = authHandler;
module.exports.authenticateToken = authenticateToken;
