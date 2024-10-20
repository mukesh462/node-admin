const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');

router.post('/', studentController.createStudent);
router.get('/', studentController.getAllStudent);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;