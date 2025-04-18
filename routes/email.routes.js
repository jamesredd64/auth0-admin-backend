const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware to parse JSON bodies
router.use(express.json());

// Middleware to verify API configuration
router.use((req, res, next) => {
  if (!process.env.MAILTRAP_API_KEY) {
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'Mailtrap API key is not configured'
    });
  }
  if (!process.env.EMAIL_FROM) {
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'Sender email is not configured'
    });
  }
  next();
});

router.post('/', async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // Enhanced validation with detailed errors
    const validationErrors = [];
    if (!to) validationErrors.push('recipient email (to) is required');
    if (!subject) validationErrors.push('subject is required');
    if (!body) validationErrors.push('email body is required');

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        details: validationErrors,
        receivedData: { to, subject, bodyPresent: !!body }
      });
    }

    const sender = {
      email: process.env.EMAIL_FROM,
      name: process.env.EMAIL_FROM_NAME || 'Mailtrap Test'
    };

    const recipients = Array.isArray(to) 
      ? to.map(email => ({ email }))
      : [{ email: to }];

    // Create the message payload matching the Mailtrap API format
    const payload = {
      from: sender,
      to: recipients,
      subject: subject,
      text: body,
      html: body,
      category: 'Integration Test'
    };

    // Send email using axios to match the curl request format
    const result = await axios({
      method: 'post',
      url: 'https://bulk.api.mailtrap.io/api/send',
      headers: {
        'Authorization': `Bearer ${process.env.MAILTRAP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: payload
    });

    console.log('Send result:', result.data);

    return res.json({
      success: true,
      messageId: result.data.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Detailed error information:', {
      name: error.name,
      message: error.message,
      response: error.response?.data
    });

    return res.status(500).json({
      error: 'Failed to send email',
      details: {
        message: error.response?.data?.message || error.message,
        type: error.name
      }
    });
  }
});

// Debug endpoint to verify configuration
router.get('/debug', (req, res) => {
  res.json({
    config: {
      hasToken: !!process.env.MAILTRAP_API_KEY,
      emailFrom: process.env.EMAIL_FROM,
      emailFromName: process.env.EMAIL_FROM_NAME
    }
  });
});

module.exports = router;

