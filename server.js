const express = require('express');
const path = require('path');
require('dotenv').config();

const connectDB = require('./services/mongodb.js');
const corsConfig = require('./config/cors.config.js');
const userRoutes = require('./routes/user.routes');
const calendarRoutes = require('./routes/calendar.routes');

const app = express();

// Apply CORS configuration BEFORE other middleware
app.use(corsConfig);

// Handle OPTIONS preflight requests
app.options('*', corsConfig);

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.json());

// Simplified security headers
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
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/calendar', calendarRoutes);

// Error handling middleware
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

// Health check endpoint with detailed info
app.get('/api/health', (req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    server: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  };
  
  res.json(status);
});

// Simple HTML status page for browser viewing
app.get('/', (req, res) => {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Server Status</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
          }
          .status-card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .status-ok {
            color: #2ecc71;
            font-weight: bold;
          }
          .status-error {
            color: #e74c3c;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="status-card">
          <h1>🚀 Server Status</h1>
          <p>Status: <span class="status-ok">Running</span></p>
          <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
          <p>Uptime: ${days}d ${hours}h ${minutes}m</p>
          <p>Node Version: ${process.version}</p>
          <p>Database: <span class="${mongoose.connection.readyState === 1 ? 'status-ok' : 'status-error'}">
            ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
          </span></p>
          <p>Last Updated: ${new Date().toLocaleString()}</p>
        </div>
        <div class="status-card">
          <h2>API Endpoints</h2>
          <p>Health Check: <code>/api/health</code></p>
          <p>Users API: <code>/api/users</code></p>
          <p>Calendar API: <code>/api/calendar</code></p>
        </div>
      </body>
    </html>
  `;
  
  res.send(html);
});

const startServer = async () => {
  try {
    await connectDB(); // Remove the db variable since we don't use it
    console.log('Database connection established');

    const PORT = process.env.PORT || (isDevMode ? 5000 : 3000);
    app.listen(PORT, () => {
      console.log(`Server is running on port`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start server  
startServer();

// Export the app for Vercel
module.exports = app;




















