
require('dotenv').config();

const config = {
  url: process.env.MONGODB_URI,
  database: 'mongo-users-react'
};

module.exports = config;







