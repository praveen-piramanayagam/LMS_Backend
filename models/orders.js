const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  student_email: {
    type: String, // Store student's email
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Email validation
  },
  tutor_email: {
    type: String, // Store tutors's email
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Email validation
  },
  scheduledClass: {
    type: Date,
    required: true
},
tutor_Name: {type: String, required: false},
title: { type: String, required: false },
  meetingLink: { type: String, required: false }, // Jitsi meeting link
  amount: {
    type: Number, // Amount in INR (e.g., 500 for 500 INR)
    required: true,
  },
  razorpay_order_id: {
    type: String, // Razorpay's order ID for payment processing
    required: true,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
