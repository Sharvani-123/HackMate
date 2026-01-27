const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { verifyFirebaseToken } = require('./middleware/auth.middleware');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// CORS middleware - Allow frontend to connect
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true
}));

app.use(express.json());

// Apply authentication globally to all routes
app.use(verifyFirebaseToken);

// Import routes
const userRoutes = require('./routes/users.route');
const hackathonRoutes = require('./routes/hackathons.route');
const adminRoutes = require('./routes/admin.route');
const teamRoutes = require('./routes/teams.route');
const globalLimiter = require('./middleware/rateLimiter.middleware');

//Rate Limiter
app.use('/api', globalLimiter);
// Register routes
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teams', teamRoutes);
// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
});

module.exports = app;