const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',   // React dev port
  'http://localhost:5173',  // Vite dev port
  'http://localhost:5000',  // Backend API port
  'https://vite-front-end.vercel.app',
  'https://admin-backend-eta.vercel.app'
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
    'Authorization',
    'Origin',
    'Cache-Control',
    'Pragma'
  ],
  credentials: true,
  maxAge: 86400
};

module.exports = cors(corsOptions);

