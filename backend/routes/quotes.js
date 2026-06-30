const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    console.error('GET /api/quotes failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { text, author } = req.body;
    const quote = new Quote({ text, author });
    await quote.save();
    res.status(201).json(quote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;