// Summarization microservice (placeholder)
const express = require('express');
const app = express();
app.use(express.json());

app.post('/summarize', (req, res) => {
  const { text } = req.body;
  // TODO: Replace with real AI summarization
  const summary = text ? text.slice(0, 100) + '...' : '';
  res.json({ summary });
});

app.listen(4001, () => {
  console.log('Summarization service running on port 4001');
});
