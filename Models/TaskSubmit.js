const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  questions: { type: Array, required: true },
  student_id: { type: Object, required: true,ref: "Student" },
  assessment_id: { type: String, required: true },
  status: { type: String, required: true,default:0 },
  date:{type:Date , required:false,default:new Date()}
});

const TaskSubmit = mongoose.model("TaskSubmit", TaskSchema);

module.exports = TaskSubmit;
