const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller.js');

// Routes
router.post('/', calendarController.createEvent);
router.get('/', calendarController.getEvents);
router.get('/:id', calendarController.getEventById);
router.patch('/:id', calendarController.updateEvent);
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;

