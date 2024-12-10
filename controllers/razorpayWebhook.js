// razorpayWebhook.js
const crypto = require('crypto');
const Order = require('../models/orders'); // Order model
const Student = require('../models/students'); // Student model
const Lesson = require('../models/lessons'); // Lesson model
const Tutor = require('../models/tutors'); // Tutor model
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
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

// Webhook handler to capture payment success
exports.razorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    if (signature !== expectedSignature) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event, payload } = req.body;
    const { order_id, payment_id, status } = payload.payment.entity;

    if (event === 'payment.captured' && status === 'captured') {
        try {
            const order = await Order.findOne({ razorpay_order_id: order_id });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Fetch payment details from Razorpay
            const Razorpay = require('razorpay');
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const paymentDetails = await razorpay.payments.fetch(payment_id);

            if (paymentDetails.status !== 'captured') {
                return res.status(400).json({ error: 'Payment not captured' });
            }

            // Update order status
            order.status = 'paid';
            order.payment_id = payment_id;
            order.payment_details = paymentDetails; // Optional for debugging
            await order.save();

            const student = await Student.findById(order.student_id);
            const lesson = await Lesson.findById(order.lesson_id);

            if (!student || !lesson) {
                return res.status(404).json({ error: 'Student or lesson not found' });
            }

            // Send email notifications
            await Promise.all([
                sendEmail(
                    student.email,
                    "Lesson Purchase Confirmation",
                    `Dear ${student.name},\n\nYou have successfully purchased the lesson: ${lesson.title}.\n\nThank you for your purchase!`
                ),
                sendEmail(
                    lesson.tutor.email,
                    "Lesson Purchased by Student",
                    `Dear ${lesson.tutor.name},\n\nYour lesson: ${lesson.title} has been purchased by ${student.name}.\n\nThank you for your contribution!`
                ),
            ]);

            res.status(200).send('Payment success handled successfully');
        } catch (err) {
            console.error('Error handling Razorpay webhook:', err);
            res.status(500).json({ error: 'Error handling payment success' });
        }
    } else {
        res.status(200).send('Payment not successful');
    }
};

