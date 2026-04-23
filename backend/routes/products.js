const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { verifyToken } = require('../auth');
const router = express.Router();

const { upload } = require('../cloudinary');

// Middleware to extract user from token if present (for optional auth routes)
const extractUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(authHeader.split(' ')[1]);
    } catch (err) {}
  }
  next();
};

// GET products (Support filtering by sellerId)
router.get('/', (req, res) => {
  let products = db.get('products');
  if (req.query.sellerId) {
    products = products.filter(p => p.sellerId === req.query.sellerId);
  }
  res.status(200).json({ success: true, products });
});

// POST a new product — requires authentication
router.post('/', extractUser, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized. You must be logged in to create a product.' });

  const { title, price, type } = req.body;

  if (!title || !price || !type) {
    return res.status(400).json({ error: 'Missing required product fields (title, price, type).' });
  }

  const fileInfo = req.files && req.files['file'] ? req.files['file'][0] : null;
  const coverImageInfo = req.files && req.files['coverImage'] ? req.files['coverImage'][0] : null;

  const newProduct = {
    id: Date.now().toString(),
    sellerId: req.user.id, // Assign to the logged-in user!
    title,
    price: parseFloat(price),
    type,
    fileName: fileInfo ? fileInfo.filename : null,
    filePath: fileInfo ? fileInfo.path : null,
    coverImagePath: coverImageInfo ? coverImageInfo.path : null,
    createdAt: new Date().toISOString()
  };

  db.push('products', newProduct);
  res.status(201).json({ success: true, product: newProduct });
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
