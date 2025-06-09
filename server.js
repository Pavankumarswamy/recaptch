// script.js - Express server to verify reCAPTCHA v2 token

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's port or fallback to 3000

// Use the correct reCAPTCHA v2 secret key
const RECAPTCHA_SECRET_KEY = '6LfTc1orAAAAAG5q5VUSMlz2DwxsMx1kCG7KR1jQ';

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
        errors: data['error-codes'],
      });
    }

    return res.json({ success: true }); // Simplified for v2

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
