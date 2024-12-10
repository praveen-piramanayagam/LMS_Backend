const Razorpay = require('razorpay');
const Order = require('../models/orders'); // Order model
const Lesson = require('../models/lessons'); // Lesson model
const mongoose = require('mongoose');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // From your .env file
    key_secret: process.env.RAZORPAY_KEY_SECRET, // From your .env file
});

// Create Order with student mapping
exports.ordercontroller = async (req, res) => {
    try {
        const { lesson_id } = req.body;
        const student = req.student;

        // Check if student is available
        if (!student) {
            return res.status(403).json({ error: 'Student not found in session.' });
        }

        // Validate lesson_id
        if (!lesson_id || !mongoose.Types.ObjectId.isValid(lesson_id)) {
            console.error("Invalid or missing lesson_id:", lesson_id);
            return res.status(400).json({ error: 'Invalid or missing lesson ID.' });
        }
        console.log("Request Body:", req.body);

        console.log("Fetching lesson with ID:", lesson_id);

        // Find the lesson by ID
        const lesson = await Lesson.findOne({ lesson_id: lesson_id });
        console.log("Lesson found:", lesson);

        if (!lesson) {
            console.error("Lesson not found for ID:", lesson_id);
            return res.status(404).json({ error: 'Lesson not found.' });
        }

        // Extract lesson price
        const amount = lesson.price;
        console.log(`Creating order for lesson: ${lesson.title}, Amount: ${amount}`);

        // Generate a receipt
        const receipt = `lesson_${lesson_id}_purchase_${student.studentId}`.slice(0, 40);

        // Razorpay order options
        const options = {
            amount: amount * 100, // Convert to paisa
            currency: "INR",
            receipt: receipt,
            payment_capture: 1,
        };

        // Create Razorpay order
        let order;
        try {
            order = await razorpay.orders.create(options);
            console.log("Razorpay order created successfully:", order.id);
        } catch (err) {
            console.error("Error creating Razorpay order:", err);
            return res.status(500).json({ error: "Failed to create Razorpay order." });
        }

        // Save order in the database
        const newOrder = new Order({
            razorpay_order_id: order.id,
            student_id: student.studentId,
            lesson_id,
            amount,
            status: 'pending',
        });
        await newOrder.save();

        // Respond with success and send order ID to frontend
        res.status(201).json({
            message: "Order created successfully",
            order_id: order.id, // Send Razorpay order ID to frontend
            amount: lesson.price,
        });
    } catch (err) {
        console.error("Error in ordercontroller:", err);
        res.status(500).json({ error: "Failed to create order." });
    }
};


