const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');

router.post('/create', courseController.createCourse);
router.post('/list', courseController.getAllCourse);
router.post('/update/:id', courseController.updateCourse);
 router.delete('/delete/:id', courseController.deleteCourse);
router.get('/getAllCourse', courseController.getCourseAll);
router.get('/:id', courseController.getCourseById);


module.exports = router;