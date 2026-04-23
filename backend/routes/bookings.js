const express = require('express');
const db = require('../db');
const router = express.Router();

// POST a new booking — saved permanently to db.json
router.post('/', (req, res) => {
  const { date, time, buyerEmail, productId } = req.body;
  if (!date || !time || !buyerEmail) {
    return res.status(400).json({ error: 'Missing required booking details.' });
  }

  const newBooking = {
    id: Date.now().toString(),
    productId: productId || null,
    date,
    time,
    buyerEmail,
    status: 'SCHEDULED',
    createdAt: new Date().toISOString()
  };

  db.push('bookings', newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

// GET all bookings from the JSON database
router.get('/', (req, res) => {
  const bookings = db.get('bookings');
  res.status(200).json({ success: true, bookings });
});

module.exports = router;
