const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

router.get('/profile', authMiddleware, getUserProfile); // Ligne 6
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;