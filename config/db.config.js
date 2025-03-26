
require('dotenv').config();

const isVercel = process.env.VERCEL === '1';
const runMode = process.env.RUN_MODE || 'p';
const isDevMode = !isVercel && runMode.toLowerCase() === 'd';

const config = {
  url: process.env.MONGODB_URI || "",
  database: isDevMode ? 'mongo-users-react-dev' : 'mongo-users-react',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    dbName: isDevMode ? 'mongo-users-react-dev' : 'mongo-users-react'
  }
};
console.log("Database name is  :", config.database);
module.exports = config;









