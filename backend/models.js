const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, default: 'SELLER' },
  createdAt: String,
  slug: String,
  displayName: String,
  bio: String,
  profilePic: String,
  availability: Object
});

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  sellerId: String,
  title: String,
  price: Number,
  type: String,
  fileName: String,
  filePath: String,
  coverImagePath: String,
  createdAt: String
});

const ledgerSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  productId: String,
  gateway: String,
  grossAmount: Number,
  platformFee: Number,
  netEarnings: Number,
  date: String
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Ledger: mongoose.model('Ledger', ledgerSchema)
};
