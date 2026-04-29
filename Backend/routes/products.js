const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get all products with category filtering
router.get('/', async (req, res) => {
    try {
        let query = { isActive: true };
        
        // Apply category filter if provided
        if (req.query.category) {
            // Decode the category (handles spaces like "Home & Kitchen")
            const category = decodeURIComponent(req.query.category);
            query.category = category;
            console.log('Filtering by category:', category);
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        console.log(`Found ${products.length} products for query:`, query);
        
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create product
router.post('/', protect, async (req, res) => {
    try {
        const product = await Product.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update product
router.put('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete product
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;