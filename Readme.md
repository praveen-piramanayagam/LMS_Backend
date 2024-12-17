# LMS_Backend

This is the backend repository for a Learning Management System (LMS) that manages lessons, student-tutor interactions, and payment processing. The project provides APIs to handle lesson booking, order creation, payment verification, and email notifications.

## Features

- **User Authentication:** Secure sign-in for tutors and students with JWT-based authentication.
- **Order Management:** Create, verify, and track lesson orders using Razorpay for payment integration.
- **Email Notifications:** Sends email notifications to students and tutors on lesson bookings and payment status.
- **Database Management:** Store and manage orders, lessons, students, and tutors.

## Tech Stack

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing lesson, order, and user data.
- **Razorpay**: Payment gateway for handling payments.
- **Nodemailer**: Email service to send notifications.
- **JWT**: JSON Web Tokens for user authentication.

## Installation

Follow these steps to get the backend up and running:

1. **Clone the repository**

   ```bash
   git clone https://github.com/praveen-piramanayagam/LMS_Backend.git
   cd LMS_Backend

2. **Install dependencies**
npm install

3. **Set up environment variables**
Create a .env file in the root directory of the project and add the following environment variables:
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

- RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are used to authenticate with Razorpay.
- EMAIL_USER and EMAIL_PASS are your credentials for sending emails via Gmail using Nodemailer.

4. **Start the server**
Start the server

API Endpoints
1. **Create Order**
- Endpoint: POST /api/v1/order/createorder
- Description: Creates an order for a lesson with a pending status.
- Body Parameters:
- lesson_id: The ID of the lesson being booked.
- Response:

{
  "message": "Order created successfully",
  "order_id": "razorpay_order_id",
  "amount": 500
}

2. **Verify Payment**
- Endpoint: POST /api/v1/orderverify/verifypayment

- Description: Verifies the payment after the user completes the Razorpay checkout process.

- Body Parameters:

- razorpay_payment_id: Payment ID from Razorpay.
- razorpay_order_id: Order ID from Razorpay.
- razorpay_signature: Payment signature from Razorpay.

- Response
{
  "message": "Payment verified successfully."
}


**After successfull payment check inbox for ordercreation and payment verification**