const Order = require('../models/orders');
require('dotenv').config();
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation


exports.fetchstudentOrder = async (req, res) => {
    try {
        const { studentId } = req.params; // Get email from req.body

        // Validate the email
        if (!studentId) {
            return res.status(400).json({ error: 'studentId is required!' });
        }

        // Fetch all orders with the provided email
        const orders = await Order.find({ studentId: studentId }).select('razorpay_order_id meetingLink title amount scheduledClass');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'No orders found for the given email!' });
        }

        // Respond with the list of orders
        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders: orders.map(order => ({
                order_id: order.razorpay_order_id,
                meetingLink: order.meetingLink,
                title: order.title,
                amount: order.amount,
                status: order.status,
                scheduledClass: order.scheduledClass, // If you need to format the date
            })),
        });
    } catch (err) {
        console.error('Error fetching orders by email:', err.message);
        res.status(500).json({ error: 'Failed to fetch orders!' });
    }
};

exports.fetchTutorOrder = async (req, res) => {
    try {
        const { tutorId } = req.params; // Get tutorId from URL params

        // Check if tutorId is missing or invalid
        if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
            return res.status(400).json({ error: 'Invalid or missing tutorId!' });
        }

        // Fetch all orders for the given tutorId
        const orders = await Order.find({ tutorId: tutorId }).select('razorpay_order_id amount title tutor_email');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'No orders found for the given tutorId!' });
        }

        // Respond with the orders
        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders: orders.map(order => ({
                order_id: order.razorpay_order_id,
                title: order.title,
                amount: order.amount,
                student_email: order.student_email,
                tutorId: order.tutorId,
            })),
        });
    } catch (err) {
        console.error('Error fetching tutor orders by tutorId:', err.message);
        res.status(500).json({ error: 'Failed to fetch orders!' });
    }
};

