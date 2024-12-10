// const Order = require('../models/orders'); // Order model to store order details
// const Lesson = require('../models/lessons'); // Lesson model to fetch lesson details
// const Tutor = require('../models/tutors'); // Tutor model to fetch tutor details
// const Razorpay = require('razorpay');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// require('dotenv').config();

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID, // From your .env file
//     key_secret: process.env.RAZORPAY_KEY_SECRET, // From your .env file
// });

// // Helper function to send email
// const sendEmail = (to, subject, text) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
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

// // Create Order with student mapping
// exports.ordercontroller = async (req, res) => {
//     try {
//         const { lesson_id } = req.body; // Lesson ID is coming from the request body

//         // Check if the student is authenticated (this will be done by isStudent middleware)
//         const student = req.student; // The authenticated student info will be here
//         console.log('Student:', student);  // Log the entire student object

//         // Ensure student is defined
//         if (!student) {
//             return res.status(403).json({ error: 'Student not found in session.' });
//         }

//         // Validate lesson_id
//         if (!lesson_id) {
//             return res.status(400).json({ error: 'Lesson ID is required!' });
//         }
//         console.log("Received lesson_id:", lesson_id);

//         // Validate lesson_id format
//         if (!lesson_id || !mongoose.Types.ObjectId.isValid(lesson_id)) {
//             return res.status(400).json({ error: 'Invalid lesson ID format.' });
//         }

//         // Fetch the lesson details based on lesson_id
//         const lesson = await Lesson.findOne({ lesson_id: lesson_id }); // Use _id to find lesson
//         console.log("Fetched lesson:", lesson);  // Log the fetched lesson to verify it exists        
//         if (!lesson) {
//             return res.status(404).json({ error: 'Lesson not found with the provided ID.' });
//         }

//         // Define the amount for the lesson (based on the lesson model)
//         const amount = lesson.price; // Assuming 'price' is stored in the Lesson model
//         const receipt = `lesson_${lesson_id}_purchase_${student.studentId}`; // Generate a unique receipt ID

//         // Log the lesson details
//         console.log(`Student ${student.name} is purchasing lesson "${lesson.title}" for ₹${amount}`);

//         // Create the Razorpay order
//         const options = {
//             amount: amount * 100, // Razorpay expects amount in paisa (1 INR = 100 paisa)
//             currency: "INR", // Currency set to INR (Indian Rupees)
//             receipt: receipt.slice(0, 40), // Ensure the receipt ID is no longer than 40 characters
//             payment_capture: 1,  // Enable auto-capture for payments
//         };

//         console.log("Razorpay Order Options:", options);  // Log the options before making the API call

//         // Create the order using Razorpay's API
//         let order;
//         try {
//             order = await razorpay.orders.create(options);
//         } catch (err) {
//             console.error("Error creating Razorpay order:", err);  // Log the error details from Razorpay
//             return res.status(500).json({ error: "Failed to create Razorpay order. Please try again later." });
//         }

//         // Log Razorpay order ID creation
//         console.log("Razorpay Order Created: ", order.id);

//         // Save the order details to the Order collection of the database
//         const newOrder = new Order({
//             razorpay_order_id: order.id,
//             student_id: student.studentId, // Map the logged-in student directly
//             lesson_id,
//             amount,
//             status: 'pending', // Set the order status to pending initially
//         });
//         await newOrder.save(); // Save the new order to the database

//         // Send confirmation email to the student
//         console.log('Student:', student);  // Log the entire student object

//         // Send confirmation email to the student
//         console.log('Student:', student);  // Log the entire student object

//         const studentEmail = student.email;  // Get the student's email        if (student.email) {
//         if (studentEmail) {
//             sendEmail(
//                 studentEmail,  // Use the student's email from the database
//                 "Lesson Purchase Confirmation",
//                 `Dear ${student.name},\n\nYou have successfully purchased the lesson: ${lesson.title}.\n\nThank you for your purchase!`
//             );
//         } else {
//             console.error('Student email not found!');
//         }

//         // Send email to the tutor notifying them about the lesson purchase
//         // We use lesson.tutorId to notify the tutor directly
//         const tutor = await Tutor.findById(lesson.tutorId);
//         if (tutor) {
//             console.log('Tutor Email:', tutor.email);
//             if (tutor.email) {
//                 sendEmail(
//                     tutor.email,
//                     "Lesson Purchased by Student",
//                     `Dear ${tutor.name},\n\nYour lesson: ${lesson.title} has been purchased by ${student.name}.\n\nThank you for your contribution!`
//                 );
//             } else {
//                 console.error('Tutor email not found!');
//             }
//         }

//         // Send the Razorpay order ID to the frontend
//         res.status(201).json({ message: "Order created successfully", order });

//     } catch (err) {
//         // Handle errors and log them for debugging
//         console.error("Error in ordercontroller:", err);  // Log the detailed error
//         res.status(500).json({ error: "Failed to create order. Please try again later." });
//     }
// };
// ordercontroller.js
const Razorpay = require('razorpay');
const Order = require('../models/orders'); // Order model
const Lesson = require('../models/lessons'); // Lesson model
const mongoose = require('mongoose');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // From your .env file
    key_secret: process.env.RAZORPAY_KEY_SECRET, // From your .env file
});

// Create Order with student mapping
exports.ordercontroller = async (req, res) => {
    try {
        const { lesson_id } = req.body;
        const student = req.student;

        // Check if student is available
        if (!student) {
            return res.status(403).json({ error: 'Student not found in session.' });
        }

        // Validate lesson_id
        if (!lesson_id || !mongoose.Types.ObjectId.isValid(lesson_id)) {
            console.error("Invalid or missing lesson_id:", lesson_id);
            return res.status(400).json({ error: 'Invalid or missing lesson ID.' });
        }
        console.log("Request Body:", req.body);

        console.log("Fetching lesson with ID:", lesson_id);

        // Find the lesson by ID
        const lesson = await Lesson.findOne({ lesson_id: lesson_id });
        console.log("Lesson found:", lesson);
                if (!lesson) {
            console.error("Lesson not found for ID:", lesson_id);
            return res.status(404).json({ error: 'Lesson not found.' });
        }

        // Extract lesson price
        const amount = lesson.price;
        console.log(`Creating order for lesson: ${lesson.title}, Amount: ${amount}`);

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
            console.log("Razorpay order created successfully:", order.id);
        } catch (err) {
            console.error("Error creating Razorpay order:", err);
            return res.status(500).json({ error: "Failed to create Razorpay order." });
        }

        // Save order in the database
        const newOrder = new Order({
            razorpay_order_id: order.id,
            student_id: student.studentId,
            lesson_id,
            amount,
            status: 'pending',
        });
        await newOrder.save();

        // Respond with success
        res.status(201).json({ message: "Order created successfully", order });
    } catch (err) {
        console.error("Error in ordercontroller:", err);
        res.status(500).json({ error: "Failed to create order." });
    }
};

