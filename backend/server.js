const express = require('express');
const cors = require('cors');
const path = require('path');
const { seedDatabase } = require('./database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

// Initialize database (async for sql.js)
const { dbReady } = require('./database');
dbReady.then(() => {
    seedDatabase();
    console.log('Database ready');
}).catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
});

// Import routes
const destinationsRouter = require('./routes/destinations');
const packagesRouter = require('./routes/packages');
const bookingsRouter = require('./routes/bookings');
const inquiriesRouter = require('./routes/inquiries');
const miscRouter = require('./routes/misc');
const authRouter = require('./routes/auth');

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/hotels', miscRouter);
app.use('/api/guides', (req, res, next) => {
    req.url = '/guides' + req.url;
    miscRouter(req, res, next);
});
app.use('/api/testimonials', (req, res, next) => {
    req.url = '/testimonials' + req.url;
    miscRouter(req, res, next);
});
app.use('/api/stats', (req, res, next) => {
    req.url = '/stats' + req.url;
    miscRouter(req, res, next);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard stats endpoint (admin)
app.get('/api/stats', authRouter.authenticateToken, authRouter.requireAdmin, (req, res) => {
    try {
        const { getDb } = require('./database');
        const db = getDb();

        const destinationCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
        const packageCount = db.prepare('SELECT COUNT(*) as count FROM tour_packages').get().count;
        const hotelCount = db.prepare('SELECT COUNT(*) as count FROM hotels').get().count;
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get().count;
        const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
        const inquiryCount = db.prepare('SELECT COUNT(*) as count FROM inquiries WHERE status = "new"').get().count;
        const pendingBookings = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = "pending"').get().count;

        // Recent bookings
        const recentBookings = db.prepare(`
            SELECT b.booking_reference, b.full_name, b.email, b.status, b.created_at, d.name as destination
            FROM bookings b
            LEFT JOIN destinations d ON b.destination_id = d.id
            ORDER BY b.created_at DESC
            LIMIT 5
        `).all();

        res.json({
            destinations: destinationCount,
            packages: packageCount,
            hotels: hotelCount,
            users: userCount,
            totalBookings: bookingCount,
            pendingBookings: pendingBookings,
            newInquiries: inquiryCount,
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🌍 Ethiopia Travel Agency API Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   API Endpoints:`);
    console.log(`   - POST /api/auth/register`);
    console.log(`   - POST /api/auth/login`);
    console.log(`   - GET  /api/auth/me`);
    console.log(`   - GET  /api/destinations`);
    console.log(`   - GET  /api/packages`);
    console.log(`   - GET  /api/hotels`);
    console.log(`   - GET  /api/guides`);
    console.log(`   - GET  /api/testimonials`);
    console.log(`   - POST /api/bookings`);
    console.log(`   - POST /api/inquiries`);
    console.log(`   - GET  /api/stats (admin)`);
    console.log(`\n   Frontend: http://localhost:${PORT}/`);
    console.log(`\n✅ Server ready!\n`);
});

module.exports = app;

