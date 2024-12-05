const bcrypt = require('bcrypt');
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

// Register tutor
exports.tutorsregister = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate email and password
    if (!validateInput(email, password)) {
        return res.status(400).json({ error: 'Invalid email or password!' });
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

        // Generate userId (ensure it is unique and not null)
        const newUserId = `user-id-${new Date().getTime()}`;

        // Save the tutor
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await tutors.create({ name, email, password: hashedPassword, tutorId: newTutorId, userId: newUserId });

        res.status(201).json({ message: 'Tutor registered successfully!', tutorId: user.tutorId });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: 'An error occurred during registration!' });
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
