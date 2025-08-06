
// Intent detection microservice using OpenAI API
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/intent', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an intent detection AI. Given a user message, reply with only the intent (e.g., greeting, question, complaint, feedback, etc.).' },
          { role: 'user', content: text }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const intent = response.data.choices[0].message.content.trim();
    res.json({ intent });
  } catch (err) {
    console.error('Intent detection error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Intent detection failed.' });
  }
});

app.listen(4002, () => {
  console.log('Intent service running on port 4002');
});
