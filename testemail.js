const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Email options
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "test_recipient@example.com", // Replace with your email to test
    subject: "Test Email from Nodemailer",
    text: "This is a test email to check if Nodemailer works correctly.",
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Failed to send test email:", error.message);
    } else {
        console.log("Test email sent successfully:", info.response);
    }
});
