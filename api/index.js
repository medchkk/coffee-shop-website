module.exports = async (req, res) => {
    console.log('✅ Serverless function called');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);

    // Extraire le chemin de req.url
    const url = new URL(req.url, `https://${req.headers.host}`);
    const path = url.pathname;
    console.log('Extracted path:', path);

    if (req.method === 'GET' && path === '/api/test') {
        console.log('✅ /api/test route called');
        return res.status(200).json({ message: 'API is working!' });
    }

    return res.status(404).json({ message: 'Not found' });
};