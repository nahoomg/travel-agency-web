const { getDb } = require('../database');

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

async function miscHandler(ctx) {
    const { method, pathname, body } = ctx;

    try {
        // GET /api/hotels
        if (pathname === '/api/hotels' && method === 'GET') {
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

            return ctx.sendJson(200, parsed);
        }

        // GET /api/hotels/destination/:destId
        let params = matchRoute('/api/hotels/destination/:destId', pathname);
        if (params && method === 'GET') {
            const db = getDb();
            const hotels = db.prepare(`
                SELECT * FROM hotels WHERE destination_id = ?
            `).all(params.destId);

            const parsed = hotels.map(h => ({
                ...h,
                amenities: h.amenities ? JSON.parse(h.amenities) : []
            }));

            return ctx.sendJson(200, parsed);
        }

        // GET /api/guides
        if (pathname === '/api/guides' && method === 'GET') {
            const db = getDb();
            const guides = db.prepare('SELECT * FROM guides ORDER BY experience_years DESC').all();

            const parsed = guides.map(g => ({
                ...g,
                languages: g.languages ? JSON.parse(g.languages) : [],
                specializations: g.specializations ? JSON.parse(g.specializations) : []
            }));

            return ctx.sendJson(200, parsed);
        }

        // GET /api/testimonials
        if (pathname === '/api/testimonials' && method === 'GET') {
            const db = getDb();
            const testimonials = db.prepare(`
                SELECT * FROM testimonials WHERE featured = 1 ORDER BY created_at DESC
            `).all();

            return ctx.sendJson(200, testimonials);
        }

        // POST /api/testimonials
        if (pathname === '/api/testimonials' && method === 'POST') {
            const db = getDb();
            const { name, role, message, rating, image_url, featured } = body;

            const result = db.prepare(`
                INSERT INTO testimonials (name, role, message, rating, image_url, featured)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(name, role, message, rating || 5, image_url || null, featured ? 1 : 0);

            return ctx.sendJson(201, { id: result.lastInsertRowid, message: 'Testimonial created successfully' });
        }

        // GET /api/stats
        if (pathname === '/api/stats' && method === 'GET') {
            const db = getDb();
            const stats = {
                users: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get().count,
                totalBookings: db.prepare('SELECT COUNT(*) as count FROM bookings').get().count,
                pendingBookings: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get().count,
                confirmedBookings: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").get().count,
                newInquiries: db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").get().count,
                destinations: db.prepare('SELECT COUNT(*) as count FROM destinations').get().count,
                packages: db.prepare('SELECT COUNT(*) as count FROM tour_packages').get().count,
                hotels: db.prepare('SELECT COUNT(*) as count FROM hotels').get().count,
                totalRevenue: db.prepare("SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = 'confirmed'").get().total
            };

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

            return ctx.sendJson(200, stats);
        }

        return ctx.sendError(404, 'Not found');

    } catch (error) {
        console.error('Misc error:', error);
        return ctx.sendError(500, error.message);
    }
}

module.exports = miscHandler;
