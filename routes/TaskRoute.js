const express = require("express");
const router = express.Router();
const batchController = require("../controllers/AssessmentController");

router.post("/list", batchController.getAllTask);
router.post("/create", batchController.createTask);
router.post('/getTask',batchController.myTaskList);
router.post('/getTaskHistory',batchController.taskHistory);
router.delete("/deleteTask/:id", batchController.deleteTask);
router.get('/:id', batchController.getTaskById);
router.post('/submitTask', batchController.createTaskSubmission);
router.post('/getAnswer', batchController.viewSubmittedAnswer);
// router.get('getAnswer/:id', batchController.viewSubmittedAnswer);


module.exports = router;
