const Order = require('../models/orders');
require('dotenv').config();

exports.fetchOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // Fetch the order details
        const order = await Order.findOne({ razorpay_order_id: orderId }).select('razorpay_order_id amount');

        if (!order) {
            return res.status(404).json({ error: 'Order not found!' });
        }

        res.status(200).json({
            message: 'Order details retrieved successfully',
            order_id: order.razorpay_order_id,
            amount: order.amount,
        });
    } catch (err) {
        console.error('Error fetching order details:', err.message);
        res.status(500).json({ error: 'Failed to fetch order details!' });
    }
};
