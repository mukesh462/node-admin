const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');

router.post('/create', studentController.createStudent);
router.post('/list', studentController.getAllStudent);
router.get('/:id', studentController.getStudentById);
router.post('/update/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;