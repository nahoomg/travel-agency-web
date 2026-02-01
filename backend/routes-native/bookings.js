const crypto = require('crypto');
const { getDb } = require('../database');
const { authenticateToken } = require('./auth');

// Generate booking reference
function generateBookingRef() {
    const prefix = 'ETH';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
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

// Optional auth - extracts user if logged in but doesn't require it
function optionalAuth(ctx) {
    const authHeader = ctx.req.headers.authorization;
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
        return { user: null };
    }

    const db = getDb();
    const session = db.prepare(`
        SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.role
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
    `).get(token);

    if (session) {
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

    return { user: null };
}

async function bookingsHandler(ctx) {
    const { method, pathname, body } = ctx;
    const basePath = '/api/bookings';

    try {
        // GET /api/bookings
        if (pathname === basePath && method === 'GET') {
            const auth = authenticateToken(ctx);
            if (auth.error) return ctx.sendError(auth.status, auth.error);

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

            return ctx.sendJson(200, bookings);
        }

        // GET /api/bookings/:id
        let params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'GET') {
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
            `).get(params.id, params.id);

            if (!booking) {
                return ctx.sendError(404, 'Booking not found');
            }

            booking.additional_services = booking.additional_services ? JSON.parse(booking.additional_services) : [];

            return ctx.sendJson(200, booking);
        }

        // POST /api/bookings
        if (pathname === basePath && method === 'POST') {
            const auth = optionalAuth(ctx);
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
            } = body;

            if (!full_name || !email) {
                return ctx.sendError(400, 'Full name and email are required');
            }

            const booking_reference = generateBookingRef();
            const user_id = auth.user?.id || null;

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

            return ctx.sendJson(201, {
                id: result.lastInsertRowid,
                booking_reference,
                message: 'Booking created successfully'
            });
        }

        // PUT /api/bookings/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'PUT') {
            const db = getDb();
            const { status, notes } = body;

            const booking = db.prepare('SELECT id FROM bookings WHERE id = ?').get(params.id);
            if (!booking) {
                return ctx.sendError(404, 'Booking not found');
            }

            if (notes !== undefined) {
                db.prepare(`
                    UPDATE bookings SET status = ?, notes = ? WHERE id = ?
                `).run(status, notes, params.id);
            } else {
                db.prepare(`
                    UPDATE bookings SET status = ? WHERE id = ?
                `).run(status, params.id);
            }

            return ctx.sendJson(200, { message: 'Booking updated successfully' });
        }

        // DELETE /api/bookings/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'DELETE') {
            const db = getDb();
            db.prepare('DELETE FROM bookings WHERE id = ?').run(params.id);
            return ctx.sendJson(200, { message: 'Booking deleted successfully' });
        }

        return ctx.sendError(404, 'Not found');

    } catch (error) {
        console.error('Bookings error:', error);
        return ctx.sendError(500, error.message);
    }
}

module.exports = bookingsHandler;
