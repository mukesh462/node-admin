const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/InstructorController');

router.post('/', instructorController.createInstructor);
router.get('/', instructorController.getAllInstructor);
router.get('/:id', instructorController.getInstructorById);
router.put('/:id', instructorController.updateInstructor);
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router;