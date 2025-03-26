const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

<<<<<<< HEAD
const corsOptions = {
  origin: 'https://vite-front-end.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS before any other middleware
app.use(cors(corsOptions));

=======
// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';
const runMode = process.env.RUN_MODE || 'p';
const isDevMode = !isVercel && runMode.toLowerCase() === 'd';

// Updated CORS configuration with dynamic origins
const allowedOrigins = isDevMode
  ? [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000'
    ]
  : [
      'https://vite-front-end.vercel.app',
      'https://admin-backend-eta.vercel.app'
    ];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Added PATCH
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Date',
    'X-Api-Version'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
>>>>>>> import-backup
app.use(express.json());

// Remove or modify the security headers middleware that's adding additional CORS headers
// Instead, use this simplified version:
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*;"
  );
  next();
}); // <meta http-equiv="Content-Security-Policy" content="style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;">



app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/calendar', calendarRoutes);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message 
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource was not found' 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const startServer = async () => {
  try {
    const db = await connectDB();
    console.log('Database connection established');

<<<<<<< HEAD
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
=======
    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/calendar', calendarRoutes);

    // Add error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ 
        error: 'Something broke!',
        message: err.message 
      });
    });

    // Handle 404s
    app.use((req, res) => {
      res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested resource was not found' 
      });
    });

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        message: 'Server is running',
        mode: isDevMode ? 'development' : 'production',
        environment: isVercel ? 'vercel' : 'local'
      });
    });

    // Only start the server if we're not on Vercel
    if (!isVercel) {
      const PORT = process.env.PORT || (isDevMode ? 5000 : 3000);
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${isDevMode ? 'development' : 'production'} mode`);
      });
    }
>>>>>>> import-backup
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start server if not on Vercel
if (!isVercel) {
  startServer();
}

// Export the app for Vercel
module.exports = app;




















