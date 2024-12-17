// const crypto = require("crypto");
// const Order = require("../models/orders"); // Order model
// const Student = require("../models/students"); // Student model
// const Lesson = require("../models/lessons"); // Lesson model
// const Tutor = require("../models/tutors"); // Tutor model
// const nodemailer = require('nodemailer');

// // Utility to send email
// const sendEmail = (to, subject, text) => {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//         tls: {
//             rejectUnauthorized: false,
//         }
//     });
    
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         text,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error("Error sending email: ", error);
//         } else {
//             console.log("Email sent: " + info.response);
//         }
//     });
// };

// // Payment Verification Controller
// // Example of the verification endpoint on the backend
// exports.verifycontroller = async (req, res) => {
//     try {
//       const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
//       // Prepare the signature data
//       const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
//       const generated_signature = hmac.update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');
  
//       // Compare generated signature with the provided signature
//       if (generated_signature === razorpay_signature) {
//         // If the signature matches, mark the payment as successful and update the order status in your database
//         await Order.updateOne({ razorpay_order_id }, { status: "paid" });
//         res.json({ message: "Payment verified successfully." });
//       } else {
//         res.status(400).json({ error: "Payment verification failed." });
//       }
//     } catch (err) {
//       console.error("Error verifying payment:", err);
//       res.status(500).json({ error: "Error verifying payment." });
//     }
//   };


// // exports.verifycontroller = async (req, res) => {
// //   try {
// //     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

// //     // Validate the input
// //     if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
// //       return res.status(400).json({ error: "Missing required parameters" });
// //     }

// //     // Prepare the signature data
// //     const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
// //     const generated_signature = hmac.update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

// //     // Compare generated signature with the provided signature
// //     if (generated_signature === razorpay_signature) {
// //       // If the signature matches, mark the payment as successful and update the order status
// //       const order = await Order.findOne({ razorpay_order_id });

// //       if (!order) {
// //         return res.status(404).json({ error: "Order not found" });
// //       }

// //       // Update order status to 'paid'
// //       order.status = "paid";
// //       await order.save();

// //       res.json({ message: "Payment verified successfully." });
// //     } else {
// //       res.status(400).json({ error: "Payment verification failed: Invalid signature." });
// //     }
// //   } catch (err) {
// //     console.error("Error verifying payment:", err);
// //     res.status(500).json({ error: "Error verifying payment." });
// //   }
// // };

const crypto = require("crypto");
const Order = require("../models/orders");
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
exports.verifycontroller = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Check if parameters exist
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // Prepare the signature data
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        const generated_signature = hmac.update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

        // Compare generated signature with the provided signature
        if (generated_signature === razorpay_signature) {
            const order = await Order.findOne({ razorpay_order_id });

            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            // Update order status to 'paid'
            order.status = "paid";
            await order.save();

            // Log to ensure email is being sent
            console.log('Sending email to student:', order.student_email);
            console.log('Sending email to tutor:', order.tutor_email);

            // Send email to student and tutor
            sendEmail(order.student_email, 'Payment Confirmation', 'Your payment has been successfully processed.');
            sendEmail(order.tutor_email, 'Payment Confirmation', 'The payment for your lesson has been successfully processed.');

            res.json({ message: "Payment verified and order status updated to 'paid'." });
        } else {
            res.status(400).json({ error: "Payment verification failed." });
        }
    } catch (err) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ error: "Error verifying payment." });
    }
};
