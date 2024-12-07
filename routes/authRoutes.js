const express = require('express');
const { studentsregister, tutorsregister, adminRegister, studentslogin, tutorslogin, adminlogin } = require('../controllers/authcontroller');

const authRouter = express.Router();


// Register and Login
authRouter.post('/students/register',studentsregister);
authRouter.post('/tutors/register',tutorsregister);
authRouter.post('/admins/register',adminRegister);
authRouter.post('/students/login',studentslogin);
authRouter.post('/tutors/login',tutorslogin);
authRouter.post('/admins/login',adminlogin);

module.exports = authRouter;