const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

module.exports = serverless(app);