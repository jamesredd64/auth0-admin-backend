const cors = require('cors');

const productionOrigins = [
  'https://vite-front-end.vercel.app'
];

const developmentOrigins = [
  'http://localhost:3000',  // Frontend dev server
  'http://localhost:5173'   // Vite dev server
];

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? productionOrigins 
  : [...developmentOrigins, ...productionOrigins];

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

