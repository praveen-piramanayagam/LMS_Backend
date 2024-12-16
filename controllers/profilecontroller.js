const students = require('../models/students');
const tutors = require('../models/tutors');
const Admin = require('../models/admins');

// Get a student's profile
exports.getStudentsProfile = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await students.findOne({ studentId }).select('-_id -password -__v -createdAt -updatedAt'); // Use findOne with studentId
        if (!student) return res.status(404).json({ error: 'Student not found!' });
        res.status(200).json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the profile!' });
    }
};

exports.getallStudents = async (req, res) => {
    try {
        // Fetch all students and exclude certain fields
        const allStudents = await students.find().select('-_id -password -__v -createdAt -updatedAt');
        if (allStudents.length === 0) {
            return res.status(404).json({ error: 'No students found!' });
        }
        res.status(200).json(allStudents); // Send all students as a response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the students!' });
    }
};


// Update a student's profile
exports.updateStudentProfile = async (req, res) => {
    const { studentId } = req.params; // Extract studentId from the route
    const { name, email } = req.body; // Extract updated data from the request body

    try {
        // Use { studentId: studentId } to search by studentId
        const updatedStudent = await students.findOneAndUpdate(
            { studentId }, // Filter object
            { name, email }, // Updated fields
            { new: true } // Return the updated document
        ).select('-_id -password -__v -createdAt -updatedAt');

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found!' });
        }

        res.status(200).json({ message: 'Profile updated successfully!', updatedStudent });
    } catch (err) {
        console.error('Error while updating profile:', err);
        res.status(500).json({ error: 'An error occurred while updating the profile!' });
    }
};

// Deactivate a student
exports.toggleStudentStatus = async (req, res) => {
        const { studentId } = req.params; // Get the studentId from the request params
        const { status } = req.body; // Assume status is passed in the request body (true for active, false for inactive)
        console.log(status);
        
        // Validate status value
        if (status !== true && status !== false) {
            return res.status(400).json({ error: 'Invalid status value. Use true to activate or false to deactivate.' });
        }
    
        try {
            // Find and update the student's status (either activate or deactivate)
            const updatedStudent = await students.findOneAndUpdate(
                { studentId },  // Search by studentId
                { isActive: status },  // Update the isActive field
                { new: true }  // Return the updated student object
            );
    
            if (!updatedStudent) {
                return res.status(404).json({ error: 'Student not found!' });
            }
    
            const action = status ? 'activated' : 'deactivated';
            res.status(200).json({ message: `Student successfully ${action}!`, student: updatedStudent });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while updating the student status!' });
        }
};

exports.getallTutors = async (req, res) => {
    try {
        // Fetch all tutors and exclude certain fields
        const allTutors = await tutors.find().select('-_id -password -__v -createdAt -updatedAt');
        if (allTutors.length === 0) {
            return res.status(404).json({ error: 'No tutors found!' });
        }
        res.status(200).json(allTutors); // Send all tutors as a response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the tutors!' });
    }
};


// Get a tutors's profile
exports.getTutorsProfile = async (req, res) => {
    const { tutorId } = req.params;

    try {
        const tutor = await tutors.findOne({ tutorId }).select('-_id -password -__v -createdAt -updatedAt'); // Use findOne with studentId
        if (!tutor) return res.status(404).json({ error: 'Tutor not found!' });
        res.status(200).json(tutor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the profile!' });
    }
};

// Update a tutors's profile
exports.updateTutorsProfile = async (req, res) => {
    const { tutorId } = req.params; // Extract studentId from the route
    const { name, email } = req.body; // Extract updated data from the request body

    try {
        // Use { studentId: studentId } to search by studentId
        const updatedTutor = await tutors.findOneAndUpdate(
            { tutorId }, // Filter object
            { name, email }, // Updated fields
            { new: true } // Return the updated document
        ).select('-_id -password -__v -createdAt -updatedAt');

        if (!updatedTutor) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        res.status(200).json({ message: 'Profile updated successfully!', updatedTutor });
    } catch (err) {
        console.error('Error while updating profile:', err);
        res.status(500).json({ error: 'An error occurred while updating the profile!' });
    }
};

// Delete a tutor
exports.toggleTutorStatus = async (req, res) => {
    const { tutorId } = req.params; // Get the tutorId from the request params
    const { status } = req.body; // Assume status is passed in the request body (true for active, false for inactive)
    console.log(status);
    
    // Validate status value
    if (status !== true && status !== false) {
        return res.status(400).json({ error: 'Invalid status value. Use true to activate or false to deactivate.' });
    }

    try {
        // Find and update the tutor's status (either activate or deactivate)
        const updatedTutor = await tutors.findOneAndUpdate(
            { tutorId },  // Search by tutorId
            { isActive: status },  // Update the isActive field
            { new: true }  // Return the updated tutor object
        );

        if (!updatedTutor) {
            return res.status(404).json({ error: 'tutor not found!' });
        }

        const action = status ? 'activated' : 'deactivated';
        res.status(200).json({ message: `Tutor successfully ${action}!`, student: updatedTutor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the student status!' });
    }
};

// Get a admin's profile
exports.getAdminsProfile = async (req, res) => {
    const { adminId } = req.params;

    try {
        // Log the received adminId to debug
        console.log('Received adminId:', adminId);

        // Fetch the admin profile based on adminId
        const admin = await Admin.findOne({ adminId }).select('-_id -password -__v -createdAt -updatedAt'); // Exclude sensitive fields

        // If admin is not found, return an error
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found!' });
        }

        // Return the admin profile
        res.status(200).json(admin);
    } catch (err) {
        console.error('Error:', err.message); // Log the error
        res.status(500).json({ error: 'An error occurred while fetching the admin profile!' });
    }
};

// update a admin's profile
exports.updateAdminProfile = async (req, res) => {
    const { adminId } = req.params; // Extract studentId from the route
    const { name, email } = req.body; // Extract updated data from the request body

    try {
        // Use { studentId: studentId } to search by studentId
        const updatedadmin = await Admin.findOneAndUpdate(
            { adminId }, // Filter object
            { name, email }, // Updated fields
            { new: true } // Return the updated document
        ).select('-_id -password -__v -createdAt -updatedAt');

        if (!updatedadmin) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        res.status(200).json({ message: 'Profile updated successfully!', updatedadmin });
    } catch (err) {
        console.error('Error while updating profile:', err.message);
        res.status(500).json({ error: 'An error occurred while updating the profile!' });
    }
};

// There will be one or two admin accounts and the credentials will be used for future use untill necessary to create another admin account so admin profile can't be deactivated