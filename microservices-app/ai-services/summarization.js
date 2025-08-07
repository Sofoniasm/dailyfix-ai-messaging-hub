
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes chat conversations.' },
          { role: 'user', content: `Summarize this chat:\n${text}` }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const summary = response.data.choices[0].message.content.trim();
    res.json({ summary });
  } catch (err) {
    console.error('Summarization error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Summarization failed.' });
  }
});

app.listen(4001, () => {
  console.log('Summarization service running on port 4001');
});
