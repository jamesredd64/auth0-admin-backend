const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log('MongoDB Connected Successfully');
    
    // Initialize models after successful connection
    const db = {};
    db.mongoose = mongoose;
    db.url = dbConfig.url;
    db.user = require("./user.js");
    
    return db;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

