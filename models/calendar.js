const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
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
      enum: ['danger', 'success', 'primary', 'warning'],
      required: true,
      lowercase: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    }
  },
  userId: {
    type: String,
    required: true,
    default: 'default'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString(); // Ensure ID is properly converted to string
      delete ret._id;
      delete ret.__v;
      // Ensure dates are in ISO format
      ret.start = ret.start.toISOString();
      ret.end = ret.end.toISOString();
      return ret;
    }
  }
});

// Indexes
calendarEventSchema.index({ start: 1, end: 1 });
calendarEventSchema.index({ userId: 1, start: 1 });
calendarEventSchema.index({ 'extendedProps.calendar': 1 });

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

module.exports = CalendarEvent;



