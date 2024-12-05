const express = require('express');
const { studentsregister, tutorsregister, adminRegister } = require('../controllers/authcontroller');

const authRouter = express.Router();

authRouter.post('/students/register',studentsregister);
authRouter.post('/tutors/register',tutorsregister);
authRouter.post('/admins/register',adminRegister);

module.exports = authRouter;