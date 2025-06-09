const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body;
  const secretKey = '6LfTc1orAAAAAG5q5VUSMlz2DwxsMx1kCG7KR1jQ'; // Replace with your actual secret

  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: token,
      },
    });

    const { success, 'error-codes': errorCodes } = response.data;
    if (success) {
      res.json({ success: true });
    } else {
      console.error('reCAPTCHA verification failed:', errorCodes);
      res.json({ success: false, errorCodes });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
