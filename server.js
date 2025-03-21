require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConfig = require('./src/config/db.config');
const userRoutes = require('./src/routes/user.routes');
const calendarRoutes = require('./src/routes/calendar.routes');

const app = express();

// Set strictQuery to suppress the deprecation warning
mongoose.set('strictQuery', true);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB before starting the server
const connectDB = async () => {
    try {
        if (!dbConfig.url) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(dbConfig.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: dbConfig.database
        });
        console.log(`MongoDB Connected to database: ${dbConfig.database}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        
        // Routes
        app.use('/api/users', userRoutes);
        app.use('/api/calendar', calendarRoutes);

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();





