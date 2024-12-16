const express = require('express');
const { getStudentsProfile, updateStudentProfile, getTutorsProfile, updateTutorsProfile, getAdminsProfile, updateAdminProfile, toggleStudentStatus, toggleTutorStatus, getallStudents, getallTutors } = require('../controllers/profilecontroller');
const { isAdmin } = require('../controllers/authcontroller');

const profileRouter = express.Router();


//Profile
profileRouter.get('/getstudent/:studentId',getStudentsProfile);
profileRouter.put('/updatestudent/:studentId',updateStudentProfile);
profileRouter.get('/gettutor/:tutorId',getTutorsProfile);
profileRouter.put('/updatetutor/:tutorId',updateTutorsProfile);
profileRouter.get('/getadmin/:adminId',getAdminsProfile);
profileRouter.put('/updateadmin/:adminId',isAdmin,updateAdminProfile);


//Admin only
profileRouter.get('/getallstudents',isAdmin,getallStudents);
profileRouter.get('/getalltutors',isAdmin,getallTutors);
profileRouter.put('/deactivatestudent/:studentId', isAdmin, toggleStudentStatus);
profileRouter.put('/deactivatetutor/:tutorId', isAdmin, toggleTutorStatus);


module.exports = profileRouter;