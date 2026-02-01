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

async function packagesHandler(ctx) {
    const { method, pathname, body } = ctx;
    const basePath = '/api/packages';

    try {
        // GET /api/packages
        if (pathname === basePath && method === 'GET') {
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

            return ctx.sendJson(200, parsed);
        }

        // GET /api/packages/:id
        let params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'GET') {
            const db = getDb();
            const pkg = db.prepare(`
                SELECT p.*, d.name as destination_name, d.slug as destination_slug
                FROM tour_packages p
                LEFT JOIN destinations d ON p.destination_id = d.id
                WHERE p.id = ?
            `).get(params.id);

            if (!pkg) {
                return ctx.sendError(404, 'Package not found');
            }

            pkg.includes = pkg.includes ? JSON.parse(pkg.includes) : [];
            pkg.itinerary = pkg.itinerary ? JSON.parse(pkg.itinerary) : [];

            return ctx.sendJson(200, pkg);
        }

        // POST /api/packages
        if (pathname === basePath && method === 'POST') {
            const db = getDb();
            const { destination_id, name, description, duration_days, price, includes, itinerary, max_group_size, image_url, featured } = body;

            const result = db.prepare(`
                INSERT INTO tour_packages (destination_id, name, description, duration_days, price, includes, itinerary, max_group_size, image_url, featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(destination_id, name, description, duration_days, price, JSON.stringify(includes || []), JSON.stringify(itinerary || []), max_group_size || 10, image_url, featured ? 1 : 0);

            return ctx.sendJson(201, { id: result.lastInsertRowid, message: 'Package created successfully' });
        }

        // PUT /api/packages/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'PUT') {
            const db = getDb();
            const { destination_id, name, description, duration_days, price, includes, itinerary, max_group_size, image_url, featured } = body;

            db.prepare(`
                UPDATE tour_packages 
                SET destination_id = ?, name = ?, description = ?, duration_days = ?, price = ?, 
                    includes = ?, itinerary = ?, max_group_size = ?, image_url = ?, featured = ?
                WHERE id = ?
            `).run(destination_id, name, description, duration_days, price, JSON.stringify(includes || []), JSON.stringify(itinerary || []), max_group_size || 10, image_url, featured ? 1 : 0, params.id);

            return ctx.sendJson(200, { message: 'Package updated successfully' });
        }

        // DELETE /api/packages/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'DELETE') {
            const db = getDb();
            db.prepare('DELETE FROM tour_packages WHERE id = ?').run(params.id);
            return ctx.sendJson(200, { message: 'Package deleted successfully' });
        }

        return ctx.sendError(404, 'Not found');

    } catch (error) {
        console.error('Packages error:', error);
        return ctx.sendError(500, error.message);
    }
}

module.exports = packagesHandler;
