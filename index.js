const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(express.json());
app.use(cors({ origin: 'https://your-frontend-url.vercel.app' })); // Replace with frontend URL

app.post('/send-email', (req, res) => {
  const { name, email, subject, message, submissionTime } = req.body;
  console.log('Received message:', { name, email, subject, message, submissionTime });

  const logEntry = { name, email, subject, message, submissionTime, date: new Date() };
  fs.appendFile('messages.json', JSON.stringify(logEntry) + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).send('Error saving message');
    }
    res.status(200).send('Message received successfully');
  });
});

app.get('/messages', (req, res) => {
  fs.readFile('messages.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error fetching messages');
    }
    const messages = data.trim().split('\n').filter(line => line).map(line => JSON.parse(line));
    res.json(messages);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});