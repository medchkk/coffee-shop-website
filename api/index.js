const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('✅ api/index.js is being executed');

// Import routes
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const cartRoutes = require('../backend/routes/cartRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const userRoutes = require('../backend/routes/userRoutes');

// Log imports for debugging
console.log('authRoutes:', authRoutes);
console.log('productRoutes:', productRoutes);
console.log('cartRoutes:', cartRoutes);
console.log('orderRoutes:', orderRoutes);
console.log('userRoutes:', userRoutes);

// Initialize Express app
const app = express();

console.log('✅ Express app initialized');

// Middleware
app.use(cors());
console.log('✅ CORS middleware applied');

app.use(express.json());
console.log('✅ JSON middleware applied');

// Middleware to log requests for debugging
app.use((req, res, next) => {
  console.log('✅ Middleware called');
  console.log('Request URL:', req.url);
  console.log('Request path:', req.path);
  console.log('Request method:', req.method);
  console.log('Request baseUrl:', req.baseUrl);
  console.log('Request originalUrl:', req.originalUrl);
  next();
});

// Connect to MongoDB
const connectDB = require('../backend/config/db');
connectDB();
console.log('✅ MongoDB connection initiated');

// Routes
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes defined');

app.use('/api/products', productRoutes);
console.log('✅ Product routes defined');

app.use('/api/cart', cartRoutes);
console.log('✅ Cart routes defined');

app.use('/api/orders', orderRoutes);
console.log('✅ Order routes defined');

app.use('/api/users', userRoutes);
console.log('✅ User routes defined');

app.get('/api/test', (req, res) => {
  console.log('✅ /api/test route called');
  res.status(200).json({ message: 'API test OK' });
});
console.log('✅ Test route defined');

// Default route for unmatched paths
app.use('*', (req, res) => {
  console.log('❌ No route matched');
  res.status(404).json({ error: 'Route not found' });
});
console.log('✅ Default route defined');

// Export the Express app directly (no serverless-http)
module.exports = app;