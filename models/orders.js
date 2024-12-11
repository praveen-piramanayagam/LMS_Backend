const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson', // Reference to the Lesson model
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId, // Aligning with studentsSchema where studentId is ObjectId
    ref: 'Student', // Reference to the Student model
    required: true,
  },
  student_email: {
    type: String, // Store student's email
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Email validation
  },
  amount: {
    type: Number, // Amount in INR (e.g., 500 for 500 INR)
    required: true,
  },
  razorpay_order_id: {
    type: String, // Razorpay's order ID for payment processing
    required: true,
  },
  razorpay_payment_id: {
    type: String, // Razorpay's payment ID (optional, can be added later)
  },
  razorpay_signature: {
    type: String, // Razorpay payment signature (optional, can be added later)
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
