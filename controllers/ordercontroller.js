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
        console.log("Order controller triggered"); // Debug log
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

        const scheduledClass = lesson.scheduledClass;
        const tutor_Name = lesson.tutorName;
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
            studentId: student.studentId,
            student_email: student.email,
            tutor_email: lesson.tutorEmail,
            meetingLink: lesson.meetingLink,
            tutor_Name: lesson.tutorName,
            scheduledClass: lesson.scheduledClass,
            title: lesson.title,
            tutorId: lesson.tutorId,
            lesson_id,
            amount,
            status: "pending",
        });
        
        await newOrder.save();

        // Format scheduledClass to display only date and day
        const scheduledDate = new Date(lesson.scheduledClass);
        const formattedDate = scheduledDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedDay = scheduledDate.toLocaleDateString('en-IN', { weekday: 'long' });

        // Define mail options inside the controller
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [student.email, lesson.tutorEmail],  // Send email to both student and tutor
            subject: 'Lesson Order Created',
            text: `Dear ${student.name},\n\nyou have purchased a lesson "${lesson.title}" which will be hosted by tutor "${lesson.tutorName}".\n\nYour meeting link is "${lesson.meetingLink}".\n\nThe live session is scheduled for "${formattedDay}, ${formattedDate}". The session timing will be from 10am to 1pm.\n\nOrder ID: ${order.id}\nAmount: ₹${lesson.price}\n\nThank you!`,
        };

        // Log email details for debugging
        console.log("Email to:", [student.email, lesson.tutorEmail]);
        console.log("Email subject:", mailOptions.subject);
        console.log("Email body:", mailOptions.text);

        // Send email to student and tutor
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

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
