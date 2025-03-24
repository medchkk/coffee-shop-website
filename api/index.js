const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

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

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

// Connect to MongoDB
const connectDB = require('../backend/config/db');
connectDB();

// Routes (teste une route à la fois)
app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);

// Export as a serverless function
module.exports = serverless(app);