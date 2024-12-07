const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const students = require('../models/students');
const tutors = require('../models/tutors');
const Admin = require('../models/admins');

// Helper function to validate email and password
const validateInput = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return emailRegex.test(email) && passwordRegex.test(password);
};

// Register Students
exports.studentsregister = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate email and password
    if (!validateInput(email, password)) {
        return res.status(400).json({ error: 'Invalid email or password!' });
    }

    try {
        // Check if the email already exists
        const existingStudent = await students.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: 'Email already exists!' });
        }

        // Generate a new student ID (starting from 1)
        const lastStudent = await students.findOne().sort({ studentId: -1 });
        const lastIdNumber = lastStudent ? parseInt(lastStudent.studentId.split('-')[2]) : 0;
        const newStudentId = `student-id-${lastIdNumber + 1}`;

        // Generate userId (ensure it is unique and not null)
        const newUserId = `user-id-${new Date().getTime()}`;

        // Save the student
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await students.create({ name, email, password: hashedPassword, studentId: newStudentId, userId: newUserId });

        res.status(201).json({ message: 'Student registered successfully!', studentId: user.studentId });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'An error occurred during registration!' });
    }
};

// Students Login
exports.studentslogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await students.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!' });

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ error: 'Invalid credentials!' });

        // Create a JWT token (you can adjust the payload to your needs)
        const token = jwt.sign(
            { userId: user._id, studentId: user.studentId }, // Payload data
            process.env.JWT_SECRET, // Secret key (use an environment variable)
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token and other relevant data
        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'Something went wrong!' });
    }
};


// Register tutor
exports.tutorsregister = async (req, res) => {
    const { 
        name, 
        email, 
        password, 
        experience, 
        qualifications, 
        expertise, 
        subjects, 
        availability, 
        price 
    } = req.body;

    // Validate email and password
    if (!validateInput(email, password)) {
        return res.status(400).json({ error: 'Invalid email or password!' });
    }

    // Validate that all required fields are provided
    if (!name || !email || !password || !experience || !qualifications || !expertise || !subjects || !availability || !price) {
        return res.status(400).json({ error: 'Please provide all required fields!' });
    }

    try {
        // Check if the email already exists
        const existingTutor = await tutors.findOne({ email });
        if (existingTutor) {
            return res.status(400).json({ error: 'Email already exists!' });
        }

        // Generate a new tutor ID (starting from 1)
        const lastTutor = await tutors.findOne().sort({ tutorId: -1 });
        const lastIdNumber = lastTutor ? parseInt(lastTutor.tutorId.split('-')[2]) : 0;
        const newTutorId = `tutor-id-${lastIdNumber + 1}`;

        // Generate a unique userId
        const newUserId = `user-id-${new Date().getTime()}`;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the tutor with the new fields
        const user = await tutors.create({
            name,
            email,
            password: hashedPassword,
            tutorId: newTutorId,
            userId: newUserId,
            experience,
            qualifications,
            expertise,
            subjects,
            availability,
            price
        });

        res.status(201).json({ message: 'Tutor registered successfully!', tutorId: user.tutorId });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'An error occurred during registration!' });
    }
};

// Tutors Login
exports.tutorslogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await tutors.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!' });

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ error: 'Invalid credentials!' });

        // Create a JWT token (you can adjust the payload to your needs)
        const token = jwt.sign(
            { userId: user._id, studentId: user.studentId }, // Payload data
            process.env.JWT_SECRET, // Secret key (use an environment variable)
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token and other relevant data
        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'Something went wrong!' });
    }
};

// Register Admin
exports.adminRegister = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate email and password
    if (!validateInput(email, password)) {
        return res.status(400).json({ error: 'Invalid email or password!' });
    }

    try {
        // Check if the email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already exists!' });
        }

        // Generate a new admin ID (starting from 1)
        const lastAdmin = await Admin.findOne().sort({ adminId: -1 });
        const lastIdNumber = lastAdmin ? parseInt(lastAdmin.adminId.split('-')[2]) : 0;
        const newAdminId = `admin-id-${lastIdNumber + 1}`;

        // Generate userId (ensure it is unique and not null)
        const newUserId = `user-id-${new Date().getTime()}`;

        // Save the admin
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Admin.create({ name, email, password: hashedPassword, adminId: newAdminId, userId: newUserId });

        res.status(201).json({ message: 'Admin registered successfully!', adminId: user.adminId });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'An error occurred during registration!' });
    }
};

// Admin Login
exports.adminlogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await Admin.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!' });

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ error: 'Invalid credentials!' });

        // Create a JWT token (you can adjust the payload to your needs)
        const token = jwt.sign(
            { userId: user._id, adminId: user.adminId }, // Payload data
            process.env.JWT_SECRET, // Secret key (use an environment variable)
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token and other relevant data
        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'Something went wrong!' });
    }
};

// Middleware to verify admin role
exports.isAdmin = async (req, res, next) => {
    try {
        // Extract token from the request headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized!' });

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an admin
        const admin = await Admin.findOne(decoded.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied! Only admins can perform this action.' });
        }

        req.admin = admin; // Add admin data to request object for further use
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: 'Invalid or expired token!' });
    }
};