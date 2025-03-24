const express = require('express');
const serverless = require('serverless-http');

console.log('✅ api/index.js is being executed');

// Initialize Express app
const app = express();

console.log('✅ Express app initialized');

// Middleware to parse JSON
app.use(express.json());
console.log('✅ JSON middleware applied');

// Middleware to log requests
app.use((req, res, next) => {
    console.log('✅ Middleware called');
    console.log('Request URL:', req.url); // Utiliser req.url au lieu de req.path
    console.log('Request path:', req.path); // Log pour comparer
    console.log('Request method:', req.method);
    console.log('Request baseUrl:', req.baseUrl); // Log supplémentaire
    console.log('Request originalUrl:', req.originalUrl); // Log supplémentaire
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    console.log('✅ /api/test route called');
    res.status(200).json({ message: 'API is working!' });
});

console.log('✅ Test route defined');

// Default route for unmatched paths
app.use((req, res) => {
    console.log('❌ No route matched');
    res.status(404).json({ message: 'Not found' });
});

console.log('✅ Default route defined');

// Export as a serverless function
const handler = serverless(app);
console.log('✅ Serverless handler created');

module.exports = handler;