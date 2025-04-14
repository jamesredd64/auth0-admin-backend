const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Accept any Auth0 ID format (auth0|, google-oauth2|, etc.)
        return v.includes('|');
      },
      message: props => `${props.value} must be a valid Auth0 ID`
    }
  },
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: true
  },
  extendedProps: {
    calendar: {
      type: String,
      required: true,
      enum: ['danger', 'success', 'primary', 'warning']
    },
    description: String,
    location: String
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add index for auth0Id
calendarEventSchema.index({ auth0Id: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);


