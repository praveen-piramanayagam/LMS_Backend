const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const students = require('../models/students');
const tutors = require('../models/tutors');
const Admin = require('../models/admins');
const mongoose = require('mongoose');


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

        // Generate a new studentId as ObjectId
        const newStudentId = new mongoose.Types.ObjectId();

        // Generate userId (ensure it is unique and not null)
        const newUserId = `user-id-${new Date().getTime()}`;

        // Save the student
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await students.create({
            name,
            email,
            password: hashedPassword,
            studentId: newStudentId,  // Assign generated ObjectId as studentId
            userId: newUserId,
        });

        res.status(201).json({
            message: 'Student registered successfully!',
            studentId: user.studentId,  // Return studentId as ObjectId
        });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'An error occurred during registration!' });
    }
};

exports.checkStudentStatus = async (req, res, next) => {
    const { email } = req.body; // Extract email from the body of the request

    if (!email) {
        return res.status(400).json({ error: 'Email is required!' });
    }

    try {
        // Find the student by email
        const student = await students.findOne({ email });

        if (!student) {
            return res.status(404).json({ error: 'Student not found!' });
        }

        // Check if the student is active
        if (!student.isActive) {
            return res.status(403).json({ error: 'Your account is inactive. Please contact support.' });
        }

        // If active, proceed to the next middleware or route handler
        req.student = student;  // Attach student object to the request for later use
        next();
    } catch (err) {
        console.error('Error while checking student status:', err);
        return res.status(500).json({ error: 'An error occurred while checking student status!' });
    }
};

// Student Login
exports.studentslogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the student exists
        const student = await students.findOne({ email });
        if (!student) return res.status(404).json({ error: 'User not found!' });

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, student.password);
        if (!isPasswordMatch) return res.status(401).json({ error: 'Invalid credentials!' });

        // Create a JWT token
        const token = jwt.sign(
            { userId: student._id, studentId: student.studentId, name: student.name, email: student.email },
            process.env.JWT_SECRET, // Secret key (use an environment variable)
            { expiresIn: '1h' } // Token expiration time

            
        );

        // Send the token and other relevant data
        res.status(200).json({ 
            message: 'Login successful!', 
            token,
            isActive: student.isActive // Include the isActive field
        });
        } catch (err) {
        console.error("Login error:", err); // Log the actual error
        res.status(500).json({ error: 'Something went wrong!' });
    }
};


// Middleware to authenticate student
exports.isStudent = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized! No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded student data:', decoded);  // Log decoded token data

        // Check if decoded contains the required fields
        if (!decoded.userId || !decoded.studentId || !decoded.name || !decoded.email) {
            return res.status(400).json({ error: 'Invalid token payload!' });
        }

        req.student = decoded; // Attach student info to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ error: 'Invalid or expired token!' });
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
        availability 
    } = req.body;

    // Validate email and password
    if (!validateInput(email, password)) {
        return res.status(400).json({ error: 'Invalid email or password!' });
    }

    // Validate that all required fields are provided
    if (!name || !email || !password || !experience || !qualifications || !expertise || !subjects || !availability) {
        return res.status(400).json({ error: 'Please provide all required fields!' });
    }

    try {
        // Check if the email already exists
        const existingTutor = await tutors.findOne({ email });
        if (existingTutor) {
            return res.status(400).json({ error: 'Email already exists!' });
        }

        // Generate a unique tutorId using MongoDB's ObjectId
        const newTutorId = new mongoose.Types.ObjectId(); // Generates a unique ObjectId

        // Generate a unique userId (you can keep this as a string, as it doesn't need to be an ObjectId)
        const newUserId = `user-id-${new Date().getTime()}`;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the tutor with the new fields
        const user = await tutors.create({
            name,
            email,
            password: hashedPassword,
            tutorId: newTutorId, // Store tutorId as an ObjectId
            userId: newUserId,   // Store userId as a string
            experience,
            qualifications,
            expertise,
            subjects,
            availability,
        });

        res.status(201).json({ message: 'Tutor registered successfully!', tutorId: user.tutorId });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'An error occurred during registration!' });
    }
};

exports.checkTutorStatus = async (req, res, next) => {
    const { email } = req.body; // Extract email from the body of the request

    if (!email) {
        return res.status(400).json({ error: 'Email is required!' });
    }

    try {
        // Find the student by email
        const tutor = await tutors.findOne({ email });

        if (!tutor) {
            return res.status(404).json({ error: 'tutor not found!' });
        }

        // Check if the student is active
        if (!tutor.isActive) {
            return res.status(403).json({ error: 'Your account is inactive. Please contact support.' });
        }

        // If active, proceed to the next middleware or route handler
        req.tutor = tutor;  // Attach student object to the request for later use
        next();
    } catch (err) {
        console.error('Error while checking tutor status:', err);
        return res.status(500).json({ error: 'An error occurred while checking tutor status!' });
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
            { userId: user._id, tutorId: user.tutorId }, // Payload data
            process.env.JWT_SECRET, // Secret key (use an environment variable)
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token and other relevant data
        res.status(200).json({ 
            message: 'Login successful!', 
            token,
            isActive: user.isActive // Include the isActive field
        });    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'Something went wrong!' });
    }
};


// Middleware to authenticate tutor
exports.isTutor = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized! No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.tutor = decoded; // Add the decoded tutor info to the request object
        console.log('Logged-in tutor:', req.tutor);
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: 'Invalid or expired token!' });
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