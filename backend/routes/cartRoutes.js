const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateQuantity, removeFromCart, clearCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all routes

router.post('/add', addToCart);
router.get('/', getCart);
router.put('/update', updateQuantity);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart); // Nouvelle route pour vider le panier

module.exports = router;