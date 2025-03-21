const express = require('express');
const cors = require('cors');
const connectDB = require('./models/index.js');
const calendarRoutes = require('./routes/calendar.routes');
const userRoutes = require('./routes/user.routes.js');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'https://your-frontend-vercel-url.vercel.app'  // Add your frontend Vercel URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Connect to database before starting server
const startServer = async () => {
  try {
    const db = await connectDB();
    console.log('Database connection established');

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/calendar', calendarRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();



