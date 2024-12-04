const express = require('express');
const authRouter = require('./routes/authRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/auth',authRouter);

module.exports = app;