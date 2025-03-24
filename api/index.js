const express = require('express');

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
    console.log('Request URL:', req.url);
    console.log('Request path:', req.path);
    console.log('Request method:', req.method);
    console.log('Request baseUrl:', req.baseUrl);
    console.log('Request originalUrl:', req.originalUrl);
    next();
});

// Test route with /api prefix
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

// Export the Express app directly
module.exports = app;