const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'travel_agency.db');

// Database instance holder
let db = null;
let rawDb = null; // Raw sql.js database for export
let dbReady = null; // Promise that resolves when DB is ready
let isInitializing = false; // Flag to prevent saving during initialization

// Password hashing functions
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password, hash, salt) {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

// Save database to file
function saveDatabase() {
    if (rawDb && !isInitializing) {
        try {
            const data = rawDb.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(dbPath, buffer);
        } catch (err) {
            console.error('Error saving database:', err);
        }
    }
}

// Helper class to provide better-sqlite3-like API
class Statement {
    constructor(database, sql) {
        this.database = database;
        this.sql = sql;
    }

    all(...params) {
        const stmt = this.database.prepare(this.sql);
        if (params.length > 0) {
            stmt.bind(params);
        }
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    get(...params) {
        const stmt = this.database.prepare(this.sql);
        if (params.length > 0) {
            stmt.bind(params);
        }
        let result = null;
        if (stmt.step()) {
            result = stmt.getAsObject();
        }
        stmt.free();
        return result;
    }

    run(...params) {
        this.database.run(this.sql, params);
        saveDatabase();

        // Get last insert rowid
        let lastId = null;
        try {
            const result = this.database.exec("SELECT last_insert_rowid()");
            if (result.length > 0 && result[0].values.length > 0) {
                lastId = result[0].values[0][0];
            }
        } catch (e) {
            // Ignore errors getting last insert id
        }

        return {
            changes: this.database.getRowsModified(),
            lastInsertRowid: lastId
        };
    }
}

// Database wrapper to provide better-sqlite3-like API
class DatabaseWrapper {
    constructor(sqlJsDb) {
        this._db = sqlJsDb;
    }

    prepare(sql) {
        return new Statement(this._db, sql);
    }

    exec(sql) {
        this._db.run(sql);
        // Only save after non-schema operations
        if (!isInitializing) {
            saveDatabase();
        }
    }

    pragma(pragma) {
        this._db.run(`PRAGMA ${pragma}`);
    }
}

// Initialize database
async function initializeDatabase() {
    isInitializing = true;

    const SQL = await initSqlJs();

    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        rawDb = new SQL.Database(fileBuffer);
    } else {
        rawDb = new SQL.Database();
    }

    db = new DatabaseWrapper(rawDb);

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            password_salt TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT,
            role TEXT DEFAULT 'user',
            profile_image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // User sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // User saved destinations (favorites)
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            destination_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
            UNIQUE(user_id, destination_id)
        )
    `);

    // Destinations table
    db.exec(`
        CREATE TABLE IF NOT EXISTS destinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            tagline TEXT,
            description TEXT,
            category TEXT,
            image_url TEXT,
            gallery_images TEXT,
            highlights TEXT,
            activities TEXT,
            best_time_to_visit TEXT,
            featured INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Add activities column if it doesn't exist (migration for existing DBs)
    try {
        db.exec(`ALTER TABLE destinations ADD COLUMN activities TEXT`);
    } catch (e) {
        // Column already exists, ignore
    }

    // Tour packages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS tour_packages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            destination_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            duration_days INTEGER,
            price REAL NOT NULL,
            includes TEXT,
            itinerary TEXT,
            max_group_size INTEGER DEFAULT 10,
            image_url TEXT,
            featured INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (destination_id) REFERENCES destinations(id)
        )
    `);

    // Hotels table
    db.exec(`
        CREATE TABLE IF NOT EXISTS hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            destination_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            star_rating INTEGER,
            price_per_night REAL,
            amenities TEXT,
            image_url TEXT,
            room_types TEXT,
            address TEXT,
            FOREIGN KEY (destination_id) REFERENCES destinations(id)
        )
    `);

    // Tour guides table
    db.exec(`
        CREATE TABLE IF NOT EXISTS guides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            languages TEXT,
            specializations TEXT,
            experience_years INTEGER,
            bio TEXT,
            image_url TEXT,
            price_per_day REAL
        )
    `);

    // Bookings table - now linked to users
    db.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_reference TEXT UNIQUE NOT NULL,
            user_id INTEGER,
            destination_id INTEGER,
            package_id INTEGER,
            hotel_id INTEGER,
            guide_id INTEGER,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            travel_date DATE,
            end_date DATE,
            num_travelers INTEGER DEFAULT 1,
            room_type TEXT,
            car_type TEXT,
            additional_services TEXT,
            total_price REAL,
            status TEXT DEFAULT 'pending',
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (destination_id) REFERENCES destinations(id),
            FOREIGN KEY (package_id) REFERENCES tour_packages(id),
            FOREIGN KEY (hotel_id) REFERENCES hotels(id),
            FOREIGN KEY (guide_id) REFERENCES guides(id)
        )
    `);

    // Contact inquiries table
    db.exec(`
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            rating INTEGER,
            status TEXT DEFAULT 'new',
            admin_response TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Testimonials table
    db.exec(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            role TEXT,
            message TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            image_url TEXT,
            featured INTEGER DEFAULT 0,
            approved INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    isInitializing = false;

    // Save the schema
    saveDatabase();

    console.log('Database initialized successfully');
    return db;
}

// Seed initial data
function seedDatabase() {
    // Check if destinations exist
    const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get();

    if (destCount.count === 0) {
        console.log('Seeding initial data...');

        // Insert destinations
        const destinations = [
            {
                name: 'Bahir Dar',
                slug: 'bahir-dar',
                tagline: "Ethiopia's Gateway to Natural Wonders",
                description: "Bahir Dar is one of Ethiopia's most beautiful and vibrant cities, located on the southern shore of Lake Tana, the source of the Blue Nile.",
                category: 'Nature',
                image_url: 'assets/Bahr_download (1).jpg',
                highlights: JSON.stringify(['Lake Tana', 'Blue Nile Falls', 'Island Monasteries', 'Tankwa Boat Tours']),
                best_time_to_visit: 'September to March',
                featured: 1
            },
            {
                name: 'Harar',
                slug: 'harar',
                tagline: 'The City of Saints',
                description: "Harar is a city of colorful alleys, rich culture and breathtaking architecture. As one of the holiest cities in Islam, this ancient walled city offers an authentic glimpse into Ethiopia's diverse heritage.",
                category: 'Culture',
                image_url: 'assets/Harra intro.jpg',
                highlights: JSON.stringify(['Jugol Walled City', 'Hyena Feeding', 'Traditional Markets', 'Harari Culture']),
                best_time_to_visit: 'October to February',
                featured: 1
            },
            {
                name: 'Axum',
                slug: 'axum',
                tagline: 'Cradle of Ethiopian Civilization',
                description: "Axum is a historic city with deep connections to Ethiopian early civilization. Once the center of the ancient Aksumite Empire, it's believed to house the Ark of the Covenant.",
                category: 'History',
                image_url: 'assets/Axum-2160089328-612x612.jpg',
                highlights: JSON.stringify(['Ancient Obelisks', 'Church of St. Mary of Zion', 'Queen of Sheba Palace', 'Royal Tombs']),
                best_time_to_visit: 'October to March',
                featured: 1
            },
            {
                name: 'Lalibela',
                slug: 'lalibela',
                tagline: 'The New Jerusalem',
                description: "Lalibela is an extraordinary spiritual site in Ethiopia featuring 11 medieval, monolithic churches carved directly downwards into the solid red rock.",
                category: 'History',
                image_url: 'assets/Lalibela_cover.webp',
                highlights: JSON.stringify(['Rock-Hewn Churches', 'Church of St. George', 'Religious Ceremonies', 'Mountain Landscapes']),
                best_time_to_visit: 'September to March',
                featured: 1
            },
            {
                name: 'Addis Ababa',
                slug: 'addis-ababa',
                tagline: 'Heart of Africa',
                description: "Welcome to Addis Ababa, the vibrant capital of Ethiopia. It blends ancient history with modern development.",
                category: 'City',
                image_url: 'assets/Addis-Ababa-cover.jpg',
                highlights: JSON.stringify(['National Museum', 'Holy Trinity Cathedral', 'Merkato Market', 'Entoto Mountains']),
                best_time_to_visit: 'Year-round',
                featured: 1
            },
            {
                name: 'Simien Mountains',
                slug: 'simien-mountains',
                tagline: 'The Roof of Africa',
                description: "A UNESCO World Heritage site, the Simien Mountains offer some of the most spectacular scenery in the world. Jagged mountain peaks, deep valleys, and rare wildlife.",
                category: 'Nature',
                image_url: 'assets/hero.jpg',
                highlights: JSON.stringify(['Ras Dashen', 'Gelada Baboons', 'Walia Ibex', 'Jinbar Waterfall']),
                best_time_to_visit: 'September to November',
                featured: 1
            }
        ];

        destinations.forEach(dest => {
            db.prepare(`
                INSERT INTO destinations (name, slug, tagline, description, category, image_url, highlights, best_time_to_visit, featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(dest.name, dest.slug, dest.tagline, dest.description, dest.category, dest.image_url, dest.highlights, dest.best_time_to_visit, dest.featured);
        });

        // Insert hotels
        const hotels = [
            { dest_id: 1, name: 'Kuriftu Resort & Spa', description: 'Luxury lakeside resort', star_rating: 5, price: 15000, amenities: JSON.stringify(['Pool', 'Spa', 'WiFi']), image: 'assets/hotel-luxury.jpg', room_types: JSON.stringify(['Deluxe', 'Suite']) },
            { dest_id: 2, name: 'Wonderland Hotel', description: 'Modern comfort', star_rating: 4, price: 8000, amenities: JSON.stringify(['Restaurant', 'WiFi']), image: 'assets/hotel-2bd.jpg', room_types: JSON.stringify(['Standard', 'Deluxe']) },
            { dest_id: 3, name: 'Yared Zema', description: 'Comfortable stay', star_rating: 4, price: 7500, amenities: JSON.stringify(['Restaurant', 'WiFi']), image: 'assets/hotel-1bd.jpg', room_types: JSON.stringify(['Standard']) },
            { dest_id: 4, name: 'Maribela Hotel', description: 'Stunning views', star_rating: 5, price: 12000, amenities: JSON.stringify(['Restaurant', 'WiFi']), image: 'assets/hotel-luxury.jpg', room_types: JSON.stringify(['Deluxe', 'Suite']) },
            { dest_id: 5, name: 'Sheraton Addis', description: 'Luxury 5-star', star_rating: 5, price: 25000, amenities: JSON.stringify(['Pool', 'Spa', 'WiFi']), image: 'assets/hotel-luxury.jpg', room_types: JSON.stringify(['Deluxe']) },
            { dest_id: 6, name: 'Simien Lodge', description: 'Highest lodge in Africa', star_rating: 4, price: 12000, amenities: JSON.stringify(['Restaurant', 'Bar', 'Fireplace']), image: 'assets/hotel-luxury.jpg', room_types: JSON.stringify(['Standard', 'Family']) }
        ];

        hotels.forEach(h => {
            db.prepare(`
                INSERT INTO hotels (destination_id, name, description, star_rating, price_per_night, amenities, image_url, room_types)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(h.dest_id, h.name, h.description, h.star_rating, h.price, h.amenities, h.image, h.room_types);
        });

        // Insert tour packages
        const packages = [
            { dest_id: 1, name: 'Lake Tana Explorer', description: 'Explore Lake Tana', days: 3, price: 15000, includes: JSON.stringify(['Hotel', 'Boat Tour', 'Guide']), featured: 1, image: 'assets/lake tana-image.jpg' },
            { dest_id: 2, name: 'Harar Cultural', description: 'Culture of Harar', days: 2, price: 12000, includes: JSON.stringify(['Hotel', 'City Tour']), featured: 1, image: 'assets/Harra intro.jpg' },
            { dest_id: 3, name: 'Ancient Axum', description: 'Discover Axum', days: 2, price: 11000, includes: JSON.stringify(['Hotel', 'Tour']), featured: 1, image: 'assets/Axum-2160089328-612x612.jpg' },
            { dest_id: 4, name: 'Lalibela Pilgrimage', description: 'Visit Rock Churches', days: 3, price: 18000, includes: JSON.stringify(['Hotel', 'Guide']), featured: 1, image: 'assets/Lalibela_cover.webp' },
            { dest_id: 6, name: 'Simien Trekking', description: '3-Day trekking adventure in Simien Mountains', days: 3, price: 20000, includes: JSON.stringify(['Lodge', 'Guide', 'Scout', 'Meals']), featured: 1, image: 'assets/hero.jpg' }
        ];

        packages.forEach(p => {
            db.prepare(`
                INSERT INTO tour_packages (destination_id, name, description, duration_days, price, includes, featured, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(p.dest_id, p.name, p.description, p.days, p.price, p.includes, p.featured, p.image);
        });

        // Guides
        const guides = [
            { name: 'Selam Tesfaye', languages: JSON.stringify(['English', 'Amharic', 'French']), specializations: JSON.stringify(['Cultural Tours', 'History']), experience: 8, bio: 'Expert cultural guide with deep knowledge of Ethiopian heritage and traditions.', price: 2500 },
            { name: 'Abiy Tesfalem', languages: JSON.stringify(['English', 'Amharic', 'German']), specializations: JSON.stringify(['Adventure', 'Trekking']), experience: 6, bio: 'Adventure specialist with extensive experience in Simien Mountains and Danakil Depression.', price: 3000 },
            { name: 'Mohamed Ali', languages: JSON.stringify(['English', 'Arabic', 'Amharic']), specializations: JSON.stringify(['Religious Sites', 'Harar']), experience: 10, bio: 'Harar native and expert on Islamic heritage sites and local traditions.', price: 2800 }
        ];
        guides.forEach(g => {
            db.prepare(`
                INSERT INTO guides (name, languages, specializations, experience_years, bio, price_per_day)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(g.name, g.languages, g.specializations, g.experience, g.bio, g.price);
        });

        // Testimonials
        const testimonials = [
            { name: 'Hewan Adam', role: 'Travel Enthusiast', message: 'The trip was absolutely amazing! The team organized everything perfectly, making it an unforgettable experience. From the stunning landscapes to the warm hospitality, every moment was special. Highly recommended!', rating: 5, featured: 1, approved: 1 },
            { name: 'Ketema Hussen', role: 'Business Traveler', message: 'Professional service, easy transportation, and excellent support. My travel experience was smooth and enjoyable. The guides were knowledgeable and the hotels were top-notch. Will definitely use EPSEC again!', rating: 5, featured: 1, approved: 1 },
            { name: 'Alem Tesfalem', role: 'Adventure Seeker', message: 'Loved every moment! The destinations were breathtaking, and the guides were knowledgeable and friendly. The Simien Mountains trek was the highlight of my trip. EPSEC made everything so easy.', rating: 5, featured: 1, approved: 1 },
            { name: 'Sarah Chen', role: 'Solo Traveler', message: 'As a solo female traveler, I felt completely safe throughout my trip. The attention to detail and care shown by the EPSEC team was outstanding. Ethiopia exceeded all my expectations!', rating: 5, featured: 1, approved: 1 },
            { name: 'David Müller', role: 'Photographer', message: 'Ethiopia is a photographers paradise, and EPSEC knew exactly where to take me. From the rock churches of Lalibela to the colorful streets of Harar, every location was picture-perfect.', rating: 5, featured: 1, approved: 1 }
        ];
        testimonials.forEach(t => {
            db.prepare(`
                INSERT INTO testimonials (name, role, message, rating, featured, approved)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(t.name, t.role, t.message, t.rating, t.featured, t.approved);
        });

        // Admin user
        const { salt, hash } = hashPassword('admin123');
        db.prepare(`
            INSERT INTO users (email, password_hash, password_salt, first_name, last_name, role)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run('admin@epsec.com', hash, salt, 'Admin', 'EPSEC', 'admin');

        console.log('Database seeded successfully');
    }
}

// Get DB instance (must wait for initialization)
function getDb() {
    return db;
}

// Initialize and make ready promise available
dbReady = initializeDatabase();

module.exports = {
    get db() { return db; },
    getDb,
    dbReady,
    initializeDatabase,
    seedDatabase,
    hashPassword,
    verifyPassword
};

