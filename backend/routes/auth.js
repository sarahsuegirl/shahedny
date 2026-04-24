const express = require('express');
const db = require('../db');
const { signToken, hashPassword, verifyPassword } = require('../auth');
const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const users = db.get('users') || [];
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: role === 'admin' ? 'SELLER' : (role?.toUpperCase() || 'SELLER'), // only allow SELLER self-registration
    createdAt: new Date().toISOString()
  };

  db.push('users', newUser);

  const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name });
  res.status(201).json({
    success: true,
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const users = db.get('users') || [];
  const user = users.find(u => u.email === email.toLowerCase());

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.status(200).json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// GET /api/auth/me — verify token and return current user
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  try {
    const { verifyToken } = require('../auth');
    const payload = verifyToken(authHeader.split(' ')[1]);
    const users = db.get('users') || [];
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(401).json({ error: 'Session expired.' });
  }
});

// GET /api/auth/by-slug/:slug — fetch public user data based on their slug
router.get('/by-slug/:slug', (req, res) => {
  const users = db.get('users') || [];
  const slug = req.params.slug.toLowerCase();
  
  // Find by precise custom slug OR fallback to name formatting
  const user = users.find(u => 
    (u.slug && u.slug === slug) || 
    (!u.slug && u.name && u.name.toLowerCase().replace(/\s+/g, '') === slug)
  );
  
  if (!user) {
    return res.status(404).json({ error: 'Storefront not found' });
  }

  // Return ONLY public data
  res.status(200).json({ 
    success: true, 
    user: { 
      id: user.id, 
      name: user.displayName || user.name, 
      slug: user.slug || user.name.toLowerCase().replace(/\s+/g, ''),
      role: user.roleTitle || 'Persona Builder | Copywriter',
      bio: user.bio || 'أهلاً بك في متجري. أنا كاتبة محتوى متخصصة في بناء شخصيات العلامات التجارية.',
      profilePic: user.profilePic || null
    } 
  });
});

const { upload, uploadBuffer } = require('../cloudinary');

// PUT /api/auth/profile — update user profile fields
router.put('/profile', upload.single('profilePic'), async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  
  try {
    const { verifyToken } = require('../auth');
    const payload = verifyToken(authHeader.split(' ')[1]);
    const users = db.get('users') || [];
    const userIndex = users.findIndex(u => u.id === payload.id);
    
    if (userIndex === -1) return res.status(404).json({ error: 'User not found.' });

    const user = users[userIndex];
    if (req.body.slug) user.slug = req.body.slug.toLowerCase().replace(/\s+/g, '');
    if (req.body.displayName) user.displayName = req.body.displayName;
    if (req.body.role) user.roleTitle = req.body.role;
    if (req.body.bio) user.bio = req.body.bio;
    
    if (req.file && req.file.buffer) {
      user.profilePic = await uploadBuffer(req.file.buffer);
    }

    users[userIndex] = user;
    db.set('users', users);
    
    res.status(200).json({ success: true, user: { id: user.id, name: user.name, profilePic: user.profilePic, slug: user.slug } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: err.message || 'Server error.' });
  }
});

module.exports = router;
