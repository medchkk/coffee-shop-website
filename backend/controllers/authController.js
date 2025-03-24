const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 📌 Fonction pour générer un JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// 🟢 Inscription
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Créer l'utilisateur
    const user = await User.create({ email, password });
    console.log('Utilisateur créé :', user); // Log pour vérifier

    // Générer le token
    const token = generateToken(user._id);

    // Définir le cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 heure
    });

    // Envoyer le token au frontend
    res.status(201).json({ message: 'User registered', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 🟢 Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe, inclure explicitement le champ password
    const user = await User.findOne({ email }).select('+password');
    console.log('Utilisateur trouvé :', user); // Log pour déboguer
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Vérifier que le champ password existe
    if (!user.password) {
      return res.status(500).json({ error: 'Le mot de passe n’est pas défini pour cet utilisateur' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Générer le token
    const token = generateToken(user._id);

    // Définir le cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 heure
    });

    // Envoyer aussi le token au frontend
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 🟢 Déconnexion
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// 🟢 Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id; // L'ID de l'utilisateur extrait du token JWT via authMiddleware

    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
