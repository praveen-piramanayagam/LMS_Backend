const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoutes.js');
const profileRouter = require('./routes/profileRoutes.js');
const filterRouter = require('./routes/filterRouter.js');
const lessonRouter = require('./routes/lessonRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const verifyRouter = require('./routes/verifyRoutes.js');
// const zoomOAuth = require('./routes/zoomOAuth.js');

const app = express();

require('dotenv').config();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());
app.use(cors({
    origin: [
        'http://127.0.0.1:5500', 
        'http://localhost:5173', 
        'https://lmsmainproject.netlify.app' // Add your frontend URL here
    ],
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Route imports
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);   
app.use('/api/v1/filtertutor', filterRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/order', orderRouter);
app.use("/api/v1/orderverify", verifyRouter);

module.exports = app;
