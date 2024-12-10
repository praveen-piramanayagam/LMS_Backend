const crypto = require("crypto");
const Order = require("../models/orders"); // Ensure you are using your Order model

exports.verifycontroller = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Generate the expected signature
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const expectedSignature = shasum.digest("hex");

        // Verify signature
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        // Update order status to "paid" in the database
        const updatedOrder = await Order.updateOne(
            { razorpay_order_id },
            { status: "paid" }
        );

        res.status(200).json({ message: "Payment verified and order updated successfully", updatedOrder });
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ error: "Failed to verify payment." });
    }
};
