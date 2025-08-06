const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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

// Basic middleware
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users.route');
const hackathonRoutes = require('./routes/hackathons.route');
const adminRoutes = require('./routes/admin.route');

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/admin', adminRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
});

module.exports = app;