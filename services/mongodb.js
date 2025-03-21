const mongoose = require("mongoose");
const dbConfig = require("../config/db.config.js");

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    if (!dbConfig.url) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    const conn = await mongoose.connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbConfig.database,
      // Add these options for better security
      ssl: true,
      retryWrites: true,
      w: "majority"
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;


