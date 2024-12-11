const crypto = require('crypto');
const Order = require('../models/orders');
const Student = require('../models/students');
const Lesson = require('../models/lessons');
const Tutor = require('../models/tutors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (to, subject, text) => {
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
    

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

// Razorpay Webhook Handler for payment capture
exports.razorpayWebhook = async (req, res) => {
    const { event, payload } = req.body;
    const { order_id, payment_id, status } = payload.payment.entity;

    // Check for payment captured event
    if (event === "payment.captured" && status === "captured") {
        try {
            // Fetch the order from the database using razorpay_order_id
            const order = await Order.findOne({ razorpay_order_id: order_id });
            if (!order) {
                // If no order exists, create a new order
                const Razorpay = require("razorpay");
                const razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                const paymentDetails = await razorpay.payments.fetch(payment_id);

                // Get the lesson ID from the payment details (or order details)
                const lesson = await Lesson.findById(paymentDetails.metadata.lesson_id);
                const student = await Student.findById(paymentDetails.metadata.student_id);

                // If lesson or student not found, return error
                if (!lesson || !student) {
                    return res.status(404).json({ error: "Lesson or Student not found" });
                }

                // Create new order in the database
                const newOrder = new Order({
                    razorpay_order_id: order_id,
                    razorpay_payment_id: payment_id,
                    lesson_id: lesson._id,
                    student_id: student._id,
                    amount: paymentDetails.amount,
                    status: "paid", // Set status to 'paid'
                    payment_details: paymentDetails,
                });

                await newOrder.save(); // Save the new order

                // Send email to student and tutor
                await Promise.all([
                    sendEmail(
                        student.email,
                        "Lesson Purchase Confirmation",
                        `Dear ${student.name},\n\nYou have successfully purchased the lesson: ${lesson.title}.\n\nThank you for your purchase!`
                    ),
                    sendEmail(
                        lesson.tutorId.email,
                        "Lesson Purchased by Student",
                        `Dear ${lesson.tutorId.name},\n\nYour lesson: ${lesson.title} has been purchased by ${student.name}.\n\nThank you for your contribution!`
                    ),
                ]);

                res.status(200).json({ message: "Payment captured and order created successfully" });
            } else {
                // Order already exists, no need to create a new one
                res.status(200).send("Payment already captured and order exists.");
            }
        } catch (err) {
            console.error("Error handling Razorpay webhook:", err);
            res.status(500).json({ error: "Error handling payment success" });
        }
    } else {
        res.status(200).send("Payment not successful or not captured");
    }
};
