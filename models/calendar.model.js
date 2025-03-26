const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.startsWith('auth0|');
      },
      message: props => `${props.value} must start with "auth0|"`
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
  startTime: {
    type: String,
    default: '00:00'
  },
  endTime: {
    type: String,
    default: '23:59'
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


