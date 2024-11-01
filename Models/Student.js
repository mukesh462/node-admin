const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  pwd: { type: String, required: true },
  pnumber: { type: String, required: true },
  profile: { type: String, required: true },
  batch_id: { type: String, required: true,ref:"Batch" },
  isAdmin: { type: String, required: true, default: 0 },
  dateofjoining: { type: String, required: true },
  status: { type: String, required: true, default: 1 },
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
