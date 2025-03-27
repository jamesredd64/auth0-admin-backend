const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Configure mongoose
    mongoose.set('strictQuery', true);
    
    // Connect with merged options
    await mongoose.connect(dbConfig.url, {
      ...dbConfig.options,
      dbName: dbConfig.database
    });
    
    console.log('MongoDB Connected Successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
    
    // Initialize models after successful connection
    const db = {};
    db.mongoose = mongoose;
    db.url = dbConfig.url;
    db.user = require("./user.js");
    
    return db;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      name: err.name
    });
    process.exit(1);
  }
};

module.exports = connectDB;


