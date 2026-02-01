const http = require('http');
const path = require('path');
const fs = require('fs');
const { dbReady, seedDatabase } = require('./database');

// Import route handlers
const authHandlers = require('./routes-native/auth');
const destinationsHandlers = require('./routes-native/destinations');
const packagesHandlers = require('./routes-native/packages');
const bookingsHandlers = require('./routes-native/bookings');
const inquiriesHandlers = require('./routes-native/inquiries');
const miscHandlers = require('./routes-native/misc');

const PORT = process.env.PORT || 3000;

// MIME types for static file serving
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// Helper to parse JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (body) {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve({});
                }
            } else {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

// Helper to send JSON response
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

// Helper to send error response
function sendError(res, statusCode, message) {
    sendJson(res, statusCode, { error: message });
}

// Serve static files
function serveStatic(req, res, filePath) {
    const publicPath = path.join(__dirname, '..', 'public');
    const fullPath = path.join(publicPath, filePath);
    
    // Security check - prevent directory traversal
    if (!fullPath.startsWith(publicPath)) {
        sendError(res, 403, 'Forbidden');
        return;
    }

    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            sendError(res, 404, 'File not found');
            return;
        }

        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });

        const stream = fs.createReadStream(fullPath);
        stream.pipe(res);
    });
}

// Route matcher - matches patterns like /api/destinations/:slug
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

// Main request handler
async function handleRequest(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Log incoming requests
    console.log(`${method} ${pathname}`);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        });
        res.end();
        return;
    }

    // Parse body for POST/PUT requests
    let body = {};
    if (method === 'POST' || method === 'PUT') {
        body = await parseBody(req);
    }

    // Create context object to pass to handlers
    const ctx = {
        req,
        res,
        method,
        pathname,
        query: Object.fromEntries(parsedUrl.searchParams),
        body,
        params: {},
        sendJson: (status, data) => sendJson(res, status, data),
        sendError: (status, msg) => sendError(res, status, msg)
    };

    // Health check
    if (pathname === '/api/health' && method === 'GET') {
        sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
        return;
    }

    // API Routes
    if (pathname.startsWith('/api/auth')) {
        return authHandlers(ctx);
    }

    if (pathname.startsWith('/api/destinations')) {
        return destinationsHandlers(ctx);
    }

    if (pathname.startsWith('/api/packages')) {
        return packagesHandlers(ctx);
    }

    if (pathname.startsWith('/api/bookings')) {
        return bookingsHandlers(ctx);
    }

    if (pathname.startsWith('/api/inquiries')) {
        return inquiriesHandlers(ctx);
    }

    if (pathname.startsWith('/api/hotels') || pathname.startsWith('/api/guides') || 
        pathname.startsWith('/api/testimonials') || pathname.startsWith('/api/stats')) {
        return miscHandlers(ctx);
    }

    // Static file serving
    if (pathname.startsWith('/assets/') || pathname.startsWith('/uploads/')) {
        return serveStatic(req, res, pathname);
    }

    // Serve index.html for root
    if (pathname === '/' || pathname === '/index.html') {
        return serveStatic(req, res, 'index.html');
    }

    // 404 for unknown routes
    sendError(res, 404, 'Not found');
}

// Create and start server
const server = http.createServer(async (req, res) => {
    try {
        await handleRequest(req, res);
    } catch (error) {
        console.error('Server error:', error);
        sendError(res, 500, 'Internal server error');
    }
});

// Initialize database then start server
dbReady.then(() => {
    seedDatabase();
    console.log('Database ready');
    
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Press Ctrl+C to stop');
    });
    
    // Keep the process alive
    server.on('error', (err) => {
        console.error('Server error:', err);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\nShutting down server...');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });
    
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
}).catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
});
