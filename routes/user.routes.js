const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const userController = require('../controllers/user.controller.js');

// Add request logging
router.use((req, res, next) => {
  console.log('User Route:', req.method, req.url);
  next();
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Get user by auth0Id
router.get('/:auth0Id', userController.findByAuth0Id);

// Create new user
router.post('/', async (req, res) => {
  try {
    const { auth0Id, email } = req.body;

    if (!auth0Id || !email) {
      return res.status(400).json({ 
        message: "Both auth0Id and email are required",
        receivedData: { auth0Id, email }
      });
    }

    // Use findOneAndUpdate to either update existing user or create new one
    const user = await User.findOneAndUpdate(
      { $or: [{ email }, { auth0Id }] },
      req.body,
      { 
        new: true,           // Return the updated document
        upsert: true,        // Create document if it doesn't exist
        runValidators: true  // Run schema validators on update
      }
    );
    
    const statusCode = user.createdAt === user.updatedAt ? 201 : 200;
    res.status(statusCode).json(user);
  } catch (err) {
    console.error('Error creating/updating user:', err);
    res.status(500).json({ 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Update user by auth0Id
router.put('/:auth0Id', async (req, res) => {
  const { auth0Id } = req.params;
  const { section } = req.query;
  const updates = req.body;

  try {
    let updateQuery = {};

    switch (section) {
      case 'meta':
        updateQuery = {
          email: updates.email,
          firstName: updates.firstName,
          lastName: updates.lastName,
          phoneNumber: updates.phoneNumber,
          profile: updates.profile
        };
        break;
      case 'address':
        updateQuery = { address: updates.address };
        break;
      case 'marketing':
        updateQuery = { marketingBudget: updates.marketingBudget };
        break;
      default:
        // If no section specified, update all fields
        updateQuery = updates;
    }

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      { $set: updateQuery },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save user data
router.put('/:auth0Id/save', userController.saveUserData);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../models/user.js');
// const userController = require('../controllers/user.controller.js');

// // Get user by auth0Id
// router.get('/:auth0Id', userController.findByAuth0Id);

// // Create new user
// router.post('/', async (req, res) => {
//   try {
//     const { auth0Id, email } = req.body;

//     if (!auth0Id || !email) {
//       return res.status(400).json({ 
//         message: "Both auth0Id and email are required",
//         receivedData: { auth0Id, email }
//       });
//     }

//     // Use findOneAndUpdate to either update existing user or create new one
//     const user = await User.findOneAndUpdate(
//       { $or: [{ email }, { auth0Id }] },
//       req.body,
//       { 
//         new: true,           // Return the updated document
//         upsert: true,        // Create document if it doesn't exist
//         runValidators: true  // Run schema validators on update
//       }
//     );
    
//     const statusCode = user.createdAt === user.updatedAt ? 201 : 200;
//     res.status(statusCode).json(user);
//   } catch (err) {
//     console.error('Error creating/updating user:', err);
//     res.status(500).json({ 
//       message: err.message,
//       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
//   }
// });

// module.exports = router;














