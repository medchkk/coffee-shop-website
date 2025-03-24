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
    console.log('Request path:', req.path);
    console.log('Request method:', req.method);
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    console.log('✅ /api/test route called');
    res.status(200).json({ message: 'API is working!' });
});

console.log('✅ Test route defined');

// Export as a serverless function
const handler = serverless(app);
console.log('✅ Serverless handler created');

module.exports = handler;