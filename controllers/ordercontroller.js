const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const Order = require('../models/orders');
const Lesson = require('../models/lessons');
const mongoose = require('mongoose');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,  // This can be used to bypass the certificate check
    }
});
 

// Create Order with student mapping
exports.ordercontroller = async (req, res) => {
    try {
        const { lesson_id } = req.body;
        const student = req.student;

        // Check if student is available
        if (!student) {
            return res.status(403).json({ error: "Student not found in session." });
        }

        // Validate lesson_id
        if (!lesson_id || !mongoose.Types.ObjectId.isValid(lesson_id)) {
            console.error("Invalid or missing lesson_id:", lesson_id);
            return res.status(400).json({ error: "Invalid or missing lesson ID." });
        }

        // Find the lesson by lesson_id
        const lesson = await Lesson.findOne({ lesson_id: new mongoose.Types.ObjectId(lesson_id) });
        if (!lesson) {
            console.error("Lesson not found with ID:", lesson_id);
            return res.status(404).json({ error: "Lesson not found." });
        }

        // Extract lesson price
        const amount = lesson.price;

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
        } catch (err) {
            console.error("Error creating Razorpay order:", err);
            return res.status(500).json({ error: "Failed to create Razorpay order." });
        }

        // Save order in the database, including tutor email
        const newOrder = new Order({
            razorpay_order_id: order.id,
            student_id: student.studentId,
            student_email: student.email,
            tutor_email: lesson.tutorEmail,  // Save tutor's email
            lesson_id,
            amount,
            status: "pending",
        });
        await newOrder.save();

        // Define mail options inside the controller
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [student.email, lesson.tutorEmail],  // Send email to both student and tutor
            subject: 'Lesson Order Created',
            text: `Dear ${student.name},\n\nYour order for the lesson "${lesson.title}" has been created successfully.\n\nOrder ID: ${order.id}\nAmount: ₹${lesson.price}\n\nThank you!`,
        };

        // Send email to student and tutor
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        // Respond to the client
        res.status(201).json({
            message: "Order created successfully",
            order_id: order.id,
            amount: lesson.price,
        });
    } catch (err) {
        console.error("Error in ordercontroller:", err);
        res.status(500).json({ error: "Failed to create order." });
    }
};
