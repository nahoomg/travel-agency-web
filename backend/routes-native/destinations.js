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

async function destinationsHandler(ctx) {
    const { method, pathname, body } = ctx;
    const basePath = '/api/destinations';

    try {
        // GET /api/destinations
        if (pathname === basePath && method === 'GET') {
            const db = getDb();
            const destinations = db.prepare(`
                SELECT id, name, slug, tagline, description, category, image_url, highlights, best_time_to_visit, featured
                FROM destinations
                ORDER BY featured DESC, name ASC
            `).all();

            const parsed = destinations.map(d => ({
                ...d,
                highlights: d.highlights ? JSON.parse(d.highlights) : []
            }));

            return ctx.sendJson(200, parsed);
        }

        // GET /api/destinations/:slug
        let params = matchRoute(`${basePath}/:slug`, pathname);
        if (params && method === 'GET') {
            const db = getDb();
            const destination = db.prepare(`
                SELECT * FROM destinations WHERE slug = ?
            `).get(params.slug);

            if (!destination) {
                return ctx.sendError(404, 'Destination not found');
            }

            destination.highlights = destination.highlights ? JSON.parse(destination.highlights) : [];
            destination.gallery_images = destination.gallery_images ? JSON.parse(destination.gallery_images) : [];

            const hotels = db.prepare(`
                SELECT * FROM hotels WHERE destination_id = ?
            `).all(destination.id);

            destination.hotels = hotels.map(h => ({
                ...h,
                amenities: h.amenities ? JSON.parse(h.amenities) : []
            }));

            const packages = db.prepare(`
                SELECT * FROM tour_packages WHERE destination_id = ?
            `).all(destination.id);

            destination.packages = packages.map(p => ({
                ...p,
                includes: p.includes ? JSON.parse(p.includes) : []
            }));

            return ctx.sendJson(200, destination);
        }

        // POST /api/destinations
        if (pathname === basePath && method === 'POST') {
            const db = getDb();
            const { name, slug, tagline, description, image_url, highlights, best_time_to_visit, featured } = body;

            const result = db.prepare(`
                INSERT INTO destinations (name, slug, tagline, description, image_url, highlights, best_time_to_visit, featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(name, slug, tagline, description, image_url, JSON.stringify(highlights || []), best_time_to_visit, featured ? 1 : 0);

            return ctx.sendJson(201, { id: result.lastInsertRowid, message: 'Destination created successfully' });
        }

        // PUT /api/destinations/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'PUT') {
            const db = getDb();
            const { name, slug, tagline, description, image_url, highlights, best_time_to_visit, featured } = body;

            db.prepare(`
                UPDATE destinations 
                SET name = ?, slug = ?, tagline = ?, description = ?, image_url = ?, 
                    highlights = ?, best_time_to_visit = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(name, slug, tagline, description, image_url, JSON.stringify(highlights || []), best_time_to_visit, featured ? 1 : 0, params.id);

            return ctx.sendJson(200, { message: 'Destination updated successfully' });
        }

        // DELETE /api/destinations/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'DELETE') {
            const db = getDb();
            db.prepare('DELETE FROM destinations WHERE id = ?').run(params.id);
            return ctx.sendJson(200, { message: 'Destination deleted successfully' });
        }

        return ctx.sendError(404, 'Not found');

    } catch (error) {
        console.error('Destinations error:', error);
        return ctx.sendError(500, error.message);
    }
}

module.exports = destinationsHandler;
