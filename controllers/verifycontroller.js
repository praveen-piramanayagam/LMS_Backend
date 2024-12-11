const crypto = require("crypto");
const Order = require("../models/orders"); // Order model
const Student = require("../models/students"); // Student model
const Lesson = require("../models/lessons"); // Lesson model
const Tutor = require("../models/tutors"); // Tutor model
const nodemailer = require('nodemailer');

// Utility to send email
const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
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

// Payment Verification Controller
// Example of the verification endpoint on the backend
exports.verifycontroller = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
      // Prepare the signature data
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      const generated_signature = hmac.update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');
  
      // Compare generated signature with the provided signature
      if (generated_signature === razorpay_signature) {
        // If the signature matches, mark the payment as successful and update the order status in your database
        await Order.updateOne({ razorpay_order_id }, { status: "paid" });
        res.json({ message: "Payment verified successfully." });
      } else {
        res.status(400).json({ error: "Payment verification failed." });
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      res.status(500).json({ error: "Error verifying payment." });
    }
  };
  
