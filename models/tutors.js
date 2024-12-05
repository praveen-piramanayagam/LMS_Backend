const mongoose = require('mongoose');

const tutorsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tutorId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tutor', tutorsSchema, 'tutors');
