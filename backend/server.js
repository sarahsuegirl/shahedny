const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { loadDatabaseFromMongo } = require('./db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    /\.vercel\.app$/,
    /\.onrender\.com$/
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routing
const productRoutes = require('./routes/products');
const availabilityRoutes = require('./routes/availability');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

app.use('/api/products', productRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Basic Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Nzmly Clone Backend Running' });
});

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB permanently!');
    await loadDatabaseFromMongo();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
