const express = require('express');
const authRouter = require('./routes/authRoutes.js');
const profileRouter = require('./routes/profileRoutes.js');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/profile',profileRouter);


module.exports = app;