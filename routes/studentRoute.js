const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');
const { upload } = require('../common/common');

router.post('/create',upload.single('profile'), studentController.createStudent);
router.post('/list', studentController.getAllStudent);
router.get('/allStudent', studentController.studentAll);
router.get('/:id', studentController.getStudentById);
router.post('/update/:id',upload.single('profile'), studentController.updateStudent);
router.delete('/delete/:id', studentController.deleteStudent);


module.exports = router;