const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

console.log('✅ api/index.js is being executed');

// Initialize Express app
const app = express();

console.log('✅ Express app initialized');

// Middleware
app.use(cors());
app.use(express.json());

console.log('✅ Middleware applied');

// Test route
app.get('/api/test', (req, res) => {
    console.log('✅ /api/test route called');
    res.status(200).json({ message: 'API is working!' });
});

console.log('✅ Test route defined');

// Comment out MongoDB connection and other routes
// const connectDB = require('../backend/config/db');
// connectDB();
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);

// console.log('✅ Routes defined');

// Export as a serverless function
const handler = serverless(app);
console.log('✅ Serverless handler created');

module.exports = handler;