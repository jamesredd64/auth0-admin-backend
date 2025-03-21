const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date
  },
  allDay: {
    type: Boolean,
    default: true
  },
  extendedProps: {
    calendar: {
      type: String,
      enum: ['Danger', 'Success', 'Primary', 'Warning'],
      required: true
    }
  },
  userId: {
    type: String, // Auth0 ID
    required: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
calendarEventSchema.index({ start: 1, end: 1 });
calendarEventSchema.index({ userId: 1, start: 1 });
calendarEventSchema.index({ 'extendedProps.calendar': 1 });

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

module.exports = CalendarEvent;
