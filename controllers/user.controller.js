const mongoose = require('mongoose');
const User = require("../models/user.js");

// Add validation to ensure User model is loaded
if (!mongoose.models.User) {
    throw new Error('User model not properly initialized');
}

// Validate model schema and ensure required paths exist
const requiredPaths = ['auth0Id', 'email', 'marketingBudget', 'address'];  // Changed from 'profile.marketingBudget' to 'marketingBudget'
const userSchema = User.schema;

requiredPaths.forEach(path => {
    if (!userSchema.path(path) && !userSchema.nested[path]) {
        throw new Error(`Required path '${path}' missing in User schema`);
    }
});

// Initialize indexes with proper options
const indexPromises = [
    User.collection.createIndex({ auth0Id: 1 }, { unique: true }),
    User.collection.createIndex({ email: 1 }, { unique: true })
];

Promise.all(indexPromises).catch(err => {
    console.error('Error creating indexes:', err);
    throw err;
});

// Get user by auth0Id
exports.findByAuth0Id = async (req, res) => {
    try {
        const { auth0Id } = req.params;
        const decodedAuth0Id = decodeURIComponent(auth0Id);
        console.log('Controller: Searching for user with decoded auth0Id:', decodedAuth0Id);

        const user = await User.findOne({ auth0Id: decodedAuth0Id });
        console.log('Controller: MongoDB query result:', user);

        if (!user) {
            console.log('Controller: No user found for auth0Id:', decodedAuth0Id);
            // Return 204 status code to indicate no content but successful request
            return res.status(204).send();
        }

        res.json(user);
    } catch (err) {
        console.error('Controller: Error finding user:', err);
        res.status(500).json({
            message: "Error retrieving user",
            error: err.message
        });
    }
};

// Create a new User
exports.create = async (req, res) => {
    try {
        console.log('Creating new user with data:', req.body);
        
        const user = new User(req.body);
        const savedUser = await user.save();
        
        console.log('User created successfully:', savedUser);
        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({
            message: err.message || "Some error occurred while creating the User.",
            error: err.toString()
        });
    }
};

// Retrieve all Users
exports.findAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
};

// Find a single User with id
exports.findOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: `User not found with id ${req.params.id}`
            });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Error retrieving user with id " + req.params.id
        });
    }
};

// Update user by auth0Id
exports.update = async (req, res) => {
    try {
        const { auth0Id } = req.params;
        const updateData = req.body;
        
        console.log('Controller: Updating user:', auth0Id);
        console.log('Update data received:', JSON.stringify(updateData, null, 2));

        // Find the existing user
        const existingUser = await User.findOne({ auth0Id });
        
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create update object with dot notation for nested fields
        const updateObject = {
            $set: {
                'firstName': updateData.firstName || existingUser.firstName,
                'lastName': updateData.lastName || existingUser.lastName,
                'phoneNumber': updateData.phoneNumber || existingUser.phoneNumber,
                'email': updateData.email || existingUser.email,
                'profile.marketingBudget.frequency': updateData.profile?.marketingBudget?.frequency || existingUser.profile?.marketingBudget?.frequency,
                'profile.marketingBudget.adBudget': updateData.profile?.marketingBudget?.adBudget || existingUser.profile?.marketingBudget?.adBudget,
                'profile.marketingBudget.costPerAcquisition': updateData.profile?.marketingBudget?.costPerAcquisition || existingUser.profile?.marketingBudget?.costPerAcquisition,
                'profile.marketingBudget.dailySpendingLimit': updateData.profile?.marketingBudget?.dailySpendingLimit || existingUser.profile?.marketingBudget?.dailySpendingLimit,
                'profile.marketingBudget.monthlyBudget': updateData.profile?.marketingBudget?.monthlyBudget || existingUser.profile?.marketingBudget?.monthlyBudget,
                'profile.marketingBudget.roiTarget': updateData.profile?.marketingBudget?.roiTarget || existingUser.profile?.marketingBudget?.roiTarget,
                'profile.marketingBudget.marketingChannels': updateData.profile?.marketingBudget?.marketingChannels || existingUser.profile?.marketingBudget?.marketingChannels,
                'profile.marketingBudget.preferredPlatforms': updateData.profile?.marketingBudget?.preferredPlatforms || existingUser.profile?.marketingBudget?.preferredPlatforms,
                'profile.marketingBudget.notificationPreferences': updateData.profile?.marketingBudget?.notificationPreferences || existingUser.profile?.marketingBudget?.notificationPreferences,
                'address.street': updateData.address?.street || existingUser.address?.street,
                'address.city': updateData.address?.city || existingUser.address?.city,
                'address.state': updateData.address?.state || existingUser.address?.state,
                'address.zipCode': updateData.address?.zipCode || existingUser.address?.zipCode,
                'address.country': updateData.address?.country || existingUser.address?.country
            }
        };

        // Update the user
        const updatedUser = await User.findOneAndUpdate(
            { auth0Id },
            updateObject,
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            throw new Error('Update failed - user not found after update');
        }

        console.log('Updated user:', JSON.stringify(updatedUser, null, 2));
        res.json(updatedUser);
    } catch (err) {
        console.error('Error in update:', err);
        res.status(500).json({ 
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// Delete a User with id
exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                message: `Cannot delete User with id=${req.params.id}. User not found!`
            });
        }

        res.status(200).json({
            message: "User was deleted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Could not delete User with id=" + req.params.id
        });
    }
};

