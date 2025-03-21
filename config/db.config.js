
require('dotenv').config();

const config = {
  url: process.env.MONGODB_URI || "mongodb+srv://jredd2013:Fh2LRJ8gwALoWDWm@mern-cluster.oistpfp.mongodb.net/mongo-users-react?retryWrites=true&w=majority",
  database: 'mongo-users-react',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    dbName: 'mongo-users-react' // Explicitly set database name
  }
};

module.exports = config;









