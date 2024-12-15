const express = require('express');
const { getLoggedInTutor, createLesson, getLessons, updateLesson, deleteLesson, getLessonsByTutorId, getLessonsByTutor, getlessoncreated } = require('../controllers/lessoncontroller');
const { isTutor, isStudent } = require('../controllers/authcontroller');

const lessonRouter = express.Router();


lessonRouter.get('/tutor/me',getLoggedInTutor);
lessonRouter.post('/createlesson',isTutor,createLesson);
lessonRouter.get('/getcreatedlessons/:tutorId',isTutor,getlessoncreated);
lessonRouter.put('/updatelesson/:lesson_id',isTutor,updateLesson);
lessonRouter.delete('/deletelesson/:lessonId',isTutor,deleteLesson);
lessonRouter.get('/tutor/getall/:tutorId',getLessonsByTutorId);


module.exports = lessonRouter;