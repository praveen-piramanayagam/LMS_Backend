const express = require('express');
const { getLoggedInTutor, createLesson, getLessons, updateLesson, deleteLesson } = require('../controllers/lessoncontroller');
const { isTutor } = require('../controllers/authcontroller');

const lessonRouter = express.Router();


lessonRouter.get('/tutor/me',getLoggedInTutor);
lessonRouter.post('/createlesson',isTutor,createLesson);
lessonRouter.get('/getlessons',isTutor,getLessons);
lessonRouter.put('/updatelesson/:lessonId',isTutor,updateLesson);
lessonRouter.delete('/deletelesson/:lessonId',isTutor,deleteLesson);

module.exports = lessonRouter;