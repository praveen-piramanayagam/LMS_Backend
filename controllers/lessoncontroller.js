const Lesson = require('../models/lessons');
const tutors = require('../models/tutors');
const mongoose = require('mongoose');

exports.createLesson = async (req, res) => {
    try {
        const { title, description, subject, duration, price,scheduledClass } = req.body;
        const tutorId = req.tutor.tutorId; // Assuming tutorId is passed in `req.tutor`

        // Validate required fields
        if (!title || !description || !subject || !duration || !price || !scheduledClass) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        if (!tutorId) {
            return res.status(400).json({ error: 'Tutor ID is required!' });
        }
        const [day, month, year] = scheduledClass.split('/');
        const parsedDate = new Date(`${year}-${month}-${day}`);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ error: 'Invalid scheduledClass date format. Use dd/mm/yyyy.' });
        }

        // Ensure `tutorId` is valid and exists in the tutors collection
        const tutor = await tutors.findOne({ tutorId });
        if (!tutor) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        // Generate the Jitsi meeting link
        const encodedSubject = subject.replace(/\s+/g, '-');
        const meetingLink = `https://meet.jit.si/${tutorId}-${encodedSubject}`;

        // Create a new lesson document
        const newLesson = new Lesson({
            title,
            description,
            subject,
            duration,
            price,
            tutorId,
            tutorName: tutor.name,
            tutorEmail: tutor.email,
            meetingLink,
            scheduledClass: parsedDate
        });

        // Save the lesson to the database
        await newLesson.save();

        res.status(201).json({
            message: 'Lesson created successfully!',
            lesson: newLesson,
        });
    } catch (err) {
        console.error('Error creating lesson:', err.message);
        res.status(500).json({ error: 'Failed to create lesson!' });
    }
};


exports.getLessonsByTutorId = async (req, res) => {
    try {
        const tutorId = req.params.tutorId; // Extract tutorId from route params
        console.log("Requested Tutor ID:", tutorId);

        // Find lessons for the given tutorId
        const tutorLessons = await Lesson
            .find({ tutorId }) // Find lessons where tutorId matches
            .populate('tutorId', 'name email subjects experience'); // Populate tutor details

        // If no lessons found, return an empty array
        if (!tutorLessons || tutorLessons.length === 0) {
            return res.status(404).json({ error: 'No lessons found for this tutor' });
        }

        console.log("Fetched Lessons:", tutorLessons);
        res.status(200).json(tutorLessons);
    } catch (err) {
        console.error("Error fetching lessons:", err);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
};


exports.getlessoncreated = async(req,res)=>{
    try {
        const tutorId = req.tutor.tutorId;
        // Find lessons created by the logged-in tutor
        const tutorLessons = await Lesson
            .find({ tutorId }) // Find lessons where tutorId matches

        // If no lessons found, return an empty array
        if (!tutorLessons || tutorLessons.length === 0) {
            return res.status(404).json({ error: 'No lessons found for this tutor' });
        }

        console.log("Fetched Lessons:", tutorLessons);
        res.status(200).json(tutorLessons);
    } catch (err) {
        console.error("Error fetching lessons:", err);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
};

// // Update Lesson
exports.updateLesson = async (req, res) => {
    try {
        const { lesson_id } = req.params; // Extract lesson_id from params
        const updateData = req.body;     // Get update data from the request body
        console.log('Params:', req.params);
        console.log('Body:', req.body);



        // Check if `lesson_id` is provided
        if (!lesson_id) {
            return res.status(400).json({ error: 'Lesson ID is required' });
        }

        // Convert `lesson_id` to ObjectId
        const objectId = new mongoose.Types.ObjectId(lesson_id);

        // Find and update the lesson
        const updatedLesson = await Lesson.findOneAndUpdate(
            { lesson_id: objectId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedLesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.status(200).json({
            message: 'Lesson updated successfully',
            updatedLesson,
        });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({
            error: 'An error occurred while updating the lesson',
            details: error.message,
        });
    }
};



// Delete Lesson
exports.deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params; // Extract lessonId from URL
        const tutorId = req.tutor.tutorId;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ error: 'Invalid lesson_id!' });
        }

        const deletedLesson = await Lesson.findOneAndDelete({
            lesson_id: lessonId,
            tutorId,
        });

        if (!deletedLesson) {
            return res.status(404).json({ error: 'Lesson not found or not authorized to delete!' });
        }

        res.status(200).json({ message: 'Lesson deleted successfully!', deletedLesson });
    } catch (err) {
        console.error('Error deleting lesson:', err.message);
        res.status(500).json({ error: 'Failed to delete lesson!' });
    }
};


// Get LoggedIn Tutor
exports.getLoggedInTutor = async (req, res) => {
    try {
        const tutorId = mongoose.Types.ObjectId(req.tutor.tutorId);  // Ensure tutorId is an ObjectId
        const tutor = await tutors.findOne({ tutorId }).select('-password');

        if (!tutor) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        res.status(200).json(tutor);
    } catch (err) {
        console.error('Error fetching tutor details:', err.message);
        res.status(500).json({ error: 'Failed to fetch tutor details!' });
    }
};