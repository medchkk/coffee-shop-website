module.exports = async (req, res) => {
    console.log('✅ Serverless function called');
    console.log('Request path:', req.path);
    console.log('Request method:', req.method);

    if (req.method === 'GET' && req.path === '/api/test') {
        console.log('✅ /api/test route called');
        return res.status(200).json({ message: 'API is working!' });
    }

    return res.status(404).json({ message: 'Not found' });
};