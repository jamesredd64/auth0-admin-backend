const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the notification schema
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['all', 'selected'], 
    default: 'all' 
  },
  recipients: [{ type: String }],
  read: [{
    userId: { type: String, required: true },
    readAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notifications for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { type: 'all' },
        { recipients: req.params.userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new notification
router.post('/', async (req, res) => {
  const notification = new Notification({
    title: req.body.title,
    message: req.body.message,
    type: req.body.type,
    recipients: req.body.recipients,
    createdBy: req.body.createdBy
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark notification as read
router.post('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const userId = req.body.userId;
    if (!notification.read.some(r => r.userId === userId)) {
      notification.read.push({ userId });
      await notification.save();
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.remove();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;