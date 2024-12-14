// const { getZoomAccessToken, createZoomMeeting } = require('../utils/zoomUtils');  // Import the necessary functions
const Lesson = require('../models/lessons');
const tutors = require('../models/tutors');
const mongoose = require('mongoose');


exports.createLesson = async (req, res) => {
    try {
        const { title, description, subject, duration, price } = req.body;
        const tutorId = req.tutor.tutorId;

        if (!title || !description || !subject || !duration || !price) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        if (!tutorId) {
            return res.status(400).json({ error: 'Tutor ID is required!' });
        }

        const tutor = await tutors.findOne({ tutorId: tutorId });
        if (!tutor) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        // Generate a unique Jitsi meeting link including tutorId and subject
        const meetingLink = `https://meet.jit.si/${tutorId}-${subject}-${title}`;

        // Save the lesson to the database with the Jitsi meeting link
        const newLesson = new Lesson({
            title,
            description,
            subject,
            duration,
            price,
            tutorId,
            tutorEmail: tutor.email,
            meetingLink,
        });

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










// // Get All Lessons for the Logged-In Tutor
exports.getLessons = async (req, res) => {
    try {
        const tutorId = req.tutor.tutorId;

        const lessons = await Lesson.find({ tutorId });

        if (!lessons.length) {
            return res.status(404).json({ message: 'No lessons found for this tutor!' });
        }

        res.status(200).json(lessons);
    } catch (err) {
        console.error('Error fetching lessons:', err.message);
        res.status(500).json({ error: 'Failed to fetch lessons!' });
    }
};


// // Update Lesson
exports.updateLesson = async (req, res) => {
    try {
        const { lessonId } = req.params; // Extract lessonId from URL
        const tutorId = req.tutor.tutorId;
        const { title, description, duration, price } = req.body;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ error: 'Invalid lesson_id!' });
        }

        const lesson = await Lesson.findOne({ lesson_id: lessonId, tutorId });

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found or not authorized to update!' });
        }

        // Update lesson fields
        lesson.title = title || lesson.title;
        lesson.description = description || lesson.description;
        lesson.duration = duration || lesson.duration;
        lesson.price = price || lesson.price;
        lesson.updatedAt = Date.now();

        const updatedLesson = await lesson.save();

        res.status(200).json({ message: 'Lesson updated successfully!', updatedLesson });
    } catch (err) {
        console.error('Error updating lesson:', err.message);
        res.status(500).json({ error: 'Failed to update lesson!' });
    }
};


// // Delete Lesson
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