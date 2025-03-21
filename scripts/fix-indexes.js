const mongoose = require('mongoose');
const { UserModel } = require('../models/user');
const dbConfig = require('../config/db.config.js');

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbConfig.database
    });

    console.log('Connected to database');

    // Drop all indexes
    await UserModel.collection.dropIndexes();
    console.log('Dropped all indexes');

    // Recreate indexes
    await UserModel.collection.createIndex(
      { auth0Id: 1 },
      { 
        unique: true,
        background: true,
        name: 'auth0Id_1'  // Give it a specific name
      }
    );
    await UserModel.collection.createIndex(
      { email: 1 },
      { 
        unique: true,
        background: true,
        name: 'email_1'
      }
    );
    
    console.log('Recreated indexes successfully');
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

fixIndexes();