const crypto = require('crypto');

exports.verifycontroller = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      console.error("Invalid signature received:", razorpay_signature); // Log invalid signature error
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err.message);  // Log the error message
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
