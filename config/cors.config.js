const cors = require('cors');

const productionOrigins = [
  'https://vite-front-end.vercel.app',
  'https://admin-backend-eta.vercel.app',
  'capacitor://localhost', // For mobile apps using Capacitor
  'ionic://localhost',     // For Ionic apps
  'http://localhost',      // For local mobile testing
  'null',                 // For some mobile browsers
  '*'                     // WARNING: Only for testing. Remove in production
];

const developmentOrigins = [
  'http://localhost:3000',    // Frontend dev server
  'http://localhost:5173',    // Vite dev server
  'http://localhost',         // Generic localhost
  'capacitor://localhost',    // For mobile apps using Capacitor
  'ionic://localhost',        // For Ionic apps
  'http://192.168.1.*',      // Local network IPs
  'null'                     // For some mobile browsers
];

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? productionOrigins 
  : [...developmentOrigins, ...productionOrigins];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin matches any allowed patterns
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin === '*') return true;
      if (allowedOrigin.includes('*')) {
        const pattern = new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$');
        return pattern.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);

