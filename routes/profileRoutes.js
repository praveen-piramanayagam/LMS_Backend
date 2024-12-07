const express = require('express');
const { getStudentsProfile, updateStudentProfile, getTutorsProfile, updateTutorsProfile, getAdminsProfile, updateAdminProfile, deleteStudent, deletetutor } = require('../controllers/profilecontroller');
const { isAdmin } = require('../controllers/authcontroller');

const profileRouter = express.Router();


//Profile
profileRouter.get('/getstudent/:studentId',getStudentsProfile);
profileRouter.put('/updatestudent/:studentId',updateStudentProfile);
profileRouter.get('/gettutor/:tutorId',getTutorsProfile);
profileRouter.put('/updatetutor/:tutorId',updateTutorsProfile);
profileRouter.get('/getadmin/:adminId',getAdminsProfile);
profileRouter.put('/updateadmin/:adminId',updateAdminProfile);


//Delete by admin
profileRouter.delete('/deletestudent/:studentId', isAdmin, deleteStudent);
profileRouter.delete('/deletetutor/:tutorId', isAdmin, deletetutor);
// adminRouter.delete('/admins/:adminId', isAdmin, deleteAdmin);


module.exports = profileRouter;