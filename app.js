const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoutes.js');
const profileRouter = require('./routes/profileRoutes.js');
const filterRouter = require('./routes/filterRouter.js');
const lessonRouter = require('./routes/lessonRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const verifyRouter = require('./routes/verifyRoutes.js');



const app = express();

require('dotenv').config();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());  // This allows all origins by default
app.use(cors({
    origin: 'http://localhost:5174', // Your frontend URL
  }));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/profile',profileRouter);
app.use('/api/v1/filtertutor',filterRouter);
app.use('/api/v1/lessons',lessonRouter);
app.use('/api/v1/order',orderRouter);
app.use("/api/v1/verification",verifyRouter);
app.use("api/v1/getorderdetails",verifyRouter);



module.exports = app;