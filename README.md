# Ethiopia Travel Agency Website (EPSEC Travel)

A full-stack travel booking web application for an Ethiopian travel agency, built with React (frontend) and Node.js/Express (backend).

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
- **React 18** - UI library with hooks
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Lucide React** - Icon library
- **Context API** - State management (AuthContext)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database (with better-sqlite3)
- **Session Tokens** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

\`\`\`
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/          # Admin dashboard components
│   │   │   ├── auth/           # Login/Register components
│   │   │   ├── booking/        # Booking wizard steps
│   │   │   ├── contact/        # Contact page components
│   │   │   ├── destination/    # Destination detail components
│   │   │   ├── home/           # Homepage sections
│   │   │   └── profile/        # User profile components
│   │   ├── context/            # React Context providers
│   │   ├── data/               # Static data constants
│   │   ├── pages/              # Route page components
│   │   └── api.js              # API client functions
│   └── public/                 # Static assets
│
├── backend/
│   ├── routes/                 # API endpoint handlers
│   │   ├── auth.js             # Authentication routes
│   │   ├── bookings.js         # Booking management
│   │   ├── destinations.js     # Destination data
│   │   ├── inquiries.js        # Contact form handling
│   │   ├── misc.js             # Hotels, guides, stats
│   │   └── packages.js         # Tour packages
│   ├── server.js               # Express app entry point
│   └── database.js             # SQLite connection & seeding
│
└── CODE_GUIDE.md               # Educational documentation
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd "Ethiopia Travel Agency Website"
   \`\`\`

2. **Install Backend Dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Install Frontend Dependencies**
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

### Running the Application

1. **Start the Backend Server**
   \`\`\`bash
   cd backend
   npm start
   \`\`\`
   Server runs on \`http://localhost:3000\`

2. **Start the Frontend Dev Server** (in a new terminal)
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`
   App runs on \`http://localhost:5173\`

> **Note:** The SQLite database is automatically created and seeded with sample data on first run.

## 🔐 Authentication

### Default Admin Account
- **Email:** admin@epsec.com
- **Password:** admin123

### User Registration
Users can register through the \`/register\` page. Authentication uses session tokens stored in localStorage.

## 📱 Key Features

### For Users
- **Home Page** - Hero carousel, services overview, featured destinations, testimonials
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
- Component-scoped styles using inline \`<style>\` tags
- Responsive design with CSS Grid and Flexbox
- Mobile-first approach

### Color Palette
- Primary: Green tones (\`--primary-*\`) - Ethiopian heritage
- Accent: Gold/amber (\`--accent-*\`) - Ethiopian gold
- Neutral: Slate gray (\`--slate-*\`)

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/auth/register\` | User registration |
| POST | \`/api/auth/login\` | User login |
| GET | \`/api/auth/me\` | Get current user profile |
| PUT | \`/api/auth/me\` | Update user profile |
| GET | \`/api/auth/bookings\` | Get user's bookings |
| GET | \`/api/auth/admins\` | Get all admins (admin only) |

### Destinations & Packages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/destinations\` | List all destinations |
| GET | \`/api/destinations/:slug\` | Get destination details |
| GET | \`/api/packages\` | List all packages |
| GET | \`/api/packages/:id\` | Get package details |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/bookings\` | Create new booking |
| GET | \`/api/bookings\` | Get all bookings (admin) |
| GET | \`/api/bookings/:id\` | Get booking details |
| PUT | \`/api/bookings/:id\` | Update booking status |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/inquiries\` | Submit contact form |
| GET | \`/api/inquiries\` | List all inquiries (admin) |
| GET | \`/api/hotels\` | List all hotels |
| GET | \`/api/guides\` | List all guides |
| GET | \`/api/stats\` | Get dashboard statistics |

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
- **React Hooks** - useState, useEffect, useContext
- **Component Architecture** - Reusable, modular components
- **REST API Design** - Proper HTTP methods and status codes
- **Authentication Flow** - Token-based session management
- **State Management** - React Context for global state
- **Responsive Design** - Mobile-first CSS approach

See \`CODE_GUIDE.md\` for detailed explanations of the codebase.



## 📄 License

This project is for educational purposes only.
