
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let vectors = [];

app.post('/vectorize', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-ada-002',
        input: text
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const vector = response.data.data[0].embedding;
    vectors.push({ text, vector });
    res.json({ vector });
  } catch (err) {
    console.error('Vectorization error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Vectorization failed.' });
  }
});

app.get('/vectors', (req, res) => {
  res.json({ vectors });
});

app.listen(4003, () => {
  console.log('Vector service running on port 4003');
});
