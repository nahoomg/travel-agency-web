# Ethiopia Travel Agency Website (EPSEC Travel)

A full-stack travel booking web application for an Ethiopian travel agency, built with React (frontend) and Node.js with native HTTP module (backend).

## 🌍 Project Overview

This website allows users to:
- Browse destinations across Ethiopia
- View and book tour packages
- Create custom travel itineraries
- Contact the agency for inquiries
- Manage their bookings through a user profile

Administrators can:
- Manage bookings and inquiries
- View dashboard analytics
- Manage other admin accounts

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with hooks
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Custom Icon Component** - SVG icons (no external library)
- **Context API** - State management (AuthContext)

### Backend
- **Node.js** - Runtime environment
- **Native HTTP Module** - `http.createServer()` (no Express)
- **SQLite** - Database (with sql.js)
- **Session Tokens** - Authentication
- **Native Crypto** - Password hashing (PBKDF2)

## 📁 Project Structure

```
project-root/
│
├── README.md                    # Documentation
├── .gitignore                   # Git ignore rules
│
├── frontend/                    # React Application (Client UI)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Icon.jsx         # Custom SVG icon component
│   │   │   ├── admin/           # Admin dashboard components
│   │   │   ├── auth/            # Login/Register components
│   │   │   ├── booking/         # Booking wizard steps
│   │   │   ├── contact/         # Contact page components
│   │   │   ├── destination/     # Destination detail components
│   │   │   ├── home/            # Homepage sections
│   │   │   └── profile/         # User profile components
│   │   ├── context/             # React Context providers
│   │   ├── data/                # Static data constants
│   │   ├── pages/               # Route page components
│   │   └── api.js               # API client functions
│   ├── public/                  # Static assets
│   └── package.json
│
├── backend/                     # Node.js Server (Native HTTP)
│   ├── server.js                # Server entry point (http.createServer)
│   ├── database.js              # SQLite connection & seeding
│   ├── routes-native/           # API route handlers
│   │   ├── auth.js              # Authentication routes
│   │   ├── bookings.js          # Booking management
│   │   ├── destinations.js      # Destination data
│   │   ├── inquiries.js         # Contact form handling
│   │   ├── misc.js              # Hotels, guides, stats
│   │   └── packages.js          # Tour packages
│   ├── travel_agency.db         # SQLite database file
│   └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Ethiopia Travel Agency Website"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:3000`

2. **Start the Frontend Dev Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

> **Note:** The SQLite database is automatically created and seeded with sample data on first run.

## 🔐 Authentication

### Default Admin Account
- **Email:** admin@epsec.com
- **Password:** admin123

### User Registration
Users can register through the `/register` page. Authentication uses session tokens stored in localStorage.

## 📱 Key Features

### For Users
- **Home Page** - Hero section, services overview, featured destinations, testimonials
- **Destinations** - Browse all Ethiopian destinations with detailed information
- **Packages** - Pre-built tour packages with pricing and booking
- **Custom Booking** - Build personalized travel itineraries with date selection
- **Profile** - View and manage bookings, edit profile information

### For Admins
- **Dashboard** - Real-time booking statistics and overview
- **Bookings Tab** - View and manage all user bookings (confirm/cancel)
- **Inquiries Tab** - View contact form submissions
- **Admins Tab** - Create and manage admin accounts

## 🎨 Styling

The project uses:
- CSS Custom Properties (variables) for theming
- Component-scoped styles
- Responsive design with CSS Grid and Flexbox
- Mobile-first approach

### Color Palette
- Primary: Green tones - Ethiopian heritage
- Accent: Gold/amber - Ethiopian gold
- Neutral: Slate gray

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/me` | Update user profile |
| GET | `/api/auth/bookings` | Get user's bookings |
| GET | `/api/auth/admins` | Get all admins (admin only) |

### Destinations & Packages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | List all destinations |
| GET | `/api/destinations/:slug` | Get destination details |
| GET | `/api/packages` | List all packages |
| GET | `/api/packages/:id` | Get package details |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings` | Get all bookings (admin) |
| GET | `/api/bookings/:id` | Get booking details |
| PUT | `/api/bookings/:id` | Update booking status |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Submit contact form |
| GET | `/api/inquiries` | List all inquiries (admin) |
| GET | `/api/hotels` | List all hotels |
| GET | `/api/guides` | List all guides |
| GET | `/api/stats` | Get dashboard statistics |
| GET | `/api/health` | Health check endpoint |

## 📊 Database Schema

The SQLite database includes the following tables:
- **users** - User accounts and authentication
- **sessions** - Login session tokens
- **destinations** - Ethiopian destinations
- **tour_packages** - Pre-built tour packages
- **hotels** - Hotel listings by destination
- **guides** - Tour guide profiles
- **bookings** - User bookings
- **inquiries** - Contact form submissions
- **testimonials** - Customer reviews

## 🎓 Educational Notes

This project demonstrates:

### Frontend (React)
- **React Hooks** - useState, useEffect, useContext
- **Component Architecture** - Reusable, modular components
- **React Router** - Client-side routing for SPA
- **State Management** - React Context for global state
- **Responsive Design** - Mobile-first CSS approach

### Backend (Node.js)
- **Native HTTP Module** - `http.createServer()` without Express
- **RESTful API Design** - Proper HTTP methods and status codes
- **Manual Routing** - Custom route matching with path parameters
- **CORS Handling** - Cross-origin resource sharing headers
- **Authentication Flow** - Token-based session management

### Database (SQLite)
- **sql.js** - SQLite compiled to WebAssembly
- **Persistent Storage** - Data survives server restarts
- **Relational Schema** - Tables with foreign key relationships

## 📄 License

This project is for educational purposes only.
