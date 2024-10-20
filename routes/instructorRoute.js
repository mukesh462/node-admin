const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/InstructorController');
const { upload } = require('../common/common');

router.post('/create',upload.single('file'),instructorController.createInstructor);
router.post('/list', instructorController.getAllInstructor);
router.get('/:id', instructorController.getInstructorById);
router.post('/update/:id', instructorController.updateInstructor);
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router;