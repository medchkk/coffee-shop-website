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

// Connect to MongoDB with forced logging
const connectDB = require('../backend/config/db');

// Fonction pour masquer partiellement l'URI MongoDB (pour la sécurité dans les logs)
const maskMongoUri = (uri) => {
  if (!uri) return 'undefined';
  const [protocol, rest] = uri.split('://');
  const [auth, host] = rest.split('@');
  if (auth) {
    return `${protocol}://[masked-credentials]@${host}`;
  }
  return uri;
};

// Vérification et logs avant la connexion
console.log('🔍 [MongoDB] Preparing to connect...');
console.log('🔍 [MongoDB] MONGO_URI:', maskMongoUri(process.env.MONGO_URI));

if (!process.env.MONGO_URI) {
  console.error('❌ [MongoDB] MONGO_URI is not defined in environment variables');
  process.exit(1);
}

// Appel à connectDB avec gestion des erreurs
console.log('🔍 [MongoDB] Initiating connection...');
connectDB()
  .then(() => {
    console.log('✅ [MongoDB] Connection process completed successfully');
  })
  .catch((error) => {
    console.error('❌ [MongoDB] Failed to connect:', error.message);
    console.error('❌ [MongoDB] Full error details:', error);
    process.exit(1);
  });

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