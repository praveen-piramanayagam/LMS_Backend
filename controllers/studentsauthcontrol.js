const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const students = require('../models/students');

// Register
exports.studentsregister = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new students({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Student registered successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists or invalid data!' });
    }
};

// Login
exports.studentslogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await students.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!' });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ error: 'Invalid credentials!' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong!' });
    }
};