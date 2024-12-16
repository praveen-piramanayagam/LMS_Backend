const express = require('express');
const {ordercontroller } = require('../controllers/ordercontroller');
const { isStudent } = require('../controllers/authcontroller');
const { fetchstudentOrder, fetchTutorOrder } = require('../controllers/orderdetailcontroller');

const orderRouter = express.Router();

orderRouter.post('/createorder',isStudent,ordercontroller);
orderRouter.get('/studentsorderdetails/:studentId',fetchstudentOrder);
orderRouter.get('/tutororderdetails/:tutorId',fetchTutorOrder);


module.exports = orderRouter;
