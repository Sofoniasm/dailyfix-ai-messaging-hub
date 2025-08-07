// ...existing code...

// Place health check endpoint after app initialization
// Health check for AI microservices
app.get('/api/ai/health', async (req, res) => {
  const results = {};
  try {
    // Summarization
    try {
      const summarize = await axios.post('http://ai-services:4001/summarize', { text: 'health check' });
      results.summarize = summarize.data || 'OK';
    } catch (err) {
      results.summarize = err.message || 'Error';
    }
    // Intent
    try {
      const intent = await axios.post('http://ai-services:4002/intent', { text: 'health check' });
      results.intent = intent.data || 'OK';
    } catch (err) {
      results.intent = err.message || 'Error';
    }
    // Vector
    try {
      const vector = await axios.post('http://ai-services:4003/vectorize', { text: 'health check' });
      results.vector = vector.data || 'OK';
    } catch (err) {
      results.vector = err.message || 'Error';
    }
    // Report
    try {
      const report = await axios.get('http://ai-services:4004/report');
      results.report = report.data || 'OK';
    } catch (err) {
      results.report = err.message || 'Error';
    }
    res.json({ status: 'success', results });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// Sequelize/Postgres setup
const { sequelize, User } = require('./models');

// Sync DB
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('DB sync error:', err);
});

// Controllers
const userController = {
  // Removed normal user registration and login logic
};

const messageController = {
  sync: (req, res) => {
    res.json({ status: 'success', message: 'Messages synced!' });
  },
  getMessages: (req, res) => {
    res.json({
      messages: [
        { id: '1', sender: 'Alice', content: 'Hello!', timestamp: '2025-08-04T10:00:00Z' },
        { id: '2', sender: 'Bob', content: 'Hi there!', timestamp: '2025-08-04T10:01:00Z' },
      ]
    });
  }
};

// User registration
// Removed normal user registration and login endpoints
// Message sync
app.get('/api/sync-messages', messageController.sync);
// Message visualization
app.get('/api/messages', messageController.getMessages);


// --- AI Microservices Integration ---
const axios = require('axios');

// Matrix Synapse registration proxy
app.post('/api/matrix/register', async (req, res) => {
  const { username, password, homeserverUrl } = req.body;
  if (!username || !password || !homeserverUrl) {
    return res.status(400).json({ error: 'Username, password, and homeserverUrl are required.' });
  }
  try {
    const response = await axios.post(
      `${homeserverUrl}/_matrix/client/r0/register`,
      {
        username,
        password,
        auth: {
          type: 'm.login.dummy',
        },
      },
      {
        params: {
          kind: 'user',
        },
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Matrix registration error:', err.response ? err.response.data : err.message);
    const status = err.response ? err.response.status : 500;
    const error = err.response ? err.response.data : 'Internal Server Error';
    res.status(status).json({ error });
  }
});

// Summarization
// Summarization: fetch Matrix messages, send to AI summarization service
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const messagesResponse = await axios.get('http://localhost:3001/api/messages');
    const messages = messagesResponse.data && messagesResponse.data.messages ? messagesResponse.data.messages : [];
    const { data } = await axios.post('http://ai-services:4001/summarize', { messages });
    res.json(data);
  } catch (err) {
    console.error('AI summarize error:', err.message);
    res.status(500).json({ error: 'Summarization service error.' });
  }
});

// Intent detection
// Intent detection: fetch Matrix messages, send to AI intent service
app.post('/api/ai/intent', async (req, res) => {
  try {
    const messagesResponse = await axios.get('http://localhost:3001/api/messages');
    const messages = messagesResponse.data && messagesResponse.data.messages ? messagesResponse.data.messages : [];
    const { data } = await axios.post('http://ai-services:4002/intent', { messages });
    res.json(data);
  } catch (err) {
    console.error('AI intent error:', err.message);
    res.status(500).json({ error: 'Intent service error.' });
  }
});

// Vectorization
// Vectorization: fetch Matrix messages, send to AI vectorization service
app.post('/api/ai/vectorize', async (req, res) => {
  try {
    const messagesResponse = await axios.get('http://localhost:3001/api/messages');
    const messages = messagesResponse.data && messagesResponse.data.messages ? messagesResponse.data.messages : [];
    const { data } = await axios.post('http://ai-services:4003/vectorize', { messages });
    res.json(data);
  } catch (err) {
    console.error('AI vectorize error:', err.message);
    res.status(500).json({ error: 'Vector service error.' });
  }
});
app.get('/api/ai/vectors', async (req, res) => {
  try {
    const { data } = await axios.get('http://ai-services:4003/vectors');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Vector service error.' });
  }
});

// Daily report
// Daily report: fetch Matrix messages, send to AI report service
app.get('/api/ai/report', async (req, res) => {
  try {
    // Fetch messages from Matrix (or from backend's /api/messages)
    const messagesResponse = await axios.get('http://localhost:3001/api/messages');
    const messages = messagesResponse.data && messagesResponse.data.messages ? messagesResponse.data.messages : [];
    // Send messages to AI report service
    const { data } = await axios.post('http://ai-services:4004/report', { messages });
    res.json(data);
  } catch (err) {
    console.error('AI report error:', err.message);
    res.status(500).json({ error: 'Report service error.' });
  }
});

// Root route for health check or welcome
app.get('/', (req, res) => {
  res.send('<h2>Welcome to the DailyFix AI Messaging Hub Backend API</h2><p>API is running. Use /api/register, /api/login, /api/messages, etc.</p>');
});

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});
