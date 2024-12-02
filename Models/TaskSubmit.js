const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  task: { type: Array, required: true },
  student_id: { type: Object, required: true },
  assessment_id: { type: String, required: true },
});

const TaskSubmit = mongoose.model("TaskSubmit", TaskSchema);

module.exports = TaskSubmit;
