const express = require('express');
const db = require('../db');
const router = express.Router();

// GET current availability from the JSON database
router.get('/', (req, res) => {
  const availability = db.get('availability');
  res.status(200).json({ success: true, availability });
});

// POST (update) availability — saved permanently to db.json
router.post('/', (req, res) => {
  const { days, times } = req.body;
  if (days && times) {
    const updated = db.set('availability', { days, times });
    res.status(200).json({ success: true, availability: updated });
  } else {
    res.status(400).json({ error: 'Missing days or times in availability payload' });
  }
});

module.exports = router;
