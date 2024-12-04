const express = require('express');
const { studentsregister, studentslogin } = require('../controllers/studentsauthcontrol');

const authRouter = express.Router();

authRouter.post('/students/register',studentsregister);
authRouter.post('/students/login', studentslogin);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

module.exports = authRouter;