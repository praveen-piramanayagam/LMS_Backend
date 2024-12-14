const Tutor = require('../models/tutors');
const Lesson = require('../models/lessons');
const mongoose = require('mongoose');

// Helper function to check availability
const checkAvailability = (availability, selectedDay, selectedStartTime, selectedEndTime) => {
    const daySlot = availability.find(slot => slot.day === selectedDay);
    if (!daySlot) return false;

    return daySlot.timeSlots.some(slot => {
        const slotStartTime = new Date(slot.startTime);
        const slotEndTime = new Date(slot.endTime);
        return selectedStartTime >= slotStartTime && selectedEndTime <= slotEndTime;
    });
};

exports.scheduleLesson = async (req, res) => {
    const { tutorId, studentId, subject, duration, lessonDate } = req.body;

    try {
        // Validate required fields
        if (!tutorId || !studentId || !subject || !duration || !lessonDate) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        // Check if tutor exists
        const tutor = await Tutor.findOne({ tutorId: tutorId });
        if (!tutor) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        // Parse lesson date and time
        const lessonDateTime = new Date(lessonDate);
        const lessonEndTime = new Date(lessonDateTime.getTime() + duration * 60 * 1000); // Adding duration to start time

        // Check tutor availability
        const selectedDay = lessonDateTime.toLocaleString('en-US', { weekday: 'long' }); // Get the day name (e.g., 'Monday')

        const isAvailable = checkAvailability(tutor.availability, selectedDay, lessonDateTime, lessonEndTime);

        if (!isAvailable) {
            return res.status(400).json({ error: 'Tutor is not available at this time.' });
        }

        // Create a new lesson
        const newLesson = new Lesson({
            tutorId,
            studentId,
            subject,
            lessonDate: lessonDateTime,
            lessonEndTime,
            status: 'scheduled', // Initial status
        });

        await newLesson.save();

        // Add lesson to the tutor's scheduled lessons
        tutor.scheduledLessons.push({
            studentId,
            lessonId: newLesson._id,
            lessonDate: lessonDateTime,
            status: 'scheduled',
        });

        await tutor.save();

        res.status(201).json({
            message: 'Lesson scheduled successfully!',
            lesson: newLesson,
        });
    } catch (err) {
        console.error('Error scheduling lesson:', err.message);
        res.status(500).json({ error: 'Failed to schedule lesson!' });
    }
};

// Function for rescheduling
exports.rescheduleLesson = async (req, res) => {
    const { lessonId, newLessonDate, duration } = req.body;

    try {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found!' });
        }

        const tutor = await Tutor.findOne({ tutorId: lesson.tutorId });
        if (!tutor) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        // Parse new lesson date and time
        const newLessonDateTime = new Date(newLessonDate);
        const newLessonEndTime = new Date(newLessonDateTime.getTime() + duration * 60 * 1000);

        const selectedDay = newLessonDateTime.toLocaleString('en-US', { weekday: 'long' });

        // Check if tutor is available
        const isAvailable = checkAvailability(tutor.availability, selectedDay, newLessonDateTime, newLessonEndTime);
        if (!isAvailable) {
            return res.status(400).json({ error: 'Tutor is not available at the new time.' });
        }

        // Update the lesson's date and time
        lesson.lessonDate = newLessonDateTime;
        lesson.lessonEndTime = newLessonEndTime;

        await lesson.save();

        // Update the tutor's scheduled lessons
        const scheduledLesson = tutor.scheduledLessons.find(lesson => lesson.lessonId.toString() === lessonId);
        scheduledLesson.lessonDate = newLessonDateTime;
        scheduledLesson.status = 'rescheduled';

        await tutor.save();

        res.status(200).json({
            message: 'Lesson rescheduled successfully!',
            lesson: lesson,
        });
    } catch (err) {
        console.error('Error rescheduling lesson:', err.message);
        res.status(500).json({ error: 'Failed to reschedule lesson!' });
    }
};

// Function for canceling a lesson
exports.cancelLesson = async (req, res) => {
    const { lessonId } = req.body;

    try {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found!' });
        }

        const tutor = await Tutor.findOne({ tutorId: lesson.tutorId });
        if (!tutor) {
            return res.status(404).json({ error: 'Tutor not found!' });
        }

        // Cancel the lesson
        lesson.status = 'canceled';
        await lesson.save();

        // Remove the canceled lesson from the tutor's scheduled lessons
        tutor.scheduledLessons = tutor.scheduledLessons.filter(scheduled => scheduled.lessonId.toString() !== lessonId);
        await tutor.save();

        res.status(200).json({
            message: 'Lesson canceled successfully!',
        });
    } catch (err) {
        console.error('Error canceling lesson:', err.message);
        res.status(500).json({ error: 'Failed to cancel lesson!' });
    }
};
