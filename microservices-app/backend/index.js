
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
  register: async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
      const existing = await User.findOne({ where: { [sequelize.Sequelize.Op.or]: [{ username }, { email }] } });
      if (existing) {
        return res.status(409).json({ error: 'User already exists.' });
      }
      await User.create({ username, email, password });
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      return res.status(500).json({ error: 'Server error.' });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({
        where: {
          [sequelize.Sequelize.Op.or]: [
            { username },
            { email: username }
          ],
          password
        }
      });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      return res.json({ message: 'Login successful.', user: { username: user.username, email: user.email } });
    } catch (err) {
      return res.status(500).json({ error: 'Server error.' });
    }
  }
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
app.post('/api/register', userController.register);
// User login
app.post('/api/login', userController.login);
// Message sync
app.get('/api/sync-messages', messageController.sync);
// Message visualization
app.get('/api/messages', messageController.getMessages);


// --- AI Microservices Integration ---
const axios = require('axios');

// Summarization
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { data } = await axios.post('http://ai-services:4001/summarize', req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Summarization service error.' });
  }
});

// Intent detection
app.post('/api/ai/intent', async (req, res) => {
  try {
    const { data } = await axios.post('http://ai-services:4002/intent', req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Intent service error.' });
  }
});

// Vectorization
app.post('/api/ai/vectorize', async (req, res) => {
  try {
    const { data } = await axios.post('http://ai-services:4003/vectorize', req.body);
    res.json(data);
  } catch (err) {
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
app.get('/api/ai/report', async (req, res) => {
  try {
    const { data } = await axios.get('http://ai-services:4004/report');
    res.json(data);
  } catch (err) {
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
