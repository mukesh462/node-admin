const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');

router.post('/create', courseController.createCourse);
router.post('/list', courseController.getAllCourse);
router.get('/:id', courseController.getCourseById);
router.post('/update/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;