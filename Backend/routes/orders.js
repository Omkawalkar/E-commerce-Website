const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// Create new order from cart
router.post('/create', protect, async (req, res) => {
    try {
        console.log('=== CREATE ORDER REQUEST ===');
        console.log('User ID:', req.user._id);
        
        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }
        
        console.log('Cart items count:', cart.items.length);
        console.log('Cart total:', cart.totalAmount);
        
        // Calculate totals
        const subtotal = cart.totalAmount;
        const tax = subtotal * 0.08;
        const shipping = 0;
        const total = subtotal + tax + shipping;
        
        // Create order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price
        }));
        
        // Get shipping address from request
        const { shippingAddress } = req.body;
        
        // Create order
        const order = new Order({
            user: req.user._id,
            customerName: req.user.fullName,
            customerEmail: req.user.email,
            customerPhone: shippingAddress?.phone || '',
            shippingAddress: {
                fullName: shippingAddress?.fullName || req.user.fullName,
                address: shippingAddress?.address || '123 Test Street',
                city: shippingAddress?.city || 'Test City',
                postalCode: shippingAddress?.postalCode || '12345',
                country: shippingAddress?.country || 'United States',
                phone: shippingAddress?.phone || '1234567890'
            },
            items: orderItems,
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total,
            paymentStatus: 'Paid',
            orderStatus: 'Pending'
        });
        
        const savedOrder = await order.save();
        console.log('Order saved successfully!');
        console.log('Order Number:', savedOrder.orderNumber);
        
        // Clear the cart
        cart.items = [];
        await cart.save();
        console.log('Cart cleared');
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: savedOrder
        });
        
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all orders (Admin)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'fullName email');
        console.log(`Found ${orders.length} orders`);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'fullName email');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        
        await order.save();
        
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;