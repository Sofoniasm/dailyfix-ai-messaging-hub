const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Dummy endpoint for message sync
app.get('/api/sync-messages', (req, res) => {
  res.json({ status: 'success', message: 'Messages synced!' });
});

// Dummy endpoint for message visualization
app.get('/api/messages', (req, res) => {
  res.json({
    messages: [
      { id: '1', sender: 'Alice', content: 'Hello!', timestamp: '2025-08-04T10:00:00Z' },
      { id: '2', sender: 'Bob', content: 'Hi there!', timestamp: '2025-08-04T10:01:00Z' },
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});
