const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./services/mongodb.js');
const corsConfig = require('./config/cors.config.js');
const userRoutes = require('./routes/user.routes');
const calendarRoutes = require('./routes/calendar.routes');
const notificationRoutes = require('./routes/notifications');
const mongoose = require('mongoose');
const os = require('os');
const assetsRoutes = require('./routes/assets.routes');
const staticMiddleware = require('./middleware/static.middleware');

const app = express();

// Apply CORS configuration BEFORE other middleware
app.use(corsConfig);

// Handle OPTIONS preflight requests
app.options('*', corsConfig);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use('/images', staticMiddleware);
app.use('/public', express.static(path.join(__dirname, 'public')));

// Security headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*;"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes); // Removed jwtCheck
app.use('/api/assets', assetsRoutes); // Enable the assets routes

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
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
  const envInfo = getEnvironmentInfo();
  const status = {
    status: 'ok',
    timestamp: new Date(),
    environment: envInfo.environment,
    deployment: {
      platform: envInfo.platform,
      region: envInfo.region,
      git: envInfo.git
    },
    server: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      cpu: os.cpus()[0].model,
      loadAvg: os.loadavg(),
      port: process.env.PORT || 5000
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length
    }
  };
  
  res.json(status);
});

// Status page with UI
app.get('/status', (req, res) => {
  const envInfo = getEnvironmentInfo();
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = {
    rss: (memoryUsage.rss / 1024 / 1024).toFixed(2),
    heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
    heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2)
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Server Status - ${envInfo.platform}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png" href="/favicon.png">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
            color: #333;
          }
          .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          .status-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .status-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
          }
          .status-badge {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 500;
            font-size: 0.875rem;
          }
          .status-ok {
            background: #dcfce7;
            color: #166534;
          }
          .status-error {
            background: #fee2e2;
            color: #991b1b;
          }
          .metric {
            display: flex;
            justify-content: space-between;
            margin: 0.5rem 0;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
          }
          .metric:last-child {
            border-bottom: none;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          h2 {
            color: #374151;
            font-size: 1.25rem;
            margin: 0;
          }
          .refresh-button {
            padding: 0.5rem 1rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
          }
          .refresh-button:hover {
            background: #2563eb;
          }
          @media (max-width: 768px) {
            body {
              padding: 1rem;
            }
            .status-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="status-header">
          <h1>🚀 Server Status${envInfo.isVercel ? ' - Vercel' : ' - Local Dev'}</h1>
          <button class="refresh-button" onclick="window.location.reload()">
            Refresh Status
          </button>
        </div>

        <div class="status-grid">
          <div class="status-card">
            <h2>Environment</h2>
            <div class="metric">
              <span>Status</span>
              <span class="status-badge status-ok">Operational</span>
            </div>
            <div class="metric">
              <span>Environment</span>
              <span>${envInfo.environment}</span>
            </div>
            <div class="metric">
              <span>Platform</span>
              <span>${envInfo.platform}</span>
            </div>
            <div class="metric">
              <span>Port</span>
              <span>${process.env.PORT || 5000}</span>
            </div>
            ${envInfo.isVercel ? `
            <div class="metric">
              <span>Region</span>
              <span>${envInfo.region}</span>
            </div>
            ` : ''}
          </div>

          <div class="status-card">
            <h2>Server</h2>
            <div class="metric">
              <span>Uptime</span>
              <span>${days}d ${hours}h ${minutes}m ${seconds}s</span>
            </div>
            <div class="metric">
              <span>Node Version</span>
              <span>${process.version}</span>
            </div>
            <div class="metric">
              <span>Platform</span>
              <span>${process.platform}</span>
            </div>
            <div class="metric">
              <span>CPU</span>
              <span>${os.cpus()[0].model}</span>
            </div>
          </div>

          <div class="status-card">
            <h2>Memory Usage</h2>
            <div class="metric">
              <span>RSS</span>
              <span>${memoryUsageMB.rss} MB</span>
            </div>
            <div class="metric">
              <span>Heap Total</span>
              <span>${memoryUsageMB.heapTotal} MB</span>
            </div>
            <div class="metric">
              <span>Heap Used</span>
              <span>${memoryUsageMB.heapUsed} MB</span>
            </div>
          </div>

          <div class="status-card">
            <h2>Database</h2>
            <div class="metric">
              <span>Status</span>
              <span class="status-badge ${mongoose.connection.readyState === 1 ? 'status-ok' : 'status-error'}">
                ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div class="metric">
              <span>Host</span>
              <span>${mongoose.connection.host || 'N/A'}</span>
            </div>
            <div class="metric">
              <span>Database</span>
              <span>${mongoose.connection.name || 'N/A'}</span>
            </div>
            <div class="metric">
              <span>Collections</span>
              <span>${Object.keys(mongoose.connection.collections).length}</span>
            </div>
          </div>
        </div>

        <script>
          // Auto-refresh every 30 seconds
          setTimeout(() => window.location.reload(), 30000);
        </script>
      </body>
    </html>
  `;
  
  res.send(html);
});

const startServer = async () => {
  try {
    // Initialize static directories
    const publicDir = path.join(__dirname, 'public');
    const imagesDir = path.join(publicDir, 'images');
    
    // Ensure directories exist
    [publicDir, imagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Connect to database
    await connectDB();
    console.log('Database connection established');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Static files served from: ${path.join(__dirname, 'public')}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start server
startServer();

// Export the app for Vercel
module.exports = app;
