const mongoose = require('mongoose');

const tutorsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tutorId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    experience: { type: String, required: true },
    qualifications: { type: String, required: true },
    expertise: { type: [String], required: true },
    subjects: { 
        type: [String], 
        required: true, 
        validate: [(val) => val.length > 0, 'At least one subject is required'] 
    },
    availability: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true,
        min: 0
    },
    studentsReview: {
        type: [{
            studentId: { type: String, required: true },
            review: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5 },
            createdAt: { type: Date, default: Date.now }
        }],
        default: []
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tutor', tutorsSchema, 'tutors');
