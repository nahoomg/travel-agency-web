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

async function inquiriesHandler(ctx) {
    const { method, pathname, body } = ctx;
    const basePath = '/api/inquiries';

    try {
        // GET /api/inquiries
        if (pathname === basePath && method === 'GET') {
            const db = getDb();
            const inquiries = db.prepare(`
                SELECT * FROM inquiries ORDER BY created_at DESC
            `).all();

            return ctx.sendJson(200, inquiries);
        }

        // GET /api/inquiries/:id
        let params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'GET') {
            const db = getDb();
            const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(params.id);

            if (!inquiry) {
                return ctx.sendError(404, 'Inquiry not found');
            }

            return ctx.sendJson(200, inquiry);
        }

        // POST /api/inquiries
        if (pathname === basePath && method === 'POST') {
            const db = getDb();
            const { first_name, last_name, email, phone, subject, message, rating } = body;

            if (!first_name || !last_name || !email || !message) {
                return ctx.sendError(400, 'First name, last name, email, and message are required');
            }

            const result = db.prepare(`
                INSERT INTO inquiries (first_name, last_name, email, phone, subject, message, rating)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(first_name, last_name, email, phone || null, subject || null, message, rating || null);

            return ctx.sendJson(201, { id: result.lastInsertRowid, message: 'Inquiry submitted successfully' });
        }

        // PUT /api/inquiries/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'PUT') {
            const db = getDb();
            const { status } = body;

            db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, params.id);

            return ctx.sendJson(200, { message: 'Inquiry updated successfully' });
        }

        // DELETE /api/inquiries/:id
        params = matchRoute(`${basePath}/:id`, pathname);
        if (params && method === 'DELETE') {
            const db = getDb();
            db.prepare('DELETE FROM inquiries WHERE id = ?').run(params.id);
            return ctx.sendJson(200, { message: 'Inquiry deleted successfully' });
        }

        return ctx.sendError(404, 'Not found');

    } catch (error) {
        console.error('Inquiries error:', error);
        return ctx.sendError(500, error.message);
    }
}

module.exports = inquiriesHandler;
