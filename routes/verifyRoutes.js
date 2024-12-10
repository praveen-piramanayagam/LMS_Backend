const express = require('express');
const { verifycontroller } = require('../controllers/verifycontroller');
// const { isStudent } = require('../controllers/authcontroller');

const verifyRouter = express.Router();

verifyRouter.post('/verifypayment',verifycontroller)

module.exports = verifyRouter;