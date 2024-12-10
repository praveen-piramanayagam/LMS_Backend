const express = require('express');
const {ordercontroller } = require('../controllers/ordercontroller');
const { isStudent } = require('../controllers/authcontroller');
const { fetchOrderDetails } = require('../controllers/orderdetailcontroller');

const orderRouter = express.Router();

orderRouter.post('/createorder',isStudent,ordercontroller);
orderRouter.get('/getorderdetails/:orderId',fetchOrderDetails);

module.exports = orderRouter;
