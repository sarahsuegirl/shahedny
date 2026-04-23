const express = require('express');
const db = require('../db');
const router = express.Router();

const PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee

const recordTransaction = (productId, price, gateway) => {
  const numericPrice = parseFloat(price);
  const platformFee = numericPrice * PLATFORM_FEE_PERCENTAGE;
  const sellerEarnings = numericPrice - platformFee;

  const transaction = {
    id: Date.now().toString(),
    productId,
    gateway,
    grossAmount: numericPrice,
    platformFee,
    netEarnings: sellerEarnings,
    date: new Date().toISOString()
  };
  db.push('ledger', transaction);
  return transaction;
};

router.post('/create-stripe-session', (req, res) => {
  const { productId, price } = req.body;
  recordTransaction(productId, price, 'STRIPE');
  res.status(200).json({
    success: true,
    message: 'Stripe Checkout Session recorded in the master ledger.',
    paymentUrl: `http://localhost:5173/checkout/success?session_id=mock_stripe_${Date.now()}`
  });
});

router.post('/create-paymob-iframe', (req, res) => {
  const { productId, price } = req.body;
  recordTransaction(productId, price, 'PAYMOB');
  res.status(200).json({
    success: true,
    message: 'Paymob Iframe registered completely.',
    paymentUrl: `http://localhost:5173/checkout/success?session_id=mock_paymob_${Date.now()}`
  });
});

router.get('/ledger', (req, res) => {
  const ledger = db.get('ledger');
  const totalGross = ledger.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalFees = ledger.reduce((sum, tx) => sum + tx.platformFee, 0);
  const totalNet = ledger.reduce((sum, tx) => sum + tx.netEarnings, 0);

  res.status(200).json({
    success: true,
    totalGross,
    totalFees,
    totalNetAvailable: totalNet,
    transactions: ledger
  });
});

router.post('/webhook', (req, res) => {
  res.status(200).send('Webhook Received & Automatically Logged.');
});

module.exports = router;
