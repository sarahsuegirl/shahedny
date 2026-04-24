const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { verifyToken } = require('../auth');
const router = express.Router();

const { upload, uploadBuffer } = require('../cloudinary');

// Middleware to extract user from token if present
const extractUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try { req.user = verifyToken(authHeader.split(' ')[1]); } catch (err) {}
  }
  next();
};

// GET products
router.get('/', (req, res) => {
  let products = db.get('products');
  if (req.query.sellerId) products = products.filter(p => p.sellerId === req.query.sellerId);
  res.status(200).json({ success: true, products });
});

// POST new product
router.post('/', extractUser, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
  const { title, price, type } = req.body;
  if (!title || !price || !type) return res.status(400).json({ error: 'Missing fields.' });

  try {
    const fileInfo = req.files?.['file']?.[0];
    const coverImageInfo = req.files?.['coverImage']?.[0];

    const filePath = fileInfo ? await uploadBuffer(fileInfo.buffer) : null;
    const coverImagePath = coverImageInfo ? await uploadBuffer(coverImageInfo.buffer) : null;

    const newProduct = {
      id: Date.now().toString(),
      sellerId: req.user.id,
      title, price: parseFloat(price), type,
      fileName: fileInfo?.originalname || null,
      filePath,
      coverImagePath,
      createdAt: new Date().toISOString()
    };
    db.push('products', newProduct);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Product upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product — requires authentication and ownership
router.delete('/:id', extractUser, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const products = db.get('products') || [];
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
  if (products[productIndex].sellerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  products.splice(productIndex, 1);
  db.set('products', products);

  res.status(200).json({ success: true, message: 'Product deleted' });
});

// PUT update a product — requires authentication and ownership
router.put('/:id', extractUser, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const products = db.get('products') || [];
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
  if (products[productIndex].sellerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const { title, price } = req.body;
  if (title) products[productIndex].title = title;
  if (price) products[productIndex].price = parseFloat(price);

  db.set('products', products);

  res.status(200).json({ success: true, product: products[productIndex] });
});

module.exports = router;
