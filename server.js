const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/tasks', (req, res) => {
  fs.readFile('./tasks.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading tasks file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/tasks', (req, res) => {
  const tasks = req.body;
  fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', err => {
    if (err) {
      res.status(500).send('Error saving tasks');
    } else {
      res.status(200).send('Tasks saved successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
