const cors = require('cors');

const runMode = process.env.RUN_MODE || 'p';
const isDevMode = runMode.toLowerCase() === 'd';

const allowedOrigins = isDevMode
  ? [
      'http://localhost:5173',  // Vite default dev port
      'http://localhost:5000',  // Backend API port
      'http://localhost:3000'   // Alternative frontend port
    ]
  : [
      'https://vite-front-end.vercel.app',
      'https://admin-backend-eta.vercel.app'
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'X-Api-Version',
    'Authorization'
  ],
  credentials: true,
  maxAge: 86400
};

module.exports = cors(corsOptions);

