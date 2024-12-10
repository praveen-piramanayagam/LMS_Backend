// // Function to create Razorpay order
// async function createRazorpayOrder(amount, receipt) {
//     const response = await fetch("/order/createorder", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount, receipt })
//     });
//     const order = await response.json();
//     return order; // You will get order details with razorpay_order_id
//   }
  
//   // Call Razorpay checkout
//   function initiatePayment(order, studentEmail, tutorEmail, lessonName, studentName) {
//     var options = {
//       key: "rzp_test_9qlbqULX5I6dyn",  // Your Razorpay Key ID
//       amount: order.amount,  // amount in paisa
//       currency: order.currency,
//       order_id: order.order_id, // The razorpay_order_id you received
//       handler: function (response) {
//         // Send the payment response to backend for verification
//         fetch("/verification/verifypayment", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             studentEmail: studentEmail,
//             tutorEmail: tutorEmail,
//             lessonName: lessonName,
//             studentName: studentName,
//           }),
//         })
//         .then(response => response.json())
//         .then(data => {
//           if (data.error) {
//             // Display error message on frontend
//             alert(data.error); // Invalid QR code or failed payment
//           } else {
//             // Payment success
//             alert("Payment verified successfully!");
//           }
//         })
//         .catch(err => {
//           console.error("Error verifying payment", err);
//           alert("Payment verification failed.");
//         });
//       },
//       prefill: {
//         name: "Test User",
//         email: "test@example.com",
//         contact: "9999999999"
//       }
//     };
  
//     var rzp = new Razorpay(options);
//     rzp.open();
//   }
  
//   // Example usage:
//   createRazorpayOrder(500, "lesson123")
//     .then((order) => {
//       // Pass the student and tutor details here as well
//       initiatePayment(order, "student@example.com", "tutor@example.com", "JavaScript Lesson", "John Doe");
//     });
  