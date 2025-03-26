const mongoose = require('mongoose');

// Log to verify model creation
console.log('Defining User model...');

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  profile: {
    profilePictureUrl: {
      type: String,
      default: ''
    }
  },
  marketingBudget: {
    adBudget: {
      type: Number,
      default: 0
    },
    costPerAcquisition: {
      type: Number,
      default: 0
    },
    dailySpendingLimit: {
      type: Number,
      default: 0
    },
    marketingChannels: {
      type: String,
      default: ''
    },
    monthlyBudget: {
      type: Number,
      default: 0
    },
    preferredPlatforms: {
      type: String,
      default: ''
    },
    notificationPreferences: {
      type: [String],
      default: []
    },
    roiTarget: {
      type: Number,
      default: 0
    },
    frequency: {
      type: String,
      enum: ['daily', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    }
  },
  address: {
    street: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    zipCode: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.statics.findByAuth0Id = function(auth0Id) {
  const decodedAuth0Id = decodeURIComponent(auth0Id);
  console.log('Finding user by decoded auth0Id:', decodedAuth0Id);
  return this.findOne({ auth0Id: decodedAuth0Id });
};

// Create indexes after model initialization
const createIndexes = async (model) => {
  try {
    console.log('Creating indexes...');
    // Add timeout promise
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Index creation timed out')), 30000)
    );
    
    const indexPromises = [
      model.collection.createIndex({ auth0Id: 1 }, { unique: true, background: true }),
      model.collection.createIndex({ email: 1 }, { unique: true, background: true })
    ];

    await Promise.race([
      Promise.all(indexPromises),
      timeout
    ]);
    
    console.log('Indexes created successfully');
  } catch (err) {
    console.error('Error creating indexes:', err);
    // Don't exit process, just log error
  }
};

const User = mongoose.model('User', userSchema);



module.exports = User;


