# Code Guide - Understanding the EPSEC Travel Website

This guide explains the key concepts and architecture of the Ethiopia Travel Agency website. It's designed to help you understand and present the codebase.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Frontend Concepts](#frontend-concepts)
3. [Backend Concepts](#backend-concepts)
4. [Key Files Explained](#key-files-explained)
5. [Common Patterns](#common-patterns)
6. [Presentation Tips](#presentation-tips)

---

## Architecture Overview

This is a **full-stack web application** with three main parts:

```
┌─────────────────┐     HTTP      ┌─────────────────┐     Database    ┌─────────────────┐
│    Frontend     │ ◄──────────► │     Backend     │ ◄─────────────► │     SQLite      │
│   (React/Vite)  │   Requests   │ (Node/Express)  │    Queries      │   (Database)    │
└─────────────────┘              └─────────────────┘                 └─────────────────┘
```

**How they communicate:**
1. User interacts with the React frontend
2. Frontend makes API calls to the Express backend
3. Backend queries SQLite database and returns data
4. Frontend displays the data to the user

---

## Frontend Concepts

### What is React?
React is a JavaScript library for building user interfaces. It uses **components** - reusable pieces of UI that can have their own logic and styling.

### Component Structure
```jsx
// A simple React component
const Greeting = ({ name }) => {
    return <h1>Hello, {name}!</h1>;
};
```

**Key concepts:**
- **Props** - Data passed from parent to child component (like function arguments)
- **State** - Data that can change and trigger re-renders
- **Hooks** - Functions that let you use React features (useState, useEffect, etc.)

### File Organization

```
src/
├── pages/           # Full page components (one per route)
│   ├── Home.jsx
│   ├── Destinations.jsx
│   └── ...
│
├── components/      # Reusable UI pieces
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── booking/     # Related components grouped together
│       ├── TripDetailsStep.jsx
│       └── ...
│
├── context/         # Global state management
│   └── AuthContext.jsx
│
└── data/            # Static configuration data
    └── bookingOptions.js
```

### Important Files

#### `App.jsx` - The Main Application
This is the root component that sets up:
- **Routing** - Which component shows for which URL
- **Layout** - Navbar and Footer wrapper
- **Authentication** - Checking if user is logged in

```jsx
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/destinations" element={<Destinations />} />
    {/* More routes... */}
</Routes>
```

#### `AuthContext.jsx` - User Authentication State
React Context provides a way to share data across all components without passing props through every level.

```jsx
// Creating context
const AuthContext = createContext();

// Using it in any component
const { user, login, logout } = useAuth();
```

This allows any component to check if a user is logged in and access their info.

#### `api.js` - Backend Communication
All API calls to the backend are defined here. This keeps network logic in one place.

```jsx
export const api = {
    getDestinations: async () => {
        const response = await fetch('/api/destinations');
        return response.json();
    },
    // ...more methods
};
```

### React Hooks Used

| Hook | Purpose | Example |
|------|---------|---------|
| `useState` | Store component data | `const [name, setName] = useState('')` |
| `useEffect` | Run code on component mount/update | Fetching data when page loads |
| `useContext` | Access shared state | Getting logged-in user info |
| `useParams` | Get URL parameters | Getting destination ID from URL |
| `useNavigate` | Programmatic navigation | Redirect after login |

### Styling Approach
The project uses **CSS-in-JS** with style tags inside components:

```jsx
const Button = () => (
    <>
        <button className="my-button">Click me</button>
        <style>{`
            .my-button {
                background: var(--primary-500);
                color: white;
            }
        `}</style>
    </>
);
```

**Why this approach?**
- Styles are scoped to components
- Easy to see styles alongside logic
- Uses CSS variables for consistent theming

---

## Backend Concepts

### What is Express.js?
Express is a web framework for Node.js that handles HTTP requests and responses.

```javascript
app.get('/api/destinations', (req, res) => {
    // Handle GET request to /api/destinations
    res.json(destinations);
});
```

### API Routes Structure

```
backend/routes/
├── auth.js          # Login, register, user management
├── bookings.js      # Create and manage bookings
├── destinations.js  # Get destination data
├── inquiries.js     # Contact form submissions
└── packages.js      # Tour packages
```

### Authentication Flow

1. **Register/Login**: User sends credentials
2. **Server validates**: Checks password with bcrypt
3. **Session Token**: Server creates a random token and stores in sessions table
4. **Token stored**: Frontend saves token in localStorage
5. **Authenticated requests**: Token sent in request headers

```javascript
// Creating a session token
const token = crypto.randomUUID();
db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);
```

### SQLite Database

SQLite is a **lightweight relational database** that stores data in a single file.

We use **better-sqlite3** - a fast, synchronous SQLite library for Node.js.

```javascript
// Querying the database
const destinations = db.prepare('SELECT * FROM destinations').all();
const destination = db.prepare('SELECT * FROM destinations WHERE slug = ?').get(slug);
```

---

## Key Files Explained

### Frontend

| File | Purpose |
|------|---------|
| `main.jsx` | Entry point - renders App into DOM |
| `App.jsx` | Root component with routing |
| `api.js` | All API call functions |
| `AuthContext.jsx` | User authentication state |
| `Home.jsx` | Landing page (uses 6 sub-components) |
| `BookingWizard.jsx` | Multi-step booking form |
| `AdminDashboard.jsx` | Admin panel with tabs |

### Backend

| File | Purpose |
|------|---------|
| `server.js` | Express app setup & middleware |
| `database.js` | SQLite connection & table setup |
| `routes/auth.js` | User authentication endpoints |
| `routes/bookings.js` | Booking CRUD operations |
| `routes/misc.js` | Hotels, guides, stats endpoints |

---

## Common Patterns

### 1. Data Fetching with useEffect
```jsx
useEffect(() => {
    const fetchData = async () => {
        const data = await api.getDestinations();
        setDestinations(data);
    };
    fetchData();
}, []); // Empty array = run once on mount
```

### 2. Conditional Rendering
```jsx
{loading ? (
    <Spinner />
) : (
    <DestinationList destinations={destinations} />
)}
```

### 3. Form Handling
```jsx
const [formData, setFormData] = useState({ name: '', email: '' });

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    await api.submitForm(formData);
};
```

### 4. Component Composition
Large pages are split into smaller components:
```jsx
// Home.jsx
const Home = () => (
    <div>
        <HeroSection />      {/* Hero banner */}
        <StatsBar />         {/* Company stats */}
        <ServicesSection />  {/* Why choose us */}
        <DestinationsPreview /> {/* Featured destinations */}
        <TestimonialsSection /> {/* Customer reviews */}
        <CTABanner />        {/* Call to action */}
    </div>
);
```

---

## Presentation Tips

### Key Points to Highlight

1. **Component-Based Architecture**
   - "The frontend is built with reusable components"
   - "Each component handles its own logic and styling"
   - Show how Home.jsx imports and uses smaller components

2. **API Communication**
   - "Frontend and backend communicate via REST API"
   - "Data is fetched using async/await and the Fetch API"
   - Show api.js as the central place for all backend calls

3. **Authentication**
   - "Users can register and login"
   - "JWT tokens are used for secure authentication"
   - "Protected routes check if user is logged in"

4. **Database**
   - "SQLite stores all our data in a single file"
   - "Tables are created in database.js with SQL CREATE statements"
   - Show database.js as an example

### Demo Flow Suggestion

1. **Start on Home page** - Show the landing page
2. **Browse Destinations** - Click through to destination detail
3. **View Packages** - Show available tour packages
4. **Register/Login** - Create an account or login
5. **Book a Package** - Walk through the booking wizard
6. **View Profile** - Show user's bookings
7. **Admin Dashboard** - Login as admin and show management features

### Questions You Might Be Asked

**Q: Why React?**
A: React is one of the most popular frontend libraries. It allows us to build reusable components and efficiently update the UI when data changes.

**Q: Why SQLite?**
A: SQLite is lightweight and requires no separate server. It stores all data in a single file, making it easy to set up and perfect for smaller applications.

**Q: How does authentication work?**
A: When a user logs in, the server creates a session token and stores it in the sessions table. This token is saved in the browser's localStorage and sent with every request to prove the user is authenticated.

**Q: What is the Context API?**
A: It's React's built-in way to share data across many components without passing props through every level. We use it for user authentication state.

---

## Code Snippets for Demonstration

### Show a Simple Component
```jsx
// components/home/StatsBar.jsx
const StatsBar = () => (
    <section className="stats-bar">
        {stats.map((stat, i) => (
            <div key={i} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
            </div>
        ))}
    </section>
);
```

### Show an API Call
```jsx
// Fetching destinations
useEffect(() => {
    api.getDestinations()
        .then(data => setDestinations(data))
        .catch(err => console.error(err));
}, []);
```

### Show a Backend Route
```javascript
// routes/destinations.js
router.get('/', (req, res) => {
    const destinations = db.prepare('SELECT * FROM destinations').all();
    res.json(destinations);
});
```

---

