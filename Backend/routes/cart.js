const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Middleware to get user from token
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = require('../models/User');
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Get cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }
        res.json({ success: true, data: cart });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }
        
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.price
            });
        }
        
        await cart.save();
        await cart.populate('items.product');
        
        res.json({ success: true, data: cart });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Remove from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        await cart.save();
        await cart.populate('items.product');
        
        res.json({ success: true, data: cart });
    } catch (error) {
        console.error('Remove error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;