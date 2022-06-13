const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../schemas/userSchema');

const router = express.Router();
const User = new mongoose.model('User', userSchema);

router.post('/signup', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
        });
        res.status(200).json({
            message: 'User create successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const checkPassword = await bcrypt.compare(req.body.password, user.password);
            if (checkPassword) {
                const token = jwt.sign(
                    {
                        // eslint-disable-next-line no-underscore-dangle
                        id: user._id,
                        email: user.email,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h',
                    }
                );

                res.status(200).json({
                    access_token: token,
                    message: 'Login successfully',
                });
            } else {
                throw new Error('Authentication Failed');
            }
        } else {
            throw new Error('Authentication Failed');
        }
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});
router.get('/all', async (req, res) => {
    try {
        const users = await User.find().populate('todos');
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
