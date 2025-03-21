const CalendarEvent = require('../models/calendar.model.js');

exports.createEvent = async (req, res) => {
  try {
    const event = new CalendarEvent(req.body);
    const savedEvent = await event.save();
    res.json({ success: true, event: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json({ success: true, events });
  } catch (error) {
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
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  console.log('[Calendar Controller] Delete Event Request:', {
    eventId: req.params.id,
    requestBody: req.body,
    requestHeaders: req.headers
  });

  try {
    console.log('[Calendar Controller] Attempting to find and delete event:', req.params.id);
    const event = await CalendarEvent.findByIdAndDelete(req.params.id);
    
    if (!event) {
      console.log('[Calendar Controller] Event not found:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found',
        eventId: req.params.id 
      });
    }

    console.log('[Calendar Controller] Event deleted successfully:', {
      eventId: req.params.id,
      eventDetails: event
    });

    res.json({ 
      success: true, 
      message: 'Event deleted successfully',
      deletedEvent: event 
    });
  } catch (error) {
    console.error('[Calendar Controller] Error deleting event:', {
      eventId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      errorDetails: {
        code: error.code,
        name: error.name
      }
    });
  }
};


