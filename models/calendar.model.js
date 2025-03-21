const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false, // Mongoose will handle _id automatically
  },
  title: {
    type: String,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
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
      ret.id = ret._id; // Ensure the ID is properly set
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