// Delete all Users
exports.deleteAll = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.status(200).json({
            message: `${result.deletedCount} Users were deleted successfully!`
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while removing all users."
        });
    }
};

// Find or Update User by email
// exports.findOrUpdate = async (req, res) => {
//     try {
//         const filter = { email: req.body.email };
//         const update = {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             phoneNumber: req.body.phoneNumber,
//             profile: req.body.profile,
//             address: req.body.address
//         };
//         const options = { new: true, upsert: true, runValidators: true };

//         const user = await User.findOneAndUpdate(filter, update, options);
//         res.status(200).json(user);
//     } catch (err) {
//         if (err.code === 11000) {
//             return res.status(409).json({
//                 message: "A user with this email already exists",
//                 error: {
//                     code: 11000,
//                     field: 'email'
//                 }
//             });
//         }
//         res.status(500).json({
//             message: err.message || "Some error occurred while saving the User."
//         });
//     }
// };

// Create or update a User
exports.createOrUpdate = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const userData = {
            auth0Id: req.body.auth0Id,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            profile: {
                dateOfBirth: req.body.dateOfBirth,
                // gender: req.body.gender,
                profilePictureUrl: req.body.profilePictureUrl,
                marketingBudget: {
                    frequency: req.body.profile?.marketingBudget?.frequency || 'monthly',
                    adBudget: req.body.profile?.marketingBudget?.adBudget || 0,
                    costPerAcquisition: req.body.profile?.marketingBudget?.costPerAcquisition || 0,
                    dailySpendingLimit: req.body.profile?.marketingBudget?.dailySpendingLimit || 0,
                    marketingChannels: req.body.profile?.marketingBudget?.marketingChannels || '',
                    monthlyBudget: req.body.profile?.marketingBudget?.monthlyBudget || 0,
                    preferredPlatforms: req.body.profile?.marketingBudget?.preferredPlatforms || '',
                    notificationPreferences: req.body.profile?.marketingBudget?.notificationPreferences || [],
                    roiTarget: req.body.profile?.marketingBudget?.roiTarget || 0
                }
            },
            address: {
                street: req.body.address?.street || '',
                city: req.body.address?.city || '',
                state: req.body.address?.state || '',
                zipCode: req.body.address?.zipCode || '',
                country: req.body.address?.country || ''
            }
        };

        const filter = { email: req.body.email };
        const update = { $set: userData };
        const options = { 
            new: true,           
            upsert: true,        
            runValidators: true, 
            setDefaultsOnInsert: true 
        };

        const user = await User.findOneAndUpdate(filter, update, options);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while saving the User."
        });
    }
};

// Add this new controller method
exports.saveUserData = async (req, res) => {
    try {
        const { auth0Id } = req.params;
        const updateData = req.body;
        
        console.log('Controller: Saving user data for:', auth0Id);
        console.log('Update data received:', JSON.stringify(updateData, null, 2));

        const updatedUser = await User.findOneAndUpdate(
            { auth0Id },
            { $set: updateData },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('User data saved successfully:', updatedUser);
        res.json(updatedUser);
    } catch (err) {
        console.error('Controller: Error saving user data:', err);
        res.status(500).json({
            message: "Error saving user data",
            error: err.message
        });
    }
};
























