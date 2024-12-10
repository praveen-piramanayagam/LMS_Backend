const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    lesson_id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() }, // Automatically generate lesson_id if not provided
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
