const CalendarEvent = require('../models/calendar.model');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);

    if (!req.body.title || !req.body.start || !req.body.auth0Id) {
      return res.status(400).json({
        success: false,
        message: 'Title, start date, and auth0Id are required'
      });
    }

    const eventData = {
      title: req.body.title,
      start: new Date(req.body.start),
      end: new Date(req.body.end || req.body.start),
      allDay: req.body.allDay ?? true,
      auth0Id: req.body.auth0Id,
      extendedProps: {
        calendar: req.body.extendedProps?.calendar || 'primary',
        description: req.body.extendedProps?.description || '',
        location: req.body.extendedProps?.location || ''
      }
    };

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
      message: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json({
      success: true,
      events: formattedEvents
    });
  } catch (error) {
    res.json({
      success: false,
      events: []
    });
  }
};

// Modified to search by auth0Id instead of _id
exports.getEventById = async (req, res) => {
  try {
    console.log('Fetching events for auth0Id:', req.params.id);
    const events = await CalendarEvent.find({ auth0Id: req.params.id });
    console.log('Found events in DB:', events.length);
    
    if (!events || events.length === 0) {
      console.log('No events found for user');
      return res.json([]); 
    }
    
    const formattedEvents = events.map(event => ({
      id: event._id.toString(),
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: event.extendedProps
    }));

    console.log('Returning formatted events:', formattedEvents.length);
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error in getEventById:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const parseDate = (dateStr, isEndDate) => {
      const date = new Date(dateStr);
      if (!isEndDate) {
        return date.toISOString();
      }
      // For end date, ensure it's set to the end of the day
      date.setHours(23, 59, 59, 999);
      return date.toISOString();
    };

    const updateData = {
      ...req.body,
      start: parseDate(req.body.start, false),
      end: parseDate(req.body.end, true)
    };

    console.log('Processing event update:', {
      receivedStart: req.body.start,
      receivedEnd: req.body.end,
      processedStart: updateData.start,
      processedEnd: updateData.end
    });

    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
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



















