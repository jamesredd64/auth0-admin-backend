const mongoose = require('mongoose');
const CalendarEvent = require('../models/calendar');
const testData = require('../data/testCalendarEvents.json');
require('dotenv').config();

const insertTestEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://jredd2013:Zeusyboy4ever!!@mern-cluster.oistpfp.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing events
    await CalendarEvent.deleteMany({});
    console.log('Cleared existing events');

    // Insert test events
    for (const eventData of testData.events) {
      const event = new CalendarEvent(eventData);
      await event.save();
      console.log(`Inserted event: ${event.title}`);
    }

    console.log('All test events inserted successfully');
  } catch (error) {
    console.error('Error inserting test events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
insertTestEvents();