const express = require('express');
const db = require('../db');
const router = express.Router();

// GET full platform overview for admin
router.get('/overview', (req, res) => {
  const products = db.get('products');
  const bookings = db.get('bookings');
  const ledger = db.get('ledger');
  const users = db.get('users') || [];

  const totalRevenue = ledger.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalFees = ledger.reduce((sum, tx) => sum + tx.platformFee, 0);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers: users.length,
      totalProducts: products.length,
      totalBookings: bookings.length,
      totalRevenue,
      platformFees: totalFees
    },
    users,
    products,
    bookings,
    ledger
  });
});

// DELETE a product by ID
router.delete('/products/:id', (req, res) => {
  const products = db.get('products');
  const filtered = products.filter(p => p.id !== req.params.id);
  db.set('products', filtered);
  res.status(200).json({ success: true, message: 'Product removed.' });
});

// DELETE a user by ID
router.delete('/users/:id', (req, res) => {
  const users = db.get('users') || [];
  const filtered = users.filter(u => u.id !== req.params.id);
  db.set('users', filtered);
  res.status(200).json({ success: true, message: 'User removed.' });
});

module.exports = router;
