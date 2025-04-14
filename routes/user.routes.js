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
  try {
    const { auth0Id } = req.params;
    const updateData = req.body;
    
    console.log('Updating user with auth0Id:', auth0Id);
    console.log('Update data received:', JSON.stringify(updateData, null, 2));

    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      {
        $set: {
          email: updateData.email,
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          phoneNumber: updateData.phoneNumber,
          'profile.dateOfBirth': updateData.profile?.dateOfBirth,
          'profile.gender': updateData.profile?.gender,
          'profile.profilePictureUrl': updateData.profile?.profilePictureUrl,
          'profile.marketingBudget.adBudget': updateData.profile?.marketingBudget?.adBudget,
          'profile.marketingBudget.costPerAcquisition': updateData.profile?.marketingBudget?.costPerAcquisition,
          'profile.marketingBudget.dailySpendingLimit': updateData.profile?.marketingBudget?.dailySpendingLimit,
          'profile.marketingBudget.marketingChannels': updateData.profile?.marketingBudget?.marketingChannels,
          'profile.marketingBudget.monthlyBudget': updateData.profile?.marketingBudget?.monthlyBudget,
          'profile.marketingBudget.preferredPlatforms': updateData.profile?.marketingBudget?.preferredPlatforms,
          'profile.marketingBudget.notificationPreferences': updateData.profile?.marketingBudget?.notificationPreferences,
          'profile.marketingBudget.roiTarget': updateData.profile?.marketingBudget?.roiTarget,
          'profile.marketingBudget.frequency': updateData.profile?.marketingBudget?.frequency,
          'address.street': updateData.address?.street,
          'address.city': updateData.address?.city,
          'address.state': updateData.address?.state,
          'address.zipCode': updateData.address?.zipCode,
          'address.country': updateData.address?.country,
          isActive: updateData.isActive
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      console.log('No user found for update');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ 
      message: 'Error updating user',
      error: err.message
    });
  }
});

// Add this new route
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














