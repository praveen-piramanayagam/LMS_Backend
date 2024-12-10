const mongoose = require('mongoose');

const studentsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },  // Define studentId as ObjectId
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

module.exports = mongoose.model('Student', studentsSchema, 'students');
