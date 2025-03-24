const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('../backend/config/db');

// Import routes
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const cartRoutes = require('../backend/routes/cartRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const userRoutes = require('../backend/routes/userRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de débogage
app.use((req, res, next) => {
  console.log('✅ Middleware called');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  next();
});

// Fonction serverless
module.exports = async (req, res) => {
  console.log('✅ api/index.js invoked');

  // Vérifier si MongoDB est déjà connecté, sinon connecter
  if (mongoose.connection.readyState !== 1) { // 1 = connected
    console.log('Tentative de connexion à MongoDB...');
    try {
      await connectDB();
    } catch (err) {
      console.error('Erreur de connexion MongoDB dans serverless:', err.message);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  } else {
    console.log('MongoDB déjà connecté');
  }

  // Définir les routes (doit être fait ici car serverless)
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);

  app.get('/api/test', (req, res) => {
    console.log('✅ /api/test route called');
    res.status(200).json({ message: 'API test OK' });
  });

  app.use('*', (req, res) => {
    console.log('❌ No route matched');
    res.status(404).json({ error: 'Route not found' });
  });

  // Gérer la requête avec Express
  app(req, res);
};