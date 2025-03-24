const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  let token = req.header('Authorization')?.split(' ')[1];

  if (!token && req.cookies.token) {
    token = req.cookies.token; // 📌 Récupérer le token depuis le cookie si absent du header
  }

  console.log('Token reçu côté serveur:', token); // Debugging

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide.' });
  }
};

module.exports = { authMiddleware };
