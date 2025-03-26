const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  auth0Id: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.startsWith('auth0|');
      },
      message: props => `${props.value} must start with "auth0|"`
    }
  }
}, {
  timestamps: true
});

// Add index for auth0Id
calendarEventSchema.index({ auth0Id: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
