const express = require('express');
const { studentsregister, tutorsregister, adminRegister, studentslogin, tutorslogin, adminlogin, checkStudentStatus, checkTutorStatus } = require('../controllers/authcontroller');

const authRouter = express.Router();


// Register and Login
authRouter.post('/students/register',studentsregister);
authRouter.post('/tutors/register',tutorsregister);
authRouter.post('/admins/register',adminRegister);
authRouter.post('/students/login',checkStudentStatus,studentslogin);
authRouter.post('/tutors/login',checkTutorStatus,tutorslogin);
authRouter.post('/admins/login',adminlogin);

module.exports = authRouter;