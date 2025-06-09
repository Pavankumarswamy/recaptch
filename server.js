// script.js - Express server to verify reCAPTCHA v3 token

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // If you're on Node.js 18+, you can remove this and use global fetch
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual reCAPTCHA secret key
const RECAPTCHA_SECRET_KEY = '6Lf-hVorAAAAAHyl87kpEwR2RIEOSraqsuQg4TCk';

app.use(cors());
app.use(bodyParser.json());

// Route to verify reCAPTCHA token
app.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is missing' });
  }

  try {
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`;

    const response = await fetch(verificationURL, { method: 'POST' });
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed reCAPTCHA verification',
        score: data.score || 0,
        errors: data['error-codes']
      });
    }

    return res.json({
      success: true,
      score: data.score,
      action: data.action
    });

  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('🛡️ reCAPTCHA verification backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
