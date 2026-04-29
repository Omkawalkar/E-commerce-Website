const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Helper function to generate JWT token
const generateToken = (userId, email) => {
    return jwt.sign(
        { id: userId, email: email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('re_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { fullName, email, mobileNumber, password } = req.body;
        
        // Check if user exists with email (if provided)
        if (email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }
        }
        
        // Check if user exists with mobile number (if provided)
        if (mobileNumber) {
            const existingMobile = await User.findOne({ mobileNumber: mobileNumber });
            if (existingMobile) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this mobile number'
                });
            }
        }

        // Create new user
        const userData = {
            fullName: fullName,
            password: password
        };
        
        if (email) userData.email = email.toLowerCase();
        if (mobileNumber) userData.mobileNumber = mobileNumber;
        
        const user = await User.create(userData);

        // Generate token
        const token = generateToken(user._id, user.email || user.mobileNumber);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('identifier').notEmpty().withMessage('Email or mobile number is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        console.log('Login request received:', { identifier: req.body.identifier });
        
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { identifier, password } = req.body;

        // Check if identifier is email or mobile
        let user;
        if (identifier.includes('@')) {
            // It's an email
            user = await User.findOne({ email: identifier.toLowerCase() }).select('+password');
        } else {
            // It's a mobile number
            user = await User.findOne({ mobileNumber: identifier }).select('+password');
        }

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. User not found.'
            });
        }

        // Check if password matches
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Wrong password.'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.email || user.mobileNumber);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify user token
// @access  Private
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

module.exports = router;