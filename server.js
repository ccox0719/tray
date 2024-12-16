const express = require('express');
const app = express();
const PORT = 3000;

// Your Joshua Project API key
const API_KEY = '5a7a72d15225';

// Proxy Endpoint to Fetch Data
app.get('/api/daily-prayer', async (req, res) => {
  try {
    const response = await fetch(`https://api.joshuaproject.net/v1/daily-prayer?api_key=${API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching daily prayer:', error);
    res.status(500).send('Error fetching data');
  }
});

// Serve static files
app.use(express.static('public'));

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
