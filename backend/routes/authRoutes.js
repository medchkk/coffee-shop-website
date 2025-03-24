const express = require('express');
const router = express.Router();
const { register, login, resetPassword, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Logs pour vérifier les importations
console.log('Controllers importés :', { register, login, resetPassword, logout });
console.log('Middleware importé :', authMiddleware);

// Define routes avec logs supplémentaires
router.post('/register', (req, res) => {
  console.log('Requête reçue sur /register avec body :', req.body); // Log des données reçues
  register(req, res); // Appel au contrôleur
});

router.post('/login', (req, res) => {
  console.log('Requête reçue sur /login avec body :', req.body); // Log pour login
  login(req, res);
});

router.post('/logout', authMiddleware, logout); // Ajout de authMiddleware

router.post('/reset-password', authMiddleware, (req, res) => {
  console.log('Requête reçue sur /reset-password avec body :', req.body); // Log pour reset
  resetPassword(req, res);
});

module.exports = router;