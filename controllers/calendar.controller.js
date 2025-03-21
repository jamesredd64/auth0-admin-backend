const CalendarEvent = require('../models/calendar');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
  try {
    console.log('Received event data:', req.body);

    // Validate required fields
    if (!req.body.title || !req.body.start) {
      return res.status(400).json({
        success: false,
        message: 'Title and start date are required'
      });
    }

    // Format the dates properly
    const eventData = {
      _id: req.body.id || new mongoose.Types.ObjectId(), // Use provided ID or generate new
      title: req.body.title,
      start: new Date(req.body.start),
      end: req.body.end ? new Date(req.body.end) : new Date(req.body.start),
      allDay: req.body.allDay || true,
      userId: req.body.userId || 'default',
      extendedProps: {
        calendar: req.body.extendedProps?.calendar?.toLowerCase(),
        description: req.body.extendedProps?.description || '',
        location: req.body.extendedProps?.location || ''
      }
    };

    console.log('Formatted event data:', eventData);

    const event = new CalendarEvent(eventData);
    const savedEvent = await event.save();
    
    console.log('Event saved successfully:', savedEvent);
    
    res.status(201).json({
      success: true,
      event: savedEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.stack
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};







